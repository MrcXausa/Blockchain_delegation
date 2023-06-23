const express = require('express'); 
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');
const cors = require('cors');

const crypto=require('crypto');
//TODO delete: comment to try push with ssh
require('dotenv').config();

//instantiating app
const app=express();

//setting up express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/registeruser",async (req,res)=>{

  let name= req.body.name;
  let surname= req.body.surname;
  let email= req.body.email;
  let taxcode= req.body.taxcode;
  let password= req.body.password;
  let address= req.body.address;


  if(!name || !surname || !email || !taxcode || !password || !address){ //if some data are not present abort
    res.status(200).send({
      stored:false,
      error:"missing parameters"
    });
    return
  }

  if(await User.findOne({taxcode:taxcode}) || await User.findOne({email:email}) || await User.findOne({address:address}) || await Institution.findOne({address:address}) || await Institution.findOne({email:email})){ //if a user with that taxcode already exists
    res.status(200).send({
      stored:false,
      error:"already exist"
    });
    return
  }

  //if all the data are present, store the user
  let user=new User({
      name:name,
      surname:surname,
      email:email,
      taxcode:taxcode,
      password:password,
      address:address
  });

  user.save(); 
  console.log("new user correctly stored");


  res.status(200).send({
    stored:true,
  });

});


app.post("/registerinstitution",async (req,res)=>{

  let name= req.body.name;
  let vat= req.body.vat;
  let email= req.body.email;
  let password= req.body.password;
  let address= req.body.address;

  if(!name || !vat || !email ||  !password || !address){ //if some data are not present abort
    res.status(200).send({
      stored:false,
      error:"missing parameters"
    });
    return
  }
  if(await Institution.findOne({vat:vat}) || await Institution.findOne({email:email}) || await Institution.findOne({address:address}) || await User.findOne({email:email}) || await User.findOne({address:address})){ //if a user with that taxcode already exists
    res.status(200).send({
      stored:false,
      error:"already exist"
    });
    return
  }
  let iv = crypto.randomBytes(16).toString('hex');
  //if all the data are present, store the institution and create a random key

  let institution=new Institution({
    name:name,
    email:email,
    vat:vat,
    password:password,
    simmetrickey: generateKey(32),
    address:address,
    iv:iv
  });



  institution.save(); 
  console.log("new institution correctly stored");

  res.status(200).send({
    stored:true,
  });
});

app.post("/rollbackuser",async (req,res)=>{

  let taxcode= req.body.taxcode;

  if( !taxcode ){ //if some data are not present abort
    res.status(200).send({
      error:"missing parameters"
    });
    return
  }


  if(await User.deleteOne({taxcode:taxcode})){  //remove the user
    res.status(200).send({rollebacked:true});
    console.log("user rollebacked");
    return
  }

  res.status(200).send({rollebacked:false});

});

app.post("/rollbackinstitution",async (req,res)=>{

  let vat= req.body.vat;

  if( !vat ){ //if some data are not present abort
    res.status(200).send({
      error:"missing parameters"
    });
    return
  }


  if(await Institution.deleteOne({vat:vat})){  //remove the institution
    res.status(200).send({rollebacked:true});
    console.log("institution rollebacked");
    return
  }

  res.status(200).send({rollebacked:false});

});

app.post("/rollbackservice",async (req,res)=>{
  let vat= req.body.vat;
  let service= req.body.service;

  if( !vat  || !service){ //if some data are not present abort
    res.status(200).send({
      error:"missing parameters"
    });
    return
  }

  
  if(await Institution.updateOne({vat: vat },{ $pull: { 'services': service } })){  //remove the institution
    res.status(200).send({rollebacked:true});
    console.log("service rollebacked");
    return
  }

  res.status(200).send({rollebacked:false});

});

app.post("/authenticate",async (req,res)=>{

  let email= req.body.email;
  let password= req.body.password;
  let address=req.body.address;

  let user=await User.findOne({email:email, password:password, address:address});
  let institution= await Institution.findOne({email:email, password:password, address:address});

  if(user){
      let data={
        name:user.name,
        surname:user.surname,
        taxcode:user.taxcode,
        address:user.address
      }
      res.status(200).send({authenticated:true, account:'user', data:data});
      return
  }
  if(institution){
    let data={
      name:institution.name,
      vat:institution.vat,
      address:institution.address
    }
    res.status(200).send({authenticated:true, account:'institution',data:data});
    return
  }

  res.status(200).send({authenticated:false});
});


app.post("/addservice",async (req,res)=>{

  let vat= req.body.vat;
  let service= req.body.service;

  if(!vat || ! service){
    res.status(200).send({ error: "missing parameters"});
    return;
  }

  const institution = await Institution.findOne({ vat: vat });


  if (institution) {
    institution.services.push(service);
    await institution.save(); 

    res.status(200).send({ stored: true});
    return;
  }
  res.status(200).send({stored:false});
});

app.get("/institutions",async (req,res)=>{
  let institutions=await Institution.find();
  if(institutions){
    res.status(200).send({ error:false, institutions: institutions});
    return;
  }
  res.status(200).send({ error:true});

});

app.post("/services",async (req,res)=>{
  let vat= req.body.vat;

  if(!vat){
    res.status(200).send({ error: "missing parameters"});
    return;
  }

  let institution=await Institution.findOne({vat:vat}).exec();;
  if (institution){
    res.status(200).send({ error:false, services: institution.services});
    return;
  }
  res.status(200).send({ error:true});
});


app.post("/encode",async (req,res)=>{
  
  let vat= req.body.vat;
  let taxcode= req.body.taxcode;
  let service= req.body.service;

  if(!vat || !service || !taxcode){
    res.status(200).send({ error: "missing parameters"});
    return;
  }

  let institution=await Institution.findOne({vat:vat}).exec();

  if (institution){
    let plaintext=institution.vat+"|"+taxcode+"|"+service;

    

    let cipher = crypto.createCipheriv('aes-256-cbc', institution.simmetrickey, Buffer.from(institution.iv, 'hex')); //create chiper
    let encoded = cipher.update(plaintext, 'utf-8', 'hex');   //cipher
    encoded += cipher.final('hex');


    
    res.status(200).send({ error:false, encoded: encoded});

    return;
  }
  res.status(200).send({ error:true});
});


app.post("/decode",async (req,res)=>{

  let vat=req.body.vat;
  let encoded= req.body.encoded;

  if(!vat || !encoded){
    res.status(200).send({ error: "missing parameters"});
    return;
  }

  let institution=await Institution.findOne({vat:vat}).exec();

  if (institution){

    let decipher = crypto.createDecipheriv('aes-256-cbc', institution.simmetrickey, Buffer.from(institution.iv, 'hex'));
    let decoded = decipher.update(encoded, 'hex', 'utf-8');
    decoded += decipher.final('utf-8');
  
    res.status(200).send({ error:false, decoded: decoded.split("|")[2]});

    return;
  }
  res.status(200).send({ error:true});
});





function generateKey(length) {
  let result = '';
  const characters = 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}



//connect to the database and start the server
var db = mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("Connected to Database");
    app.listen(process.env.PORT, () => { console.log(`Server listening`); });
}).catch((err)=> {
    console.log("Database connection Error");
    console.log(err);
});

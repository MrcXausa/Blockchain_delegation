const express = require('express'); 
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');
const cors = require('cors');
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

  //console.log(req.body);
  //console.log(name+" "+surname+" "+email+" "+taxcode+" "+password);

  if(!name || !surname || !email || !taxcode || !password){ //if some data are not present abort
    res.status(200).send({
      stored:false,
      error:"missing parameters"
    });
    return
  }

  if(await User.findOne({taxcode:taxcode}) || await User.findOne({email:email})){ //if a user with that taxcode already exists
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
      password:password
  });

  user.save(); 
  console.log("new user correctly stored");


  res.status(200).send({
    stored:true,
  });

});


app.post("/registerinstitution",async (req,res)=>{

  let name= req.body.name;
  let piva= req.body.piva;
  let email= req.body.email;
  let password= req.body.password;

  if(!name || !piva || !email ||  !password){ //if some data are not present abort
    res.status(200).send({
      stored:false,
      error:"missing parameters"
    });
    return
  }
  if(await Institution.findOne({piva:piva}) || await Institution.findOne({email:email})){ //if a user with that taxcode already exists
    res.status(200).send({
      stored:false,
      error:"already exist"
    });
    return
  }

  //if all the data are present, store the institution

  let institution=new Institution({
    name:name,
    email:email,
    piva:piva,
    password:password
  });

  institution.save(); 
  console.log("new institution correctly stored");

  res.status(200).send({
    stored:true,
  });
});

app.post("/authenticate",async (req,res)=>{

  let email= req.body.email;
  let password= req.body.password;

  if(await User.findOne({email:email, password:password})){
      res.status(200).send({authenticated:true, account:'user'});
      return
  }
  if(await Institution.findOne({email:email, password:password})){
    res.status(200).send({authenticated:true, account:'institution'});
    return
  }

  res.status(200).send({authenticated:false});
});





//connect to the database and start the server
var db = mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("Connected to Database");
    app.listen(process.env.PORT, () => { console.log(`Server listening`); });
}).catch((err)=> {
    console.log("Database connection Error");
    console.log(err);
});

const express = require('express'); 
const mongoose = require('mongoose');
const User = require('./models/User');
const Institution = require('./models/Institution');

//instantiating app
const app=express();
var port = 8081;

//setting up express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/registeruser",async (req,res)=>{

    let name= req.body.name;
    let surname= req.body.surname;
    let email= req.body.email;
    let taxcode= req.body.taxcode;
    let password= req.body.password;
  
    if(!name || !surname || !email || !taxcode || !password){ //if some data are not present abort
      res.status(400).send({
        error:"missing parameters"
      });
      return
    }

    if(await User.findOne({taxcode:taxcode}) || await User.findOne({email:email})){ //if a user with that taxcode already exists
      res.status(400).send({
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

    res.status(200).send();
  
  });


app.post("/registerinstitution",async (req,res)=>{

    let name= req.body.name;
    let piva= req.body.piva;
    let email= req.body.email;
    let password= req.body.password;

    if(!name || !piva || !email ||  !password){ //if some data are not present abort
        res.status(400).send({
        error:"missing parameters"
        });
        return
    }
    if(await Institution.findOne({piva:piva}) || await Institution.findOne({email:email})){ //if a user with that taxcode already exists
        res.status(400).send({
        error:"already exist"
        });
        return
    }

    //if all the data are present, store the user

    let institution=new Institution({
        name:name,
        email:email,
        piva:piva,
        password:password
    });

    institution.save(); 

    res.status(200).send();
});

app.get("/authenticate",async (req,res)=>{
    let email= req.body.email;
    let password= req.body.password;

    if(await User.findOne({email:email, password:password}) || await Institution.findOne({email:email, password:password})){
        res.status(200).json({authenticated:true}).send();
        return
    }
    res.status(400).json({authenticated:false}).send();
});





//connect to the database and start the server
var db = mongoose.connect("mongodb+srv://admin:Adminsw@ingegneriasw.shvnz.mongodb.net/blockchain?retryWrites=true&w=majority").then(() => {
    console.log("Connected to Database");
    app.listen(port, () => { console.log(`Server listening`); });
}).catch((err)=> {
    console.log("Database connection Error");
    console.log(err);
});

const express = require('express');
const router2 = express.Router();
const keccak256 = require('keccak256')

const User = require('./models/User');
const Institution = require('./models/Institution');

router2.post("/registerinstitution",async (req,res)=>{
  
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
  
    let institution=new Institution({
      name:name,
      email:email,
      vat:vat,
      password:password,
      address:address
    });
  
  
  
    institution.save(); 
    console.log("new institution correctly stored");
  
    res.status(200).send({
      stored:true,
    });
});


router2.post("/addservice",async (req,res)=>{
  
    let vat= req.body.vat;
    let service= req.body.service;
  
    if(!vat || ! service){
      res.status(200).send({ error: "missing parameters"});
      return;
    }
  
    const institution = await Institution.findOne({ vat: vat });
  
  
    if (institution) {
        institution.services.push(service);
        institution.hashservices.push(keccak256(service).toString('hex'));
        await institution.save(); 
    
        console.log("hashed service: "+keccak256(service).toString('hex'))
        res.status(200).send({ stored: true, hash:keccak256(service).toString('hex')});
        return;
    }
    res.status(200).send({stored:false});
});

router2.post("/decode",async (req,res)=>{
  
    let vat=req.body.vat;
    let hashservice= req.body.hashservice;
  
    if(!vat || !hashservice){
      res.status(200).send({ error: "missing parameters"});
      return;
    }

    
  
    let institution=await Institution.findOne({vat:vat}).exec();

    hashservice=hashservice.substring(2);
  
    if (institution){
        
        let found=false;
        let i=0;
        console.log(institution.hashservices.length);
        while(!found && i<institution.hashservices.length){
            console.log(institution.hashservices[i]+" "+hashservice);
            if(institution.hashservices[i]==hashservice)
                found=true;
            else
                i++;
        }
        
        res.status(200).send({ error:false, service: institution.services[i]});
  
        return;
    }
    res.status(200).send({ error:true});
});

module.exports=router2;
import { useEth } from "../../contexts/EthContext";
import { useNavigate } from "react-router-dom";
import './Userpage.css'
import { useEffect, useState } from "react";

function Userpage({authenticated,user}){

    const { state: { contract, accounts } } = useEth();
    const [options, setOptions]=useState(<></>);
    const [services, setServices]=useState(<></>);
    const [services1, setServices1]=useState(<></>);
    const [delegations, setDelegations]=useState(<></>);
    const [loaded, setLoaded]=useState(false);

    const navigate=useNavigate();

    useEffect(()=>{
        if(!authenticated)
            navigate("/error");
        if(!loaded){
            fetch("http://localhost:3000/institutions",{method:'GET'}) 
            .then(response => {
                return response.json();
            })
            .then(res=>{
                let sup=[];
                let institutions=res.institutions;
                for(let i=0;i<institutions.length;i++){
                    let value={
                        vat:institutions[i].vat,
                        address: institutions[i].address
                    }
                    sup.push(<option value={JSON.stringify(value)} >{institutions[i].name} </option>);
                }
                setOptions(sup);

                let toBeSent={
                    vat:res.institutions[0].vat
                }
        
                fetch("http://localhost:3000/services",{
                    method:'POST',
                    headers: { "Content-Type": "application/json" },
                    body:JSON.stringify(toBeSent)
                }) 
                .then(response => {
                    return response.json();
                })
                .then((res)=>{
                    let sup=[];
                    for (let i=0;i<res.services.length;i++){
                        sup.push(<option value={res.services[i]} >{res.services[i]} </option>);
                    }
                    setServices(sup);
                    setServices1(sup);
                })
            })
            setLoaded(true);
        }
        
    });


    async function handleSubmit1(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let vat=JSON.parse(e.target.vat.value).vat;
        let service =e.target.service.value;
        let institutionAddress=JSON.parse(e.target.vat.value).address;

        let toBeSent={
            vat:vat,
            taxcode:user.taxcode,
            service:service
        }
        console.log(toBeSent)

        let res= await fetch("http://localhost:3000/encode",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) .then(response => {
            return response.json();
            
        })

        if(res.error){
            alert("error occurred, try again");
        }
        else{
            let isValid=await contract.methods.checkService(institutionAddress,service).call({ from: accounts[0]  })
            console.log("isvalid: "+isValid);
            if(isValid){
                let encodedservice=res.encoded;
                console.log("encodedservice check delegation: "+encodedservice);
                if(accounts[0]==user.address){
                    contract.events.debug(options, (error, event) => {
                        if (error) {
                          console.error("Error:", error);
                          return;
                        }
                      
                        // Handle the event data
                        console.log("Event received:", event.returnValues);
                      })
                    .on("data", (event) => {
                    if(event.code=="delegation alredy exists")
                        alert("delegation alredy exists");
                    console.log(event);
                    })
                    contract.methods.delegate(address,institutionAddress,encodedservice).send({ from: accounts[0] })
                    .then(()=>{
                        alert("delegation approved");
                    })
                }
                else
                    alert("wrong account on metamask");
            }
            else
                alert("service not found in the contract");
   
           
        }

       
    }

    async function handleSubmit2(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let service=e.target.service.value;
        let vat=JSON.parse(e.target.vat.value).vat;
        let institutionAddress=JSON.parse(e.target.vat.value).address;

        let toBeSent={
            vat:vat,
            taxcode:user.taxcode,
            service:service
        }
        console.log(toBeSent)

        let res= await fetch("http://localhost:3000/encode",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) .then(response => {
            return response.json();
            
        })


        if(res.error){
            alert("error occurred, try again");
        }
        else{
            let encodedservice=res.encoded;
            console.log("encodedservice check delegation: "+encodedservice);
            contract.methods.checkDelegationUser(address,institutionAddress,encodedservice).call({ from: accounts[0] })
            .then((res)=>{
                if(res)
                    alert("Delegation permitted");
                else
                    alert("Delegation not permitted");
            })
            .catch((err)=>{console.log("error"); console.log(err)});
        }
       
    }


    function handleChange(e){
        e.preventDefault();

        let vat=JSON.parse(e.target.value).vat;

        let toBeSent={
            vat:vat
        }

        fetch("http://localhost:3000/services",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })
        .then((res)=>{
            let sup=[];
            for (let i=0;i<res.services.length;i++){
                sup.push(<option value={res.services[i]} >{res.services[i]} </option>);
            }
            setServices(sup);
        })
    }

    function handleChange1(e){
        e.preventDefault();

        let vat=JSON.parse(e.target.value).vat;

        let toBeSent={
            vat:vat
        }

        fetch("http://localhost:3000/services",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })
        .then((res)=>{
            let sup=[];
            for (let i=0;i<res.services.length;i++){
                sup.push(<option value={res.services[i]} >{res.services[i]} </option>);
            }
            setServices1(sup);
        })
    }

    function handleFormViewDelegations(e){
        e.preventDefault(); 
        
        
        let addressInst=JSON.parse(e.target.institutionView.value).address;
        let vat=JSON.parse(e.target.institutionView.value).vat;

        
        
        if(accounts[0]==user.address){
            contract.events.debug(options, (error, event) => {
                if (error) {
                  console.error("Error:", error);
                  return;
                }
              
                // Handle the event data
            console.log("Event received:", event.returnValues);
            })
            .on("data", (event) => {         
            console.log(event.code);
            });

           
            contract.methods.userDelegations(addressInst).call({ from: accounts[0] })
            .then(async(res)=>{
                const delegations = res.map((delegation) => ({
                    delegated: delegation.delegated,
                    institution: delegation.institution,
                    services: delegation.services,
                }));
                let ser=[];
                for(let i=0;i<delegations.length;i++){
                    for(let j=0;j<delegations[i].services.length;j++){
                        console.log("service encoded= "+delegations[i].services[j]);
                        
                        let toBeSent={
                            vat:vat,
                            encoded:delegations[i].services[j]
                        }

                        let service= await fetch("http://localhost:3000/decode",{
                            method:'POST',
                            headers: { "Content-Type": "application/json" },
                            body:JSON.stringify(toBeSent)
                        }) 
                        .then(response => {
                            return response.json();
                        })
                        ser.push(<p>delegated:{delegations[i].delegated}, service: {service.decoded}</p>);
                        
                    }
                }
                setDelegations(ser);


            })

        }else{
            alert("check metamask account: user and account not match!");
        }

    }



    async function handleDeleteDelegation(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let service=e.target.service.value;
        let institutionAddress=JSON.parse(e.target.vat.value).address;
        let vat=JSON.parse(e.target.vat.value).vat;

        let toBeSent={
            vat:vat,
            taxcode:user.taxcode,
            service:service
        }

        let res= await fetch("http://localhost:3000/encode",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) .then(response => {
            return response.json();
        })
        let encodedService=res.encoded;


        if(accounts[0]==user.address){
            contract.events.debug(options, (error, event) => {
                if (error) {
                  console.error("Error:", error);
                  return;
                }
              
                // Handle the event data
                console.log("Event received:", event.returnValues);
              })
            .on("data", (event) => {
            if(event.code=="delegation alredy exists")
                alert("delegation alredy exists");
            console.log(event);
            })
            contract.methods.deleteDelegation(address,institutionAddress,encodedService).send({from: accounts[0]})
            .then((res)=>{
                if(!res){
                    alert("Could not delete delegation");
                }else{
                    alert("Delegation deleted!");
                }
                    
            })
            .catch((err)=>{console.log("error in delete delegation"); console.log(err)});

        
        }
       
    }

    return (
        <div className="user-wrapper">
            <form onSubmit={handleSubmit1}>
                <h1>Delegate</h1>
                <br />
                <label>delegated address:</label>
                <br />
                <input type="text" name="delegated_address" />
                <br />
                <label>vat of company to delegate:</label>
                <br />
                <select name="vat" onChange={handleChange}>
                    {options}
                </select>
                <br />
                <label>service to delegate:</label>
                <br />
                <select name="service">
                    {services}
                </select>
                <br />
                <br />
                <button type="submit">delegate</button>
            </form>
            <br />
            <br />
            <form onSubmit={handleSubmit2}>
                <h1>Check delegation</h1>
                <br />
                <label>delegated address:</label>
                <br />
                <input type="text" name="delegated_address" />
                <br />
                <label>vat of company to delegate:</label>
                <br />
                <select name="vat" onChange={handleChange1}>
                    {options}
                </select>
                <br />
                <label>service:</label>
                <br />
                <select name="service">
                    {services1}
                </select>
                <br />
                <br />
                <button type="submit">check delegation</button>
            </form>
            <br />
            <form onSubmit={handleFormViewDelegations}>
                <h1>View delegations</h1>
                <br></br>
                <label>select institution:</label>
                <br></br>
                <select name="institutionView">
                    {options}
                </select>
                <br></br>
                <button type="submit">view</button>
            </form>
            <br />
            <br />
            {delegations}
            <form onSubmit={handleDeleteDelegation}>
                <h1>Delete Delegation</h1>
                <br />
                <label>delegated address:</label>
                <br />
                <input type="text" name="delegated_address" />
                <br />
                <label>vat of company:</label>
                <br />
                <select name="vat" onChange={handleChange}>
                    {options}
                </select>
                <br />
                <label>service delegated:</label>
                <br />
                <select name="service">
                    {services}
                </select>
                <br />
                <br />
                <button type="submit">delete</button>
            </form>
        </div>
    );
}

export default Userpage;
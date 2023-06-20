import { useEth } from "../../contexts/EthContext";
import { useNavigate } from "react-router-dom";
import './Userpage.css'
import { useEffect, useState } from "react";

function Userpage({authenticated,user}){
    const { state: { contract, accounts } } = useEth();
    const [options, setOptions]=useState(<></>);
    const [services, setServices]=useState(<></>);
    const [services1, setServices1]=useState(<></>);
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
            let encodedservice=res.encoded;
            console.log(encodedservice);
            if(accounts[0]==user.address){
                contract.methods.delegate(address,institutionAddress,encodedservice).send({ from: accounts[0] })
                .then((res)=>{
                    alert("Delegation approved!");  
                })
                .catch((err)=>{alert("Contract not signed");});
            }
            else
                alert("wrong account on metamask");
           
        }

       
    }

    async function handleSubmit2(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let service=e.target.service.value;
        let institutionAddress=JSON.parse(e.target.vat.value).address;
        contract.methods.checkDelegationUser(address,institutionAddress,service).call({ from: accounts[0] })
        .then((res)=>{
            if(res)
                alert("Delegation permitted: "+res);
            else
                alert("Delegation not permitted");
        })
        .catch((err)=>{console.log("error"); console.log(err)});
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
        </div>
    );
}

export default Userpage;
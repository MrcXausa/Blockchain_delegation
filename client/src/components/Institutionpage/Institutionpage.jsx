import { useEth } from "../../contexts/EthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Institutionpage.css'

function Institutionpage({authenticated,institution}){
    const { state: { contract, accounts } } = useEth();

    const [delegations, setDelegations]=useState(<></>);

    const navigate=useNavigate();
    useEffect(()=>{
        if(!authenticated)
            navigate("/error");
    });

    async function handleSubmit1(e){
        e.preventDefault();
        let service =e.target.service.value;
        let vat=institution.vat
        
        var toBeSent={
            vat:vat,
            service:service
        };

        console.log(toBeSent)

        await fetch("http://localhost:3000/addservice",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })
        .then(async (response) => {
            console.log(response);
            if(response.stored){
                await contract.methods.addService(service).send({ from: accounts[0]  })
                .then(()=>alert("service added"))
                .catch((err)=>{
                    alert("contract not signed");
                    fetch("http://localhost:3000/rollbackservice",{
                        method:'POST',
                        headers: { "Content-Type": "application/json" },
                        body:JSON.stringify({vat:vat,service:service})
                    });
                });
            }

            
        })

    }

    return <>
        <div className="institution-wrapper">
            <form onSubmit={handleSubmit1}>
                <h1>Add a service</h1>
                <br />
                <label>service name:</label>
                <br />
                <input type="text" name="service" />
                <br />
                <button type="submit">store</button>
            </form>

            <form >
                <h1>Check delegation</h1>
                <br />
                <label>adddress:</label>
                <br />
                <input type="text" name="service" />
                <br />
                <button type="submit">store</button>
            </form>
            <br />
            {delegations}
        </div>
    </>;
}

export default Institutionpage;
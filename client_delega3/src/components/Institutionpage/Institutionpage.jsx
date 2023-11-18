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

        await fetch("http://localhost:3000/v2/addservice",{
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
                
                if(accounts[0]===institution.address){
                    await contract.methods.addService(service).send({ from: accounts[0]  })
                    .then(()=>alert("service added"))
                    .catch((err)=>{
                        alert("contract not signed");
                        fetch("http://localhost:3000/v1/rollbackservice",{
                            method:'POST',
                            headers: { "Content-Type": "application/json" },
                            body:JSON.stringify({vat:vat,service:service})
                        });
                    });
                }
                else    
                    alert("wrong account on metamask");
               
            }

            
        })

    }

    function handleFormViewDelegations(e){
        e.preventDefault(); 
        
        
        let userAddress =e.target.address.value;
        let vat=institution.vat
        
        
        
        if(accounts[0]===institution.address){
           
            contract.methods.institutionDelegations(userAddress).call({ from: accounts[0] })
            .then(async (res)=>{
                
                const delegations = res.map((delegation) => ({
                    delegated: delegation.delegated,
                    service: delegation.services,
                }));
                
                console.log("delegations= "+delegations);
              
                console.log("before loop");
                let ser = [];
                for (let i = 0; i < delegations.length; i++) {
                    console.log("i= "+i);
                    let toBeSent={
                        vat:vat,
                        hashservice:delegations[i].service
                    }

                    let res= await fetch("http://localhost:3000/v2/decode",{
                        method:'POST',
                        headers: { "Content-Type": "application/json" },
                        body:JSON.stringify(toBeSent)
                    }) 
                    .then(response => {
                        let tmp= response.json();
                        return tmp;
                    })
                    ser.push(<p key={`${i}`}><b>Delegated:</b> {delegations[i].delegated}<br/><b>Service:</b> {res.service}</p>);
                }
                console.log(ser)
                setDelegations(ser);


            })

        }else{
            alert("check metamask account: user and account not match!");
        }

    }

    return <>
        <div className="institution-wrapper">
            <form onSubmit={handleSubmit1}>
                <h1>Add a service</h1>
                <br />
                <label>Service Name</label>
                <br />
                <input type="text" name="service" />
                <br />
                <button type="submit">Store</button>
            </form>
            <br />
            <form onSubmit={handleFormViewDelegations}>
                <h1>View delegations</h1>
                <br></br>
                <label>Insert Address</label>
                <br />
                <input type="text" name="address" />
                <br />
                <button type="submit">View</button>
            </form>
            {delegations}
        </div>
    </>;
}

export default Institutionpage;
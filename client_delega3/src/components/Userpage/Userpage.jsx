import { useEth } from "../../contexts/EthContext";
import { useNavigate } from "react-router-dom";
import './Userpage.css'
import { useEffect, useState } from "react";

function Userpage({ authenticated, user }) {

    const { state: { contract, accounts } } = useEth();
    const [options, setOptions] = useState(<></>);
    const [services, setServices] = useState(<></>);
    const [services1, setServices1] = useState(<></>);
    const [delegations, setDelegations] = useState(<></>);
    const [loaded, setLoaded] = useState(false);
    const [showDelegations, setShowDelegations] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated)
            navigate("/error");
        if (!loaded) {
            fetch("http://localhost:3000/v1/institutions", { method: 'GET' })
                .then(response => {
                    return response.json();
                })
                .then(res => {
                    let sup = [];
                    let institutions = res.institutions;
                    for (let i = 0; i < institutions.length; i++) {
                        let value = {
                            vat: institutions[i].vat,
                            address: institutions[i].address
                        }
                        sup.push(<option key={i} value={JSON.stringify(value)}>{institutions[i].name}</option>);
                    }
                    setOptions(sup);

                    let toBeSent = {
                        vat: res.institutions[0].vat
                    }

                    fetch("http://localhost:3000/v1/services", {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(toBeSent)
                    })
                        .then(response => {
                            return response.json();
                        })
                        .then((res) => {
                            let sup = [];
                            for (let i = 0; i < res.services.length; i++) {
                                sup.push(<option key={i} value={res.services[i]}>{res.services[i]}</option>);
                            }
                            setServices(sup);
                            setServices1(sup);
                        })
                })
            setLoaded(true);
        }

    });


    async function handleSubmit1(e) {
        e.preventDefault();
        let address = e.target.delegated_address.value;
        let vat = JSON.parse(e.target.vat.value).vat;
        let service = e.target.service.value;
        let institutionAddress = JSON.parse(e.target.vat.value).address;

        let toBeSent = {
            vat: vat,
            taxcode: user.taxcode,
            service: service
        }
        console.log(toBeSent)
        

            let isValid=await contract.methods.checkService(institutionAddress,service).call({ from: accounts[0]  })
            console.log("isvalid: "+isValid);
            if(isValid){
                if(accounts[0]===user.address){
                    contract.events.debugBytes32(options, (error, event) => {
                        if (error) {
                          console.error("Error:", error);
                          return;
                        }
                        // Handle the event data
                        console.log("Event received:", event.returnValues);
                      })
                    .on("data", (event) => {
                        console.log(event);
                    })
                    contract.methods.delegate(address,institutionAddress,service).send({ from: accounts[0] })
                    .then(()=>{
                        alert("delegation approved");
                    })
                }
            }
            else
                alert("service not found in the contract");
    }

    async function handleSubmit2(e) {
        e.preventDefault();
        let address = e.target.delegated_address.value;
        let service = e.target.service.value;
        let vat = JSON.parse(e.target.vat.value).vat;
        let institutionAddress = JSON.parse(e.target.vat.value).address;

        let toBeSent = {
            vat: vat,
            taxcode: user.taxcode,
            service: service
        }
        console.log(toBeSent)

        contract.methods.checkDelegationUser(address, institutionAddress, service).call({ from: accounts[0] })
            .then((res) => {
                if (res)
                    alert("Delegation permitted");
                else
                    alert("Delegation not permitted");
            })
            .catch((err) => { console.log("error"); console.log(err) });
        

    }


    function handleChange(e) {
        e.preventDefault();

        let vat = JSON.parse(e.target.value).vat;

        let toBeSent = {
            vat: vat
        }

        fetch("http://localhost:3000/v1/services", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toBeSent)
        })
            .then(response => {
                return response.json();
            })
            .then((res) => {
                let sup = [];
                for (let i = 0; i < res.services.length; i++) {
                    sup.push(<option value={res.services[i]} >{res.services[i]} </option>);
                }
                setServices(sup);
            })
    }

    function handleChange1(e) {
        e.preventDefault();

        let vat = JSON.parse(e.target.value).vat;

        let toBeSent = {
            vat: vat
        }

        fetch("http://localhost:3000/v1/services", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toBeSent)
        })
            .then(response => {
                return response.json();
            })
            .then((res) => {
                let sup = [];
                for (let i = 0; i < res.services.length; i++) {
                    sup.push(<option value={res.services[i]} >{res.services[i]} </option>);
                }
                setServices1(sup);
            })
    }

    function handleFormViewDelegations(e) {
        e.preventDefault();


        let addressInst = JSON.parse(e.target.institutionView.value).address;
        let vat = JSON.parse(e.target.institutionView.value).vat;



        
        
        if(accounts[0]===user.address){
            contract.methods.userDelegations(addressInst).call({ from: accounts[0] })
                .then(async (res) => {
                    const delegations = res.map((delegation) => ({
                        delegated: delegation.delegated,
                        service: delegation.services,
                    }));
                    
                  
                    
                    let ser = [];
                    for (let i = 0; i < delegations.length; i++) {
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
                    setDelegations(ser);


                })

        } else {
            alert("check metamask account: user and account not match!");
        }

    }



    async function handleDeleteDelegation(e) {
        e.preventDefault();
        let address = e.target.delegated_address.value;
        let service = e.target.service.value;
        let institutionAddress = JSON.parse(e.target.vat.value).address;
        let vat = JSON.parse(e.target.vat.value).vat;

        if(accounts[0]===user.address){
            contract.events.debugBytes32(options, (error, event) => {
                if (error) {
                  console.error("Error:", error);
                  return;
                }
                // Handle the event data
                console.log("Event received:", event.returnValues);
            })
            .on("data", (event) => {
                console.log(event);
            })
            contract.methods.revoke(address, institutionAddress, service).send({ from: accounts[0] })
                .then((res) => {
                    if (!res) {
                        alert("Could not delete delegation");
                    } else {
                        alert("Delegation deleted!");
                    }

                })
                .catch((err) => { console.log("error in delete delegation"); console.log(err) });
        }
    }

    return (
        <div className="user-wrapper">
            <section>
                <h1>Delegate</h1>
                <form onSubmit={handleSubmit1}>
                    <br />
                    <label>delegated address</label>
                    <br />
                    <input type="text" name="delegated_address" />
                    <br />
                    <label>vat of company to delegate</label>
                    <br />
                    <select name="vat" onChange={handleChange}>
                        {options}
                    </select>
                    <br />
                    <label>service to delegate</label>
                    <br />
                    <select name="service">
                        {services}
                    </select>
                    <br />
                    <br />
                    <button type="submit">Delegate</button>
                </form>
            </section>

            <section>
                <h1>Check Delegation</h1>
                <form onSubmit={handleSubmit2}>
                    <br />
                    <label>delegated address</label>
                    <br />
                    <input type="text" name="delegated_address" />
                    <br />
                    <label>vat of company to delegate</label>
                    <br />
                    <select name="vat" onChange={handleChange1}>
                        {options}
                    </select>
                    <br />
                    <label>service</label>
                    <br />
                    <select name="service">
                        {services1}
                    </select>
                    <br />
                    <br />
                    <button type="submit">Check</button>
                </form>
            </section>

            <section>
                <h1>View Delegations</h1>
                <form onSubmit={handleFormViewDelegations}>
                    <br></br>
                    <label>select institution</label>
                    <br></br>
                    <select name="institutionView">
                        {options}
                    </select>
                    <br></br>
                    <button type="submit" onClick={() => setShowDelegations(true)}>View</button>
                </form>
                {showDelegations && (
                    <div className="modal">
                        <div className="modal-content">
                            {delegations}
                            <button className="modal-close" onClick={() => setShowDelegations(false)}>Ok</button>
                        </div>
                    </div>
                )}
            </section>

            <section>
                <h1>Delete Delegation</h1>
                <form onSubmit={handleDeleteDelegation}>
                    <br />
                    <label>delegated address</label>
                    <br />
                    <input type="text" name="delegated_address" />
                    <br />
                    <label>vat of company</label>
                    <br />
                    <select name="vat" onChange={handleChange}>
                        {options}
                    </select>
                    <br />
                    <label>service delegated</label>
                    <br />
                    <select name="service">
                        {services}
                    </select>
                    <br />
                    <br />
                    <button type="submit">Delete</button>
                </form>
            </section>

        </div>
    );
}

export default Userpage;
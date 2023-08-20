import { useEth } from "../../contexts/EthContext";
require('dotenv').config();


function RegisterInstitution({setDisplay}){
    const { state: { contract, accounts } } = useEth();



    async function handleSubmit(e){
        e.preventDefault();
        
        let name =e.target.name.value;
        let email =e.target.email.value;
        let vat =e.target.vat.value;
        let password =e.target.password.value;

        var toBeSent={
            name:name,
            email:email,
            vat:vat,
            password:password,
            address:accounts[0]
        };

        fetch("http://localhost:3000/registerinstitution",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })
        .then(async (response) => {
            if(response.stored===false)
                alert("Institution has not been created. Error:"+response.error);
            else{
                await contract.methods.addInstitution(accounts[0]).send({ from: accounts[0]  })
                .then((res)=>{alert("account created, login above");console.log(res)})
                .catch((err)=>{
                    alert("contract not signed");
                    fetch("http://localhost:3000/rollbackinstitution",{
                        method:'POST',
                        headers: { "Content-Type": "application/json" },
                        body:JSON.stringify({vat:vat})
                    });
                });
            }
        })




        
    }

    function handleClick(e){
        e.preventDefault(); 
        setDisplay(true);
    }

    return (
        <>
         <form className="user-institution-register-form" onSubmit={handleSubmit}>
            <h1>Insert your information</h1>
            <label >Institution name: </label>
            <input type="text" name="name"  />
            <br />
            <br />
            <label >VAT code: </label>
            <input type="text" name="vat"  />
            <br />
            <br />
            <label >email: </label>
            <input type="text" name="email"  />
            <br />
            <br />
            <label >password: </label>
            <input type="password" name="password"  />
            <br />
            <br />
            <button onClick={handleClick}>back</button>
            <br />
            <br />
            <u><b><label>Pay attention to the account selected on metamask,<br /> it will be bounded to the institution</label></b></u>
            <br />
            <br />
            <button type="submit">register</button>
        </form>
        </>
    );
}

export default RegisterInstitution;
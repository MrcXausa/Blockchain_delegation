import { useEth } from "../../contexts/EthContext";
require('dotenv').config();

function Registeruser({setDisplay}){
    const { state: { contract, accounts, owner } } = useEth();


    async function handleSubmit(e){
        e.preventDefault();

        let name =e.target.name.value;
        let surname =e.target.surname.value;
        let email =e.target.email.value;
        let taxcode =e.target.taxcode.value;
        let password =e.target.password.value;
        console.log(accounts[0])

        var toBeSent={
            name:name,
            surname:surname,
            email:email,
            taxcode:taxcode,
            password:password,
            address:accounts[0]
        };

        fetch("http://localhost:3000/registeruser",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            return response.json();
        })
        .then(async (response) => {
            console.log(response);
            if(response.stored==false)
                alert("User has not been created. Error:"+response.error);
            else{
                await contract.methods.addUser(accounts[0]).send({ from: accounts[0] /*process.env.REACT_APP_CONTRACT_OWNER_ADDRESS*/ })
                .then(()=>alert("account created, login above"))
                .catch((err)=>{
                    alert("contract not signed");
                    fetch("http://localhost:3000/rollbackuser",{
                        method:'POST',
                        headers: { "Content-Type": "application/json" },
                        body:JSON.stringify({taxcode:taxcode})
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
        <form onSubmit={handleSubmit}>
            <h1>Insert your information</h1>
            <label >Name: </label>
            <input type="text" name="name"  />
            <br />
            <br />
            <label >Surname: </label>
            <input type="text" name="surname"  />
            <br />
            <br />
            <label >Email: </label>
            <input type="text" name="email"  />
            <br />
            <br />
            <label >Tax code: </label>
            <input type="text" name="taxcode"  />
            <br />
            <br />
            <label >Password: </label>
            <input type="password" name="password"  />
            <br />
            <br />
            <button onClick={handleClick}>back</button>
            <br />
            <br />
            <u><b><label>Pay attention to the account selected on metamask,<br /> it will be bounded to the user</label></b></u>
            <br />
            <br />
            <button type="submit">register</button>
        </form>
        </>
    );
}

export default Registeruser;
import { useEth } from "../../contexts/EthContext";
require('dotenv').config();

function Registeruser({setDisplay}){
    const { state: { contract, accounts } } = useEth();


    async function handleSubmit(e){
        e.preventDefault();

        //to verify: how to let the user choose which address to use
        //we have to modify addUser(accounts[0])


        await contract.methods.addUser(accounts[0]).send({ from: process.env.REACT_APP_CONTRACT_OWNER_ADDRESS })
        .then((res)=>{
            if(res)
                alert("Account bounded to address!");
            else
                alert("Account not added");
            console.log(res);
        })
        .catch((err)=>{console.log("error"); console.log(err)});
    
        
        let name =e.target.name.value;
        let surname =e.target.surname.value;
        let email =e.target.email.value;
        let taxcode =e.target.taxcode.value;
        let password =e.target.password.value;

        var toBeSent={
            name:name,
            surname:surname,
            email:email,
            taxcode:taxcode,
            password:password
        };

        fetch("http://localhost:3000/registeruser",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
        }) 
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then((response) => {
            console.log(response);
            if(response.stored==false)
                alert("User has not been created. Error:"+response.error);
            else{
                alert("User has been created");
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
            <label >Surname: </label>
            <input type="text" name="surname"  />
            <br />
            <label >Email: </label>
            <input type="text" name="email"  />
            <br />
            <label >Tax code: </label>
            <input type="text" name="taxcode"  />
            <br />
            <label >Password: </label>
            <input type="password" name="password"  />
            <br />
            <button onClick={handleClick}>back</button>
            <button type="submit">register</button>
        </form>
        </>
    );
}

export default Registeruser;
import { useEth } from "../../contexts/EthContext";
require('dotenv').config();


function RegisterInstitution({setDisplay}){
    const { state: { contract, accounts } } = useEth();



    async function handleSubmit(e){
        e.preventDefault();

        await contract.methods.addUser(accounts[0]).send({ from: process.env.REACT_APP_CONTRACT_OWNER_ADDRESS  })
        .then((res)=>{
            if(res)
                alert("Account bounded to address!");
            else
                alert("Account not added");
            console.log(res)
        })
        .catch((err)=>{console.log("error"); console.log(err)});

        let name =e.target.name.value;
        let email =e.target.email.value;
        let piva =e.target.piva.value;
        let password =e.target.password.value;

        var toBeSent={
            name:name,
            email:email,
            piva:piva,
            password:password
        };

        await fetch("http://localhost:3000/registerinstitution",{
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
                alert("Institution has not been created. Error:"+response.error);
            else{
                alert("Institution has been created");
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
            <label >Institution name: </label>
            <input type="text" name="name"  />
            <br />
            <label >P.Iva: </label>
            <input type="text" name="piva"  />
            <br />
            <label >email: </label>
            <input type="text" name="email"  />
            <br />
            <label >password: </label>
            <input type="password" name="password"  />
            <br />
            <button onClick={handleClick}>back</button>
            <button type="submit">register</button>
        </form>
        </>
    );
}

export default RegisterInstitution;
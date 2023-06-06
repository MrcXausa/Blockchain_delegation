import { useEth } from "../contexts/EthContext";

function Registeruser(){
    const { state: { contract, accounts } } = useEth();


    function handleSubmit(e){
        e.preventDefault();

        //to verify: how to let the user choose which address to use
        //we have to modify addUser(accounts[0])
        contract.methods.addUser(accounts[0]).send({ from: accounts[0] })
            .then((res)=>{
                if(res)
                    alert("Account created and bounded to address!");
                else
                    alert("Account not added");
                console.log(res)
            })
            .catch((err)=>{console.log("error"); console.log(err)});
        
            //send user to api
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
            <button type="submit">register</button>
        </form>
        </>
    );
}

export default Registeruser;
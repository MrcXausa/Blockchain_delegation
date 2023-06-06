import { useEth } from "../contexts/EthContext";

function RegisterInstitution(){
    const { state: { contract, accounts } } = useEth();

    function handleSubmit(e){
        e.preventDefault();

        contract.methods.addUser(accounts[0]).send({ from: accounts[0] })
            .then((res)=>{
                if(res)
                    alert("Account created and bounded to address!");
                else
                    alert("Account not added");
                console.log(res)
            })
            .catch((err)=>{console.log("error"); console.log(err)});
    }

    return (
        <>
         <form onSubmit={handleSubmit}>
            <h1>Insert your information</h1>
            <label >Institution name: </label>
            <input type="text" name="name"  />
            <br />
            <label >P.Iva: </label>
            <input type="text" name="surname"  />
            <br />
            <label >email: </label>
            <input type="text" name="email"  />
            <br />
            <label >password: </label>
            <input type="password" name="password"  />
            <br />
            <button type="submit">register</button>
        </form>
        </>
    );
}

export default RegisterInstitution;
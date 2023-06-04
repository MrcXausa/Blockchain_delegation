import { useEth } from "../contexts/EthContext";

function Formdelegation(){
    const { state: { contract, accounts } } = useEth();


    async function handleSubmit1(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let service =e.target.service.value;

        console.log("account[0]="+accounts[0]);
        contract.methods.delegate(address,service).send({ from: accounts[0] })
            .then((res)=>{
                alert(res);
                console.log(res);
            
        })
            .catch((err)=>{alert("error"); console.log(err)});
    }

    async function handleSubmit2(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let service=e.target.service.value;
        contract.methods.checkDelegation(address,service).call({ from: accounts[0] })
            .then((res)=>{
                if(res)
                    alert("Delegation permitted: "+res);
                else
                    alert("Delegation not permitted");
            })
            .catch((err)=>{console.log("error"); console.log(err)});
    }
    async function handleSubmit3(e){
        e.preventDefault();
        let address =e.target.user_address.value;
        contract.methods.addUser(address).send({ from: accounts[0] })
            .then((res)=>{
                if(res)
                    alert("Account added: "+res);
                else
                    alert("Account not added");
                console.log(res)
            })
            .catch((err)=>{console.log("error"); console.log(err)});
    }

    return (
        <>
        <form onSubmit={handleSubmit1}>
            <h1>Delegate</h1>
            <br />
            <label>delegated address:</label>
            <br />
            <input type="text" name="delegated_address" />
            <br />
            <label>service to delegate:</label>
            <br />
            <input type="text" name="service" />
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
            <label>service:</label>
            <br />
            <input type="text" name="service" />
            <br />
            <br />
            <button type="submit">check delegation</button>
        </form>
        <form onSubmit={handleSubmit3}>
            <h1>Add user</h1>
            <br />
            <label>User's address:</label>
            <br />
            <input type="text" name="user_address" />
            <br />
            <br />
            <button type="submit">Add</button>
        </form>
        </>
    );
}

export default Formdelegation;
import { useEth } from "../contexts/EthContext";
import { useState } from "react";

function Formdelegation(){
    const { state: { contract, accounts } } = useEth();


    async function handleSubmit1(e){
        e.preventDefault();
        let name1=e.target.delegator_name.value;
        let name2=e.target.delegated_name.value;
        let address =e.target.delegated_address.value;

        console.log(name1+" "+name2+" "+address);

        contract.methods.delegate(name1,address,name2).send({ from: accounts[0] })
            .then(()=>{console.log("done")})
            .catch((err)=>{console.log("error"); console.log(err)});
    }

    async function handleSubmit2(e){
        e.preventDefault();
        let address =e.target.delegated_address.value;
        let id=e.target.id.value;
        contract.methods.checkDelegation(id,address).call({ from: accounts[0] })
            .then((res)=>{alert("done. res="+res)})
            .catch((err)=>{console.log("error"); console.log(err)});
    }

    return (
        <>
        <form onSubmit={handleSubmit1}>
            delegator name:
            <input type="text" name="delegator_name" />
            <br />
            delegated name:
            <input type="text" name="delegated_name" />
            <br />
            delegated address:
            <input type="text" name="delegated_address" />
            <br />

            <button type="submit">delegate</button>
        </form>
        <form onSubmit={handleSubmit2}>
            delegated address:
            <input type="text" name="delegated_address" />
            <br />
            check delegation:
            <input type="text" name="id" />
            <br />
            <button type="submit">check delegation</button>
        </form>
        </>
    );
}

export default Formdelegation;
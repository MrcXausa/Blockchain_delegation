import { useState } from "react";
import Registeruser from "./Registeruser";
import Registerinstitution from "./Registerinstitution";

function Begin(){
    
    const [display, setDisplay] = useState(true);
    const [content, setContent] = useState(<></>);
    

    function handleClickUser(e){
        e.preventDefault();
        setContent(<Registeruser />);
        console.log("loading user's login page");
        setDisplay(false);
        
    }
    function handleClickInstitution(e){
        e.preventDefault();
        setContent(<Registerinstitution />);
        console.log("loading institution's login page");
        setDisplay(false);
        
    }
    
    const choiceScreen=<>
        <form >
            <h1>What would you like to register as?</h1>
            <button onClick={handleClickUser} name="button" value="user">User</button>
            <button onClick={handleClickInstitution} name="button" value="institution">Institution</button>
        </form>
    </>

    return (
        <>
        { display ? choiceScreen : content }
        </>
    );
}

export default Begin;
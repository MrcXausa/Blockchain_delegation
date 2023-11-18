import { useState } from "react";
import Registeruser from "./Registeruser";
import Registerinstitution from "./Registerinstitution";
import './Subscribe.css'

function Subscribe(){
    
    const [display, setDisplay] = useState(true);
    const [content, setContent] = useState(<></>);
    

    function handleClickUser(e){
        e.preventDefault();
        setContent(<Registeruser setDisplay={setDisplay}/>);
        setDisplay(false);
        
    }
    function handleClickInstitution(e){
        e.preventDefault();
        setContent(<Registerinstitution setDisplay={setDisplay}/>);
        setDisplay(false);
        
    }
    
    const choiceScreen=<>
        <form >
            <h1>Not registered yet? Register now!</h1>
            <br />
            <br />
            <button onClick={handleClickUser} name="button" value="user">User</button>
            <br />
            <br />
            <button onClick={handleClickInstitution} name="button" value="institution">Institution</button>
        </form>
    </>

    return (
        <div className="login-wrapper">
            { display ? choiceScreen : content }
        </div>
    );
}

export default Subscribe;
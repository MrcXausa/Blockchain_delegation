import './Login.css';
import { useNavigate } from "react-router-dom";


export default function Login({setLoginUser,setLoginInstitution}) {

  const navigate = useNavigate();


  function handleSubmit(e){

    e.preventDefault();
    
    let email =e.target.email.value;
    let password =e.target.password.value;
  
    let toBeSent={
      email:email,
      password:password
    }

    fetch("http://localhost:3000/authenticate",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(toBeSent)
    }) 
    .then(response => {
        return response.json();
    })
    .then((res=>{
      console.log(res);
      if(res.authenticated){
        if(res.account=="user"){
          setLoginUser(true);
          navigate("/user"); // Redirect to /user route
        }
          
        if(res.account=="institution"){
          setLoginInstitution(true);
          navigate("/institution"); // Redirect to /institution route
        }
      }
      else 
        alert("Wrong credentials");
    }))
  }

  return(
      <div className="login-wrapper">
      <h1>Please Log In</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          <div>email</div>
          <input type="text" name="email"/>
        </label>
        <br />
        <br />
        <label>
          <div>password</div>
          <input type="password" name="password" />
        </label>
        <br />
        <br />
        <div>
          <button type="submit" >Submit</button>
        </div>
      </form>
    </div>
  )
  }
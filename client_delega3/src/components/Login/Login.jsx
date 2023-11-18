import { useEth } from '../../contexts/EthContext';
import './Login.css';
import { useNavigate } from "react-router-dom";


export default function Login({setUser,setInstitution,setLoginUser,setLoginInstitution}) {
  const { state: { accounts } } = useEth();
  const navigate = useNavigate();


  function handleSubmit(e){

    e.preventDefault();
    
    let email =e.target.email.value;
    let password =e.target.password.value;
    let address=accounts[0];
  
    let toBeSent={
      email:email,
      password:password,
      address:address
    }

    console.log(toBeSent)

    fetch("http://localhost:3000/v1/authenticate",{
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
        if(res.account==="user"){
          setLoginUser(true);
          setUser({
            name:res.data.name,
            surname:res.data.surname,
            taxcode:res.data.taxcode,
            address:res.data.address
          });
          setLoginInstitution(false);
          setInstitution({
            name:null,
            vat:null,
            address:null
          })
          navigate("/user"); // Redirect to /user route
        }
          
        if(res.account==="institution"){
          setLoginInstitution(true);
          setInstitution({
            name:res.data.name,
            vat:res.data.vat,
            address:res.data.address
          })
          setLoginUser(false);
          setUser({
            name:null,
            surname:null,
            taxcode:null,
            address:null
          })
          navigate("/institution"); // Redirect to /institution route
        }
      }
      else 
        alert("Wrong credentials, take care of selecting the right address on metamask");
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
        <u><b><label>Pay attention to the account selected on metamask</label></b></u>
        <br />
        <br />
        <div>
          <button type="submit" >Submit</button>
        </div>
      </form>
    </div>
  )
  }
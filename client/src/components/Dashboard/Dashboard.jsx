import { EthProvider } from "../../contexts/EthContext";
import Login from "../Login/Login";
import Subscribe from "../Subscribe/Subscribe";

export default function Dashboard({setUser,setInstitution,setLoginUser,setLoginInstitution}){

    return (<>
    
    <EthProvider>
      <Login setUser={setUser} setInstitution={setInstitution} setLoginUser={setLoginUser} setLoginInstitution={setLoginInstitution} />
      <hr/>
      <Subscribe setLoginUser={setLoginUser} setLoginInstitution={setLoginInstitution} />
    </EthProvider>
    </>);
}
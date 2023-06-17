import { EthProvider } from "../../contexts/EthContext";
import Login from "../Login/Login";
import Subscribe from "../Subscribe/Subscribe";

export default function Dashboard({setLoginUser,setLoginInstitution}){

    return (<>
    <Login setLoginUser={setLoginUser} setLoginInstitution={setLoginInstitution} />
    <hr/>
    <EthProvider>
      <Subscribe setLoginUser={setLoginUser} setLoginInstitution={setLoginInstitution} />
    </EthProvider>
    </>);
}
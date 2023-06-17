import { useEth } from "../../contexts/EthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Institutionpage.css'

function Institutionpage({authenticated}){
    const { state: { contract, accounts } } = useEth();
    const navigate=useNavigate();
    useEffect(()=>{
        if(!authenticated)
            navigate("/error");
    });

    if(authenticated)
        return <>
            <div className="institution-wrapper">
                    <h1>INSTITUTION</h1>
            </div>
        </>;

    else
        return <h1>Error, not authenticated</h1>;
}

export default Institutionpage;
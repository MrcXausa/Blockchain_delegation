import { Link } from "react-router-dom"

export default function Error(){
    return(<>
        <h1>An error occurred</h1>
        <li><Link to="/">Home page</Link></li>
    </>)
}
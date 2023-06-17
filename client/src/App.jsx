import { EthProvider } from "./contexts/EthContext";
import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";
import Userpage from "./components/Userpage/Userpage.jsx"
import Institutionpage from "./components/Institutionpage/Institutionpage.jsx";
import Dashboard from "./components/Dashboard/Dashboard";
import Error from "./components/Error";

function App() {

  
  const [loginUser,setLoginUser]=useState(false);
  const [loginInstitution,setLoginInstitution]=useState(false);

  return (
    <EthProvider>
      <div>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Dashboard setLoginUser={setLoginUser} setLoginInstitution={setLoginInstitution}/>}/>
            <Route path="/user" element={<Userpage authenticated={loginUser}/>}/>
            <Route path="/institution" element={<Institutionpage authenticated={loginInstitution}/>}/>
            <Route path="/error" element={<Error/>}/>
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </BrowserRouter>
      </div>
    </EthProvider>
  );
}

export default App;


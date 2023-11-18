import React from 'react';
import { EthProvider } from '../../contexts/EthContext';
import Login from '../Login/Login';
import Subscribe from '../Subscribe/Subscribe';
import './Dashboard.css';

export default function Dashboard({ setUser, setInstitution, setLoginUser, setLoginInstitution }) {
  return (
    <div className="container">
      <EthProvider>
        <Login
          className="login-form"
          setUser={setUser}
          setInstitution={setInstitution}
          setLoginUser={setLoginUser}
          setLoginInstitution={setLoginInstitution}
        />
        <p/>
        <Subscribe
          className="subscribe-form" 
          setLoginUser={setLoginUser}
          setLoginInstitution={setLoginInstitution}
        />
      </EthProvider>
    </div>
  );
}
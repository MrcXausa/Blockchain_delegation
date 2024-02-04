import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
require('dotenv').config();


function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {

        
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545"); //create a web3 instance with the provider
        const accounts = await web3.eth.requestAccounts(); //get accounts from metamask

        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let contract,contractaddress;
        try {
          contractaddress=artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi,contractaddress);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts,  contract }
        });


      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Delega.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();

   
  
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;

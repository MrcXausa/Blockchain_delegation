// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;


/*
    let's assume a delegation is made by:
        - name and address of the delegator
        - name and address of the delegated
*/



contract Delega {

    //a delegation is made by the address of the delegated person and the service for which it is delegated
    struct Delegation{
        address delegated;
        string[] services;
    }

    address owner; //only account allowed to add users

    mapping(address=>bool)  users;

    //each address represents a user and their delegations
    mapping(address => Delegation[]) delegations;

    constructor() { //runs when the contract is deployed
        owner = msg.sender; //the owner of the contract is the address that deploys theit 
    }

    
    function delegate(address delegated, string memory service) public returns (uint) {
        require(users[msg.sender]); //check if the user already exist
        
        uint index=0;
        if(delegations[msg.sender].length>0){ //if the delegator already have delegations
            while(delegations[msg.sender][index].delegated!=delegated || index>delegations[msg.sender].length){
                index++;
            }
            if(index>delegations[msg.sender].length){ //there is not that delegated address for this user
                Delegation memory temp;
                temp.delegated=delegated;
                temp.services=new string[](1);
                temp.services[0]=service;
                delegations[msg.sender].push(temp);
            }
            else{ //there is already a delegated with that address. In this case it is enough to add the service
                delegations[msg.sender][index].services.push(service);
            }
        }
        else{//if the delegator does not already have delegations
            Delegation memory temp;
            temp.delegated=delegated;
            temp.services=new string[](1);
            temp.services[0]=service;
            delegations[msg.sender].push(temp);
        }
    }



    function checkDelegation( address delegated, string memory service) public view returns(bool){
        require(users[msg.sender]);
        bool found=false;
        uint i=0;
        while(!found || i>delegations[msg.sender].length){
            if(delegations[msg.sender][i].delegated==delegated){ //if the address of the delegated is present
                uint j=0;
                while(!found || j>delegations[msg.sender][i].services.length){
                    if(compareStrings(delegations[msg.sender][i].services[j],service)){//compare the services in the delegation and the service
                        found=true;
                    }
                    j++;
                }
            }
            i++;
        }
        return found;
    }


    function addUser(address user) public returns(bool){
        require (msg.sender==owner);
        if(users[user]==false){
            users[user]=true;
            return(true);
        }     
        else{
            return false;
        }  
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }


}

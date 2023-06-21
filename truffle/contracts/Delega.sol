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
        address institution;
        string[] services;
    }

    event debug(string code);

    //only account allowed to add users
    address owner; 

    //all the allowed users and institutions 
    mapping(address=>bool)  users;
    mapping(address=>bool)  institutions;

    //each address represents a user and their delegations
    mapping(address => Delegation[]) delegations;

    //services offered by each institution
    mapping(address=> string[]) institutionServices;

    constructor() { //runs when the contract is deployed
        owner = msg.sender; //the owner of the contract is the address that deploys it 
    }

    
    function delegate(address delegated, address institution,  string memory service) public {
        require(users[msg.sender]); //check if the user already exist
        require(institutions[institution]); //check if the institution addres was added

        bool found=false;
        uint index=0;
        if(delegations[msg.sender].length>0){ //if the delegator already have delegations

            //check if the delegated already has a delegation for that institution

            uint i=0;

            while(!found && i<delegations[msg.sender].length){
                if(delegations[msg.sender][i].delegated==delegated && delegations[msg.sender][i].institution==institution){
                    found=true;
                    index=i;
                }
                i++;
            }

            //if delegated does not have a delegation already, add a new element in the array
            if(!found){ 
                Delegation memory temp= createMemoryDelegation(delegated, institution, service);
                delegations[msg.sender].push(temp);
                emit debug("new delegation pushed 1");
            }

            //if there is already a delegated with that address, just add the service
            else{ 
                
                uint j=0;
                bool alreadypresent=false;

                while(!alreadypresent && j<delegations[msg.sender][i].services.length){
                    if(compareStrings(delegations[msg.sender][i].services[j], service)){
                        alreadypresent=true;
                    }
                    j++;
                }

                if(!alreadypresent){
                    delegations[msg.sender][index].services.push(service);
                    emit debug("new delegation pushed 2.");
                }
                else{
                    emit debug("delegation alredy exists");
                }
            }
        }
        else{//if the delegator does not already have delegations for that institution, add it
            Delegation memory temp = createMemoryDelegation(delegated, institution, service);
            delegations[msg.sender].push(temp);
            emit debug("new delegation pushed 3");
        }
    }



    function checkDelegationUser( address delegated, address institution, string memory service) public view returns(bool){
        bool found=false;
        if (users[msg.sender] ){
            
            uint i=0;
            
            while(!found && i<delegations[msg.sender].length){
                if(delegations[msg.sender][i].delegated==delegated && delegations[msg.sender][i].institution==institution){ //if the address of the delegated is present
                    uint j=0;
                    
                    while(!found && j<delegations[msg.sender][i].services.length){
                        if(compareStrings(delegations[msg.sender][i].services[j],service)){//compare the services in the delegation and the service
                            found=true;
                        }
                        j++;    
                    }
                    
                }
                i++;
            }
            
        }
        return found;
        
    }

    function checkDelegationInstitution( address delegator) public view returns(Delegation[] memory){
        Delegation[] memory ret;
        uint j=0;
        if (institutions[msg.sender]){
            for(uint i=0;i<delegations[delegator].length;i++){
                if(delegations[delegator][i].institution==msg.sender){
                    Delegation memory temp;
                    temp=copyMemoryDelegation(delegations[delegator][i]);
                    ret[j]=temp;
                    j++;
                }
            }
        }
        return ret;
    }



    function addUser(address user) public returns(bool){
        //require (msg.sender==owner);
        if(users[user]==false){
            users[user]=true;
            return(true);
        }     
        else{
            return false;
        }  
    }

    function addInstitution(address institution) public returns(bool){
        //require (msg.sender==owner);
        if(institutions[institution]==false){
            institutions[institution]=true;
            return(true);
        }     
        else{
            return false;
        }  
    }

    function addService(string memory service) public{
        require(institutions[msg.sender]);
        require(!checkService(msg.sender,service));//service is not already present

        institutionServices[msg.sender].push(service);
    }

    function checkService(address institution, string memory service) public view returns (bool){
        require(institutions[institution]);

        bool found=false;

        uint i=0;
        while(!found && i<institutionServices[institution].length){
            if(compareStrings(institutionServices[institution][i],service)){
                found=true;
            }
            i++;
        }

        return found;
    }


    //missing possibility to remove delegation





    //view and pure methods used as utilities

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function createMemoryDelegation(address delegated, address institution, string memory service) private pure returns (Delegation memory){
        Delegation memory ret;
        ret.delegated=delegated;
        ret.services=new string[](1);
        ret.services[0]=service;
        ret.institution=institution;
        return ret;
    }

    function copyMemoryDelegation(Delegation memory tocopy) private pure returns (Delegation memory){
        Delegation memory ret;
        ret.delegated=tocopy.delegated;
        ret.services=tocopy.services;
        ret.institution=tocopy.institution;
        return ret;
    }

    function checkServiceInstitution ( address institution,  string memory service) private view returns (bool){
        bool ret=false;
        for(uint i=0;i<institutionServices[institution].length;i++){

            //if the service is found amog those available for that institution
            if(compareStrings(institutionServices[institution][i],service)){ 
                return true;
            }
        }
        return ret;
    }

}




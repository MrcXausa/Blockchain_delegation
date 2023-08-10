    // SPDX-License-Identifier: MIT 
    pragma solidity >=0.4.22 <0.9.0;
    pragma experimental ABIEncoderV2;


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
            require(users[delegated]);

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

                //if delegated does not have a delegation already for that institution, add a new element in the array
                if(!found){ 
                    Delegation memory temp= createMemoryDelegation(delegated, institution, service);
                    delegations[msg.sender].push(temp);
                    emit debug("new delegation pushed 1");
                }

                //if there is already a delegated with that address, just add the service
                else{ 
                    delegations[msg.sender][index].services.push(service);
                    emit debug("new delegation pushed 2.");
                    /*
                    uint j=0;
                    bool alreadypresent=false;

                    //ciclo ha un'errore ????
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
                    */
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

        
        function userDelegations(address institution) public view returns (Delegation[] memory){
            
            require(users[msg.sender]);
            require(institutions[institution]);


            // Get the number of delegations for the institution
            uint count = 0;
            for (uint i = 0; i < delegations[msg.sender].length; i++) {
                if (delegations[msg.sender][i].institution == institution) {
                    count++;
                }
            }

            // Create a new array with the correct length
            Delegation[] memory viewDels = new Delegation[](count);

            uint j=0;
            for(uint i=0; i < delegations[msg.sender].length; i++){
                
                if (delegations[msg.sender][i].institution == institution){
                    Delegation memory temp = copyMemoryDelegation(delegations[msg.sender][i]);
                    viewDels[j] = temp;
                    j++;
                }
                
            }
            
            return viewDels;
        }

        function institutionDelegations(address user) public view returns (Delegation[] memory){
            require(users[user]);
            require(institutions[msg.sender]);

            // Get the number of delegations for the institution
            uint count = 0;
            for (uint i = 0; i < delegations[user].length; i++) {
                if (delegations[user][i].institution == msg.sender) {
                    count++;
                }
            }

            // Create a new array with the correct length
            Delegation[] memory viewDels = new Delegation[](count);

            uint j=0;
            for(uint i=0; i < delegations[user].length; i++){
                
                if (delegations[user][i].institution == msg.sender){
                    Delegation memory temp = copyMemoryDelegation(delegations[user][i]);
                    viewDels[j] = temp;
                    j++;
                }
                
            }

            return viewDels;
        }

        function deleteDelegation(address delegated, address institution, string memory service) public {
            require(users[msg.sender]);
            require(users[delegated]);
            require(institutions[institution]);
            require(checkDelegationUser(delegated, institution, service));

            uint indexService;
            uint indexDelegation;
            uint i = 0;
            bool found = false;

            while(!found && i<delegations[msg.sender].length){
                if(delegations[msg.sender][i].delegated == delegated && delegations[msg.sender][i].institution == institution){
                    
                    indexDelegation = i;
                    uint j = 0;
                    bool foundString=false;
                    
                    while(!foundString && j<delegations[msg.sender][i].services.length){
                        if(compareStrings(delegations[msg.sender][i].services[j], service)){
                            indexService = j;
                            foundString=true;
                            
                        }
                        j++;
                        emit debug("j++");
                    }            
                    found = true;
                }
                i++;
                emit debug("i++");
            }
            
            
            if(delegations[msg.sender][indexDelegation].services.length==1){ //remove the hole delegation
                if(delegations[msg.sender].length-1==indexDelegation){ //if it is the last element of the array
                    delegations[msg.sender].pop();
                    emit debug("removed entire delegation last");
                }
                else{
                    removeDelegationComplete(msg.sender, indexDelegation);
                    emit debug("removed entire delegation not last");
                }
            }
            else{
                removeDelegationService(msg.sender, indexDelegation, indexService);
                emit debug("removed a service");
            }
            
            
        }



        function addUser(address user) public {
            //require (msg.sender==owner);
            require(!users[msg.sender]);
            users[user]=true;
        }


        function addInstitution(address institution) public {
            //require (msg.sender==owner);
            require(!institutions[msg.sender]);
            institutions[institution]=true;

        }

        function addService(string memory service) public{
            require(institutions[msg.sender]);
            require(!checkService(msg.sender,service));                 //service is not already present
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

        function removeDelegationComplete(address user,uint index) private {
            Delegation memory sup=copyMemoryDelegation(delegations[user][delegations[user].length-1]);
            delegations[user][index] = sup;
            delete delegations[user][delegations[user].length-1];
            //delegations[user].pop();
        }

        function removeDelegationService(address user,uint indexDelegation,uint indexService) private{
            string memory sup=delegations[user][indexDelegation].services[delegations[user][indexDelegation].services.length-1];
            delegations[user][indexDelegation].services[indexService]=sup;
            delegations[user][indexDelegation].services.pop();
        }
}

    




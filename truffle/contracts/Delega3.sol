// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./DelegationStorage3.sol";
/*

In this version, the encrypted string is no longer stored in the blockchain, 
but only an array with the delegated addresses in the Service structure.

The control over the access to the delegations of the users is performed via the 
require and assert statements. The objective is to allow only method calls from the user
or institutions to access the delegations.

As a result, a user will see all their delegations, and an institution will see 
*/

contract Delega3 is DelegationStorage3{

    //event for debugging
    event debugString(string code);

    event debugBytes32(bytes32 code);


    //User's functions

    function delegate(address delegated, address institution,  string memory service) public {
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added
        require(authorizedUsers[delegated],"invalid delegated");                //check if the delegated is an authenticated user

        //if the delegation for that delegated for that service of that institution is not present yet
        require(!checkDelegationUser(delegated, institution, service),"Delegation already present");

        bytes32 hashedService=hash(service);
        emit debugBytes32(hashedService);
        users[msg.sender][institution].services[hashedService].isDelegated[delegated]=true;
        users[msg.sender][institution].services[hashedService].delegatedAddresses.push(delegated);
        users[msg.sender][institution].services[hashedService].delegationAmount++;
        
        if(!users[msg.sender][institution].servicePresent[hashedService]){
            users[msg.sender][institution].servicePresent[hashedService]=true;
            users[msg.sender][institution].allServices.push(hashedService);
        }
        
    }

    function revoke(address delegated, address institution, string memory service) public {
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added
        require(authorizedUsers[delegated],"invalid delegated");                //check if the delegated is an authenticated user

        //makes sure the delegation actually exists
        require(checkDelegationUser(delegated, institution, service));

        bytes32 hashedService=hash(service);    
        emit debugBytes32(hashedService);   
        users[msg.sender][institution].services[hashedService].isDelegated[delegated]=false;
        users[msg.sender][institution].services[hashedService].delegationAmount--;
    }

    function checkDelegationUser( address delegated, address institution, string memory service) public view returns(bool){
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added
        require(authorizedUsers[delegated],"invalid delegated");                //check if the delegated is an authenticated user

        //simply returns the actual value of the isDelegated mapping, which is false unless changed through the delegate function
        return users[msg.sender][institution].services[hash(service)].isDelegated[delegated];  
    }

    function userDelegations(address institution) public view returns (returnValue[] memory) { 
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added

        //cycle to get the length of the result array
        uint length=0;
        for (uint i = 0; i < users[msg.sender][institution].allServices.length; i++) {

            bytes32 service=users[msg.sender][institution].allServices[i];
            length+=users[msg.sender][institution].services[service].delegationAmount;

        }

        returnValue[] memory ret = new returnValue[] (length);

        //cycle to get all the delegations         
        for (uint i = 0; i < users[msg.sender][institution].allServices.length; i++) {

            bytes32 service=users[msg.sender][institution].allServices[i];

            for (uint j = 0; j < users[msg.sender][institution].services[service].delegatedAddresses.length; j++) {

                address temp=users[msg.sender][institution].services[service].delegatedAddresses[j];

                if(users[msg.sender][institution].services[service].isDelegated[temp]){
                    ret[i].delegated=temp;
                    ret[i].services=service;
                }
            }
        }

        return ret;
    }

    
    //Institution's functions
    function institutionDelegations(address user) public view returns (returnValue[] memory){
        require(authorizedInstitutions[msg.sender],"invalid institution");      //check if the institution addres was added
        require(authorizedUsers[user],"unauthorized user");                     //check if the user already exist
        
        //cycle to get the length of the result array
        uint length=0;
        for (uint i = 0; i < users[user][msg.sender].allServices.length; i++) {

            bytes32 service=users[user][msg.sender].allServices[i];
            length+=users[user][msg.sender].services[service].delegationAmount;

        }

        returnValue[] memory ret = new returnValue[] (length);

                
        for (uint i = 0; i < users[user][msg.sender].allServices.length; i++) {

            bytes32 service=users[user][msg.sender].allServices[i];

            for (uint j = 0; j < users[user][msg.sender].services[service].delegatedAddresses.length; j++) {

                address temp=users[user][msg.sender].services[service].delegatedAddresses[j];
                if(users[user][msg.sender].services[service].isDelegated[temp]){
                    ret[i].delegated=temp;
                    ret[i].services=service;
                }
            }
        }


        return ret;
    }

    function addService(string memory service) public{
        require(authorizedInstitutions[msg.sender]);
        require(!checkService(msg.sender,service));
        institutionServices[msg.sender][hash(service)]=true;
    }

    function checkService(address institution, string memory service) public view returns (bool){
        require(authorizedInstitutions[institution]);
        return institutionServices[institution][hash(service)];
    }


    //Access control functions

    function addUser(address user) public {
        require (msg.sender==owner);
        require(!authorizedUsers[user]);
        authorizedUsers[user]=true;
    }

    function addInstitution(address institution) public {
        require (msg.sender==owner);
        require(!authorizedInstitutions[institution]);
        authorizedInstitutions[institution]=true;
    }
    
    function isAuthorizedUser(address user) public view returns (bool) {
        require (msg.sender==owner);
        return authorizedUsers[user];
    }

    function isAuthorizedInstitution(address institution) public view returns (bool) {
        require (msg.sender==owner);
        return authorizedInstitutions[institution];
    }
}
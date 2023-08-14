// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Delega2 {

    //event for debugging
    event debug(string code);

    //only account allowed to add users
    address owner;

    struct Services{        //represent the services delegated to every single delegated
        string[] services;                          //encrypted string
        mapping(bytes32=>bool) serviceIsPresent;    //hash of the encrypted string
        mapping(bytes32=>uint) serviceIndex;         //mapping to get immediately the services indexes
        address delegated;                          //address of the delegated
    }

    struct Delegateds{      //represents the delegated for every single institution
        mapping(address => Services) delegateds;    //all the delegateds of an institution for a user
        mapping(address=>bool) addressIsPresent;    //hash of the encrypted string
        mapping(address=>uint) delegatedIndex;      //mapping to get immediately the addresses indexes
        address[] delegatedAddresses;               //all the addresses a user dalegated for at leas one service
    }

    struct Delegations{
        mapping(address=>Delegateds) institutions;  //all the institutions a user has delegated people for
    }


    //users' delegations 
    mapping(address=>Delegations)  users;


    //all the allowed users and institutions 
    mapping(address=>bool)  authorizedUsers;
    mapping(address=>bool)  authorizedInstitutions;


    //services offered by each institution
    mapping(bytes23=> bool) institutionServices;


    //struct for returning data to frontend
    struct returnValue{
        address delegated;
        string[] services;
    }

    constructor() { //runs when the contract is deployed
        owner = msg.sender; //the owner of the contract is the address that deploys it 
    }

    
    function delegate(address delegated, address institution,  string memory service) public {
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added
        require(authorizedUsers[delegated],"invalid delegated");                //check if the delegated is an authenticated user

        //if the delegation for that delegated for that service of that institution is not present yet
        require(!checkDelegationUser(delegated, institution, service),"Delegation already present");
      
        //set the value for delegated and 
        users[msg.sender].institutions[institution].delegateds[delegated].delegated=delegated;
        users[msg.sender].institutions[institution].delegateds[delegated].services.push(service);
        users[msg.sender].institutions[institution].delegateds[delegated].serviceIsPresent[hash(service)]=true;
        uint lengthServices=users[msg.sender].institutions[institution].delegateds[delegated].services.length;
        users[msg.sender].institutions[institution].delegateds[delegated].serviceIndex[hash(service)]=lengthServices-1;

        if(!users[msg.sender].institutions[institution].addressIsPresent[delegated]){   //if the delegated address is not already present, add it
            users[msg.sender].institutions[institution].addressIsPresent[delegated]=true;
            users[msg.sender].institutions[institution].delegatedAddresses.push(delegated);
            uint addressesLength = users[msg.sender].institutions[institution].delegatedAddresses.length;
            users[msg.sender].institutions[institution].delegatedIndex[delegated]=addressesLength-1;
        }
        
    }


    function checkDelegationUser( address delegated, address institution, string memory service) public view returns(bool){
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added
        require(authorizedUsers[delegated],"invalid delegated");                //check if the delegated is an authenticated user

        
        return users[msg.sender].institutions[institution].delegateds[delegated].serviceIsPresent[hash(service)];  
    }


    function userDelegations(address institution) public view returns (returnValue[] memory){ 
        require(authorizedUsers[msg.sender],"unauthorized user");               //check if the user already exist
        require(authorizedInstitutions[institution],"invalid institution");     //check if the institution addres was added

        uint AddressesLength= users[msg.sender].institutions[institution].delegatedAddresses.length;

        returnValue[] memory ret = new returnValue[] (AddressesLength);

        for (uint i = 0; i < AddressesLength; i++) {
            address delegated=users[msg.sender].institutions[institution].delegatedAddresses[i];
            returnValue memory sup;
            sup.delegated=delegated;
            sup.services=users[msg.sender].institutions[institution].delegateds[delegated].services;
            ret[i]=sup;
        }

        return ret;
    }

    
    function institutionDelegations(address user) public view returns (returnValue[] memory){
        require(authorizedInstitutions[msg.sender],"invalid institution");      //check if the institution addres was added
        require(authorizedUsers[user],"unauthorized user");                     //check if the user already exist
       
        uint AddressesLength= users[user].institutions[msg.sender].delegatedAddresses.length;

        returnValue[] memory ret = new returnValue[] (AddressesLength);

        for (uint i = 0; i < AddressesLength; i++) {
            address delegated=users[user].institutions[msg.sender].delegatedAddresses[i];
            returnValue memory sup;
            sup.delegated=delegated;
            sup.services=users[user].institutions[msg.sender].delegateds[delegated].services;
            ret[i]=sup;
        }

        return ret;
    }

    function deleteDelegation(address delegated, address institution, string memory service) public {
        require(authorizedUsers[msg.sender]);
        require(authorizedUsers[delegated]);
        require(authorizedInstitutions[institution]);
        require(checkDelegationUser(delegated, institution, service));

        bytes32 hashedService=hash(service);       

        //if the delegated service is the last for that institution
        if (users[msg.sender].institutions[institution].delegateds[delegated].services.length == 1) {
            // Remove the entire delegation
            deleteEntireDelegation(institution, delegated,hashedService);
        } else {
            // Remove the specified service
            uint indexService = users[msg.sender].institutions[institution].delegateds[delegated].serviceIndex[hashedService];
            deleteSpecifiedService(institution, delegated, hashedService,indexService);
        }
    }

    function addUser(address user) public {
        //require (msg.sender==owner);
        require(!authorizedUsers[msg.sender]);
        authorizedUsers[user]=true;
    }


    function addInstitution(address institution) public {
        //require (msg.sender==owner);
        require(!authorizedInstitutions[msg.sender]);
        authorizedInstitutions[institution]=true;

    }


    function addService(string memory service) public{
        require(authorizedInstitutions[msg.sender]);
        require(!checkService(msg.sender,service));                 //service is not already present
        institutionServices[hash(service)]=true;
    }


    function checkService(address institution, string memory service) public view returns (bool){
        require(authorizedInstitutions[institution]);
        return institutionServices[hash(service)];
    }


    function hash(string memory a) private pure returns(bytes32) {
        return keccak256(abi.encodePacked((a)));
    }

    function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (hash(a) == hash(b));
    }

    function deleteEntireDelegation(address institution, address delegated, bytes32 service) private {
        
        delete users[msg.sender].institutions[institution].delegateds[delegated].serviceIsPresent[service];
        delete users[msg.sender].institutions[institution].delegateds[delegated].serviceIndex[service];

        
        uint indexToRemove= users[msg.sender].institutions[institution].delegatedIndex[delegated];

        delete users[msg.sender].institutions[institution].addressIsPresent[delegated];
        delete users[msg.sender].institutions[institution].delegatedIndex[delegated];
        delete users[msg.sender].institutions[institution].delegateds[delegated];
        delete users[msg.sender].institutions[institution].delegatedAddresses[indexToRemove];

        bool delegatedAddressesIsEmpty=true

        //controllare se può essere ottimizzato

        for (uint256 index = 0; index < users[msg.sender].institutions[institution].delegatedAddresses.length; index++) {
            if(users[msg.sender].institutions[institution].delegatedAddresses[index]!=address(0)){
                delegatedAddressesIsEmpty=false;
            }
        }

        if(delegatedAddressesIsEmpty){
            delete users[msg.sender].institutions[institution];
        }

    }

    function deleteSpecifiedService(address institution, address delegated, bytes32 service, uint indexService) private{
        uint lastIndex = users[msg.sender].institutions[institution].delegateds[delegated].services.length - 1;

        string memory lastService=users[msg.sender].institutions[institution].delegateds[delegated].services[lastIndex];

        if (indexService != lastIndex) {
            // Swap the last service with the one to be removed
            users[msg.sender].institutions[institution].delegateds[delegated].services[indexService] = lastService;
            users[msg.sender].institutions[institution].delegateds[delegated].serviceIndex[hash(lastService)] = indexService;
        }

        users[msg.sender].institutions[institution].delegateds[delegated].services.pop();
        delete users[msg.sender].institutions[institution].delegateds[delegated].serviceIndex[service];
        delete users[msg.sender].institutions[institution].delegateds[delegated].serviceIsPresent[service];
    }
}
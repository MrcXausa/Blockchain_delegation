// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;

contract DelegationStorage3{

    struct Service{
        mapping(address=>bool) isDelegated;         
        address[] delegatedAddresses;
        uint256 delegationAmount;
    }

    struct Institution{
        mapping(bytes32=>Service) services;             //All services of an institution
        bytes32[] allServices;
        mapping(bytes32=>bool) servicePresent;
    } 

    //users' delegations 
    mapping( address=> mapping(address=>Institution ) )  users;

    //all the allowed users and institutions 
    mapping(address=>bool)  authorizedUsers;
    mapping(address=>bool)  authorizedInstitutions;


    //services offered by each institution
    mapping(address=>mapping(bytes32=> bool)) institutionServices;


    //struct for returning data to frontend
    struct returnValue{
        address delegated;
        bytes32 services;
    }

    //only account allowed to add users
    address owner;

    constructor() { //runs when the contract is deployed
        owner = msg.sender; //the owner of the contract is the address that deploys it 
    }

    function hash(string memory a) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked((a)));
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (hash(a) == hash(b));
    }
}
pragma solidity >=0.4.22 <0.9.0;


/*
    let's assume a delegation is made by:
        - name and address of the delegator
        - name and address of the delegated
*/



contract Delegation {

    struct T_Delegation{
        string delegator_name;
        address delegator_address;
        string delegated_name;
        address delegated_address;
        string service;
    }

    T_Delegation[] delegations; //would be better to use a map

    function delegate(string memory delegator_name, address delegated_address, string memory delegated_name) public {
        T_Delegation memory delegation;
        delegation.delegator_name=delegator_name;
        delegation.delegator_address=msg.sender;
        delegation.delegated_name=delegated_name;
        delegation.delegated_address=delegated_address;
        delegations.push(delegation);
    }

    function checkDelegation(uint d_tocheck, address a_tocheck) public view returns(bool){
        return a_tocheck==delegations[d_tocheck].delegated_address;
    }


}

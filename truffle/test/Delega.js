/*
const Delega = artifacts.require("Delega3"); // Make sure this matches your contract's artifact name

contract("Delega3", (accounts) => {
  let delegaInstance;

  before(async () => {
    delegaInstance = await Delega.deployed();
  });

  it("should add users and institutions", async () => {
    // Use the same account that you're checking for authorization
    await delegaInstance.addUser(accounts[1], { from: accounts[0] });
    await delegaInstance.addInstitution(accounts[2], { from: accounts[0] });
  
    const isUserAuthorized = await delegaInstance.isAuthorizedUser(accounts[1]);
    const isInstitutionAuthorized = await delegaInstance.isAuthorizedInstitution(accounts[2]);
    
    assert.isTrue(isUserAuthorized, "User should be authorized");
    assert.isTrue(isInstitutionAuthorized, "Institution should be authorized");
  });
  
  it("should delegate services", async () => {
    const service = "Service 1";
  
    // Use the same account that you're checking for authorization
    await delegaInstance.addUser(accounts[1], { from: accounts[0] });
    await delegaInstance.addUser(accounts[3], { from: accounts[0] }); // Add accounts[3] as an authorized user
    await delegaInstance.addInstitution(accounts[2], { from: accounts[0] });

    await delegaInstance.delegate(accounts[3], accounts[2], service, {from: accounts[1]});
  
    const isDelegationPresent = await delegaInstance.checkDelegationUser.call(accounts[3], accounts[2], service, {from: accounts[1]});
    assert.isTrue(isDelegationPresent, "Delegation should be present");
  
    const userDelegations = await delegaInstance.userDelegations.call(accounts[2], { from: accounts[1] });
    assert.equal(userDelegations.length, 1, "User should have one delegation");
    assert.equal(userDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.deepEqual(userDelegations[0].services, [service], "Delegated services should match");
  });
  
  
  it("should add services to institutions", async () => {
    const service = "Service 2";

    await delegaInstance.addService(service, {from: accounts[2]});

    const hasService = await delegaInstance.checkService.call(accounts[2], service, {from: accounts[2]});
    assert.isTrue(hasService, "Service should be added to the institution");
  });


  it("should check delegation status", async () => {
    const service = "Service 1";
  
    // Check if the delegation is present
    const isDelegationPresent = await delegaInstance.checkDelegationUser.call(
      accounts[3],
      accounts[2],
      service,
      {from: accounts[1]}
    );
    assert.isTrue(isDelegationPresent, "Delegation should be present");
  });
  
  it("should retrieve user's delegations", async () => {
    const service = "Service 1";
  
    // Get user's delegations for institution accounts[2]
    const userDelegations = await delegaInstance.userDelegations.call(accounts[2], {from: accounts[1]});
  
    assert.equal(userDelegations.length, 1, "User should have one delegation");
    assert.equal(userDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.deepEqual(userDelegations[0].services, [service], "Delegated services should match");
  });
  
  it("should retrieve institution's delegations", async () => {
    const service = "Service 1";
  
    // Get institution's delegations for user accounts[1]
    const institutionDelegations = await delegaInstance.institutionDelegations.call(accounts[1], {from: accounts[2]});
  
    assert.equal(institutionDelegations.length, 1, "Institution should have one delegation");
    assert.equal(institutionDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.deepEqual(institutionDelegations[0].services, [service], "Delegated services should match");
  });

  it("should delete a delegation", async () => {
    const service = "Service 1";
    
    // Check if the delegation is present before deletion
    let isDelegationPresent = await delegaInstance.checkDelegationUser.call(accounts[3], accounts[2], service, {from: accounts[1]});
    assert.isTrue(isDelegationPresent, "Delegation should be present");
  
    // Delete the delegation
    await delegaInstance.deleteDelegation(accounts[3], accounts[2], service, {from: accounts[1]});
  
    // Check if the delegation is still present after deletion
    isDelegationPresent = await delegaInstance.checkDelegationUser.call(accounts[3], accounts[2], service, {from: accounts[1]});
    assert.isFalse(isDelegationPresent, "Delegation should be deleted");
  });
  
    // Add more test cases as needed

});
*/














const Delega3 = artifacts.require("Delega3");
const service = "Service 1";

contract("Delega3", accounts => {
  let delegaInstance;

  before(async () => {
    delegaInstance = await Delega3.deployed();
  });

  it("should add a user", async () => {
    await delegaInstance.addUser(accounts[1], { from: accounts[0] });
    const isAuthorized = await delegaInstance.isAuthorizedUser(accounts[1]);
    assert.equal(isAuthorized, true, "User not added successfully");
  });

  it("should add an institution", async () => {
    await delegaInstance.addInstitution(accounts[2], { from: accounts[0] });
    const isAuthorized = await delegaInstance.isAuthorizedInstitution(accounts[2]);
    assert.equal(isAuthorized, true, "Institution not added successfully");
  });

  it("should delegate a service", async () => {
    await delegaInstance.addUser(accounts[3], { from: accounts[0] });
    await delegaInstance.delegate(accounts[3], accounts[2], service, { from: accounts[1] });
    
    const hasDelegation = await delegaInstance.checkDelegationUser(accounts[3], accounts[2], service, { from: accounts[1] });
    assert.equal(hasDelegation, true, "Delegation not added successfully");
  });

  it("check delegation status before revoking it", async () => {
    const hasDelegation = await delegaInstance.checkDelegationUser(accounts[3], accounts[2], service, { from: accounts[1] });
    assert.equal(hasDelegation, true, "Delegation not added successfully");
  });

  it("should revoke a delegation", async () => {
    await delegaInstance.revoke(accounts[3], accounts[2], service, { from: accounts[1] });
    const hasDelegation = await delegaInstance.checkDelegationUser(accounts[3], accounts[2], service, { from: accounts[1] });
    assert.equal(hasDelegation, false, "Delegation not revoked successfully");
  });

  it("should check delegation status after revoking it", async () => {
    const hasDelegation = await delegaInstance.checkDelegationUser(accounts[3], accounts[2], service, { from: accounts[1] });
    assert.equal(hasDelegation, false, "Delegation should not be present");
  });

  it("should add a service to an institution", async () => {
    await delegaInstance.addService("NewService", { from: accounts[2] });
    const hasService = await delegaInstance.checkService(accounts[2], "NewService");
    assert.equal(hasService, true, "Service not added successfully");
  });

  it("should get user delegations", async () => {
    const delegations = await delegaInstance.userDelegations(accounts[2], { from: accounts[1] });
    console.log("USER");
    console.log(delegations);
    console.log(delegations.length);
    assert.equal(delegations.length, 0, "User has unexpected delegations");
  });

it("should get institution delegations", async () => {
    const delegations = await delegaInstance.institutionDelegations(accounts[1], { from: accounts[2] });
    console.log("INSTITUTION");
    console.log(delegations);
    console.log(delegations.length);
    assert.equal(delegations.length, 0, "Institution has unexpected delegations");
  });
});

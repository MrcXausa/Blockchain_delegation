const Delega = artifacts.require("Delega"); // Make sure this matches your contract's artifact name

contract("Delega", (accounts) => {
  let delegaInstance;

  before(async () => {
    delegaInstance = await Delega.deployed();
  });

  it("should add users and institutions", async () => {
    // Use the same account that you're checking for authorization
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addInstitution(accounts[2]);
  
    const isUserAuthorized = await delegaInstance.authorizedUsers(accounts[1]);
    const isInstitutionAuthorized = await delegaInstance.authorizedInstitutions(accounts[2]);
    
    assert.isTrue(isUserAuthorized, "User should be authorized");
    assert.isTrue(isInstitutionAuthorized, "Institution should be authorized");
  });
  
  it("should delegate services", async () => {
    const service = "Service 1";
  
    // Use the same account that you're checking for authorization
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addUser(accounts[3]); // Add accounts[3] as an authorized user
    await delegaInstance.addInstitution(accounts[2]);

    await delegaInstance.delegate(accounts[3], accounts[2], service);
  //
    //const isDelegationPresent = await delegaInstance.checkDelegationUser.call(accounts[3], accounts[2], service);
    //assert.isTrue(isDelegationPresent, "Delegation should be present");
  //
    //const userDelegations = await delegaInstance.userDelegations.call(accounts[2], { from: accounts[1] });
    //assert.equal(userDelegations.length, 1, "User should have one delegation");
    //assert.equal(userDelegations[0].delegated, accounts[3], "Delegated address should match");
    //assert.deepEqual(userDelegations[0].services, [service], "Delegated services should match");
  });
  
  
  it("should add services to institutions", async () => {
    const service = "Service 2";

    await delegaInstance.addService(service, { from: accounts[2] });

    const hasService = await delegaInstance.checkService.call(accounts[2], service);
    assert.isTrue(hasService, "Service should be added to the institution");
  });


  it("should check delegation status", async () => {
    const service = "Service 1";
  
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addUser(accounts[3]);
    await delegaInstance.addInstitution(accounts[2]);
  
    // Delegate a service from accounts[3] to accounts[2]
    await delegaInstance.delegate(accounts[3], accounts[2], service);
  
    // Check if the delegation is present
    const isDelegationPresent = await delegaInstance.checkDelegationUser.call(
      accounts[3],
      accounts[2],
      service
    );
    assert.isTrue(isDelegationPresent, "Delegation should be present");
  });
  
  it("should retrieve user's delegations", async () => {
    const service = "Service 1";
  
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addUser(accounts[3]);
    await delegaInstance.addInstitution(accounts[2]);
  
    // Delegate a service from accounts[3] to accounts[2]
    await delegaInstance.delegate(accounts[3], accounts[2], service);
  
    // Get user's delegations for institution accounts[2]
    const userDelegations = await delegaInstance.userDelegations.call(accounts[2], { from: accounts[1] });
  
    assert.equal(userDelegations.length, 1, "User should have one delegation");
    assert.equal(userDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.deepEqual(userDelegations[0].services, [service], "Delegated services should match");
  });
  
  it("should retrieve institution's delegations", async () => {
    const service = "Service 1";
  
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addUser(accounts[3]);
    await delegaInstance.addInstitution(accounts[2]);
  
    // Delegate a service from accounts[3] to accounts[2]
    await delegaInstance.delegate(accounts[3], accounts[2], service);
  
    // Get institution's delegations for user accounts[1]
    const institutionDelegations = await delegaInstance.institutionDelegations.call(accounts[1], { from: accounts[2] });
  
    assert.equal(institutionDelegations.length, 1, "Institution should have one delegation");
    assert.equal(institutionDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.deepEqual(institutionDelegations[0].services, [service], "Delegated services should match");
  });

    // Add more test cases as needed


});

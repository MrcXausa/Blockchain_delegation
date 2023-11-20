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
    assert.equal(delegations.length, 0, "User has unexpected delegations");
  });

it("should get institution delegations", async () => {
    const delegations = await delegaInstance.institutionDelegations(accounts[1], { from: accounts[2] });
    assert.equal(delegations.length, 0, "Institution has unexpected delegations");
  });
});
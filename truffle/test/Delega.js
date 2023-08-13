/*
const Delega = artifacts.require("Delega"); 

contract("Delega", (accounts) => {
  let delegaInstance;

  before(async () => {
    delegaInstance = await Delega.deployed();
  });

  it("should add users and institutions", async () => {
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addInstitution(accounts[2]);

    const isUserAuthorized = await delegaInstance.authorizedUsers.call(accounts[1]);
    const isInstitutionAuthorized = await delegaInstance.authorizedInstitutions.call(accounts[2]);

    assert.isTrue(isUserAuthorized, "User should be authorized");
    assert.isTrue(isInstitutionAuthorized, "Institution should be authorized");
  });

  it("should delegate services", async () => {
    const service = "Service 1";

    await delegaInstance.delegate(accounts[3], accounts[2], service);

    const isDelegationPresent = await delegaInstance.checkDelegationUser.call(accounts[3], accounts[2], service);
    assert.isTrue(isDelegationPresent, "Delegation should be present");

    const userDelegations = await delegaInstance.userDelegations.call(accounts[2], { from: accounts[1] });
    assert.equal(userDelegations.length, 1, "User should have one delegation");
    assert.equal(userDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.deepEqual(userDelegations[0].services, [service], "Delegated services should match");
  });

  // Add more test cases as needed

  it("should add services to institutions", async () => {
    const service = "Service 2";

    await delegaInstance.addService(service, { from: accounts[2] });

    const hasService = await delegaInstance.checkService.call(accounts[2], service);
    assert.isTrue(hasService, "Service should be added to the institution");
  });
});
*/

const Delega = artifacts.require("Delega");

contract("Delega", (accounts) => {
  let delegaInstance;

  before(async () => {
    delegaInstance = await Delega.deployed();
  });

  it("should add users and institutions", async () => {
    await delegaInstance.addUser(accounts[1]);
    await delegaInstance.addInstitution(accounts[2]);

    const isUserAuthorized = await delegaInstance.users.call(accounts[1]);
    const isInstitutionAuthorized = await delegaInstance.institutions.call(accounts[2]);

    assert.isTrue(isUserAuthorized, "User should be authorized");
    assert.isTrue(isInstitutionAuthorized, "Institution should be authorized");
  });

  it("should delegate services", async () => {
    const service = "Service 1";

    await delegaInstance.delegate(accounts[3], accounts[2], service);

    const isDelegationPresent = await delegaInstance.checkDelegationUser.call(
      accounts[3],
      accounts[2],
      service
    );
    assert.isTrue(isDelegationPresent, "Delegation should be present");

    const userDelegations = await delegaInstance.userDelegations.call(accounts[2]);
    assert.equal(
      userDelegations.length,
      1,
      "User should have one delegation for the institution"
    );
    assert.equal(userDelegations[0].delegated, accounts[3], "Delegated address should match");
    assert.equal(
      userDelegations[0].services.length,
      1,
      "Delegated services should have one service"
    );
    assert.equal(userDelegations[0].services[0], service, "Delegated service should match");
  });

  it("should add services to institutions", async () => {
    const service = "Service 2";

    await delegaInstance.addService(service, { from: accounts[2] });

    const hasService = await delegaInstance.checkService.call(accounts[2], service);
    assert.isTrue(hasService, "Service should be added to the institution");
  });

  it("should delete a delegation", async () => {
    const service = "Service 3";

    await delegaInstance.delegate(accounts[4], accounts[2], service);

    const initialDelegations = await delegaInstance.userDelegations.call(accounts[2]);
    assert.equal(
      initialDelegations[0].services.length,
      2,
      "User should have two services in the delegation"
    );

    await delegaInstance.deleteDelegation(accounts[4], accounts[2], service);

    const updatedDelegations = await delegaInstance.userDelegations.call(accounts[2]);
    assert.equal(
      updatedDelegations[0].services.length,
      1,
      "User should have one service after deletion"
    );
  });
});
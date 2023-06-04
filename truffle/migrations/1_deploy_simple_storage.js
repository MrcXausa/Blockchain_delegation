const Delegation = artifacts.require("Delegation");

module.exports = function (deployer) {
  deployer.deploy(Delegation);
};

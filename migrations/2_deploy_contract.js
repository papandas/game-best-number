var Casino = artifacts.require("./Casino.sol");

module.exports = function(deployer) {
  deployer.deploy(Casino, 100, {gas: 3000000});
};

var Casino = artifacts.require("./Casino.sol");

contract('Casino', function(accounts){

    it("Initialized our Casino.", function(){
        return Casino.deployed().then(function(instance){
            casinoInstance = instance;
            return casinoInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, "Has contract addresss");
            return casinoInstance.owner();
        }).then(function(owner){
            assert.equal(owner, accounts[0], "We have correct owner.");
            return casinoInstance.kill();
        }).then(function(receipt){
            //console.log(receipt);
            return casinoInstance.owner();
        }).then(assert.fail).catch(function(error){
            //console.log(error);
            assert(error.message.indexOf("is not a contract address") >= 0, "Contract removed.");
        })
    });

});
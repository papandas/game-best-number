var Casino = artifacts.require("./Casino.sol");

contract('Casino', function(accounts){

    
    var admin = accounts[0];
    var player1 = accounts[1];
    var player2 = accounts[2];
    var player3 = accounts[3];
    var player4 = accounts[4];


    it("Initialized our Casino.", function(){
        return Casino.deployed().then(function(instance){
            casinoInstance = instance;
            return casinoInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, "Has contract addresss");
            return casinoInstance.owner();
        }).then(function(owner){
            assert.equal(owner, accounts[0], "We have correct owner.");
            //return casinoInstance.kill();
        })/*.then(function(receipt){
            //console.log(receipt);
            return casinoInstance.owner();
        }).then(assert.fail).catch(function(error){
            //console.log(error);
            assert(error.message.indexOf("is not a contract address") >= 0, "Contract removed.");
        })*/
    });

    it("Initialize Betting Function", function(){
        return Casino.deployed().then(function(instance){
            casinoInstance = instance;
            casinoInstance.bet(1, { from: player1, value : 101 })
            return casinoInstance.playerInfo(player1);
        }).then(function(receipt){
            //console.log(receipt);
            //console.log("AMount Bet", receipt[0].toNumber());
            //console.log("Number Selected", receipt[1].toNumber());
            assert.equal(receipt[0].toNumber(), 101, "Correct bet amount");
            assert.equal(receipt[1].toNumber(), 1, "Correct Number Selected");
            return casinoInstance.IsPlayerExist(player1)
        }).then(function(IsExist){
            //console.log(IsExist);
            assert.equal(IsExist, true, "Player Exist in the Playesr list");
            return casinoInstance.bet(2, { from: player1, value : 102 });
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "Player already exist in the list.");
            return casinoInstance.bet(0, { from: player2, value : 102 })
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "Bet Number has to be more then 0");
            return casinoInstance.bet(11, { from: player2, value : 102 })
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert") >= 0, "Bet Number has to be less then 10");
            return casinoInstance.bet(2, { from: player2, value : 99 })
        }).then(assert.fail).catch(function(error){
            //console.log(error);
            assert(error.message.indexOf("revert") >= 0, "Bet Value has to be more then minimum bet value.");
        })
    })

    

});
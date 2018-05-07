pragma solidity ^0.4.17;

contract Casino {
  
    address public owner;
    uint256 public minBet;
    uint256 public totalBet;
    uint256 public numOfBets;
    uint256 public maxAmtOfBets = 100;
    address[] public players;

    struct Player {
        uint256 amountBet;
        uint256 numberSelected;
    }

    mapping(address => Player) public playerInfo;

    function() public payable {}

    function Casino(uint256 _minBet) public {
        owner = msg.sender;
        if(_minBet != 0) minBet = _minBet;
    }

    function kill() public {
        if(msg.sender == owner) selfdestruct(owner);
    }

    function IsPlayerExist(address _player) public constant returns(bool){
        for(uint256 i = 0; i < players.length; i++){
            if(players[i] == _player){
                return true;
            }
        }
        return false;
    }

    function bet(uint256 numSelected) public payable {
        require(!IsPlayerExist(msg.sender));
        require(numSelected >= 1 && numSelected <= 10);
        require(msg.value >= minBet);

        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].numberSelected = numSelected;
        numOfBets++;
        players.push(msg.sender);
        totalBet += msg.value;

        if(numOfBets >= maxAmtOfBets){
            generateWin();
        }
    }

    function generateWin() public {
        uint256 numberGenerated = block.number % 10 + 1;
        //uint256 numberGenerated = uint( block.blockhash( block.number - 1 ) ) % 10 + 1;
        distributePrizes(numberGenerated);
        //return numberGenerated;
    }

    function distributePrizes(uint256 winNum) public {
        address[100] memory winners;

        uint256 count = 0;

        for(uint256 i = 0; i < players.length; i++){
            address playerAddress = players[i];
            if(playerInfo[playerAddress].numberSelected == winNum){
                winners[count] = playerAddress;
                count++;
            }
            delete playerInfo[playerAddress];
        } 

        players.length = 0;

        uint256 winnerEtherAmount = totalBet / winners.length;

        for(uint256 j = 0; j < winners.length; j++){
            if(winners[j] != address(0)){
                winners[j].transfer(winnerEtherAmount);
            }
        }
    }

    function resetData() public {
        players.length = 0; // Delete all the players array
        totalBet = 0;
        numOfBets = 0;
    }

}
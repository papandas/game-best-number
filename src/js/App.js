import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Casino from '../../build/contracts/Casino.json'
//import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      owner: '0x0',
      IsPlayerExist: false,
      lastWinner: 0,
      numberOfBets: 0,
      minimumBet: 0,
      totalBet: 0,
      maxAmountOfBets: 0,
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.casino = TruffleContract(Casino)
    this.casino.setProvider(this.web3Provider)

    /*this.castVote = this.castVote.bind(this)
    this.watchEvents = this.watchEvents.bind(this)*/

    
  }

  componentDidMount(){
    this.updateState();
    this.setUpListeners();
    setInterval(this.updateState.bind(this), 10e3);
  }

  setUpListeners(){
    let liNodes = this.refs.numbers.querySelectorAll('li');
    liNodes.forEach(number => {
      number.addEventListener('click', event => {
        //console.log(event.target.innerHTML)
        if(!this.state.IsPlayerExist){
          event.target.className = 'number-selected';
          this.voteNumber(parseInt(event.target.innerHTML), done => {
            for(let i=0; i< liNodes.length; i++){
              liNodes[i].className = '';
            }
            alert('You bet has been successfully accepted.');
          })
        }else{
          alert('This account has already voted. Kindly try with someother account.')
        }
      })
    })
  }

  voteNumber(number, callback){
    console.log(number);
    let bet = this.refs['ether-bet'].value;
    if(!bet) bet = 0.1
    if(parseFloat(bet) < this.state.minimumBet){
      alert('You must bet more than the minimum bet amount.');
      callback();
    }else{
      this.casino.deployed().then((instance) => {
        instance.bet(number, {
          gas: 300000,
          from: this.state.account,
          value: this.web3.toWei(bet, 'ether')
        }).then((receipt) => {
          //console.log("Bet Receipt:", receipt);
          callback();
        }).catch((error) => {
          console.log("Error Triggered");
          callback();
        })
      })
    }
  }

  updateState(){
    /*this.state.ContractInstance.minimumBet((err, result) => {
      if(result != null){
        this.setState({
          minimumBet: parseFloat(web3.fromWei(result, 'ether'))
        })
      }
    })*/

    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      //console.log("Account: ", account)
      this.casino.deployed().then((instance) => {
        this.casinoInstance = instance;
        return this.casinoInstance.owner();
      }).then((owner) => {
        this.setState({owner})
        return this.casinoInstance.IsPlayerExist(account);
      }).then((exist) => {
        this.setState({IsPlayerExist: exist})
        return this.casinoInstance.minBet();
      }).then((minimumBet) => {
        //console.log("Minimum Bet:", minimumBet.toNumber());
        this.setState({minimumBet: parseFloat(web3.fromWei(minimumBet.toNumber(), 'ether')) })
        return this.casinoInstance.totalBet();
      }).then((totalBet) => {
        //console.log("Total Bet:", totalBet.toNumber());
        this.setState({totalBet: parseFloat(web3.fromWei(totalBet.toNumber(), 'ether')) })

        return this.casinoInstance.numOfBets();
      }).then((numberOfBets) => {
        //console.log("Number of Bets:", numberOfBets.toNumber());
        this.setState({numberOfBets: numberOfBets.toNumber()})

        return this.casinoInstance.maxAmtOfBets();
      }).then((maxAmountOfBets) => {
        //console.log("Maximum Number of Bets:", maxAmountOfBets.toNumber());
        this.setState({ maxAmountOfBets: maxAmountOfBets.toNumber() })
      })
    });
  }

  

  render() {
    return (
      <div className="main-container">
        <h1>Bet for your best number and win huge amount of ethereum. Running on Rinkeby Ethereum Test Network.</h1>

        <div className="block">
          <h4>Number of Bets:</h4>&nbsp;
          <span ref="minimumBet">{this.state.numberOfBets}</span>
        </div>

        <div className="block">
          <h4>Last Number Winner:</h4>&nbsp;
          <span ref="minimumBet">{this.state.lastWinner}</span>
        </div>

        <div className="block">
          <h4>Total Ether Bet:</h4>&nbsp;
          <span ref="minimumBet">{this.state.totalBet}</span>
        </div>

        <div className="block">
          <h4>Minimum Bet:</h4>&nbsp;
          <span ref="minimumBet">{this.state.minimumBet}</span>
        </div>

        <div className="block">
          <h4>Max Amount of Bets:</h4>&nbsp;
          <span ref="minimumBet">{this.state.maxAmountOfBets}</span>
        </div>

        <hr/>

        <h2>Vote for the next number</h2>

        <label>
          <b>How much Ether do you want to bet?
        
          <input 
            className="bet-input" 
            ref="ether-bet" 
            type="number" 
            placeholder={this.state.minimumBet}
          />

          ether

          </b>
        </label>
        

        <br/>

        
        <ul ref="numbers">
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
          <li>10</li>
        </ul>

        <hr/>

        <p>Your Account: {this.state.account}</p>
        <p>Owner Account: {this.state.owner}</p>

      </div>
    )
  }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
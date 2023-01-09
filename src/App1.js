import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
    
  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    
      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    // if (!ethereum) {
    //   console.log('Make sure you have metamask!');
    //   return;
    // } else {
    //   console.log('We have the ethereum object', ethereum);
    // }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      {/* <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" /> */}
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect Wallet
      </button>
    </div>
  );
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🟩◻️🟩 Naija Name Service</p>
              <p className="subtitle">Your Naija API on the blockchain!</p>
            </div>

			<div>
				  {/* Hide the connect button if currentAccount isn't empty*/}
				  {!currentAccount && renderNotConnectedContainer()}
			</div>
          </header>
        </div>

		  {/* Hide the connect button if currentAccount isn't empty
		  {!currentAccount && renderNotConnectedContainer()} */}


        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

// stop here too
// MY VERSION BUT NO ALERT POP OF WALLET

import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [account, setAccount] = useState('');

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account);
  }

  const loadBlockChainData = async () => {

	window.ethereum.on('accountsChanged', async () => {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		const account = ethers.utils.getAddress(accounts[0])
		setAccount(account);
	  })

  }


  useEffect(() => {
	loadBlockChainData();
  }, [])
  
 

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🟩◻️🟩 Naija Name Service</p>
              <p className="subtitle">Your Naija API on the blockchain!</p>
            </div>

			<div>
				  {/* Hide the connect button if currentAccount isn't empty*/}
							{account ? (
					<button
					type="button"
					className='cta-button connect-wallet-button'
					>
					{account.slice(0, 6) + '...' + account.slice(38, 42)}
					</button>
				) : (
					<button
					type="button"
					className='cta-button connect-wallet-button'
					onClick={connectHandler}
					>
					Connect Wallet
					</button>
				)}
			</div>
          </header>
        </div>

		  {/* Hide the connect button if currentAccount isn't empty
		  {!currentAccount && renderNotConnectedContainer()} */}


        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

// code for the connect wallet button handler

const connectHandler = async () => {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
}


import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";
import contractAbi from './utils/contractABI.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// Add the domain you will be minting
const tld = '.naija';
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';


const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  
// Add some state data propertie
const [domain, setDomain] = useState('');
const [loading, setLoading] = useState(false);
const [record, setRecord] = useState('');

  const { ethereum } = window;
    
  // Implement your connectWallet method here
  const connectWallet = async () => {
    try {
    //   const { ethereum } = window;

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
	   try {
		   if (!ethereum) return alert ('Install Metamask')
		   const accounts = await ethereum.request({ method: "eth_requestAccounts"});
		   
		   window.ethereum.on('accountsChanged', async () => {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setCurrentAccount(accounts[0]);
		  })
		  if (accounts.length) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setCurrentAccount(accounts[0]);
		  } else {
			  alert ('Please connect wallet');
			  console.log('no wallet found')
		  }
	   } catch (error) {
		   console.log(error)
	   }
  }

  const mintDomain = async () => {
    // Don't run if the domain is empty
    if (!domain) { return }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert('Domain must be at least 3 characters long');
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)	
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price = domain.length === 3 ? '0.0003' : domain.length === 4 ? '0.0002' : '0.0001';
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
  
        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);
          
          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();
  
          console.log("Record set! https://mumbai.polygonscan.com/tx/"+tx.hash);
          
          setRecord('');
          setDomain('');
        }
        else {
          alert("Transaction failed! Please try again");
        }
      }
    }
    catch(error){
      console.log(error);
    }
  }

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

  // Form to enter domain name and data
  const renderInputForm = () => {

    return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={domain}
						placeholder='domain'
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={record}
					placeholder='whats your power'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
				
           {/* Call the mintDomain function when the button is clicked*/}
        <button className='cta-button mint-button' onClick={mintDomain}>
          Mint
        </button> 
					<button className='cta-button mint-button' disabled={null} onClick={null}>
						Set data
					</button>  
				</div>

			</div>
		);

  }
  
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
				  { currentAccount? (
		<div className="connect-wallet-container">
		{/* <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" /> */}
		{/* Call the connectWallet function we just wrote when the button is clicked */}
		<button onClick={connectWallet} className="cta-button connect-wallet-button">
		{currentAccount.slice(0, 6) + '...' + currentAccount.slice(38, 42)}
		</button>
	  </div>
	) : (
		<div className="connect-wallet-container">
		{/* <img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" /> */}
		{/* Call the connectWallet function we just wrote when the button is clicked */}
		<button onClick={connectWallet} className="cta-button connect-wallet-button">
		  Connect Wallet
		</button>
	  </div>
	)

	}
				  
				  {/* {!currentAccount && renderNotConnectedContainer()} */}
			</div>
          </header>
        </div>

		  {/* Hide the connect button if currentAccount isn't empty
		  {!currentAccount && renderNotConnectedContainer()} */}

      {/* Render the input form if an account is connected */}
				{currentAccount && renderInputForm()}


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
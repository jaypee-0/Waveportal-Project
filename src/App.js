import React, { useEffect, useState } from 'react';
import './App.scss';
import { ethers } from 'ethers';
import abi from './utils/WavePortal.json';
import initialImage from './Assets/initialImage.png'
import loadingImage from './Assets/loadingImage.png'
import finalImage from './Assets/finalImage.png'
import happyImage from './Assets/happyImage.png'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [loadingconnect, setloadingconnect] = useState(false);
  const [loadingwave, setloadingwave] = useState(false);
  //const [sparkles, setsparkles] = useState(false)
  // Storing waves
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = '0xed67D01f2a1eaD061e497A2d53318ee48369c7CB';
  const contractABI = abi.abi;
  
  // Getting all waves
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        //Calling the getAllWaves method from the Smart Contract         
        const waves = await wavePortalContract.getAllWaves();
        
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Listen in for emitter events! 
useEffect(() => {
  let wavePortalContract;
  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, [contractABI]);
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      // Check if we're authorized to access the user's wallet      
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // ConnectWallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Get MetaMask!');
        return getAllWaves;
      }
      setloadingconnect(true)
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
      setloadingconnect(false)
    } catch (error) {
      console.log(error);
    }
  };

  // Wave - reading data from the smart contract
  const wave = async () => {
    try {
      const { ethereum } = window;
      
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
          );
          
        setloadingwave(true)
        let count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave count...', count.toNumber());
        
        // Execute/Write the actual wave from the smart contract 
        const waveTxn = await wavePortalContract.wave("Gas Limit", { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);
        
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        
        setloadingwave(false)
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        
        //getAllWaves()
        setloadingwave(true)
      } else {
        console.log("Ethereum object doesn't exist!");
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className='mainContainer'>
      <div className='dataContainer container'>
        <div className='text-center'>
            <div><img className='img-fluidx' src={currentAccount ? (loadingwave ? happyImage: finalImage ) : (loadingconnect ? loadingImage : initialImage)} alt="" /></div> 
        </div>
        <p className='header'>
          {currentAccount ? <div>Wallet Connected</div> : <div><span className='pe-1' role='img' aria-labelledby=''>👋</span> Hi, there</div>
        }
          </p>
        <div className='bio'>
          Could you help me out by connecting to your Ethereum wallet? <br/> and then wave at me!
        </div>

        <button className='waveButton rounded' onClick={currentAccount && wave}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className='waveButton rounded' onClick={connectWallet}>
          {loadingconnect ? 'Connecting...' : 'Connect Wallet'} 
          </button>
        )}
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
};

export default App;

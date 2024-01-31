import React, { useState } from 'react';
import { ethers } from 'ethers';
import TokenAirdropABI from './TokenAirdropABI.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Assuming you have some basic styles here

function App() {
    const [tokenAddress, setTokenAddress] = useState('');
    const [quantity, setQuantity] = useState('');
    const [recipients, setRecipients] = useState('');
    const contractAddress = '0x54F16126D0dEC011F7435122D47AD54af52f9f83';
    const [airdropContract, setAirdropContract] = useState();

    // Connect to MetaMask and set up the contract
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, TokenAirdropABI, signer);
                setAirdropContract(contract);
                toast.success('Wallet connected');
            } catch (error) {
                toast.error('Failed to connect wallet');
            }
        } else {
            toast.error('MetaMask is not installed');
        }
    };

    // Function to handle setting the token
    const handleSetToken = async () => {
        try {
            await airdropContract.setAirdropToken(tokenAddress);
            toast.success(`Token set to ${tokenAddress}`);
        } catch (error) {
            toast.error('Failed to set token');
        }
    };

    // Function to handle setting the quantity
    const handleSetQuantity = async () => {
        try {
            await airdropContract.setAirdropQuantity(ethers.utils.parseUnits(quantity, 18));
            toast.success(`Quantity set to ${quantity}`);
        } catch (error) {
            toast.error('Failed to set quantity');
        }
    };

    // Function to execute the airdrop
    const handleExecuteAirdrop = async () => {
        try {
            const recipientArray = recipients.split(',').map(addr => addr.trim());
            await airdropContract.executeAirdrop(recipientArray);
            toast.success('Airdrop executed successfully');
        } catch (error) {
            toast.error('Failed to execute airdrop : Only admin can execute airdrop');
        }
    };

    return (
      <div className="app">
          <ToastContainer />
          <h1>Token Airdrop</h1>
          <button onClick={connectWallet}>Connect Wallet</button>
          <div className="input-group">
              <input
                  type="text"
                  placeholder="Token Address"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
              />
              <button onClick={handleSetToken}>Set Token</button>
          </div>
          <div className="input-group">
              <input
                  type="text"
                  placeholder="Airdrop Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
              />
              <button onClick={handleSetQuantity}>Set Quantity</button>
          </div>
          <div className="input-group">
              <textarea
                  placeholder="Recipient Addresses (comma separated)"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
              ></textarea>
              <button onClick={handleExecuteAirdrop}>Execute Airdrop</button>
          </div>
          <div className="display-info">
              <p>Airdrop Quantity: {quantity}</p>
          </div>
      </div>
  );
}

export default App;

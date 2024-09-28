"use client";

import { useState, useEffect } from 'react';
// Import JsonRpcProvider and formatEther from ethers.js v6
import { JsonRpcProvider, formatEther } from 'ethers';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    async function connectToHardhat() {
      try {
        // Create a JSON-RPC provider to connect to Hardhat node
        const provider = new JsonRpcProvider('http://127.0.0.1:8545');

        // Use a known Hardhat account (address 0) for testing
        const hardhatAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with one of Hardhat's default addresses

        // Set the connected account
        setAccount(hardhatAccount);

        // Get the balance of the Hardhat account
        const balanceBigInt = await provider.getBalance(hardhatAccount);
        setBalance(formatEther(balanceBigInt));
      } catch (error) {
        console.error('Error connecting to Hardhat node:', error);
      }
    }

    connectToHardhat();
  }, []);

  return (
      <div>
        <main>
          <h1>Welcome to My dApp with Hardhat</h1>
          <p>Connected account: {account || "Not connected"}</p>
          <p>Balance: {balance || "N/A"}</p>
        </main>
      </div>
  );
}


/*export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    async function connectToWeb3() {
      // Check if Ethereum is available in the browser (MetaMask)
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Request access to MetaMask accounts
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

          // Create a new BrowserProvider from ethers.js v6
          const provider = new BrowserProvider((window as any).ethereum);

          // Get the signer (the connected account)
          const signer = await provider.getSigner();
          const userAccount = await signer.getAddress();
          setAccount(userAccount);

          // Get the balance of the connected account
          const balanceBigInt = await provider.getBalance(userAccount);
          setBalance(formatEther(balanceBigInt));
        } catch (error) {
          console.error('Error connecting to web3:', error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    }

    connectToWeb3();
  }, []);

  return (
      <div>
        <h1>Welcome to my dApp with TypeScript</h1>
        <p>Connected account: {account ? account : "Not connected"}</p>
      </div>
  );
}*/

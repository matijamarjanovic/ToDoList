"use client";

import { useState, useEffect } from 'react';
// Import JsonRpcProvider and formatEther from ethers.js v6
import {JsonRpcProvider, formatEther, ethers, BrowserProvider} from 'ethers';
import {getContractHardhat, getContractMetaMask} from "../../utils/ethers";
import Web3 from 'web3';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [contract, setContract] = useState<any | null>(null);


  async function connectToHardhat() {
    try {
      // Create a JSON-RPC provider to connect to Hardhat node
      const provider = new JsonRpcProvider('http://127.0.0.1:8545');

      // Use a known Hardhat account (address 0) for testing
      const hardhatAccount = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"; // Replace with one of Hardhat's default addresses

      // Set the connected account
      setAccount(hardhatAccount);

      // Get the balance of the Hardhat account
      const balanceBigInt = provider.getBalance(hardhatAccount);
      setBalance(formatEther(await balanceBigInt));
      setContract(await getContractHardhat());
    } catch (error) {
      console.error('Error connecting to Hardhat node:', error);
    }
  }
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
        setContract(await getContractMetaMask());
      } catch (error) {
        console.error('Error connecting to web3:', error);
      }
    } else {
      console.log("Please install MetaMask!");
    }
  }

  async function loadTasks() {

    try{
      if(contract){
        const taskCount = await contract.getTaskCountByOwner(account);
        const tasks = await contract.getTasksByOwner(account);

        let loadedTasks: any[] = [];

        for(let i = 0; i < taskCount; i++){
          const task = await contract.getTask(tasks[i].id);
          loadedTasks.push({
            id: task.id,
            content: task.content,
            completed: task.completed,
            owner: task.owner
          });
        }
        setTasks(loadedTasks);
      }

    }catch (error){
      console.error('Error loading tasks:', error);
    }
  }

    async function toggleTask(id : number){
        try{
          if(contract){
            await contract.toggleCompleted(id);
          }
        }catch (error){
          console.error('Error toggling task:', error);
        }
        loadTasks();
    }


  async function addTask(content: string, address: string) {
    const web3 = new Web3();
    const formattedAddress = web3.utils.toChecksumAddress(address);
    console.log("formattedAddress: ", formattedAddress);
    console.log("sender: ", account);

    try {
      if (contract){
        const tx = await contract.addTask(content, formattedAddress);
        await tx.wait(); // Wait for the transaction to be mined
        setNewTask("");
        loadTasks(); // Reload tasks after adding
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  useEffect(() => {
    connectToHardhat();
    //connectToWeb3();

    if (account) {
      loadTasks(); // Call loadTasks when account is updated
    }
  }, [account, contract]);

  return (
      <div className="container">
        <h1 className="title">To-Do List DApp</h1>

        <div className="input-container">
          <input
              type="text"
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task"
              className="task-input"
          />
          <button onClick={() => addTask(newTask, account ? account : "")} className="add-button">Add Task</button>
        </div>

        <h2 className="welcome-title">Welcome to My dApp with Hardhat</h2>
        <p className="account-info">Connected account: {account || "Not connected"}</p>
        <p className="balance-info">Balance: {balance ? `${balance} ETH` : "N/A"}</p>

        <ul className="task-list">
          {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="task-checkbox"
                />
                <span className="task-content">{task.id} | {task.content}</span>
              </li>
          ))}
        </ul>
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

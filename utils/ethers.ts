import {BrowserProvider, ethers, JsonRpcProvider} from "ethers";
import ToDoListAbi from "../artifacts/contracts/ToDoList.sol/ToDoList.json"; // Import the contract ABI

const HARDHAT_LOCAL_NODE_URL = "http://127.0.0.1:8545";
// Replace with the deployed contract address
const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

// Connect to the Hardhat local node
export const getContractHardhat = async () => {
    try {
        // Create a provider connected to Hardhat's local node
        const provider = new JsonRpcProvider(HARDHAT_LOCAL_NODE_URL);

        // Fetch the signer (account[5] in Hardhat local node)
        const signer = await provider.getSigner(5); // Account index 5 in Hardhat

        // Initialize the contract with ABI, address, and signer
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ToDoListAbi.abi, signer);

        return contract;
    } catch (error) {
        console.error("Error connecting to Hardhat or initializing contract:", error);
        return undefined; // Return undefined in case of error
    }
};

export const getContractMetaMask = async () => {
    // Ensure MetaMask is available
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request account access if needed
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Create an ethers provider connected to MetaMask
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Get the signer (currently selected MetaMask account)
            const signer = await provider.getSigner();

            // Initialize the contract with ABI, address, and signer
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ToDoListAbi.abi, signer);

            return contract;
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            return undefined; // Explicitly return undefined in case of an error
        }
    } else {
        console.error("MetaMask is not installed.");
        return undefined;
    }
};

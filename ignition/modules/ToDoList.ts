import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ToDoListModule = buildModule("ToDoListModule", (m) => {
    const lock = m.contract("ToDoList", []);
    return { lock };
});

export default ToDoListModule;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const ToDoListModule = buildModule("ToDoListModule2", (m) => {
    const toDoList = m.contract("ToDoList", []);
    return { toDoList };
});

export default ToDoListModule;

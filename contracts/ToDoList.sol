pragma solidity ^0.8.27;

contract ToDoList{

    uint public taskCount = 0;
    struct Task {
        uint id;
        string content;
        bool completed;
    }
    mapping (address => Task) public tasks;
}

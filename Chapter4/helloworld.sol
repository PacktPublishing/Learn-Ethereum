pragma solidity >=0.5.0;

/** @title smart HelloWorld contract. */
contract HelloWorld {
    
    // the greeting variable, by default, it is set as "Hello World from Learn Ethereum"
    string public greeting;
    
    //constructor of the contract HelloWorld
    constructor() public {
       greeting = 'Hello World from Learn Ethereum';
    }

    /** @dev say hello world from Learn Ethereum.
      * @return greeting the greeting to be returned
      */    
    function hello() public view returns (string memory)  {
        return greeting;
    }
    
    /** @dev sets the greeting.
      * @param _greeting The new greeting to be set
      */
    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
} 

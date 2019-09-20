pragma solidity >=0.5.0;

contract MiscTypes {
    
    address payable payor; // defining address type payor
    string hello = 'Hello World'; // defining the string 
    bytes32[] public names;    /**string array **/
    bytes32[] empIds;     /**bytes array **/
    
    uint term; // defining unsigned integer lease term
    bool transferable = true; // defining boolan type
    int quantity = 10; // define an integer
    uint threshold = 100; // defining unsigned threshold
    uint8[5] odds = [1,3,5,7,9]; //defining an array

} 

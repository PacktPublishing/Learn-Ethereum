pragma solidity >=0.5.0;

contract Rent {
    // define events notifying rent is paid
    event RentPaid(
        address indexed _from,
        string indexed _tenant,
        uint _rent
    );

    function deposit(string memory _tenant) public payable {
        //emit event notifying rent is paid
        emit RentPaid(msg.sender, _tenant, msg.value);
    }
}

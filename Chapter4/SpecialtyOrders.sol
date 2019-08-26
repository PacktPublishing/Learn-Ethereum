pragma solidity >=0.5.0;

contract Orders {
    
    struct Order {
            string buyer;
            string product;
            uint quantity;
    } 
    
    mapping (address => Order) orders;
    
    // The same setOrder function will be restricted to not more than 100 quantity;
    function setOrder(address _address, string memory _buyer, string memory _product, uint _quantity) 
    public costs(_quantity) { 
        Order storage order = orders[_address];
        order.buyer = _buyer;
        order.product = _product;
        order.quantity = _quantity;
    }
    
    // restrict large quantity orders, limit to up to 100;
    modifier costs(uint _quantity) {
        require(
            _quantity <= 100,
            "Large quantity orders are not allowed."
        );
        _;
    }
    
    function getOrder(address _address) view public returns (string memory, string memory, uint) {
        return (orders[_address].buyer, orders[_address].product, orders[_address].quantity);
    }
       
} 

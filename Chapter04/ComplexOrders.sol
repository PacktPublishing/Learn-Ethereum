pragma solidity >=0.5.0 <=0.7.0;

interface OrderInterface {
    
    struct Order {
        string buyer;
        string product;
        uint quantity;
    }
    
    enum OrderType { PhoneOrder, MailOrder, InternetOrder}
    
    function setOrder(address _address, string calldata _buyer, string calldata _product, uint _quantity) external;
    function getOrder(address _address) view external returns (string memory, string memory, uint);
}

contract AbstractOrders is OrderInterface{
    mapping (address => OrderInterface.Order) orders;
    
    function setOrder(address _address, string memory _buyer, string memory _product) public { 
        Order storage order = orders[_address];
        order.buyer = _buyer;
        order.product = _product;
        order.quantity = 1;
    }
     
    function getOrder(address _address) view public returns (string memory, string memory, uint) {
        return (orders[_address].buyer, orders[_address].product, orders[_address].quantity);
    }
}

contract Orders is AbstractOrders {
    
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
}

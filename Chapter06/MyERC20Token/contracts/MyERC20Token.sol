pragma solidity ^0.5.2;
/**
 *@notice The MyERC20Token implements the ERC20 token
 *@author brian wu
 */ 

/**
 * define owner, transfer owner and assign admin
 */
contract owned {
    address public owner;
    mapping(address => bool) admins;
    constructor () internal {
        owner = msg.sender;
        admins[msg.sender] = true;
    }
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    modifier onlyAdmin() {
        require(admins[msg.sender] == true);
            _;
    }
    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
    function isAdmin(address account) onlyOwner public view returns (bool) {   
        return admins[account];
    }
    function addAdmin(address account) onlyOwner public {
        require(account != address(0) && !admins[account]);             
        admins[account] = true;    
    }
    function removeAdmin(address account) onlyOwner public {
        require(account != address(0) && !admins[account]);
        admins[account] = true;    
    }
}
/**
 * manage whitelsit
 */
contract Whitelist is owned {
    mapping(address => bool) whitelist;
    function addWhitelist(address account) onlyAdmin public{
        require(account != address(0) && !whitelist[account]);             
        whitelist[account] = true;    
    }
    function isWhitelist(address account) public view returns (bool) {   
        return whitelist[account];
    }
    function removeWhitelisted(address account) public onlyAdmin {
        require(account != address(0) && whitelist[account]);
        whitelist[account] = false;    
    }
}
/**
 * make contract function pausable
 */
contract Pausable is owned {
    event PausedEvt(address account);
    event UnpausedEvt(address account);
    bool private paused;
    constructor () internal {
        paused = false;
    }
    modifier whenNotPaused() {
        require(!paused);
        _;
    }
    modifier whenPaused() {
        require(paused);
        _;
    }
    function pause() public onlyAdmin whenNotPaused {
        paused = true;
        emit PausedEvt(msg.sender);
    }
    function unpause() public onlyAdmin whenPaused {
        paused = false;
        emit UnpausedEvt(msg.sender);
    }
}
/**
 *Interface for ERC20
 */
interface ERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}
contract MyERC20Token is ERC20, Whitelist, Pausable {
    TokenSummary public tokenSummary;
    mapping(address => uint256) internal balances;
    mapping (address => mapping (address => uint256)) internal allowed;
    uint256 internal _totalSupply;
    uint8 public constant SUCCESS_CODE = 0;
    string public constant SUCCESS_MESSAGE = "SUCCESS";
    uint8 public constant NON_WHITELIST_CODE = 1;
    string public constant NON_WHITELIST_ERROR = "ILLEGAL_TRANSFER_TO_NON_WHITELISTED_ADDRESS";
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address from, uint256 value);
    struct TokenSummary {
        address initialAccount;
        string name;
        string symbol;
    }
    constructor(string memory _name, string memory  _symbol, 
    address initialAccount, uint initialBalance) public payable {
        addWhitelist(initialAccount);
        balances[initialAccount] = initialBalance;
        _totalSupply = initialBalance;
        tokenSummary = TokenSummary(initialAccount, _name, _symbol);
    }
    modifier verify (address from, address to, uint256 value) {
        uint8 restrictionCode = validateTransferRestricted(to);
        require(restrictionCode == SUCCESS_CODE, messageHandler(restrictionCode));
        _;
    }
    function validateTransferRestricted (address to) public view returns (uint8 restrictionCode) {
        if (!isWhitelist(to)) {
            restrictionCode = NON_WHITELIST_CODE;
        } else {
            restrictionCode = SUCCESS_CODE;
        }
    }
    function messageHandler (uint8 restrictionCode) public pure returns (string memory message) {
        if (restrictionCode == SUCCESS_CODE) {
            message = SUCCESS_MESSAGE;
        } else if(restrictionCode == NON_WHITELIST_CODE) {
            message = NON_WHITELIST_ERROR;
        }
    }
    function totalSupply() public view returns (uint256) {
       return _totalSupply;
    }
    function balanceOf(address account) public view returns (uint256) {
      return balances[account];
    }
    function transfer (address to, uint256 value) public verify(msg.sender, to, value)
    whenNotPaused  returns (bool success) {
        require(to != address(0) && balances[msg.sender]> value);
        balances[msg.sender] = balances[msg.sender] - value;
        balances[to] = balances[to] + value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    function transferFrom(address from, address spender,uint256 value) public verify(from, spender, value) whenNotPaused returns (bool) {
        require(spender != address(0) && value <= balances[from] && value <= allowed[from][msg.sender]);
        balances[from] = balances[from] - value;
        balances[spender] = balances[spender] + value;
        allowed[from][msg.sender] = allowed[from][msg.sender] - value;
        emit Transfer(from, spender, value);
        return true;
  }
  function allowance(address owner,address spender) public view returns (uint256) {
    return allowed[owner][spender];
  }
  function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0));
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
   }
  function burn(uint256 value) public whenNotPaused onlyAdmin returns (bool success) {
    require(balances[msg.sender] >= value); 
    balances[msg.sender] -= value; 
    _totalSupply -= value;
    emit Burn(msg.sender, value);
    return true;
 }
  function mint(address account, uint256 value) public whenNotPaused onlyAdmin returns (bool) {
    require(account != address(0));
    _totalSupply = _totalSupply += value;
    balances[account] = balances[account] + value;
    emit Transfer(address(0), account, value);
    return true;
  }
  function ()  external payable {
       revert();  
  }
}

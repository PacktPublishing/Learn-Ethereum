pragma solidity >=0.5.0 <0.7.0;

contract FourSeasonContract {
    enum Season { Spring, Summer, Autumn, Winter}
    Season season;
    Season constant defaultSeason = Season.Spring;

    function construct() public {
        season = defaultSeason;
    }
    
    function setSeason(uint _value) public {
         season = Season(_value);
    }
    
    function getSeason() public view returns (uint){
         return uint(season);
    }
}

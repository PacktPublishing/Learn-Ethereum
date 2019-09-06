pragma solidity >=0.5.0;

contract A {
}

contract B is A {
}

contract C is A {
}

contract D is B, C {
}

contract E is A, B{
}

//contract F is B, A { This won't compile
//}

contract G {
    function isGood() pure public returns (bool) {
        return false;
    }
}

contract H is G {
    function isGood() pure public returns (bool) {
        return true;
    }
}

contract I is G {
}

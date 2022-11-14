// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Game {
    
    string private info;

    struct Hero {
        string name;
        uint256 level;
        uint256 attack;
        uint256 defense;
        uint256 lastTraining;
    }

    mapping (address => Hero) public heroes;

    // Nos permite verificar si la dirección tiene un heroe
    modifier hasHero() {
        require(heroes[msg.sender].level > 0, "You don't have a hero");
        _;
    }

    // Nos permite crear un nuevo heroe
    function createHero(string memory _name) public {
        require(heroes[msg.sender].level == 0, "You already have a hero");
        heroes[msg.sender] = Hero(_name, 1, 100, 100, 0);
    }

    // Nos permite generar una batalla entre nuestro heroe y una dirección dada
    function fight(address _enemy) public {
        require(heroes[msg.sender].level > 0, "You don't have a hero");
        require(heroes[_enemy].level > 0, "Enemy doesn't have a hero");
        require(msg.sender != _enemy, "You can't fight yourself");
        if(heroes[msg.sender].attack > heroes[_enemy].defense) {
            _levelUp();
        }
    }

    // Nos permite entrenar nuestro heroe
    function train() public {
        require(heroes[msg.sender].level > 0, "You don't have a hero");
        require(canTrain(msg.sender), "You can't train yet");
        _levelUp();
        heroes[msg.sender].lastTraining = block.timestamp;
    }

    // Verifica si el heroe puede entrenar
    function canTrain(address _player) public view returns (bool) {
        return heroes[_player].level > 0 && block.timestamp - heroes[_player].lastTraining > 1 minutes;
    }

    // Nos permite levelear a nuestro heroe
    function _levelUp() private {
        heroes[msg.sender].level += 1;
        heroes[msg.sender].attack += 15;
        heroes[msg.sender].defense += 10;
    }

    // Nos permite obtener los datos de nuestro heroe en la cadena
    function getMyHero() public view returns (Hero memory) {
        return heroes[msg.sender];
    }
}
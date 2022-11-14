// Código para interactuar con el smart contract

// Comenzamos por conectarno con el nodo local
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));

// Configuramos la dirección donde hemos desplegado nuestro smart contract
// Este paso puede realizarse usando Remix, Ganache y MetaMask
var contractAddress = '0x12d016F3a941C07a356bd329f1C3046468EC1aeD';
var abi = JSON.parse('[{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"createHero","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_enemy","type":"address"}],"name":"fight","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"train","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_player","type":"address"}],"name":"canTrain","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyHero","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"attack","type":"uint256"},{"internalType":"uint256","name":"defense","type":"uint256"},{"internalType":"uint256","name":"lastTraining","type":"uint256"}],"internalType":"structGame.Hero","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"heroes","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"attack","type":"uint256"},{"internalType":"uint256","name":"defense","type":"uint256"},{"internalType":"uint256","name":"lastTraining","type":"uint256"}],"stateMutability":"view","type":"function"}]');

// Generamos la interfaz por la cual accederemos al smart contract
contract = new web3.eth.Contract(abi, contractAddress);

// Variable global para almacenar nuestra cuenta
var account;

// Función para conectarnos a la wallet MetaMask
function getAccount() {

  window.ethereum.request({ method: "eth_requestAccounts" });

  web3.eth.getAccounts(function(err, accounts) {
    if (err != null) {
      alert("Error retrieving accounts.");
      return;
    }
    if (accounts.length == 0) {
      alert("No account found! Make sure the Ethereum client is configured properly.");
      return;
    }
    account = accounts[0];
    console.log('Account: ' + account);
    web3.eth.defaultAccount = account;
  });
}

// Funcion para obtener los datos del hero creado por el usuario
async function getMyHero() {

  if (web3.eth.defaultAccount == undefined) {
    alert("error")
  }
  else {
    // Obtenemos información de nuestro heroe almacenado on-chain
    info = await contract.methods.getMyHero().call();
    
    // Desplegamos en consola los datos obtenidos
    console.log(info);
    
    // Escribimos los datos en la pantalla de navegador
    document.getElementById('accountHero').innerHTML = account;
    document.getElementById('nameHero').innerHTML = info.name;
    document.getElementById('heroLevel').innerHTML = info.level;
    document.getElementById('heroAttack').innerHTML = info.attack;
    document.getElementById('heroDefense').innerHTML = info.defense;
    document.getElementById('herolastTraining').innerHTML = info.lastTraining;
  }
}

// Funcion para crear un nuevo heroe
function createHero() {

  if (web3.eth.defaultAccount == undefined) {
    alert("error")
  }

  // Generamos una variable para insertar el nombre de nuestro heroe
  info = $("#setHero").val();

  // Llamamos a la función de generacón de nuestro smart contract 
  contract.methods.createHero(info).send( {from: account, gas: '1000000'}).then( function(tx) { 

    // Salida de la operación
    console.log("Transaction: ", tx); 
    alert(tx);

  });

  $("setHero").val('');
}

// Funcion para entrenar un heroe
function trainHero() {

  // Llamamos a la función de generacón de nuestro smart contract 
  contract.methods.train().send( {from: account, gas: '1000000'}).then( function(tx) { 
    // Salida de la operación
    console.log("Training Hero: ", tx); 

  });
}

// Funcion para entrenar un heroe
// Funcion para crear un nuevo heroe
function battleHero() {
  
  // Generamos una variable para insertar el nombre de nuestro heroe
  enemyAdd = $("#enemyAddress").val();

  // Llamamos a la función de generacón de nuestro smart contract 
  contract.methods.fight(enemyAdd).send( {from: account, gas: '1000000'}).then( function(tx) { 

    // Salida de la operación
    console.log("Transaction: ", tx); 
  
  });

  $("enemyAddress").val('');
}
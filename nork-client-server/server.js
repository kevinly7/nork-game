'use strict';

var net = require('net'); //import socket module
var world = require('../common/world.json');// load information about the world

//variables for the game
var inventory;
var currentRoom;
var echo;

//creating the server
var server = net.createServer(function(socket) {

//notify on data received event
  socket.on('data', function(data) {

    //process data received from client
    echo = data.toString().toUpperCase();
    if(echo === 'START') {
    	gameStart();
    	socket.write(roomDescription(socket));
    } else if(echo === 'END') {
    	socket.end(); //close the connection
    } else {
	    switch(echo.substring(0, echo.indexOf(" "))) {
	        case "GO": //case to navigate to a differnt room
	            navigate(echo, socket);
	            break;
	        case "TAKE": //case to pick up an item found in a room
	        	pickUp(echo, socket);
	        	break;
	        case "USE": //case to use an item on a valid feature in the game
	        	useItem(echo, socket);
	        	break;
	        case "CHECK": //case to open inventory
	        	openInventory(socket);
	        	break;
	        case "SHOW": //case to re-display the room description
	        	socket.write(roomDescription(socket));
	        	break;
	        default: //case to error-checks when the user inputs an invalid option
	            socket.write('\n You entered an invalid option. Pleaase try again. \n\n');
	            break;
	    }
	}
  });
});

//start "listening" for connections
server.on('listening', function() {
   var addr = server.address(); //get address info
   console.log(' server listening on port %d \n\n\n', addr.port); //print the info
});

//when a connection with client is established
server.on('connection', function(socket) {
	socket.write('Welcome to Nork. A console game where you navigate and explore a world in a textual format. \n Move between rooms, pick up items, fight monsters, and discover treasures in order to win the game. \n Have fun, and let your imagination flow! \n To start the game, write \'START\' or \'END\': ');
});


server.listen(53040, '128.95.242.208'); //listen on port 3000, host 127.0.0.1
console.log(' server connected'); //print that server is connected with client

//instatiate the game
function gameStart() {
	inventory = [];
	currentRoom = 0;
}

//prints out the description of the room the user is currently in
function roomDescription(socket) {
	var data = '\n Current Location: ' + world.rooms[currentRoom].id + '\n' + world.rooms[currentRoom].description + '\n\n';
	return data;
}

// moves player to a different room, dependent on the answer the direction they provide.
function navigate(echo, socket) {
    var direction = echo.toLowerCase().substring(3, echo.length); //get the direction from client data
    if (direction in world.rooms[currentRoom].exits) { //checks if the direction entered is valid
        currentRoom = indexOfRoom(world.rooms[currentRoom].exits[direction].id); //change currentRoom to where the user is moving to
        socket.write(roomDescription(socket)); //send the room description back to client
    } else { //user entered invalid direction
        socket.write('\n There are no rooms in that DIRECTION. \n\n'); //send error message back to client
    }
}

// picks up the item from the room and places the item in the player's inventory
function pickUp(echo, socket) {
    var item = echo.toLowerCase().substring(5, echo.length)
    if(world.rooms[currentRoom].items != undefined) { //checks if room has items
      if (item === world.rooms[currentRoom].items.toString()) { //checks if the item is in the room
      	if(inventory.indexOf(item) == -1) { //checks if item is already in inventory
          	inventory.push(item); //add item to inventory
          	socket.write('\n You picked up a ' + item + '!\n\n'); //send success message back to client
          } else { //item already exist in inventory
          	socket.write('\n That item already exist in your inventory. \n\n'); //send error message back to client
          }
      } else { //item does not exist in the room
          socket.write('\n That item does not exist to pick up. \n\n'); //send error message back to client
      }
    } else { //room does not have any item
        socket.write('\n This room does not have any items. \n\n'); //send error message back to client
    }
}

// enacts the item the user entered, and reacts depending on the situation of the current room the player is in
function useItem(echo, socket) {
    var item = echo.toLowerCase().substring(4, echo.length);
    if (inventory.indexOf(item) > -1) { //checks if item is in inventory
      if(world.rooms[currentRoom].uses != undefined) {//checks if there are any uses for items in the current room
      	if (item === world.rooms[currentRoom].uses[0].item) { //checks if item has any effects in the current room
      		var data = '\n ' + world.rooms[currentRoom].uses[0].description  //text showing the effect of the item
      		currentRoom = indexOfRoom(world.rooms[currentRoom].uses[0].effect.goto); //move the user to a new location based on the effect of using the item
      		data += ('\n' + roomDescription(socket)); //add the new room description
      		socket.write(data); //send the complied message back to client
         } else { //item has no use in this location
         		socket.write('\n That item has no use here. \n\n'); //send error message back to client
         }
      } else {//item has no uses in this locaiton
        socket.write('\n That item has no use here. \n\n'); //send error message back to client
      }
   } else { //item does not exist in user inventory
   		socket.write('\n That item does not exist in your inventory. \n\n'); //send error message back to client
   }
}

// displays the contents of the player's inventory
function openInventory(socket) {
    socket.write('\n Opening INVENTORY:\n\n ' + inventory + '\n\n'); //sned user inventory to client
}

//private method to checks the index of the room based on the room id
function indexOfRoom(id) {
  	for (var i = 0; i < world.rooms.length; i++) {
    	if (world.rooms[i].id === id) {
    		return i;
    	}
  	}
  	return -1;
}





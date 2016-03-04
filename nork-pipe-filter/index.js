'use strict';

// requires
var world = require('../common/world.json'); //json file of the world
var readline = require('readline'); //for user input
var stream = require('stream'); //for pipe & filter architecture

var io = readline.createInterface( { //call the interface "io"
  input: process.stdin, //input comes from the terminal ("standard in")
  output: inputFilter //output triggers pipe funnel
});

//global variables
var gameEnd = false; //true if the game has ended
var currentRoom = 0; //current index of rooms that the user is currently in
var inventory= []; //array of items user picked up

//prints Nork game introduction
console.log('\n Welcome to Nork. A console game where you navigate and explore a world in a textual format. \n Move between rooms, pick up items, fight monsters, and discover treasures in order to win the game. \n Have fun, and let your imagination flow!');
console.log('\n\n You are in room ' + world.rooms[currentRoom].id + '. \n' + world.rooms[currentRoom].description + "\n\n What do you want to do? \n --GO [DIRECTION] \n --TAKE [ITEM] \n --USE [ITEM] \n --CHECK INVENTORY \n >>");

//filter #1: get input
var inputFilter = new stream.Transform({
	objectMode: true,   //include any existing constructor options

	transform (chunk, encoding, done) { //this is the _transform method
	  	var data = chunk.toString().toUpperCase(); //read in data

      //filter the user input by commands
	    if (data.startsWith("GO") || data.startsWith("USE") || data.startsWith("TAKE") || data.startsWith("CHECK INVENTORY"))
	    	this.push(data); //pipe out data
      else //user input command does not match
	    	this.push('\n Sorry, invalid command. \n\n'); //send error message to next filter

	    done(); //callback for when finished
  },

  flush(done) { //this is the _flush method
    //any final processing occurs here
    done();
  }
  
});	


//filter #2: make changes to world state
var gameFilter = new stream.Transform({
  objectMode: true,   //include any existing constructor options

  transform (chunk, encoding, done) { //this is the _transform method
    var data = chunk.toString().split(" "); //read in data and split on command and data
    var output;
    
    //checks command user entered
    if (data[0] == "GO")
    	output = navigate(data[1]);
    else if (data[0] == "USE") 
    	output = useItem(data[1]);
    else if (data[0] == "TAKE")
    	output = pickUp(data[1]);
    else if (data[0] == "CHECK")
    	output = openInventory();
    else //user command was not valid
    	output = "\n\n Sorry, invalid command. \n"; //error message to passed on to next filter

    //checks if user has 'won' or 'eaten'
    if (world.rooms[currentRoom].id == 'won' || world.rooms[currentRoom].id == 'eaten_dark') {
    	this.push(world.rooms[currentRoom].description + '\n\n'); //send win/lose description to next filter
    	done();
    	process.exit(0);
    } else { //game is ongoing
		output += '\n You are in room ' + world.rooms[currentRoom].id + '. \n' + world.rooms[currentRoom].description + "\n\n What do you want to do? \n --GO [DIRECTION] \n --TAKE [ITEM] \n --USE [ITEM] \n --CHECK INVENTORY \n >>"; //ongoing game description, alerts, reactions, and question
	    this.push(output); //pipe out data
	    done(); //callback for when finished
    }
  }, 

  flush(done) { //this is the _flush method
    //any final processing occurs here
    done();
  }
});


//filter #3: produce output
var outputFilter = new stream.Transform({
  objectMode: true,   //include any existing constructor options

  transform (chunk, encoding, done) { //this is the _transform method
    this.push(chunk.toString()); //pipe out data received from previous filter to be displated back to user

    done(); //callback for when finished
  },

  flush(done) { //this is the _flush method
    //any final processing occurs here
    done();
  }
});

// piping the filters together
io.on('line', function(chunk) {
});
process.stdin
  .pipe(inputFilter).pipe(gameFilter).pipe(outputFilter).pipe(process.stdout);

// moves player to a different room, dependent on the answer the direction they provide.
function navigate(data) {
    var direction = data.toLowerCase().trim(); //direction user entered
    if (direction in world.rooms[currentRoom].exits) { //checks if the direction entered is valid for the current location
        currentRoom = indexOfRoom(world.rooms[currentRoom].exits[direction].id); //change the currentRoom to the new location
        return '\n\n You went ' + direction + '\n'; //return success message
    } else { //user entered an invalid direction
        return '\n\n There are no rooms in that DIRECTION. \n'; //return error message
    }
}

// picks up the item from the room and places the item in the player's inventory
function pickUp(data) {
    var item = data.toLowerCase().trim(); //item user entered
    if(world.rooms[currentRoom].items != undefined) { //checks if there are items in the room
      if (item === world.rooms[currentRoom].items.toString()) { //checks if the item entered exist in the room
      	if(inventory.indexOf(item) == -1) { //checks if item already exist in user inventory
          	inventory.push(item); //add item to user inventory
          	return '\n\n You picked up a ' + item + '!\n'; //return success message
          } else { //item already exist in user inventory
          	return '\n\n That item already exist in your inventory. \n'; //return error message
          }
      } else { //item does not exist in the room
          return '\n\n That item does not exist to pick up. \n'; //return error message
      }
    } else {//there are no items in the room
      return '\n\n There are no items to pick up. \n'; //return error message
    } 
}

// enacts the item the user entered, and reacts depending on the situation of the current room the player is in
function useItem(data) {
    var item = data.toLowerCase().trim(); //item user entered
    if (inventory.indexOf(item) > -1) { //checks if item is in user inventory
      if (world.rooms[currentRoom].uses != undefined) { //checks if there are any uses for items in the current room
      	if (item === world.rooms[currentRoom].uses[0].item) { //checks if item has effects in the current room 
      		var data = world.rooms[currentRoom].uses[0].description; //text showing the effect of the item
      		currentRoom = indexOfRoom(world.rooms[currentRoom].uses[0].effect.goto); //move the user to a new location based on the effect of using the item
      		return '\n\n ' + data + '\n'; //return success message
         } else { //item has no effect in the current location
         		return '\n\n That item has no use here. \n'; //return error message
         }
       } else { //item has no uses in the current locaiton
          return '\n\n That item has no use here. \n'; //return error message
       }
   } else { //item does not exist in the user inventory
      return '\n\n That item does not exist in your inventory. \n'; //return error message
   }
}

// displays the contents of the player's inventory
function openInventory() {
    return '\n\n Opening INVENTORY:\n\n ' + inventory + '\n\n'; //return the user inventory
}

//private method to checks the index of the room based on the room id
function indexOfRoom(id) {
    for (var i = 0; i < world.rooms.length; i++) {
      if (world.rooms[i].id === id)
        return i;
    }
    return -1;
}






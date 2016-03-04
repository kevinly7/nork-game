'use strict';

//required
var net = require('net'); //import socket module
var readline = require('readline'); //for user input
var io = readline.createInterface({ //call the interface "io"
  input: process.stdin, //input comes from the terminal ("standard in")
  output: process.stdout //output goes to the terminal ("standard out")
});

//creating the client
var client = new net.Socket(); //create socket server

var HOST = '127.0.0.1';
var PORT = 3000;

//connect to the server
client.connect(PORT, HOST, function() {
  console.log(' Connected to: ' + HOST + ':' + PORT + '\n\n\n'); //Print out host and port once connection with server is established
});


//when data is received from the server
client.on('data', function(data) {
  //process the data
	if (data.toString().includes('won') || data.toString().includes('eaten_dark')) { //check game status (win/eaten)
		console.log(' ' + data.toString()); //print win or eaten message from server
    	io.close(); //close the io
    	client.destroy(); //destroy the client
   } else{ //if game is ongoing
   	if(data.includes('start')) { //check if data is opening message
   		io.question(' ' + data.toString(), function(answer){ //display game intro and ask user to respond
   			client.write(answer); //send user response to server
   		});
   	} else { //during regular gameplay
   		console.log(' ' + data.toString()); //prints out data from server
      //ask user what they want to do during regular gameplay with the following options
   		io.question(' What do you want to do? \n --GO [DIRECTION] \n --TAKE [ITEM] \n --USE [ITEM] \n --CHECK INVENTORY \n --SHOW ROOM DESC. \n\n >>', function(answer) {
   			client.write(answer); //send user repsonse to server
   			console.log('\n');
   		});
   	}
   }
});

//when connection closed
client.on('close', function() {
   console.log('Connection closed'); //display that connection have been closed
});






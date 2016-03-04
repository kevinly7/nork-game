# Architected Nork

This repository contains two versions of a simple text-based game called Nork, developed as part of a [course](http://arch-joelross.rhcloud.com/) at the UW iSchool. 

The below questions should be answered (in detail!) regarding your submission!


##### 1. Did you work with a partner? If so, who?
> Yes, this was a peer-coding project between Kenny Raymond and Kevin Ly.



##### 2. Discuss how the different architectural styles affected the implementation of your program. Was one pattern easier to use or more effective _for this problem_? Why? How do the different styles influence the ability to add new features or modify existing functionality? What kind of changes would be easier or harder with each style?
##### This discussion should be a couple of paragraphs, giving a detailed analysis of how the styles work.
> The two architectural styles we used to implement the Nork game were Client-Server architecture and Pipe & Fileter architecture. One architecture was defintely easier to implement. But both were also fairly similar to one another as well.
> 
> The Client-Server architecture breaks the game into two parts. The server handles all the game logic, while the Client takes outputs the data from the game as well as take in user commands and pass it on to the Server for processing. This makes the architecure makes implementation very easy. The Server will process the command from the user, and call on the corresponding function to update the game. After which, the Server sends data back to the Client to be displayed. This back and forth communication goes on until the game is won and the connection is broken. Adding new features to this architecture is fairly simple. If we were to add a new command, this would require editing the question script in the Client to include the new command option. Next we would add a new switch case to check if the user called on this new command. Lastly, we will create a new method that would modify the game logic and will be called when the user enacts the new command.
> 
> The Pipe & Filter architecture however was a bit more difficult to implement. To implement this architecture, we had to create 3 differnt filters and pipe them together. This architecture is set up in a MVC style. The first filter is like the Controller and is used to read in the user's input and determine if their command are valid. This filter then pipes the user's input to the next filter. The second filter will process which command the user entered and call on the corresponding function and modify the game. This filter is the Model. After the function modifies the game, it will then returns the success or game data back to to the second filter. From here, the filter will pass this data on to the last filter. The thrid filter is like View. This filter will then output the data to the user. Adding new features to this architecure will require more steps to implemnet. Like the example above, if we want to add a new command we will first need to add the new command to the check in the first filter. The second filter will also need to include a check and call on the new command. A new function for the command that will modify the game logic will need to be created as well. Similar to the Client-Server architecture, but a bit more steps to implement.
> 
> If we had to choose which architecture to implement for this game, we would choose the Client-Server architecture because it was fairly simple to set up and implement. Additionally, it allows for multiplayer game play as well.



##### 3. Did you add an extra features to either version of your game? If so, what?
> No, we did not add any additional/optional game functionalities.



##### 4. Approximately how many hours did it take you to complete this assignment? #####
> We spent apoximately 20 hours.



##### 5. Did you receive help from any other sources (classmates, etc)? If so, please list who (be specific!). #####
> No.



##### 6. Did you encounter any problems in this assignment we should warn students about in the future? How can we make the assignment better? #####
> No.



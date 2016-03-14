var Board = {
	boardState : [ 
		[2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [5, 1],
		[0, 0], [3, 1], [0, 0], [0, 0], [0, 0], [5, 0],
		[5, 1], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],
		[5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [2, 1]
		],
	playerTurn : true,
	whiteScore : 0,
	blackScore : 0,
	firstDice : 0,
	secondDice : 0,
	isDouble : false,
	doubleCounter : 0,
	whiteOut : 0,
	blackOut : 0,
	//black - clockwise/false , white - counterclockwise/true

	initialize : function () {
		this.populateBoard();
		this.assignTurn();
		this.interactBoard();
		//game loop
	},
	populateBoard : function () {
		// define lines
		for (var i = 1; i <= 4; i++) {
			var qdr = document.getElementsByClassName("qdr-"+i);
			for ( j = 1; j <= 6; j++) {
				qdr[0].innerHTML += '<div class="cl" id="cl-' + ((i-1)*6+j) + '"></div>';
			}
		}

		//put pieces in place

		for (var i = 0; i < 24; i++) {
			if ( this.boardState[i][0] ) {
				var type = (this.boardState[i][1]) ? "white" : "black";
				var cont = document.getElementById("cl-"+(i+1));
				for ( var j = 0; j < this.boardState[i][0]; j++ ) {
					cont.innerHTML += '<div class="item '+ type +'"></div>';
				}
			}
		}

		//create dices

		var diceDots = "";
		for ( var i = 1; i <= 9; i++) {
			diceDots += '<div class="dot"></div>'; 
		}
		document.getElementById("dice-1").innerHTML = diceDots;
		document.getElementById("dice-2").innerHTML = diceDots;

	},
	assignTurn : function () {
		this.throwDices();
		this.playerTurn = !this.playerTurn;
		document.getElementById("debug").innerHTML = this.playerTurn ? "white turn" : "black turn"; 
		var turn = this.playerTurn ? "item white" : "item black";
		var items = document.getElementsByClassName("item");
		for (var i = 0; i < items.length; i++) {
			items[i].removeAttributes(["draggable","ondragstart"]);
			if ( turn == items[i].getAttribute("class") ) {
				if ((this.playerTurn && this.whiteOut) || (!this.playerTurn && this.blackOut)) {
					if (items[i].parentNode.getAttribute("id") == "board-bar") items[i].setAttributes({"draggable" : "true", "ondragstart" : "event.dataTransfer.setData('text/plain',null)"});
				} else items[i].setAttributes({"draggable" : "true", "ondragstart" : "event.dataTransfer.setData('text/plain',null)"});
			}
		}
	},
	throwDices : function () {
		this.isDouble = false;
		this.firstDice = this.rollDice();
		document.getElementById("dice-1").setAttribute("class", "dice dice-"+this.firstDice);

		this.secondDice = this.rollDice();
		document.getElementById("dice-2").setAttribute("class", "dice dice-"+this.secondDice);

		if (this.firstDice == this.secondDice) {
			this.isDouble = true;
			this.doubleCounter = 4;
		}
	},
	rollDice : function () {
		return Math.floor( Math.random() * 6 ) + 1; 
	},
	interactBoard : function () {
		var dragged;
		var self = this;

		document.addEventListener("drag", function( event ) {}, false);
		
		document.addEventListener("dragstart", function( event ) {
		  	dragged = event.target;
		  	event.target.style.opacity = .8;
		  	var currentLine = event.target.parentNode.getAttribute("id").split("-")[1];
		  	currentLine = parseInt(currentLine);
  			var direction = self.playerTurn ? -1 : 1;
  			//target val explanation...... 0 - same position, 1 - first dice, 2 - second dice, 3 - both dices sum / double: 4 - 1/4, 5 - 2/4, 6 - 3/4, 7 - 4/4
		  	if (self.doubleCounter && self.isDouble) {
 	  		//double
		  		var tmp = self.doubleCounter;
		  		var plm = 1;
		  		while(tmp) {
		  		console.log(plm);
		  			if (self.boardState[currentLine+plm*self.firstDice*direction-1][0] == 0 || 
	  					self.boardState[currentLine+plm*self.firstDice*direction-1][1] == self.playerTurn) {
		  				document.getElementById("cl-"+(currentLine + plm*self.firstDice*direction)).setAttributes({"moveTarget" : "true", "targetVal" : (plm+3).toString()});	
		  				tmp--;
		  				plm++;
		  			} else if (self.boardState[currentLine+plm*self.firstDice*direction-1][0] == 1) {
		  				document.getElementById("cl-"+(currentLine + plm*self.firstDice*direction)).setAttributes({"moveTarget" : "true", "targetVal" : (plm+3).toString()});
		  				break;
		  			}
		  			else break;
		  		}
		  	} else {
		  		//same position
		  		event.target.parentNode.setAttributes({"moveTarget" : "true", "targetVal" : "0"});
		  		
		  		//first dice
	  			if (self.firstDice != 0 && (
	  				self.boardState[currentLine+self.firstDice*direction-1][0] <= 1 || (
	  				self.boardState[currentLine+self.firstDice*direction-1][0] > 1 && 
	  				self.boardState[currentLine+self.firstDice*direction-1][1] == self.playerTurn
	  				))) {
	  				//console.log("asd");
	  				document.getElementById("cl-"+(currentLine + self.firstDice*direction)).setAttributes({"moveTarget" : "true", "targetVal" : "1"}); 
	  			}

	  			//second dice
	  			if (self.secondDice != 0 && (
	  				self.boardState[currentLine+self.secondDice*direction-1][0] <= 1 || (
	  				self.boardState[currentLine+self.secondDice*direction-1][0] > 1 && 
	  				self.boardState[currentLine+self.secondDice*direction-1][1] == self.playerTurn
	  				))) {
	  				document.getElementById("cl-"+(currentLine + self.secondDice*direction)).setAttributes({"moveTarget" : "true", "targetVal" : "2"}); 
	  			}

	  			//combination of dices, only if there is direct path (no 1 enemy item row)
	  			if ((self.firstDice != 0 && self.secondDice != 0 && (
	  					self.boardState[currentLine+self.firstDice*direction-1][0] == 0 || 
	  					self.boardState[currentLine+self.firstDice*direction-1][1] == self.playerTurn ||
	  					self.boardState[currentLine+self.secondDice*direction-1][0] == 0 || 
	  					self.boardState[currentLine+self.secondDice*direction-1][1] == self.playerTurn
  				))) {
					if (self.boardState[currentLine+(self.firstDice+self.secondDice)*direction-1][0] <= 1 || (
						self.boardState[currentLine+(self.firstDice+self.secondDice)*direction-1][0] > 1 && 
						self.boardState[currentLine+(self.firstDice+self.secondDice)*direction-1][1] == self.playerTurn)) {
		  				document.getElementById("cl-"+(currentLine + (self.firstDice+self.secondDice)*direction)).setAttributes({"moveTarget" : "true", "targetVal" : "3"});
		  			}
				}
	  		}
		}, false);

		document.addEventListener("dragend", function( event ) {
		  event.target.style.opacity = "";
		}, false);

		document.addEventListener("dragover", function( event ) { event.preventDefault(); }, false);
		
		document.addEventListener("dragenter", function( event ) {
		  if ( event.target.getAttribute( 'moveTarget' ) == "true" ) {
		      event.target.setAttribute("onTarget", "true");
		  }

		}, false);

		document.addEventListener("dragleave", function( event ) {
 		  if ( event.target.getAttribute( 'moveTarget' ) == "true" ) {
		      event.target.setAttribute("onTarget", "false");
		  }
		}, false);

		document.addEventListener("drop", function( event ) {
		 	event.preventDefault();
		  	if ( event.target.getAttribute( "moveTarget" ) == "true" ) {
		    	switch (event.target.getAttribute("targetVal")) {
		    		case "0" : { break; }
		    		case "1" : { self.firstDice = 0; break; }
		    		case "2" : { self.secondDice = 0; break; }
		    		case "3" : { self.firstDice = 0; self.secondDice = 0; break; }
		    		case "4" : { self.doubleCounter--; break; }
		    		case "5" : { self.doubleCounter-=2; break; }
		    		case "6" : { self.doubleCounter-=3; break; }
		    		case "7" : { self.doubleCounter-=4; break; }
		    		default : { break; }
		    	}

  			    self.boardState[parseInt(dragged.parentNode.getAttribute("id").split("-")[1]-1)][0]--;
		    	dragged.parentNode.removeChild( dragged );

		    	if(self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][0] == 1 && self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][1] == !self.playerTurn) {
		    		var tmp = event.target.childNodes[0];
		    		event.target.removeChild(tmp);
					document.getElementById("board-bar").appendChild(tmp);
		    		self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][0] = 0;
		    		self.playerTurn ? self.blackOut++ : self.whiteOut++;
		    	}

		    	self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][0]++
		    	self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][1] = self.playerTurn ? 1 : 0;
		    	event.target.appendChild( dragged );
		    	console.log(self);
		  	}
			//reset targets
      		var targets = document.querySelectorAll('[moveTarget="true"]');
    		for (var i = 0; i < targets.length; i++) {
    			targets[i].removeAttributes(["moveTarget", "onTarget", "targetVal"]);
		    }
		  	if ((self.firstDice == 0 && self.secondDice == 0) || (self.isDouble && !self.doubleCounter)) self.assignTurn(); 

		}, false);
	}
}

//start game

var game = Object.create(Board);
ready(function () {game.initialize();} );
//game.initialize();


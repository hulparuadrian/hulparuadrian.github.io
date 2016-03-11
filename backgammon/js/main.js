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
	doubleCounter : 0,
	//black - clockwise/false , white - counterclockwise/true

	initialize : function () {
		this.populateBoard();
		this.interactBoard();
		//game loop
		while( true ) {
			this.throwDices();
			this.assignTurn();
			break;	
		}
		

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

	},
	assignTurn : function () {
		var turn = this.playerTurn ? "item white" : "item black";
		var items = document.getElementsByClassName("item");
		for (var i = 0; i < items.length; i++) {
			items[i].removeAttributes(["draggable","ondragstart"]);
			if ( turn == items[i].getAttribute("class") ) {
				items[i].setAttributes({"draggable" : "true", "ondragstart" : "event.dataTransfer.setData('text/plain',null)"});
			}
		}
	},
	throwDices : function () {
		this.firstDice = this.rollDice();
		this.secondDice = this.rollDice();
		if (this.firstDice == this.secondDice) this.doubleCounter = 4;
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
  			var direction = self.playerTurn ? -1 : 1;
  			//target val explanation...... 0 - same position, 1 - first dice, 2 - second dice / double: 3 - 1/4, 4 - 2/4, 5 - 3/4, 6 - 4/4
		  	if (self.firstDice == self.secondDice) {
	  		//double
		  	} else {
		  		event.target.parentNode.setAttributes({"moveTarget" : "true", "targetVal" : "0"});
	  			if (self.firstDice != 0) document.getElementById("cl-"+(parseInt(currentLine) + self.firstDice*direction)).setAttributes({"moveTarget" : "true", "targetVal" : "1"});
	  			if (self.secondDice != 0) document.getElementById("cl-"+(parseInt(currentLine) + self.secondDice*direction)).setAttributes({"moveTarget" : "true", "targetVal" : "2"});
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
		    		case "3" : { self.doubleCounter--; break; }
		    		case "4" : { self.doubleCounter-=2; break; }
		    		case "5" : { self.doubleCounter-=3; break; }
		    		case "6" : { self.doubleCounter-=4; break; }
		    		default : { break; }
		    	}

				//reset targets
	      		var targets = document.querySelectorAll('[moveTarget="true"]');
	    		for (var i = 0; i < targets.length; i++) {
	    			targets[i].removeAttributes(["moveTarget", "onTarget", "targetVal"]);
  			    }
  			    self.boardState[parseInt(dragged.parentNode.getAttribute("id").split("-")[1]-1)][0]--;
		    	dragged.parentNode.removeChild( dragged );

		    	self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][0]++
		    	self.boardState[parseInt(parseInt(event.target.getAttribute("id").split("-")[1])-1)][1] = self.playerTurn ? 1 : 0;
		    	event.target.appendChild( dragged );
		    	console.log(self);


		  }

		}, false);
	}
}

//start game

var game = Object.create(Board);
ready(function () {game.initialize();} );
//game.initialize();


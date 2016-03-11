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
			items[i].removeAttribute("draggable");
			items[i].removeAttribute("ondragstart");
			if ( turn == items[i].getAttribute("class") ) {
				items[i].setAttribute("draggable", "true");
				items[i].setAttribute("ondragstart", "event.dataTransfer.setData('text/plain',null)");
			}
		}
	},
	throwDices : function () {
		this.firstDice = this.rollDice();
		this.secondDice = this.rollDice();
	},
	rollDice : function () {
		return Math.floor( Math.random() * 6 ) + 1; 
	},
	interactBoard : function () {
		var dragged;
		document.addEventListener("drag", function( event ) {}, false);
		document.addEventListener("dragstart", function( event ) {
		  	dragged = event.target;
		  	event.target.style.opacity = .8;
		  	var currentLine = event.target.parentNode.getAttribute("id").split("-")[1];
		  //this.availableMoves( currentLine );
		  	var direction = this.playerTurn ? -1 : 1;
		  	console.log(this.firstDice+" "+this.secondDice);
		  	if (this.firstDice == this.secondDice) {
		  		//double
		  	} else {
		  		var tmp1 = document.getElementById("cl-"+(currentLine+(this.firstDice*direction)));
		  		var tmp2 = document.getElementById("cl-"+(currentLine+(this.secondDice*direction)));
		  		console.log(tmp1);
		  		console.log(tmp2);
		  	}
		}, false);

		document.addEventListener("dragend", function( event ) {
		  event.target.style.opacity = "";
		}, false);

		document.addEventListener("dragover", function( event ) { event.preventDefault(); }, false);
		document.addEventListener("dragenter", function( event ) {
		  if ( event.target.getAttribute( 'id' ) == "dropzone" ) {
		      event.target.style.background = "purple";
		      console.log("sdjlajsdl");
		  }

		}, false);

		document.addEventListener("dragleave", function( event ) {
		  // reset background of potential drop target when the draggable element leaves it
		  if ( event.target.getAttribute( 'id' ) == "dropzone" ) {
		      event.target.style.background = "";
		  }

		}, false);

		document.addEventListener("drop", function( event ) {
		  // prevent default action (open as link for some elements)
		  event.preventDefault();
		  // move dragged elem to the selected drop target
		  if ( event.target.getAttribute( 'id' ) == "dropzone" ) {
		      event.target.style.background = "";
		      dragged.parentNode.removeChild( dragged );
		      event.target.appendChild( dragged );
		  }

		}, false);
	},
	availableMoves : function ( line ) {
		console.log( line );
		var direction = this.playerTurn ? -1 : 1;

	}
}

//start game

var game = Object.create(Board);
ready(function () {game.initialize();} );
//game.initialize();


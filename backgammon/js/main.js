function Board(){
	this.boardState = "";
}

//board initializer - to run after dom ready - get everything setup for the game
Board.prototype = {
	constructor : Board,
	initialize : function () {
		Board.prototype.populateBoard();
	},
	populateBoard : function () {	
		// define shit
		for (var i = 1; i <= 4; i++) {
			var qdr = document.getElementsByClassName("qdr-"+i);
			for ( j = 1; j <= 6; j++) {
				qdr[0].innerHTML += '<div class="cl cl-' + ((i-1)*6+j) + '"></div>';
			}
		}
	}
}

//start game
var game = new Board();
ready(game.initialize);
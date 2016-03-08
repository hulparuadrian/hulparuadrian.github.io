var Board = {
	boardState : [ 
		[2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [5, 1],
		[0, 0], [3, 1], [0, 0], [0, 0], [0, 0], [5, 0],
		[5, 1], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],
		[5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [2, 1]
		],
	initialize : function () {
		this.populateBoard();
	},
	populateBoard : function () {
		// define lines
		for (var i = 1; i <= 4; i++) {
			var qdr = document.getElementsByClassName("qdr-"+i);
			for ( j = 1; j <= 6; j++) {
				qdr[0].innerHTML += '<div class="cl cl-' + ((i-1)*6+j) + '"></div>';
			}
		}

		//put pieces in place

		for (var i = 0; i < 24; i++) {
			if ( this.boardState[i][0] ) {
				var type = (this.boardState[i][1]) ? "white" : "black";
				var cont = document.getElementsByClassName("cl-"+(i+1));
				for ( var j = 0; j < this.boardState[i][0]; j++ ) {
					cont[0].innerHTML += '<div class="'+ type +'"></div>';
				}
			}
		}

	}
}

//start game

var game = Object.create(Board);
ready(function () {game.initialize();} );
//game.initialize();
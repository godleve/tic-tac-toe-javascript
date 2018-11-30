var origBoard;
const firstPlayer = 'X';
const secondPlayer = 'O';
let calculate = 0;
let currentTime=10, PlayerRemainingTime, myTime, oTime, xTime;
let selection = ' ';
let currentPlayer;
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
timer = document.querySelector('#timer');
progressX = document.querySelector('.progress-bar');
progressO = document.querySelector(".progress-bar.bg-danger");

startGame();

function startGame() {
	selection = document.getElementById('mySelect').value;
    currentPlayer = 'X';
	document.querySelector(".endgame").style.display = "none";
	stopCounting(myTime);
	oTime = 10;
	xTime=11;
	startCounting();

	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
	
}

 function startCounting(){
	/* currentTime = 11;
	calculate=0; */
	myTime = setInterval(calculateTime,1000);

}

function stopCounting(stopping){
	clearInterval(stopping);
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, currentPlayer)
		if (!checkWin(origBoard, currentPlayer) && !checkTie()){
			if(selection==='second'){
				clearInterval(myTime);
				turn(bestSpot(), secondPlayer)
				startCounting();
			}
			else {
				stopCounting(myTime);
				//PlayerRemainingTime
				nextTurn();
				startCounting();
				/*currentTime = 11; klk
				calculate=0;*/
			}
		} 
	}
}

function nextTurn(){
    if (currentPlayer==='X'){
		currentPlayer = 'O'
    }
	else currentPlayer = 'X';
	
	

}

let checkCurrentPlayer = (player) =>{
	if(player==="X")
		return 'O';
	else
		return 'X';
}

function calculateTime(){
	//calculate++;
	if(currentPlayer==='X'){
		xTime--;
		PlayerRemainingTime = xTime;
	}else{
		oTime--;
		PlayerRemainingTime = oTime;
	}

	
	progressX.style.width = xTime*10 + '%';
	progressX.innerText = `${xTime}`;
	progressO.style.width = oTime*10 + '%';
	progressO.innerText = `${oTime}`;

	 if(PlayerRemainingTime===0){
		clearInterval(myTime);
		//checkCurrentPlayer(currentPlayer);
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = `Zamanınız Doldu. ${checkCurrentPlayer(currentPlayer)} KAZANDI. `;
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "grey";
			cells[i].removeEventListener('click', turnClick, false);
		}
	} 
}



function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == firstPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == firstPlayer ? "Winner is X" : "Winner is O");
}

function declareWinner(who) {
	stopCounting(myTime);
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, secondPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Draw")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, firstPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, secondPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == secondPlayer) {
			var result = minimax(newBoard, firstPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, secondPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === secondPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}


function generateWinningNumber(){
	return Math.floor((Math.random() * 100) + 1);
}

// used from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
	var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
}

return array;
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function(){
	return (this.playersGuess < this.winningNumber);
}

Game.prototype.checkGuess = function(guessNum){
	if(guessNum > 0 && guessNum <= 100){
		this.playersGuess = guessNum;
	}
	else {
		throw 'That is an invalid guess.';
	}
}

Game.prototype.playersGuessSubmission = function(guessNum){
	// console.log("caller is " + arguments.callee.caller.toString());
	var result = '';
	this.checkGuess(guessNum);
	if(this.playersGuess === this.winningNumber && this.pastGuesses.length <= 5 ){
		$('#hint, #submit').prop("disabled",true);
		$('#subtitle').text("Press the Reset button to play again!");
		return 'You Win!'
	}
	
	if(this.pastGuesses.length < 5){
		if(!(this.pastGuesses.indexOf(this.playersGuess) > -1)){
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
			var diff = this.difference();

			if(this.isLower()) {
				$('#subtitle').text("Guess Higher!");
			} else {
				$('#subtitle').text("Guess Lower!");
			}

			if(diff < 10){
				result = "You\'re burning up!";
			}
			else if(diff < 25){
				result = "You\'re lukewarm.";
			}
			else if(diff < 50){
				result = "You\'re a bit chilly.";
			}
			else if(diff < 100){
				result = "You\'re ice cold!";
			}
		}
		else{
			result = 'You have already guessed that number.';
		}

	}
	if(this.pastGuesses.length >= 5)
	{
		$('#hint, #submit').prop("disabled",true);
		$('#subtitle').text("Press the Reset button to play again!")
		result = 'You Lose.'
	}
	return result;
}

Game.prototype.provideHint = function(){
	var result = [];
	result.push(generateWinningNumber());
	result.push(generateWinningNumber());
	result.push(this.winningNumber);
	
	return shuffle(result);
};

function newGame(){
	return new Game();
}

function makeGuess(game){
	var input = +$('#player-input').val();
	$('#player-input').val('');
	var output = game.playersGuessSubmission(input);
	$('#title').text(output);
}

$(document).ready(function() {

	var gameInstance = newGame();
	
	$('#submit').click(function(e) {
		makeGuess(gameInstance);
		console.log('Submit button has been clicked');
	});

	$('#player-input').keypress(function(event){
		if(event.which === 13){
			makeGuess(gameInstance);
		}
	});
	$('#hint').click(function() {
    	var hints = gameInstance.provideHint();
    	$('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
	});

	$('#reset').click(function() {
	    gameInstance = newGame();
	    $('#title').text('Play the Guessing Game!');
	    $('#subtitle').text('Guess a number between 1-100!');
	    $('.guess').text('-');
	    $('#hint, #submit').prop("disabled",false);
	});

});

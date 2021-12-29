
// DECLARING/INITIALIZING VARIABLES

var cards = document.querySelectorAll(".memory-card");
var userHasFlippedFirstCard = false;
var lockMatchedCards = false;
var firstCard, secondCard;
var score = 0;
var count = 0;
var stopFunc;
var runTime = 0;
var pauseTime;
var remaining_cards = 0;

function showDetails(){
		console.log("hello");
		console.log(score);
		$(".finalScore").text(score);
		$(".finalTime").text(runTime + " secs");
		$(".finalCardsRemaining").text(remaining_cards);
	}

// DEFINING FUNCTIONS

function startLevel1(){
	window.location.assign("level1.html");
}
function startLevel2(){
	window.location.assign("level2.html");
}
function startLevel3(){
	window.location.assign("level3.html");
}
function playAgainLevel1(){
	window.location.assign("level1.html");
}
function playAgainLevel2(){
	window.location.assign("level2.html");
}
function playAgainLevel3(){
	window.location.assign("level3.html");
}
function cancel(){
	window.location.assign("index.html");
}

function pause(){
	clearInterval(stopFunc);
	pauseTime = runTime;
	$(".pausePopup").removeClass("hide");
}
function resume(){
	$(".pausePopup").addClass("hide");
	timer(pauseTime);
}
function timer(time){
	stopFunc = setInterval(function(){
 	time--;
 	runTime = time;
	$(".time").text(time);		


 	// LOST (TIME)
 	if (time == 0){
		clearInterval(stopFunc);
 		showDetails();
		$(".reason").text("You Lost!  \n Time is over");
		setTimeout( function(){
			$(".lostpopup").removeClass("hide");
			}, 1000);
 		}
	},1000);
}

// INITIALIZE 
function initialize(time, numClicks, remainingCards, level){
	$(".start-popup").remove();

	// SHOW DETAILS FUNCTION
	
	function onClick(){
		if (lockMatchedCards) return;
		numClicks--;
		this.classList.add('flip');
		if(level !== 1){
			$(".clicks").text(numClicks);

			// LOST (CLICKS)
			if (numClicks == 0){
				clearInterval(stopFunc);
				showDetails();
				$(".reason").text("You Lost!  \n No of Clicks are over");
				setTimeout( function(){
					$(".lostpopup").removeClass("hide");
				}, 1000);
				return;
			}
		}

		// RESOLVING SAME CARD CLCIK AGAIN ISSUE
		if (this === firstCard) return;

		if (!userHasFlippedFirstCard){
			userHasFlippedFirstCard = true;
			firstCard = this;
			return;
		}
		secondCard = this;
		checkForMatch();
	}

	// CHECK FOR MATCH

	function checkForMatch(){
		let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
		isMatch ? matchedCards() : unmatchedCards();

	}

	let totalMatch = remainingCards/2;

	// MATCHED CARDS
	function matchedCards(){
		firstCard.removeEventListener('click', onClick);
		secondCard.removeEventListener('click', onClick);
		playMatchSound();
		score = score + 4;
		remainingCards = remainingCards - 2;
		$(".score").text(score);
		$(".cards-remaining").text(remainingCards);
		remaining_cards = remainingCards;
		firstCard.classList.remove("active");
		secondCard.classList.remove("active");
		count++;

		resetBooard();

		// WINNING LOGIC
		if (count == totalMatch){
			clearInterval(stopFunc);

			showDetails();
			$(".reason").text("Congratulations!! You passed the level");
				setTimeout( function(){
					$(".winpopup").removeClass("hide");
					playWinningSound();
				}, 1000);
			}
		}


	// UNMATCHED CARDS
	function unmatchedCards(){
		lockMatchedCards = true;	
		setTimeout(() => {
			firstCard.classList.remove('flip');
			secondCard.classList.remove('flip');


		// NEGATIVE SCORING
		if(level !== 1 && level !==2){
			if (score > 0){
				score = score - 1;
			}
			$(".score").text(score);		
		}
		resetBooard();
		}, 1500)
	}


	// RESET BOARD
	function resetBooard(){
		[userHasFlippedFirstCard, lockMatchedCards] = [false, false];
		[firstCard, secondCard] = [null, null]
	}

	// SHUFFLING
	(function shuffle(){
		cards.forEach(card => {
			let randomPosition = Math.floor(Math.random() * 12);
			card.style.order = randomPosition;
		});
	})();


	/* ON EVERY CLICK */

	/*cards.forEach(function (card){return card.addEventListener('click', onClick)});*/
	cards.forEach(card => card.addEventListener('click', onClick));


	/* SOUND EFFECTS */

	var winningSound = document.getElementById("winningSound"); 
	var matchSound = document.getElementById("matchSound"); 

	function playWinningSound() { 
	  winningSound.play(); 
	}
	function playMatchSound() { 
	  matchSound.play(); 
	}
	/*TIMER*/

	timer(time);
}


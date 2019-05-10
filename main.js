// Codeworks - Blackjack Game - Javascript
// Developed by Katie'


// Define Deck class with methods to pick and delete cards

class Deck {
  constructor () {
    this.deck = {
    H: ['A', 'K', 'Q', 'J', 0, 9, 8, 7, 6, 5, 4, 3, 2],
    D: ['A', 'K', 'Q', 'J', 0, 9, 8, 7, 6, 5, 4, 3, 2],
    S: ['A', 'K', 'Q', 'J', 0, 9, 8, 7, 6, 5, 4, 3, 2],
    C: ['A', 'K', 'Q', 'J', 0, 9, 8, 7, 6, 5, 4, 3, 2]
    }
  }
  
  deleteCard (card) {
    let suit = card[0];
    let cardIndex = this.deck[suit].indexOf(card[1]);
    this.deck[suit].splice(cardIndex,1);
    return this.deck;
  }

  pickCard () {
    let cards = [];
    for (let suit in this.deck) {
      this.deck[suit].forEach( (val) => cards.push([suit,val]));
    }
    let dealtCard = cards[Math.floor(Math.random()*cards.length)];
    this.deleteCard(dealtCard);
    return dealtCard;
  }
}


// Define Hand class

class Hand {
  constructor () {
    this.cards = [];
    this.score = 0;
  }
  
}

// Define global variables

let user, dealer, currentDeck, activeUser;
let runningScore = {user:0, dealer:0}
let userName = 'Player';
let htmlBase = 'https://raw.githubusercontent.com/crobertsbmw/deckofcards/master/static/img/';



$(document).ready (() => {

// Deal the first two cards.
// The user's card are face up. The dealer has one face up card, one face down.
// Calculate the score to see if the user already won with Blackjack.

function deal() {
    
    user.cards.push(currentDeck.pickCard());
    $("#userCard0").attr('src',htmlBase + user.cards[0][1]+user.cards[0][0]+'.png');
    dealer.cards.push(currentDeck.pickCard());
  $("#dealerCard0").attr('src','https://upload.wikimedia.org/wikipedia/commons/d/d4/Card_back_01.svg');
    user.cards.push(currentDeck.pickCard());
    $(".userHand").append("<img id='userCard1' src="+htmlBase+ user.cards[1][1]+user.cards[1][0]+'.png'+">");
    dealer.cards.push(currentDeck.pickCard());
    $(".dealerHand").append("<img id='userCard1' src="+htmlBase+dealer.cards[1][1]+dealer.cards[1][0]+'.png'+">");
    
    winner(handScore(user.cards),handScore(dealer.cards),activeUser,1);
}


// Calculate a given hand's score.
// Each card's value is its number. If it's a K, Q, or J, then it's 10.
// Calculate the aces' value within the hand.
// If the hand's value is greater than 10, then the ace's value is 1.
// If the hand's value is less than or equal to 10, then the ace's value is 11. 

function handScore(hand) {
    
    let score = 0;
    let aces = hand.filter(x => x[1] === 'A');
    hand = hand.filter(x => x[1] !== 'A');
    
    for(let i=0; i<hand.length; i++) {
        let value = hand[i][1];
        ['K','Q','J',0].indexOf(value) !== -1 ? score += 10 : score += value;
    }          
  
    if (aces.length !== 0) {
      aces.forEach( (ace) => score > 10 ? score+=1 : score+=11);
    }
     
    return score;      
}


// Take the user's score and the dealer's score
// If there's a winner or push, then end the game, and display the result.
// Update the winner's score.
// If there is no winner, then continue. 
// Calculate the user's current score, and display next to their name.

function winner(userScore, dealerScore, activeUser, round=0) {
    
  if(round===1) {
    if(userScore === 21) {
      runningScore.user += 1;
      endGame()
        $('#userName').addClass('winnerBlink');
    }     
  }

  else {
    if (userScore > 21) {
        runningScore.dealer += 1;
        endGame()
        $('#dealer').addClass('winnerBlink');
      }
      else if(userScore === 21 && dealerScore !== 21) {
        runningScore.user += 1;
        endGame()
        $('#userName').addClass('winnerBlink');
        }
    
      else {
        if(activeUser===false && dealerScore >= 17) {
          if (dealerScore > 21) {
            runningScore.user+= 1;
            endGame()
            $('#userName').addClass('winnerBlink');
          }
          else if (dealerScore > userScore) {
            runningScore.dealer += 1;
            endGame()
            $('#dealer').addClass('winnerBlink');
          }
          else if(dealerScore === userScore) {
            endGame()
            $('#dealer').addClass('winnerBlink');
            $('#userName').addClass('winnerBlink');
          }
          else {
            runningScore.user += 1;
            endGame()
            $('#userName').addClass('winnerBlink');
          }
        }
    }
  }

  $("#userName").html(userName+' - '+handScore(user.cards));

}

// "Hit" the hand with a new card
// Calculate the score and potential winner

function hit(player, hand, activeUser) {

  hand.push(currentDeck.pickCard());
  let nextCardIndex = hand.length-1;
    
    if(player==='user') {
      $('.userHand').append("<img id='"+player+'Card'+nextCardIndex+"' src="+htmlBase+hand[nextCardIndex][1]+hand[nextCardIndex][0]+'.png'+">");
    }
    else if(player==='dealer') {
      $('.dealerHand').append("<img id='"+player+'Card'+nextCardIndex+"' src="+htmlBase+hand[nextCardIndex][1]+hand[nextCardIndex][0]+'.png'+">");  
    }

    winner(handScore(user.cards),handScore(dealer.cards), activeUser);

}

// Disable the "hit" button.
// Reveal the face down card to the user.
// Show the dealer's score next to the Dealer text.
// Calculate the score and possible winner.
// The dealer continues to receive cards until his hand is at least 17

function stand() {

  $("#hit").prop("disabled",true);
  $("#dealerCard0").attr('src', htmlBase+dealer.cards[0][1]+dealer.cards[0][0]+'.png');
  $("#dealer").html('Dealer - '+handScore(dealer.cards));
  
  setTimeout(function(){
    if (handScore(dealer.cards)<17) {
      hit('dealer', dealer.cards, false);
      stand();  
    }
  },1000);
}

// Disable buttons and end game 
// If the dealer's card wasn't revealed yet, show.
// If the user's and dealer's scores weren't shown, then show.

function endGame() {
  
  $("#dealerCard0").attr('src',htmlBase+dealer.cards[0][1]+dealer.cards[0][0]+'.png');

  isPlaying = false
  $("#hit").prop("disabled",true);
  $("#stand").prop("disabled",true);
  $("#playAgain").show();

  $("#dealer").html('Dealer - '+handScore(dealer.cards));
  $(".score").html(userName + ' ' +runningScore.user+' - '+runningScore.dealer+' Dealer');
}


// Call the hit() function when the "hit" button is clicked

$(function hitButton() {
  $('#hit').on('click', () => hit('user', user.cards, true));
});


// Call the stand() function when the "stand" button is clicked

$(function standButton() {
  $('#stand').on('click', () => {
    winner(handScore(user.cards),handScore(dealer.cards), false);
    stand()
  });
});


// Call the playGame() function when the "play again" button is clicked

$(function playAgainButton() {
  
  $("#playAgain").on('click', () => {
    $("#result").html('');
    $(".dealerHand").empty();
    $(".userHand").empty();
    $(".dealerHand").append("<img id='dealerCard0' src=\"\">");
    $(".userHand").append("<img id='userCard0' src=\"\">");
    $('#dealer').removeClass('winnerBlink');
    $('#userName').removeClass('winnerBlink');
    playGame(true)});
})



// Initialize the game. 
// Enable/disable appropriate buttons.
// Clear the user's and dealer's hands. 
// Reset the deck to 52 cards.
// Deal the first two cards per person.

function playGame(isPlaying) {

  $("#hit").prop("disabled",false);
  $("#stand").prop("disabled",false);
  $("#playAgain").hide();
  $("#dealer").html('Dealer');
  $("#userName").html(userName);

  user = new Hand();
  dealer = new Hand();
  currentDeck = new Deck();
  activeUser = true;

  deal();
    
}
  
// ---------------------------------------------------------------
// ------------- Functions called to start the game---------------
// ---------------------------------------------------------------
playGame(true);
});




  



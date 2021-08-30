 let blackjackGame={
     'you': {'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0},
     'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
     'cards':['2','3','4','5','6','7','8','9','10','11','K','Q','J','A'],
    //  To map each card with its correspondense value
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'11':11,'A':[1,11],'J':10,'K':10,'Q':10},
    // keep track on which loss and draw
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand':false,
    'turnsOver':false,
  }
 
 const YOU= blackjackGame['you']
 const DEALER= blackjackGame['dealer']
 const hitSound=new Audio('static/sounds/swishh.mp3')
 const winSound=new Audio('static/sounds/win.mp3')
 const lossSound=new Audio('static/sounds/loss.mp3')
 
 
 document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackHit);
 
 document.querySelector('#blackjack-stand-button').addEventListener('click',dealerLogic);

 document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);
// Hit button should only work when you have not used stanrd button yet
 function blackjackHit(){
   if(blackjackGame['isStand']===false){
   let card = randomCard()
  
   showCard(card, YOU);
   updateScore(card,YOU)
   showScore(YOU)
   
   }
  }

 function randomCard(){
  let randomIndex=Math.floor(Math.random()*14);
  return blackjackGame['cards'][randomIndex]
}
 
 function showCard(card,activePlayer){
   if(activePlayer['score'] <=21){
     let CardImage=document.createElement('img');
     CardImage.src=`static/images/${card}.png`;
     document.querySelector(activePlayer['div']).appendChild(CardImage);
     hitSound.play();
   }
 }
function blackjackDeal(){
 
 if(blackjackGame['turnsOver']===true){
  let winner;
   blackjackGame['isStand']=false
  let yourImages = document.querySelector('#your-box').querySelectorAll('img');
  let dealerImages= document.querySelector('#dealer-box').querySelectorAll('img');
  for (i=0; i<yourImages.length;i++){
    yourImages[i].remove()
  }
  for (i=0; i<dealerImages.length;i++){
    dealerImages[i].remove()
  }
YOU['score']=0;
DEALER['score']=0;
document.querySelector('#your-blackjack-result').textContent=0
document.querySelector('#dealer-blackjack-result').textContent=0;
document.querySelector('#your-blackjack-result').style.color='white'
document.querySelector('#dealer-blackjack-result').style.color='white'
document.querySelector('#blackjack-result').textContent="Let's Play"
document.querySelector('#blackjack-result').style.color='black'

blackjackGame['turnsOver']=true;
 }

}

function updateScore(card,activePlayer) {
  if(card==='A'){
  // if adding 11 keeps me below 21 add 11. otherwise 1
  if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21 ){
  activePlayer['score'] += blackjackGame['cardsMap'][card][1]
  } else{
    activePlayer['score'] += blackjackGame['cardsMap'][card][0]
  }
}else{
  activePlayer['score'] +=blackjackGame['cardsMap'][card];
}
}

function showScore(activePlayer){
  if(activePlayer['score']> 21){
    document.querySelector(activePlayer['scoreSpan']).textContent='BUST!';
    document.querySelector(activePlayer['scoreSpan']).style.color='red';
  }else{
  document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
  }
}

// promise object
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic(){
  blackjackGame['isStand']= true

  while(DEALER['score'] < 16 && blackjackGame['isStand']=== true){
  let card=randomCard();
  showCard(card,DEALER);
  updateScore(card,DEALER);
  showScore(DEALER)
  await sleep(1000);
  }
 
    blackjackGame['turnsOver']=true
    let winner=computerWinner();
    showResult(winner)
    
  }



// Compute Winner and return who just won
// Update the wins, draws and losses
function computerWinner(){
  let winner;

  if(YOU['score']<=21){
    // condition:higher score than dealer or when dealer busts but you'r 21
    if(YOU['score'] > DEALER['score'] || (DEALER['score']>21)){
      blackjackGame['wins']++;
      winner=YOU;
    
    } else if(YOU['score'] < DEALER['score']){
      blackjackGame['losses']++;
      winner=DEALER;
    
    }else if(YOU['score'] === DEALER['score']){
      blackjackGame['draws']++;
    }
    
    //condition: when user busts but dealer does not 
  } else if (YOU['score'] >21 && DEALER['score'] <=21){
    blackjackGame['losses']++;
    winner=DEALER;
  
  }
  // condition:when you and dealer both busts
  else if (YOU['score'] >21 && DEALER['score'] >21){
    blackjackGame['draws']++;
   
  }
    console.log(blackjackGame)
    return winner;
}
 
function showResult(winner){
 let message, messageColor;
// if all the turns are over we see the result
if (blackjackGame['turnsOver']===true){
 if(winner===YOU){
   document.querySelector('#wins').textContent=blackjackGame['wins']
   message='You won! 😄';
   messageColor='green';
   winSound.play()
 } else if(winner===DEALER){
  document.querySelector('#losses').textContent=blackjackGame['losses']
  message='You lost! 😮';
  messageColor='red';
  lossSound.play()
 } else{
  document.querySelector('#draws').textContent=blackjackGame['draws']
  message='You drew! 😏';
  messageColor='black';

 }
 document.querySelector('#blackjack-result').textContent=message
 document.querySelector('#blackjack-result').style.color=messageColor;
}
}

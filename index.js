import GameState from "./game-state.js";

var game = new GameState();


const btnSpin = document.getElementById('btn-spin');
const btnPredict = document.getElementById('btn-predict');
const btnStartGame = document.getElementById('btn-startGame');
const btnNextOpponent = document.getElementById('btn-next-opponent');
const btnPrevOpponent = document.getElementById('btn-prev-opponent');

btnSpin.addEventListener('click', function () {game.startRound()});
btnPredict.addEventListener('click', function () {game.setPlayerPrediction()});
btnStartGame.addEventListener('click', function () {game.startGame()});

btnPrevOpponent.addEventListener('click', function () {game.switchOpponent(-1)});
btnNextOpponent.addEventListener('click', function () {game.switchOpponent(1)});



const debugOpponentFace = document.getElementById('debug-opponent-face');

debugOpponentFace.addEventListener('change', function(e) {
    const index = e.target.value;
    document.getElementById('opponent-expression').style.backgroundPositionX = -150 * index + 'px';
})

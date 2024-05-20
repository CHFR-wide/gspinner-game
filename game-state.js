import { END_GAME_STATUS } from "./end-game-status-const.js";
import FletaAI from "./fleta-ai.js";
import GameUi from "./game-ui.js";
import { GRADE } from "./grade-const.js";
import HarpaeAI from "./harpae-ai.js";
import LisetteAi from "./lisette-ai.js";
import PlayerState from "./player-state.js";

export const SCORE_TARGET = 200;

class GameState {

    constructor() {
        this.setPlayerPrediction = this.setPlayerPrediction.bind(this);
        this.startRound = this.startRound.bind(this);
        this.startGame = this.startGame.bind(this);
        this.spinG = this.spinG.bind(this);
        this.switchOpponent = this.switchOpponent.bind(this);
        this.getOpponent = this.getOpponent.bind(this);
        this.endRound = this.endRound.bind(this);

        this.init();
    }

    animationLength = 14
    ui = new GameUi(this.animationLength);
    player = new PlayerState();
    opponents = [
        null,
        new FletaAI(),
        new HarpaeAI(),
        new LisetteAi(),
    ];
    currentOpponent = 0;
    counter = 0;
    maxLoops = 0;
    players = [];
    scoreTarget = SCORE_TARGET;


    init() {
        this.ui.firstLoad(this.scoreTarget);
    }

    lisetteHasWon() {
        return this.getOpponent() instanceof LisetteAi
        && this.getOpponent().score > 0
        && this.getOpponent().score >= this.player.score
    }

    switchOpponent(offset) {
        this.currentOpponent = (this.currentOpponent + offset) % this.opponents.length;
        if (this.currentOpponent === -1) {
            this.currentOpponent = this.opponents.length - 1;
        }

        this.ui.setOpponentInfos(this.getOpponent());
        this.ui.configureOpponentFaces(this.getOpponent())
        this.startGame();
    }

    getOpponent() {
        return this.opponents[this.currentOpponent];
    }

    startRound() {
        this.ui.startRound();

        if (this.getOpponent()) {
            this.getOpponent().resetNewTurn();
        }

        this.player.resetNewTurn();
        this.maxLoops = Math.ceil(Math.random() * 20);

        this.spinG();
    }

    setPlayerPrediction() {
        this.player.setPrediction(Math.ceil(this.counter / this.animationLength));

        if (this.getOpponent()) {
            this.getOpponent().onPlayerPrediction();
        }
    }

    endRound() {
        this.player.setLockSpin(false);
        this.player.setLockPredict(true);

        this.counter = 0;

        const playerScore = this.getScore(this.player.prediction);

        if (this.getOpponent()) {
            const opponentScore = this.getScore(this.getOpponent().prediction);

            this.getOpponent().onScored(opponentScore);
            this.scorePlayers(playerScore, opponentScore);
        }

        this.ui.endRound(
            this.maxLoops,
            playerScore,
        );
    }

    endGame(status) {
        if (this.getOpponent()) {
            this.getOpponent().onEndGame(status)
        }

        this.ui.endGame(status);
    }

    startGame() {
        this.player.resetGame();

        if (this.getOpponent()) {
            this.getOpponent().resetGame();
        }

        this.ui.startGame();

        if (this.getOpponent() instanceof LisetteAi) {
            this.player.addToScore(15);
        }
    }

    scorePlayers(playerScore, opponentScore) {
        if (this.lisetteHasWon()) {
            playerScore = 0;
            opponentScore = 0;
        }

        this.player.addToScore(playerScore);
        this.getOpponent().addToScore(opponentScore);

        let playerHasWon, opponentHasWon;

        playerHasWon = this.player.score >= this.scoreTarget;
        opponentHasWon = this.lisetteHasWon() || this.getOpponent().score >= this.scoreTarget;

        if (playerHasWon && opponentHasWon) {
            this.endGame(END_GAME_STATUS.TIE)
        }
        else if (playerHasWon) {
            this.endGame(END_GAME_STATUS.WIN);
            return;
        }
        else if (opponentHasWon) {
            this.endGame(END_GAME_STATUS.LOSE);
            return;
        }
    }

    spinG() {
        this.counter += 1;

        const currentTurn = Math.ceil(this.counter / this.animationLength)

        if (this.getOpponent()) {
            if ((this.counter + this.animationLength / 2) % this.animationLength === 0) {
                this.getOpponent().onActionOpportunity(currentTurn, this.player);
            }

            if ( this.counter % this.animationLength === 0
                && this.lisetteHasWon()
            ) {
                this.endRound()
                return;
            }
        }

        this.ui.spinG(this.counter);
        if (this.counter == (this.animationLength) * this.maxLoops) {
            this.endRound();
            return;
        }

        setTimeout(this.spinG, 75);
    }

    getScore(prediction) {
        if (prediction === null) {
            return GRADE.MISS;
        }

        if (this.getOpponent() instanceof LisetteAi) {
            switch (this.maxLoops - prediction) {
                case 0:
                    return 30
                case 1:
                    return 25
                case 2:
                case 3:
                    return 20
                case 4:
                case 5:
                case 6:
                    return 10
                case 7:
                case 8:
                case 9:
                    return 5
                default:
                    return GRADE.FAIL
            }
        }

        switch (this.maxLoops - prediction) {
            case 0:
                return GRADE.PERFECT
            case 1:
                return GRADE.GREAT
            case 2:
            case 3:
                return GRADE.GOOD
            case 4:
            case 5:
            case 6:
                return GRADE.DECENT
            case 7:
            case 8:
            case 9:
                return GRADE.MEDIOCRE
            default:
                return GRADE.FAIL
        }
    }
}

export default GameState;
import { DIALOG_EVENT } from "./dialog-event.js";
import { END_GAME_STATUS } from "./end-game-status-const.js";
import { GRADE } from "./grade-const.js";
import OpponentUi from "./opponent-ui.js";
import PlayerState from "./player-state.js";

class OpponentState extends PlayerState {
    ui = new OpponentUi();

    playerHasPredicted = false;
    roundHasEnded = false;
    predictChance = 0;
    abilityChance = 0;
    abilityLocked = false;

    infos = {
        name: '',
        playStyle: '',
        abilityPassive: null,
        abilityActive: null,
    }

    resetGame() {
        super.resetGame()
        this.say(DIALOG_EVENT.INITIAL_TAUNT);
    }

    setPrediction(prediction) {
        this.prediction = prediction;
        this.ui.setPredictionText(prediction);

        this.say(DIALOG_EVENT.PREDICTION);
    }

    onUseAbility() {
        this.say(DIALOG_EVENT.USE_ABILITY);
    }

    resetNewTurn() {
        this.prediction = null;
        this.playerHasPredicted = false;
        this.roundHasEnded = false;
        this.abilityLocked = false;

        this.ui.setPredictionText(this.prediction);
        this.say(DIALOG_EVENT.START_ROUND);
    }

    onPlayerPrediction() {
        this.playerHasPredicted = true;
    }

    onRoundEnd() {
        this.roundHasEnded = true;
    }

    say(dialogEvent) {
        return;
    }

    onEndGame(status) {
        switch (status) {
            case END_GAME_STATUS.LOSE:
                this.say(DIALOG_EVENT.PLAYER_LOSE)
                break;
            case END_GAME_STATUS.WIN:
                this.say(DIALOG_EVENT.PLAYER_WIN)
                break;
            case END_GAME_STATUS.TIE:
                this.say(DIALOG_EVENT.PLAYER_TIE)
                break;
        }
    }

    onScored(score) {
        switch (score) {
            case GRADE.PERFECT:
                this.say(DIALOG_EVENT.ROUND_PERFECT)
                break;
            case GRADE.GREAT:
                this.say(DIALOG_EVENT.ROUND_GREAT)
                break;
            case GRADE.GOOD:
                this.say(DIALOG_EVENT.ROUND_GOOD)
                break;
            case GRADE.DECENT:
                this.say(DIALOG_EVENT.ROUND_DECENT)
                break;
            case GRADE.MEDIOCRE:
                this.say(DIALOG_EVENT.ROUND_MEDIOCRE)
                break;
            case GRADE.FAIL:
                this.say(DIALOG_EVENT.ROUND_FAIL)
                break;
            case GRADE.MISS:
                this.say(DIALOG_EVENT.ROUND_MISS)
                break;
        }
    }

    onStartRound() {
        this.say(DIALOG_EVENT.START_ROUND)
    }


}

export default OpponentState;
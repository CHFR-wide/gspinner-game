import PlayerUi from "./player-ui.js";

class PlayerState {
    ui = new PlayerUi();
    score = 0;
    prediction = null;

    resetGame() {
        this.score = 0;
        this.prediction = null;
        this.ui.setScore(this.score);
        this.ui.setPredictionText(this.prediction);
    }

    resetNewTurn() {
        this.setPrediction(null);
        this.setLockSpin(true);
        this.setLockPredict(false);
    }

    setPrediction(prediction) {
        this.prediction = prediction;
        this.ui.setPredictionText(this.prediction);
        this.setLockPredict(true);
    }

    setLockSpin(value) {
        this.ui.setLockSpin(value);
    }

    setLockPredict(value) {
        this.ui.setLockPredict(value);
    }

    addToScore(value) {
        this.score += value;

        this.ui.setScore(this.score);
    }
}

export default PlayerState;
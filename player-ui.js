class PlayerUi {
    constructor() {
        this.playerScore.innerText = 0;
    }

    btnSpin = document.getElementById('btn-spin');
    btnPredict = document.getElementById('btn-predict');
    spinPrediction = document.getElementById('spin-prediction');
    playerScore = document.getElementById('player-score');

    setLockSpin(value) {
        this.btnSpin.disabled = value;
    }

    setLockPredict(value) {
        this.predictLocked = value;
        this.btnPredict.disabled = value;
    }

    setPredictionText(value) {
        this.spinPrediction.innerText = value
    }

    setScore(value) {
        this.playerScore.innerText = value
    }
}

export default PlayerUi;
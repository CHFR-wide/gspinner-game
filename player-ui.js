class PlayerUi {
    constructor() {
    }

    btnSpin = document.getElementById('btn-spin');
    btnPredict = document.getElementById('btn-predict');
    spinPrediction = document.getElementById('spin-prediction');

    scoreProgress = document.getElementById('player-progress')

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

    setScoreProgress(value) {
        this.scoreProgress.style.width = value;
    }
}

export default PlayerUi;
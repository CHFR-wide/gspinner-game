class OpponentUi {
    constructor() {
        this.opponentScore.innerText = 0;
    }

    btnPredict = document.getElementById('btn-predict');
    spinPrediction = document.getElementById('opponent-spin-prediction');
    opponentScore = document.getElementById('opponent-score');
    opponentDialog = document.getElementById('opponent-dialog');
    opponentExpression = document.getElementById('opponent-expression');

    setLockPredict(value) {
        this.btnPredict.disabled = value;
    }

    setPredictionText(value) {
        this.spinPrediction.innerText = value
    }

    setScore(value) {
        this.opponentScore.innerText = value
    }

    say(dialog, image) {
        this.opponentDialog.innerHTML = dialog;
        this.opponentExpression.src = image;
    }
}

export default OpponentUi;
class OpponentUi {
    constructor() {
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

    say(dialog, emotionIndex) {
        this.opponentDialog.innerHTML = dialog;
        this.opponentExpression.style.backgroundPositionX = -150 * emotionIndex + 'px';
    }
}

export default OpponentUi;
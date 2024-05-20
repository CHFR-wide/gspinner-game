import { END_GAME_STATUS } from "./end-game-status-const.js";
import { GRADE } from "./grade-const.js";

class GameUi {
    constructor(animationLength) {
        this.animationLength = animationLength;
        this.spinG = this.spinG.bind(this);
    }

    animationLength;
    title = document.getElementById('spin-title');
    spinPrediction = document.getElementById('spin-prediction');
    spinActual = document.getElementById('spin-actual');
    roundResult = document.getElementById('round-result');
    btnSpin = document.getElementById('btn-spin');
    btnPredict = document.getElementById('btn-predict');
    gameResult = document.getElementById('game-result');
    scoreTargets = document.getElementsByClassName('score-target');
    gameInProgressArea = document.getElementById('game-in-progress-area');
    gameOverArea = document.getElementById('game-over-area');

    gspinSpritesheet = document.getElementById('g-spin');
    
    nextOpponentBtn = document.getElementById('btn-next-opponent');
    prevOpponentBtn = document.getElementById('btn-prev-opponent');

    opponentInfosDiv = document.getElementById('opponent-infos');
    opponentFallbackDiv = document.getElementById('opponent-fallback');

    titleOpponentName = document.getElementById('title-opponent-name')
    opponentName = document.getElementById('opponent-name')
    opponentPlaystyle = document.getElementById('opponent-playstyle')
    opponentAbilityPassive = document.getElementById('opponent-ability-passive')
    opponentAvilityActive = document.getElementById('opponent-ability-active')

    versusAiElements = document.getElementsByClassName('versus-ai-mode')

    endGame(status) {
        this.gameInProgressArea.style.display = 'none';
        this.gameOverArea.style.display = 'flex';
        this.gameResult.style.display = 'block';

        switch (status) {
            case END_GAME_STATUS.WIN:
                this.gameResult.innerText = 'You win!'
                break;
            case END_GAME_STATUS.LOSE:
                this.gameResult.innerText = 'You lose!'
                break;
            case END_GAME_STATUS.TIE:
                this.gameResult.innerText = 'It\'s a tie!'
                break;
        }
    }

    setSwitchOpponentLock(value) {
        this.nextOpponentBtn.disabled = value;
        this.prevOpponentBtn.disabled = value;
    }

    startGame() {
        this.gameInProgressArea.style.display = 'flex';
        this.gameOverArea.style.display = 'none';
        this.gameResult.style.display = 'none';
        this.resetRoundInfos();
    }

    firstLoad(scoreTarget) {
        this.btnPredict.disabled = true;
        this.gameOverArea.style.display = 'none';
        for (const e of this.scoreTargets) {
            e.innerText = scoreTarget
        }

        this.setOpponentInfos(null);

        setTimeout(() => {
            this.resetRoundInfos()
        }, 500);
    }

    setOpponentInfos(opponent) {
        if (opponent === null) {
            this.opponentInfosDiv.style.display = 'none';
            this.opponentFallbackDiv.style.display = 'block';

            for (const e of this.versusAiElements) {
                e.style.display = 'none'
            }
        }
        else {
            this.opponentInfosDiv.style.display = 'block';
            this.opponentFallbackDiv.style.display = 'none';

            this.opponentName.innerText = opponent.infos.name
            this.titleOpponentName.innerText = opponent.infos.name
            this.opponentPlaystyle.innerHTML = opponent.infos.playStyle
            this.opponentAbilityPassive.innerHTML = opponent.infos.abilityPassive ?? 'None'
            this.opponentAvilityActive.innerHTML = opponent.infos.abilityActive ?? 'None'

            for (const e of this.versusAiElements) {
                e.style.display = 'block'
            }
        }
    }

    startRound() {
        this.setSwitchOpponentLock(true);
        this.resetRoundInfos();
        this.setSpinningTitle();
    }

    resetRoundInfos() {

        this.spinPrediction.innerText = '';
        this.spinActual.innerText = '';
        this.roundResult.innerText = '';


    }

    spinG(counter) {
        let currentImage = counter % this.animationLength

        this.gspinSpritesheet.style.backgroundPositionX = `-${currentImage*93}px`;
    }

    setSpinningTitle() {
        const randIdx = Math.floor(Math.random() * gNames.length);

        this.title.innerText = `${gNames.at(randIdx)} is spinning...`;
    }

    resetTitle() {
        this.title.innerText = 'Spin the G!';
    }

    endRound(actualLoops, score) {
        this.setSwitchOpponentLock(false);
        this.resetTitle();
        this.spinActual.innerText = actualLoops;

        const scoremMessage = this.getScoreMessage(score);
        this.roundResult.innerText = scoremMessage ? `. ${scoremMessage}` : null
    }

    getScoreMessage(score) {
        switch (score) {
            case GRADE.PERFECT:
                return 'A perfect score! Congratulations!';
            case GRADE.GREAT:
                return 'So close!!'
            case GRADE.GOOD:
                return 'Pretty good!'
            case GRADE.DECENT:
                return 'Acceptable...'
            case GRADE.MEDIOCRE:
                return 'Ouch!'
            case GRADE.FAIL:
                return 'Make up your mind slower next time.'
            case GRADE.MISS:
                return 'You lose... make up your mind faster next time.';
        }
    }
}

const gNames = [
    'Glorbo',
    'Glorb',
    'Glob',
    'Gertrude',
    'Greta',
    'Glutton',
    'Garlic',
    'G',
    'Greta',
    'Genevieve',
    'Gehovah',
    'Gwendolyn',
    'Georgia',
    'Goldy',
    'Gypsy',
    'Galileo',
    'Galileo',
    'Germany',
    'Ground',
    'Girl',
    'Griselda',
    'Gretel',
]

export default GameUi;
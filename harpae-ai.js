import { DIALOG_EVENT } from "./dialog-event.js";
import { SCORE_TARGET } from "./game-state.js";
import { GRADE } from "./grade-const.js";
import OpponentState from "./opponent-state.js";

class HarpaeAI extends OpponentState {

    constructor() {
        super();
        this.infos.name = 'Harpae';
        this.infos.playStyle = `
        Harpae plays defensively, she is more likely to fold early in the round.<br>
        Steadfast in her resolve, she proudly marches forward, without being influenced 
        by your actions or undermining them.
        It is a race against the clock, you may need to take on more risk to win.
        `;
        this.infos.abilityPassive = `
        <i>Steady advance:</i> Harpae is guaranteed to earn at least 10 points as long as she folds<br>
        Her lower scores are also boosted.<br>
        <i>Brittle protector:</i> If harpae fails to fold before G stops spinning,
        she suffers four times the usual penalty.
        `
    }

    spriteInfos = {
        name: 'harpae',
        width: 364,
        height: 528,
    }

    resetNewTurn() {
        const isCloseToWinning = this.score >= SCORE_TARGET - 40;

        this.predictChance = isCloseToWinning ? 0.35 : 0.10;


        super.resetNewTurn();
    }

    onActionOpportunity(currentTurn) {
        if (this.prediction != null) return;

        const predictionDiceRoll = Math.random();

        // console.log(
        //     currentTurn, 
        //     this.prediction,
        //     this.predictChance,
        //     predictionDiceRoll < this.predictChance,
        // );

        if (currentTurn % 3 === 0) {
            this.predictChance += 0.15;
        }

        if (currentTurn > 10) {
            this.predictChance = 0.66;
        }

        if (predictionDiceRoll < this.predictChance) {
            this.setPrediction(currentTurn);
            return;
        }

    }

    addToScore(value) {
        let correctedValue;

        switch (value) {
            case GRADE.FAIL:
                correctedValue = 10;
                break;
            case GRADE.MEDIOCRE:
                correctedValue = 20;
                break;
            case GRADE.DECENT:
                correctedValue = 30;
                break;
            case GRADE.MISS:
                correctedValue = -40;
                break;

            default:
                correctedValue = value;
                break;
        }

        super.addToScore(correctedValue);
    }

    getEmotionImage(value) {
        return `./imgs/opponent-harpae/${value}.png`;
    }

    say(dialogEvent) {
        let dialog;
        let emotion;

        switch (dialogEvent) {
            case DIALOG_EVENT.INITIAL_TAUNT:
                dialog = `
                Let us have a fair match.
                `;
                emotion = 'smile';
                break;
            case DIALOG_EVENT.START_ROUND:
                dialog = `
                I won't falter!
                `
                emotion = 'smile2';
                break;
            case DIALOG_EVENT.PLAYER_WIN:
                dialog = `
                Impressive, you may have what it takes to progress on your own.
                I shall be rooting for you.
                `
                emotion = 'happy';
                break;
            case DIALOG_EVENT.PLAYER_LOSE:
                dialog = `
                In the end it looks like you couldn't make it on your own.<br>
                There, leave it to me, I'll take care of everything now.
                `
                emotion = 'ominous';
                break;
            case DIALOG_EVENT.PLAYER_TIE:
                dialog = `
                A tie huh. You're slowly getting there.
                `
                emotion = 'smile2';
                break;
            case DIALOG_EVENT.PREDICTION:
                if (this.score >= SCORE_TARGET - 40) {
                    dialog = `
                    So close... J-just a little more!
                    `
                    emotion = 'ominous2';
                }
                else {
                    dialog = `
                    I'm taking my stance now! ${this.prediction}.
                    `
                    emotion = 'resolved';
                }

                break;
            case DIALOG_EVENT.ROUND_PERFECT:
                dialog = `
                A perfect score? it seems the stars have aligned for me just this once.
                `
                emotion = 'surprised'
                break;
            case DIALOG_EVENT.ROUND_GREAT:
                dialog = `
                Wonderful!
                `
                emotion = 'smile2'
                break;
            case DIALOG_EVENT.ROUND_GOOD:
                dialog = `
                This is good, let's go on with the next round shall we?
                `
                emotion = 'relaxed'
                break;
            case DIALOG_EVENT.ROUND_DECENT:
                dialog = `
                My instincts will not fail me.
                `
                emotion = 'smile'
                break;
            case DIALOG_EVENT.ROUND_MEDIOCRE:
                dialog = `
                It seems I am a bit off the mark...
                `
                emotion = 'pained'
                break;
            case DIALOG_EVENT.ROUND_FAIL:
                dialog = `
                No matter how long it takes, I will carry on!
                `
                emotion = 'pained2'
                break;
            case DIALOG_EVENT.ROUND_MISS:
                dialog = `
                K-kuh...
                `
                emotion = 'pained3'
                break;
            case DIALOG_EVENT.WAITING:
                dialog = `
                ...
                `
                emotion = 'smile'
                break;
            default:
                return;
        }

        this.ui.say(dialog, this.getEmotionImage(emotion));
    }
}

export default HarpaeAI;
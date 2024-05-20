import { DIALOG_EVENT } from "./dialog-event.js";
import { SCORE_TARGET } from "./game-state.js";
import OpponentState from "./opponent-state.js";

class LisetteAi extends OpponentState {

    constructor() {
        super();
        this.onEndAbility = this.onEndAbility.bind(this);
        this.onEndAbilityCooldown = this.onEndAbilityCooldown.bind(this);

        this.infos.name = 'Lisette';
        this.infos.playStyle = `
        Lisette is chasing you! Make sure you reach the goal before she catches you!
        `;
        this.infos.abilityPassive = `
        <i>Red light green light:</i> Lisette does not make any calls, instead, she will slowly advance every time
        G spins. Once you make a call, she cannot move anymore. The more you wait, the faster she advances!<br>
        <i>Frightened stupor:</i> You don't suffer a penalty when you miss a call, but you also get less points than usual.
        `

        this.uiData = {
            progressSprite: {
                url: './imgs/opponent-sprites/lisette.png',
                width: 416,
                height: 556,
            },
            faces: {
                url: './imgs/opponent-faces/lisette.png',
            }
        }
    }



    resetNewTurn() {

        super.resetNewTurn();
    }

    onActionOpportunity(currentTurn, player = null) {
        if (player.score > 0 && player.prediction == null) {

            const scoreDifference = player.score - this.score;
            const scoreIncrement = Math.min(Math.ceil(currentTurn / 3), Math.max(scoreDifference - 5, 1));

            this.addToScore(scoreIncrement, true);

            this.sayDuringTurn(player);
            this.ui.setScoreProgress(Math.min(this.score / SCORE_TARGET * 100, 100) + '%');
        }
    }

    addToScore(value, lisetteMode) {
        if (lisetteMode) {
            super.addToScore(value);
        }
    }

    useAbility() {
        if (this.playerHasPredicted) return;

        this.abilityChance = 0.05;
        this.abilityLocked = true;
        this.ui.setLockPredict(true);

        setTimeout(this.onEndAbility, this.abilityDuration);
        setTimeout(this.onEndAbilityCooldown, this.abilityCooldownMs);

        this.onUseAbility();
    }

    onEndAbility() {
        if (this.roundHasEnded) {
            return;
        }
        this.ui.setLockPredict(false);
    }

    onEndAbilityCooldown() {
        this.abilityLocked = false;
    }

    sayDuringTurn(player) {
        let dialog;
        let emotion;

        const scoreDifference = player.score - this.score;

        if (scoreDifference > 25) {
            dialog = '........';
            emotion = 'clouded';
        } else if (scoreDifference > 20) {
            dialog = '...be careful not to trip now';
            emotion = 'smirk';
        } else if (scoreDifference > 15) {
            dialog = '...hehehe, hehehehe...';
            emotion = 'crazy';
        } else if (scoreDifference > 10) {
            dialog = 'close, close, close, so close...';
            emotion = 'mad';
        } else {
            dialog = 'So close... just a few more steps and I can finally be set free...';
            emotion = 'crazy2';
        }

        this.ui.say(dialog, this.faces.indexOf(emotion));
    }

    say(dialogEvent) {
        let dialog;
        let emotion;

        switch (dialogEvent) {
            case DIALOG_EVENT.INITIAL_TAUNT:
                dialog = '...hehe... heh';
                emotion = 'neutral-pained';
                break;
            case DIALOG_EVENT.PLAYER_WIN:
                dialog = `
                ...
                `
                emotion = 'neutral';
                break;
            case DIALOG_EVENT.PLAYER_LOSE:
                dialog = `
                Caught... you...
                `
                emotion = 'ominous';
                break;
            default:
                return;
        }

        this.ui.say(dialog, this.faces.indexOf(emotion));
    }

    faces = [
        'neutral',
        'frown',
        'clouded',
        'smirk',
        'crazy',
        'crazy2',
        'mad',
        'mad2',
        'ominous',
        'crazy3',
        'neutral-pained',
    ]
}

export default LisetteAi;
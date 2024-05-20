import { DIALOG_EVENT } from "./dialog-event.js";
import OpponentState from "./opponent-state.js";

class FletaAI extends OpponentState {

    constructor() {
        super();
        this.onEndAbility = this.onEndAbility.bind(this);
        this.onEndAbilityCooldown = this.onEndAbilityCooldown.bind(this);

        this.infos.name = 'Fleta';
        this.infos.playStyle = `
        Fleta plays as she pleases without worrying about strategy.
        `;
        this.infos.abilityActive = `
        <i>Impatience:</i> Fleta blocks your ability to make a call for two seconds.<br>
        The more you wait to make your decision, the more likely she is to trigger this ability.
        `

        this.uiData = {
            progressSprite: {
                url: '/imgs/opponent-sprites/fleta.png',
                width: 408,
                height: 508,
            },
            faces: {
                url: '/imgs/opponent-faces/fleta.png',
            }
        }
    }


    abilityDuration = 2000;
    abilityCooldownMs = 5000;


    resetNewTurn() {
        this.abilityChance = 0.05;
        this.predictChance = 0.1;
        this.abilityLocked = false;

        super.resetNewTurn();
    }

    onActionOpportunity(currentTurn) {
        const abilityDiceRoll = Math.random();

        if (abilityDiceRoll < this.abilityChance) {
            this.useAbility(currentTurn);
            return;
        }


        if (this.prediction != null) return;

        const predictionDiceRoll = Math.random();

        // console.log(
        //     currentTurn, 
        //     this.prediction,
        //     predictionDiceRoll < this.predictChance, 
        //     abilityDiceRoll < this.abilityChance, 
        // );

        if (currentTurn >= 5) {
            this.predictChance += 0.05;
        }
        if (currentTurn > 2 && this.abilityLocked === false) {
            this.abilityChance += 0.05
        }


        if (predictionDiceRoll < this.predictChance) {
            this.setPrediction(currentTurn);
            return;
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

    say(dialogEvent) {
        let dialog;
        let emotion;

        switch (dialogEvent) {
            case DIALOG_EVENT.INITIAL_TAUNT:
                dialog = 'Try not to bore me to death okay?';
                emotion = 'smug';
                break;
            case DIALOG_EVENT.START_ROUND:
                dialog = 'Get ready to lose!'
                emotion = 'proud';
                break;
            case DIALOG_EVENT.PLAYER_WIN:
                dialog = `
                Guuuuh... no way you won! You cheated for sure!
                Uh? You didn't? Well who cares anyways, it's just a stupid luck game! 
                `
                emotion = 'annoyed3';
                break;
            case DIALOG_EVENT.USE_ABILITY:
                dialog = `
                Oh sorry! Did you need this button?
                `
                emotion = 'ominous2';
                break;
            case DIALOG_EVENT.PLAYER_LOSE:
                dialog = `
                I win! I win! Ahahaha!!! 
                `
                emotion = 'happy';
                break;
            case DIALOG_EVENT.PLAYER_TIE:
                dialog = `
                Ugh... since you're such a sore loser, I guess I can be benevolent and call it a tie.
                `
                emotion = 'annoyed2';
                break;
            case DIALOG_EVENT.PREDICTION:
                dialog = `
                Alright, I say ${this.prediction}! You can stop spinning now!
                `
                emotion = 'happy2';
                break;
            case DIALOG_EVENT.ROUND_PERFECT:
                dialog = `
                Hahahaha!!! A perfect score, what do you say about this?
                `
                emotion = 'happy'
                break;
            case DIALOG_EVENT.ROUND_GREAT:
                dialog = `
                Close to perfect... You could have stopped spinning a bit earlier ribbon girl,
                but I'm in a good mood so I'll forgive you for now.
                `
                emotion = 'surprised'
                break;
            case DIALOG_EVENT.ROUND_GOOD:
                dialog = `
                I thought I told you to stop spinning sooner! Oh well, I guess not everyone is perfect,
                especially not you. Don't mess up again ribbon girl.
                `
                emotion = 'neutral'
                break;
            case DIALOG_EVENT.ROUND_DECENT:
                dialog = `
                You're a bit slow aren't you? did you not hear me when I said ${this.prediction}?
                That was your signal to stop spinning!
                `
                emotion = 'annoyed'
                break;
            case DIALOG_EVENT.ROUND_MEDIOCRE:
                dialog = `
                WHY!!? Are you stupid? Did all the spinning turn your brain into mush?<br>
                Why do you like to spin so much anyways?<br>
                Why can't you just listen when I tell you to STOP SPINNING?!!<br>
                `
                emotion = 'angry'
                break;
            case DIALOG_EVENT.ROUND_FAIL:
                dialog = `
                I DON'T CARE ANYMORE! If you like to spin so much then I'll just
                make you spin and spin and spin and spin until you can't stand up anymore!
                And then I'll have you stand back up and spin a hundred more times!
                `
                emotion = 'angry2'
                break;
            case DIALOG_EVENT.ROUND_MISS:
                dialog = `
                HEY! You're too fast! You didn't even wait for my signal!
                `
                emotion = 'angry3'
                break;
            case DIALOG_EVENT.WAITING:
                dialog = `
                ...
                `
                emotion = 'neutral'
                break;
            default:
                return;
        }

        this.ui.say(dialog, this.faces.indexOf(emotion));
    }

    faces = [
        'angry',
        'angry2',
        'angry3',
        'annoyed',
        'annoyed2',
        'annoyed3',
        'frown',
        'happy',
        'happy2',
        'neutral',
        'ominous',
        'ominous2',
        'proud',
        'smug',
        'surprised',
    ]
}

export default FletaAI;
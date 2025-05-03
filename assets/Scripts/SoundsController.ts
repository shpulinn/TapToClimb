import { _decorator, Component, AudioClip, AudioSource, math } from 'cc';
const { ccclass, property } = _decorator;
const { randomRangeInt } = math;

@ccclass('SoundsController')
export class SoundsController extends Component {

    @property([AudioClip])
    private playerFootstepsAudioClips: AudioClip[] = [];

    private audioSource: AudioSource = null;

    start() {
        this.audioSource = this.getComponent(AudioSource);

        this.node.on('playerJumped', this.onPlayerJumped, this);
    }

    onPlayerJumped() {
        this.playRandomSound();
    }

    playRandomSound() {
        let rnd = randomRangeInt(0, this.playerFootstepsAudioClips.length);

        this.audioSource.clip = this.playerFootstepsAudioClips[rnd];

        this.audioSource.play();
    }
}
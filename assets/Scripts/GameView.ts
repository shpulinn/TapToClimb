import { _decorator, Component, director, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {
    @property(Label)
    private scoreLabel: Label = null;

    @property(Node)
    private gameOverPanel: Node = null;

    @property(Label)
    private gameOverScoreLabel: Label = null;

    public updateScore(score: number) {
        this.scoreLabel.string = `SCORE: ${score}`;
        tween()
            .target(this.scoreLabel.node)
            .to(.2, {
                scale: new Vec3(1.1, 1.1, 1),
            })
            .to(.2, {
                scale: new Vec3(1, 1, 1),
            })
            .start();
    }

    public loadMenu() {
        director.loadScene("MenuScene");
    }

    public restart() {
        director.loadScene("MainScene");
    }

    public showGameOver(score: number) {
        this.gameOverPanel.active = true;
        this.gameOverScoreLabel.string = `${score}`;
    }

    public showGame() {
        this.gameOverPanel.active = false;
    }
}
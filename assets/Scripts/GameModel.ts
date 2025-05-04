import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    private score: number = 0;

    public addScore(points: number) {
        if (points < 0) {
            console.log("can't add negative score")
            return;
        }
        this.score += points;
    }

    public getScore(): number {
        return this.score;
    }

    public resetScore() {
        this.score = 0;
    }
}
import { _decorator, Component, Node} from 'cc';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
const { ccclass, property } = _decorator;

enum GameState {
    Menu,
    Playing,
    GameOver
}

@ccclass('GameController')
export class GameController extends Component {
    @property(GameView)
    private view: GameView = null;

    @property(Node)
    private player: Node = null;

    private model: GameModel = new GameModel();
    private currentState: GameState = GameState.Menu;

    onLoad() {
        this.player.on('playerJumped', this.onPlayerJumped, this);
        this.player.on('playerDied', this.onPlayerDied, this);
        this.player.on('coinCollected', this.onCoinCollected, this);
        this.switchState(GameState.Playing);
    }

    private onCoinCollected() {
        if (this.currentState === GameState.Playing) {
            this.model.addScore(10);            
            this.view.updateScore(this.model.getScore());
        }
    }

    private onPlayerJumped() {
        if (this.currentState === GameState.Playing) {
            this.model.addScore(1);
            this.view.updateScore(this.model.getScore());
        }
    }

    private onPlayerDied() {
        this.switchState(GameState.GameOver);
    }

    private switchState(newState: GameState) {
        this.currentState = newState;
        switch (newState) {
            case GameState.Playing:
                this.view.showGame();
                break;
            case GameState.GameOver:
                this.view.showGameOver(this.model.getScore());
                break;
        }
    }
}
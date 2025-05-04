import { _decorator, Component, Button, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputController')
export class InputController extends Component {
    @property(Button)
    private leftButton: Button = null;

    @property(Button)
    private rightButton: Button = null;

    private moveDirection: number = 0;

    onLoad() {
        this.leftButton.node.on(Input.EventType.TOUCH_START, this.startMoveLeft, this);
        this.leftButton.node.on(Input.EventType.TOUCH_END, this.stopMove, this);
        this.rightButton.node.on(Input.EventType.TOUCH_START, this.startMoveRight, this);
        this.rightButton.node.on(Input.EventType.TOUCH_END, this.stopMove, this);
    }

    startMoveLeft() {
        this.moveDirection = -1;
        this.node.emit('moveInput', this.moveDirection);
    }

    startMoveRight() {
        this.moveDirection = 1;
        this.node.emit('moveInput', this.moveDirection);
    }

    stopMove() {
        this.moveDirection = 0;
        this.node.emit('moveInput', this.moveDirection);
    }

    onDisable(): void {
        this.leftButton.node.off(Input.EventType.TOUCH_START, this.startMoveLeft, this);
        this.leftButton.node.off(Input.EventType.TOUCH_END, this.stopMove, this);
        this.rightButton.node.off(Input.EventType.TOUCH_START, this.startMoveRight, this);
        this.rightButton.node.off(Input.EventType.TOUCH_END, this.stopMove, this);
    }
}
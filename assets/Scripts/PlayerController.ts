import { _decorator, Component, RigidBody2D, input, Input, EventTouch, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(RigidBody2D)
    private rigidBody: RigidBody2D = null;

    @property(Number)
    private jumpForce: number = 500;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.jump, this);
    }

    jump(event: EventTouch) {
        this.rigidBody.applyForceToCenter(new Vec2(0, this.jumpForce), true);
        this.node.emit('playerJumped');
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.jump, this);
    }
}
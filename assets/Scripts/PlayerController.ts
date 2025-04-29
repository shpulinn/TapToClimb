import { _decorator, Component, RigidBody2D, input, Input, EventTouch, Vec2, Node, Vec3, BoxCollider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(RigidBody2D)
    private rigidBody: RigidBody2D = null;

    @property(Number)
    private jumpForce: number = 500;

    @property(Number)
    private moveSpeed: number = 200;

    private moveDirection: number = 0;
    private isGrounded: boolean = false;
    private defaultParent: Node = null;
    private playerVisual: Node = null;

    onLoad() {
        this.defaultParent = this.node.parent;
        this.playerVisual = this.node.getChildByName("Visual");

        input.on(Input.EventType.TOUCH_START, this.jump, this);
        input.on(Input.EventType.TOUCH_MOVE, this.move, this);
        input.on(Input.EventType.TOUCH_END, this.stopMove, this);

        const collider = this.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    jump(event: EventTouch) {
        if (this.isGrounded) {
            this.rigidBody.applyForceToCenter(new Vec2(0, this.jumpForce), true);
            this.node.emit('playerJumped');
            this.isGrounded = false;
        }
    }

    move(event: EventTouch) {
        const touchX = event.getLocationX();
        const screenWidth = 720; // Разрешение экрана
        this.moveDirection = touchX < screenWidth / 2 ? -1 : 1;
        let scale = this.moveDirection > 0 ? new Vec3(1,1,1) : new Vec3(-1,1,1);
        this.playerVisual.scale = scale;
    }

    stopMove() {
        this.moveDirection = 0;
    }

    onBeginContact(selfCollider: any, otherCollider: any) {
        if (otherCollider.node.name === 'Platform') {
            const playerPos = this.node.getPosition();
            const platformPos = otherCollider.node.getPosition();
            if (playerPos.y > platformPos.y) {
                this.isGrounded = true;
                this.node.setParent(otherCollider.node);
            }
        }
        if (otherCollider.node.name === 'Spike') {
            this.node.emit('playerDied');
        }
    }

    onEndContact(selfCollider: any, otherCollider: any) {
        if (otherCollider.node.name === 'Platform') {
            this.isGrounded = false;
            this.node.setParent(this.defaultParent);
        }
    }

    update(deltaTime: number) {      
        if (this.moveDirection !== 0) {
            const velocity = this.rigidBody.linearVelocity;
            velocity.x = this.moveDirection * this.moveSpeed;
            this.rigidBody.linearVelocity = velocity;
        }

        if (this.node.getPosition().y < -800) {
            this.node.emit('playerDied');
        }
    }

    onCollisionEnter2D(other: any, self: any, contact: any) {  
        if (other.node.name === 'Platform') {             
            const velocity = this.rigidBody.linearVelocity;
            if (velocity.y > 0) {
                // Игрок движется вверх → игнорируем столкновение
                contact.disabled = true;
            }
        }
        if (other.node.name === 'Spike') {
            this.node.emit('playerDied');
        }
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.jump, this);
        input.off(Input.EventType.TOUCH_MOVE, this.move, this);
        input.off(Input.EventType.TOUCH_END, this.stopMove, this);
    }
}
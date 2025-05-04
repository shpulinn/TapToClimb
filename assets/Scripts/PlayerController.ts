import { _decorator, Component, RigidBody2D, EventTouch, Vec2, Node, Vec3, BoxCollider2D, Contact2DType, director, Director, Collider2D, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(RigidBody2D)
    private rigidBody: RigidBody2D = null;

    @property(CCFloat)
    private jumpForce: number = 500;

    @property(CCFloat)
    private moveSpeed: number = 200;

    private moveDirection: number = 0;
    private isGrounded: boolean = false;
    private defaultParent: Node = null;
    private playerVisual: Node = null;
    private collider: Collider2D = null;

    onLoad() {
        this.defaultParent = this.node.parent;
        this.playerVisual = this.node.getChildByName("Visual");

        this.collider = this.getComponent(BoxCollider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);

        this.node.on('moveInput', this.onMoveInput, this);
    }

    onMoveInput(direction: number) {
        if (direction !== this.moveDirection) {
            this.moveDirection = direction;
            this.playerVisual.scale = new Vec3(direction > 0 ? 1 : (direction < 0 ? -1 : this.playerVisual.scale.x), 1, 1);
        }
    }

    jump(event: EventTouch) {
        if (this.isGrounded) {
            this.rigidBody.applyForceToCenter(new Vec2(0, this.jumpForce), true);
            this.node.emit('playerJumped');
            this.isGrounded = false;
        }
    }

    stopMove() {
        this.moveDirection = 0;
    }

    onBeginContact(selfCollider: any, otherCollider: any) {
        if (otherCollider.node.name === 'Platform') {
            const playerPos = this.node.position;
            const platformPos = otherCollider.node.position;
            
            if (playerPos.y > platformPos.y && this.rigidBody.linearVelocity.y <= 0) {
                this.isGrounded = true;
                director.once(Director.EVENT_AFTER_PHYSICS, this.jump, this);
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
        if(this.rigidBody.linearVelocity.y >= 0) {
            this.collider.sensor = true;
        } else {
            this.collider.sensor = false;
        }

        if (this.moveDirection !== 0) {
            const velocity = this.rigidBody.linearVelocity;
            velocity.x = this.moveDirection * this.moveSpeed;
            this.rigidBody.linearVelocity = velocity;
        }

        if (this.node.position.y > 600) {
            this.node.setPosition(new Vec3(this.node.position.x, 600, this.node.position.z));
        }

        if (this.node.y < -800) {
            this.node.emit('playerDied');
        }
    }
}
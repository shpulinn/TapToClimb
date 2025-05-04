import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MenuBackgroundRepeat')
export class MenuBackgroundRepeat extends Component {
    @property(CCFloat)
    private returnPosition: number = 0;

    @property(CCFloat)
    private moveSpeed: number = 0;

    private defaultPosition: Vec3 = null;

    start() {
        this.defaultPosition = this.node.getPosition();
    }

    update(deltaTime: number) {
        let pos = this.node.getPosition();
        if (pos.y <= this.returnPosition) {
            this.node.setPosition(this.defaultPosition);
            return;
        }        
        pos.y -= this.moveSpeed * deltaTime;
        this.node.setPosition(pos);
    }
}



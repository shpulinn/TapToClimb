import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlatformController')
export class PlatformController extends Component {
    @property(Number)
    private speed: number = 100;

    update(deltaTime: number) {
        const pos = this.node.getPosition();
        pos.y -= this.speed * deltaTime;
        this.node.setPosition(pos);

        if (pos.y < -800) {
            this.node.destroy();
        }
    }
}
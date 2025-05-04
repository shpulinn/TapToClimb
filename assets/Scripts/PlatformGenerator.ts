import { _decorator, Component, Prefab, instantiate, Vec3, randomRange, CCInteger, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlatformGenerator')
export class PlatformGenerator extends Component {

    @property(Prefab)
    private platformPrefab: Prefab = null;

    @property(CCInteger)
    private spawnInterval: number = 2;

    @property(CCFloat)
    private minX: number = -300;

    @property(CCFloat)
    private maxX: number = 300;

    @property(CCFloat)
    private spawnY: number = 800;

    private timer: number = 0;

    update(deltaTime: number) {
        this.timer += deltaTime;
        if (this.timer >= this.spawnInterval) {
            this.spawnPlatform();
            this.timer = 0;
        }
    }

    spawnPlatform() {
        const platform = instantiate(this.platformPrefab);
        platform.setParent(this.node);
        const x = randomRange(this.minX, this.maxX);
        platform.setPosition(new Vec3(x, this.spawnY, 0));
    }
}
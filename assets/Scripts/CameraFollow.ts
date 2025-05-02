import { _decorator, Component, Node, Camera, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property({
        type: Node,
        tooltip: "Узел игрока, за которым будет следовать камера"
    })
    private target: Node = null;

    @property({
        tooltip: "Высота экрана, после которой камера начнет следовать за игроком (в процентах от высоты экрана, 0.5 = центр)"
    })
    private verticalOffset: number = 0.4;

    @property({
        tooltip: "Скорость плавного следования камеры (0 для мгновенного)"
    })
    private smoothSpeed: number = 5.0;

    @property({
        tooltip: "Следовать только вверх (не опускать камеру, когда игрок падает)"
    })
    private followOnlyUp: boolean = true;

    private initialPosition: Vec3 = new Vec3();
    private targetPosition: Vec3 = new Vec3();
    private viewHeight: number = 0;
    private highestY: number = 0;

    onLoad() {
        // Сохраняем начальную позицию камеры
        this.initialPosition = new Vec3(this.node.position);
        
        // Если цель не указана, попробуем найти игрока автоматически
        if (!this.target) {
            const player = this.node.scene.getChildByName('Canvas')?.getChildByName('Player');
            if (player) {
                this.target = player;
                console.log("Camera target automatically set to Player");
            } else {
                console.error("Camera target not set! Please assign player node in the inspector.");
            }
        }
        
        // Получаем примерную высоту видимой области
        const camera = this.getComponent(Camera);
        if (camera) {
            // Приблизительная высота видимой области (зависит от настроек камеры)
            this.viewHeight = camera.orthoHeight * 2;
            console.log("Camera view height:", this.viewHeight);
        } else {
            // Значение по умолчанию, если камера не найдена
            this.viewHeight = 960;
            console.warn("Camera component not found, using default view height");
        }
    }

    lateUpdate(deltaTime: number) {
        if (!this.target) return;
        
        const targetY = this.target.position.y;
        const cameraY = this.node.position.y;
        
        // Вычисляем порог для начала следования
        const threshold = cameraY + (this.verticalOffset * this.viewHeight);
        
        // Обновляем максимальную высоту игрока (для followOnlyUp)
        if (targetY > this.highestY) {
            this.highestY = targetY;
        }
        
        // Определяем целевую позицию Y для камеры
        let newY = cameraY;
        
        if (this.followOnlyUp) {
            // Следуем только когда игрок поднимается выше порога
            if (targetY > threshold) {
                newY = targetY - (this.verticalOffset * this.viewHeight);
            }
        } else {
            // Всегда следуем, даже когда игрок падает
            if (targetY > threshold || targetY < cameraY - (this.verticalOffset * this.viewHeight)) {
                newY = targetY - (this.verticalOffset * this.viewHeight);
            }
        }
        
        // Создаем целевую позицию, сохраняя X и Z координаты
        this.targetPosition.x = this.initialPosition.x;
        this.targetPosition.y = newY;
        this.targetPosition.z = this.initialPosition.z;
        
        // Применяем плавное движение если smoothSpeed > 0
        if (this.smoothSpeed > 0) {
            const currentPos = this.node.position;
            const smoothPos = new Vec3(
                currentPos.x,
                currentPos.y + (newY - currentPos.y) * Math.min(1, deltaTime * this.smoothSpeed),
                currentPos.z
            );
            this.node.position = smoothPos;
        } else {
            // Мгновенное перемещение
            this.node.position = this.targetPosition;
        }
    }
}
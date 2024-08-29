import Bullet from "./Bullet";

class Hero {
    #location: {x: number, y: number};
    #speed: number;
    #context: CanvasRenderingContext2D;
    #radius: number;
    #color: string;
    #bullets: Bullet[] = []
    #speedBullet: number;
    #bulletColor: string;
    #hit = 0;
    #shootFrequency = 500
    constructor(context: CanvasRenderingContext2D, location: {x: number, y: number}, color: string, speed: number, speedBullet: number, radius = 20) {
        this.#location = location;
        this.#speed = speed;
        this.#context = context;
        this.#radius = radius;
        this.#color = color;
        this.#bulletColor = color;
        this.#speedBullet = speedBullet;
    }

    get radius() {
        return this.#radius;
    }

    set radius(value) {
        if (value > 0) {
            this.#radius = value;
        } else {
            this.#radius = 20;
        }
    }

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }

    get shootFrequency() {
        return this.#shootFrequency;
    }

    set shootFrequency(value) {
        this.#shootFrequency = value;
    }

    get bulletColor() {
        return this.#bulletColor;
    }

    set bulletColor(value) {
        this.#bulletColor = value;
    }

    get hit() {
        return this.#hit;
    }

    set hit(value) {
        this.#hit = value;
    }

    get location(){
        return this.#location;
    }

    set location(location) {
        this.#location = location;
    }

    set speed(speed: number) {
        this.#speed = speed;
    }
    get speed(){
        return this.#speed;
    }

    shot() {
        this.#bullets.push(new Bullet(this.#context, {x: this.#location.x, y: this.#location.y}, this.#bulletColor, this.#speedBullet))
    }

    get bullets() {
        return this.#bullets
    }

    set bullets(bullets) {
        this.#bullets = bullets
    }

    show() {
        this.#context.beginPath();
        this.#context.arc(this.#location.x, this.#location.y, this.#radius, 0, Math.PI * 2);
        this.#context.fillStyle = this.#color;
        this.#context.fill();
        this.#context.closePath();

        this.#context.font = `${this.#radius}px Arial`;
        this.#context.fillStyle = 'white';
        this.#context.textAlign = 'center';
        this.#context.textBaseline = 'middle';
        this.#context.fillText(String(this.#hit), this.#location.x, this.#location.y);

        this.#bullets.forEach((bullet) => {
            bullet.location = {x: bullet.location.x + bullet.speed, y: bullet.location.y};
            bullet.show();
        })
    }
}
export default Hero;
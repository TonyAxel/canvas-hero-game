class Bullet {
    #location: {x: number, y: number};
    #speed: number;
    #context: CanvasRenderingContext2D;
    #radius: number;
    #color: string;
    constructor(context: CanvasRenderingContext2D, location: {x: number, y: number}, color: string, speed = 5, radius = 5) {
        this.#location = location;
        this.#speed = speed;
        this.#context = context;
        this.#radius = radius;
        this.#color = color;
    }

    get location(){
        return this.#location;
    }

    set location(location) {
        this.#location = location;
    }

    get radius() {
        return this.#radius;
    }

    set radius(value) {
        if (value > 0) {
            this.#radius = value;
        } else {
            this.#radius = 5;
        }
    }

    get color() {
        return this.#color;
    }

    set color(value) {
        this.#color = value;
    }
    set speed(speed: number) {
        this.#speed = speed;
    }
    get speed(){
        return this.#speed;
    }

    show() {
        this.#context.beginPath();
        this.#context.arc(this.#location.x, this.#location.y, this.#radius, 0, Math.PI * 2);
        this.#context.fillStyle = this.#color;
        this.#context.fill();
        this.#context.closePath();
    }
}

export default Bullet
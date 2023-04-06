interface FoodOptions {
    x: number;
    y: number;
    energy: number;
}

class Food {
    x: number;
    y: number;
    energy: number;

    constructor(options: FoodOptions) {
        this.x = options.x;
        this.y = options.y;
        this.energy = options.energy;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const size = 5; // You can adjust the food's size

        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; // You can adjust the food's color
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export default Food;

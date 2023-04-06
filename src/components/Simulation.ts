import Bacteria from './Bacteria';
import Food from './Food';
import { getRandomInt } from '../utils/helperFunctions';

interface SimulationOptions {
    canvas: HTMLCanvasElement;
    numBacteria: number;
    numFood: number;
}

class Simulation {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    bacteria: Bacteria[];
    food: Food[];
    uiVisible: boolean;
    startTime: number;
    elapsedTime: number;

    constructor(options: SimulationOptions) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.bacteria = this.generateBacteria(options.numBacteria);
        this.food = this.generateFood(options.numFood);
        this.uiVisible = false;
        this.startTime = Date.now();
        this.elapsedTime = 0;
    }

    generateBacteria(numBacteria: number): Bacteria[] {
        const bacteria: Bacteria[] = [];

        for (let i = 0; i < numBacteria; i++) {
            bacteria.push(
                new Bacteria({
                    x: getRandomInt(0, this.canvas.width),
                    y: getRandomInt(0, this.canvas.height),
                    direction: Math.random() * 2 * Math.PI,
                })
            );
        }

        return bacteria;
    }

    generateFood(numFood: number): Food[] {
        const food: Food[] = [];

        for (let i = 0; i < numFood; i++) {
            food.push(
                new Food({
                    x: getRandomInt(0, this.canvas.width),
                    y: getRandomInt(0, this.canvas.height),
                    energy: getRandomInt(10, 50),
                })
            );
        }

        return food;
    }

    spawnFood(): void {
        if (this.food.length < 10) {
            this.food.push(
                new Food({
                    x: getRandomInt(0, this.canvas.width),
                    y: getRandomInt(0, this.canvas.height),
                    energy: getRandomInt(10, 50),
                })
            );
        }
    }

    update(): void {
        this.bacteria.forEach((bacteria) => {
            const closestFood = this.food.reduce((closest, food) => {
                const distToBacteria = (f: Food) =>
                    Math.hypot(f.x - bacteria.x, f.y - bacteria.y);
                return distToBacteria(food) < distToBacteria(closest) ? food : closest;
            });

            const foodDirection = {
                dx: closestFood.x - bacteria.x,
                dy: closestFood.y - bacteria.y,
            };

            bacteria.update(foodDirection);

            // Check if bacteria has eaten food
            if (
                Math.hypot(closestFood.x - bacteria.x, closestFood.y - bacteria.y) < 5
            ) {
                bacteria.eat(closestFood.energy);
                this.food = this.food.filter((food) => food !== closestFood);
            }
        });

        this.spawnFood();
    }

    handleInput(key: string): void {
        switch (key) {
            case 'G':
                // Increase simulation speed
                break;
            case 'F':
                // Decrease simulation speed
                break;
            case 'H':
                // Reset simulation speed
                break;
            case ' ':
                // Pause the simulation
                break;
            case 'O':
                // Toggle circle around the oldest generation
                break;
            case 'B':
                // Toggle circle around the newest generation
                break;
            case 'U':
                this.uiVisible = !this.uiVisible;
                break;
            default:
                break;
        }
    }

    render(): void {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render the bacteria
        this.bacteria.forEach((bacteria) => bacteria.render(this.ctx));

        // Render the food
        this.food.forEach((food) => food.render(this.ctx));

        // Render UI if visible
        if (this.uiVisible) {
            this.renderUI();
        }
    }

    renderUI(): void {
        const elapsedTime = ((Date.now() - this.startTime) / 1000).toFixed(1);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 120, 50);

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`Elapsed Time: ${elapsedTime}s`, 20, 30);
        this.ctx.fillText(`Food Count: ${this.food.length}`, 20, 50);
    }

    run(): void {
        this.update();
        this.render();
        requestAnimationFrame(() => this.run());
    }
}

export default Simulation;

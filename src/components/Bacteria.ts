import NeuralNetwork from './NeuralNetwork';
import Food from './Food';

class Bacteria {
    x: number;
    y: number;
    direction: number;
    size: number;
    energy: number;
    brain: NeuralNetwork;
    generation: number;

    constructor(x: number, y: number, brain?: NeuralNetwork) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * Math.PI * 2;
        this.size = 10;
        this.energy = 100;
        this.generation = 1;

        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new NeuralNetwork(3, 8, 4);
        }
    }

    move(): void {
        this.x += Math.cos(this.direction);
        this.y += Math.sin(this.direction);
        this.energy -= 0.1;
    }

    think(foods: Food[]): void {
        const closestFood = this.findClosestFood(foods);
        const inputs = [
            this.direction / (Math.PI * 2),
            closestFood.distance / Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2),
            closestFood.angle / (Math.PI * 2),
        ];

        const outputs = this.brain.feedForward(inputs);
        const maxOutput = Math.max(...outputs);
        const outputIndex = outputs.indexOf(maxOutput);

        if (outputIndex === 0) {
            this.direction -= 0.1;
        } else if (outputIndex === 1) {
            this.direction += 0.1;
        } else if (outputIndex === 2) {
            this.move();
        } else if (outputIndex === 3) {
            this.energy -= 0.5;
            this.size += 0.1;
        }
    }

    eat(foods: Food[]): void {
        for (let i = foods.length - 1; i >= 0; i--) {
            const distance = Math.hypot(foods[i].x - this.x, foods[i].y - this.y);
            if (distance < this.size / 2) {
                this.energy += foods[i].energy;
                foods.splice(i, 1);
            }
        }
    }

    interactWith(bacteriaList: Bacteria[]): void {
        for (let i = bacteriaList.length - 1; i >= 0; i--) {
            if (bacteriaList[i] === this) continue;

            const distance = Math.hypot(bacteriaList[i].x - this.x, bacteriaList[i].y - this.y);
            if (distance < this.size / 2) {
                if (this.size > bacteriaList[i].size) {
                    this.energy += bacteriaList[i].energy * 0.5;
                    bacteriaList.splice(i, 1);
                } else {
                    bacteriaList[i].energy += this.energy * 0.5;
                    this.energy = 0;
                    break;
                }
            }
        }
    }

    findClosestFood(foods: Food[]): { distance: number; angle: number } {
        let minDistance = Infinity;
        let angle = 0;

        for (const food of foods) {
            const distance = Math.hypot(food.x - this.x, food.y - this.y);
            if (distance < minDistance) {
                minDistance = distance;
                angle = Math.atan2(food.y - this.y, food.x - this.x) - this.direction;
                angle = (angle + Math.PI * 2) % (Math.PI * 2);
            }
        }

        return { distance: minDistance, angle };
    }

    isDead(): boolean {
        return this.energy <= 0;
    }

    reproduce(): Bacteria | null {
        if (Math.random() < 0.001) {
            const childBrain = this.brain.copy();
            childBrain.mutate(0.1);
            const child = new Bacteria(this.x, this.y, childBrain);
            child.generation = this.generation + 1;
            return child;
        } else {
            return null;
        }
    }
}

export default Bacteria;


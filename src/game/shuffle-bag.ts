import { component } from "tsdi";
import * as Random from "random-seed";
import {
    Tetrimino,
    TetriminoI,
    TetriminoJ,
    TetriminoL,
    TetriminoO,
    TetriminoS,
    TetriminoT,
    TetriminoZ,
} from "./tetriminos";

@component
export class ShuffleBag {
    private sequence: Tetrimino[] = [];
    private random: Random.RandomSeed;

    public seed(seed = `${Math.random}`.replace(/\./, "")) {
        this.random = Random.create(seed);
        this.refill();
    }

    private shuffle<T>(array: T[]): T[] {
        const result: T[] = [];
        while (array.length > 0) {
            const [element] = array.splice(this.random.range(array.length), 1);
            result.push(element);
        }
        return result;
    }

    public take(): Tetrimino {
        if (!this.random) { throw new Error("Can't take from unitialized bag."); }
        const nextTetrimino = this.sequence.shift()!;
        if (this.sequence.length <= 7) { this.refill(); }
        nextTetrimino.refreshGhostPosition();
        return nextTetrimino;
    }

    public get preview(): Tetrimino[] {
        if (!this.random) { throw new Error("Can't peek into from unitialized bag."); }
        return this.sequence.slice(0, 6);
    }

    private refill() {
        this.sequence.push(...this.shuffle([
            new TetriminoI(),
            new TetriminoJ(),
            new TetriminoL(),
            new TetriminoO(),
            new TetriminoS(),
            new TetriminoT(),
            new TetriminoZ(),
        ]));
    }

    public reset(seed: string) {
        this.sequence = [];
        this.seed(seed);
    }
}

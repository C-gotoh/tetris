import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";

export class TetriminoMatrixO extends Matrix {
    constructor() {
        super(vec2(2, 2), matrixInitializer(CellColor.TETRIMINO_O, [
            1, 1,
            1, 1,
        ]));
    }
}

@external
export class TetriminoO extends Tetrimino {
    constructor(@inject config?: Config) {
        super(
            new TetriminoMatrixO(),
            config!.logicalSize.horizontalCenter().add(vec2(0, -2)),
        );
    }

    public rotateLeft() {
        return;
    }

    public rotateRight() {
        return;
    }
}

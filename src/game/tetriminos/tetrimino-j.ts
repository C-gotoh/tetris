import { external, inject } from "tsdi";
import { Matrix, vec2 } from "utils";
import { Config } from "config";
import { CellColor } from "types";
import { matrixInitializer } from "./matrix-initializer";
import { Tetrimino } from "./tetrimino";
import { Playfield } from "../playfield";

export class TetriminoMatrixJ extends Matrix {
    constructor() {
        super(vec2(3, 3), matrixInitializer(CellColor.TETRIMINO_J, [
            1, 0, 0,
            1, 1, 1,
            0, 0, 0,
        ]));
    }
}

@external
export class TetriminoJ extends Tetrimino {
    constructor(playfield: Playfield, @inject config?: Config) {
        super(
            new TetriminoMatrixJ(),
            config!.visibleSize.horizontalCenter().add(vec2(0, -3)),
            playfield,
        );
    }
}

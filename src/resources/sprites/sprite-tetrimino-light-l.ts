import { external } from "tsdi";
import { TintedSprite } from "./tinted-sprite";
import * as atlasTetriminoLight from "assets/tetrimino-light.json";

@external
export class SpriteTetriminoLightL extends TintedSprite {
    constructor() { super(atlasTetriminoLight, "hsl(26, 73%, 60%)"); }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const sprite_1 = require("./sprite");
const atlasTetriminoLight = require("../../assets/tetrimino-light.json");
let SpriteTetriminoLight = class SpriteTetriminoLight extends sprite_1.Sprite {
    constructor() { super(atlasTetriminoLight); }
};
SpriteTetriminoLight = __decorate([
    tsdi_1.external,
    __metadata("design:paramtypes", [])
], SpriteTetriminoLight);
exports.SpriteTetriminoLight = SpriteTetriminoLight;
//# sourceMappingURL=sprite-tetrimino-light.js.map
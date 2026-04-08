import Phaser from 'phaser';
export declare class GameScene extends Phaser.Scene {
    private cellGraphics;
    private unitSprites;
    private highlightGraphics;
    private lastState;
    constructor();
    create(): void;
    update(): void;
    private updateFromStore;
    private drawGrid;
    private drawUnits;
    private createUnitSprite;
    private updateUnitSprite;
    private drawHighlights;
    private handleCellClick;
    private lastHoveredPos;
    private handleCellHover;
}
//# sourceMappingURL=GameScene.d.ts.map
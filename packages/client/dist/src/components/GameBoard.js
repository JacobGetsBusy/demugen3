import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from '../scenes/GameScene.js';
export function GameBoard() {
    const containerRef = useRef(null);
    const gameRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current || gameRef.current)
            return;
        gameRef.current = new Phaser.Game({
            type: Phaser.AUTO,
            parent: containerRef.current,
            width: 30 * 24,
            height: 30 * 24,
            backgroundColor: '#0f0f1a',
            scene: [GameScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        });
        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);
    return (_jsx("div", { className: "flex items-center justify-center flex-1", children: _jsx("div", { ref: containerRef, className: "rounded-xl overflow-hidden shadow-2xl border border-white/5" }) }));
}
//# sourceMappingURL=GameBoard.js.map
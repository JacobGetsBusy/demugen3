import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GameBoard } from './GameBoard.js';
import { GameHUD } from './GameHUD.js';
import { BenchUnits } from './BenchUnits.js';
import { HoverPanel } from './HoverPanel.js';
export function GameScreen() {
    return (_jsxs("div", { className: "min-h-screen bg-mugen-bg flex", children: [_jsx(HoverPanel, {}), _jsx(GameBoard, {}), _jsx(BenchUnits, {}), _jsx(GameHUD, {})] }));
}
//# sourceMappingURL=GameScreen.js.map
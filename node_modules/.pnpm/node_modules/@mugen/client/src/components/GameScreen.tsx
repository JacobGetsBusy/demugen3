import { GameBoard } from './GameBoard.js';
import { GameHUD } from './GameHUD.js';
import { BenchUnits } from './BenchUnits.js';
import { HoverPanel } from './HoverPanel.js';

export function GameScreen() {
  return (
    <div className="min-h-screen bg-mugen-bg flex">
      <HoverPanel />
      <GameBoard />
      <BenchUnits />
      <GameHUD />
    </div>
  );
}

import { GameBoard } from './GameBoard.js';
import { GameHUD } from './GameHUD.js';

export function GameScreen() {
  return (
    <div className="min-h-screen bg-mugen-bg flex">
      <GameBoard />
      <GameHUD />
    </div>
  );
}

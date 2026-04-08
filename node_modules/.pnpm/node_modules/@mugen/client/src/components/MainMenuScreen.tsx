import { useGameStore } from '../store/game-store.js';
import { Play, Layers, BookOpen } from 'lucide-react';

export function MainMenuScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mugen-bg">
      <div className="bg-mugen-surface rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/5">
        <h1 className="text-5xl font-bold text-center mb-2 bg-gradient-to-r from-mugen-accent to-mugen-mana bg-clip-text text-transparent">
          MUGEN
        </h1>
        <p className="text-gray-400 text-center mb-10 text-sm">Strategy Card Game</p>

        <div className="space-y-4">
          <button
            onClick={() => setScreen('deck-select')}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-mugen-accent hover:bg-mugen-accent/80 rounded-lg font-semibold text-lg transition"
          >
            <Play size={20} /> Play
          </button>

          <button
            onClick={() => setScreen('deck-builder')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-mugen-surface border border-white/10 hover:border-mugen-accent/50 rounded-lg font-medium transition"
          >
            <Layers size={18} /> Deck Builder
          </button>

          <button
            onClick={() => setScreen('card-library')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-mugen-surface border border-white/10 hover:border-mugen-accent/50 rounded-lg font-medium transition"
          >
            <BookOpen size={18} /> Card Library
          </button>
        </div>
      </div>
    </div>
  );
}

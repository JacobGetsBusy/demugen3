import { useGameStore } from '../store/game-store.js';
import { useUnitHover } from '../hooks/useUnitHover.js';
import type { UnitCard } from '@mugen/shared';

export function BenchUnits() {
  const benchUnits = useGameStore(state => state.benchUnits);
  const { handleMouseEnter, handleMouseLeave } = useUnitHover();

  if (benchUnits.length === 0) {
    return (
      <div 
        data-testid="bench-units-container"
        className="fixed right-0 top-1/2 -translate-y-1/2 w-64 bg-gray-900/90 border-l border-white/10 p-4"
      >
        <div className="text-gray-400 text-sm">No bench units</div>
      </div>
    );
  }

  return (
    <div 
      data-testid="bench-units-container"
      className="fixed right-0 top-1/2 -translate-y-1/2 w-64 bg-gray-900/90 border-l border-white/10 p-4"
    >
      <h3 className="text-white font-bold mb-3 text-sm">Bench Units</h3>
      <div className="flex flex-col gap-2">
        {benchUnits.map((unit: UnitCard) => (
          <div
            key={unit.id}
            data-testid="bench-unit"
            className="bg-gray-800 border border-white/20 rounded p-3 cursor-pointer hover:bg-gray-700 hover:border-red-500 transition-colors"
            onMouseEnter={() => handleMouseEnter(unit)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-white font-semibold text-sm">{unit.name}</div>
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>HP: {unit.hp}</span>
              <span>ATK: {unit.atk}</span>
              <span>Cost: {unit.cost}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {unit.ability.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useGameStore } from '../store/game-store.js';
import { getUnitDisplayStats } from '../logic/hover-logic.js';
import { Heart, Swords, Move, Target, Zap, Coins } from 'lucide-react';

export function UnitStatsPanel() {
  const hoveredUnit = useGameStore((s) => s.hoveredUnit);

  if (!hoveredUnit) return null;

  const stats = getUnitDisplayStats(hoveredUnit);

  const hpPct = stats.maxHp > 0 ? (stats.hp / stats.maxHp) * 100 : 0;

  return (
    <div className="absolute left-0 top-20 w-56 p-4 pointer-events-none z-50">
      <div className="bg-mugen-surface/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-2xl">
        <h3 className="font-bold text-base text-white mb-3 truncate">{stats.name}</h3>

        {/* HP Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              <Heart size={12} className="text-mugen-danger" /> HP
            </span>
            <span className="font-mono">{stats.hp}/{stats.maxHp}</span>
          </div>
          <div className="h-2 bg-mugen-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                hpPct > 50 ? 'bg-mugen-success' : hpPct > 25 ? 'bg-mugen-gold' : 'bg-mugen-danger'
              }`}
              style={{ width: `${hpPct}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Swords size={14} className="text-mugen-gold" />
            <span className="text-gray-400 text-xs">ATK</span>
            <span className="font-bold ml-auto">{stats.atk}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Move size={14} className="text-mugen-mana" />
            <span className="text-gray-400 text-xs">MOV</span>
            <span className="font-bold ml-auto">{stats.movement}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Target size={14} className="text-mugen-accent" />
            <span className="text-gray-400 text-xs">RNG</span>
            <span className="font-bold ml-auto">{stats.range}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Coins size={14} className="text-mugen-gold" />
            <span className="text-gray-400 text-xs">Cost</span>
            <span className="font-bold ml-auto">{stats.cost}</span>
          </div>
        </div>

        {/* Ability */}
        <div className="border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={14} className="text-mugen-accent" />
            <span className="font-semibold text-sm">{stats.abilityName}</span>
            {stats.abilityCost > 0 && (
              <span className="ml-auto text-xs text-mugen-gold font-mono">{stats.abilityCost} LP</span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">{stats.abilityDescription}</p>
        </div>
      </div>
    </div>
  );
}

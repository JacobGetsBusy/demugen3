import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGameStore } from '../store/game-store.js';
import { useGameActions } from '../hooks/useGameActions.js';
import { TurnPhase } from '@mugen/shared';
import { Heart, Swords, Zap, ArrowRight, SkipForward, Shield } from 'lucide-react';
import { UnitStatsPanel } from './UnitStatsPanel.js';
const PHASE_LABELS = {
    [TurnPhase.MOVE]: 'Move Phase',
    [TurnPhase.ABILITY]: 'Ability Phase',
    [TurnPhase.ATTACK]: 'Attack Phase',
    [TurnPhase.END]: 'End Phase',
};
function UnitCard({ unit }) {
    const selectUnit = useGameStore((s) => s.selectUnit);
    const selectedUnitId = useGameStore((s) => s.selectedUnitId);
    const isSelected = selectedUnitId === unit.card.id;
    return (_jsxs("button", { onClick: () => selectUnit(isSelected ? null : unit.card.id), className: `flex flex-col items-start p-3 rounded-lg border transition text-left w-full ${isSelected
            ? 'border-mugen-accent bg-mugen-accent/10'
            : 'border-white/10 bg-mugen-bg hover:border-white/20'} ${unit.currentHp <= 0 ? 'opacity-30' : ''}`, children: [_jsx("span", { className: "font-semibold text-sm truncate w-full", children: unit.card.name }), _jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1 text-mugen-danger", children: [_jsx(Heart, { size: 10 }), " ", unit.currentHp, "/", unit.card.maxHp] }), _jsxs("span", { className: "flex items-center gap-1 text-mugen-gold", children: [_jsx(Swords, { size: 10 }), " ", unit.card.atk] }), _jsxs("span", { className: "flex items-center gap-1 text-mugen-mana", children: [_jsx(Shield, { size: 10 }), " ", unit.card.movement] })] })] }));
}
function HandDisplay() {
    const gameState = useGameStore((s) => s.gameState);
    const playerId = useGameStore((s) => s.playerId);
    const myPlayer = gameState?.players.find((p) => p.id === playerId);
    if (!myPlayer || myPlayer.hand.cards.length === 0) {
        return (_jsx("div", { className: "text-gray-500 text-sm italic p-2", children: "No cards in hand" }));
    }
    return (_jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: myPlayer.hand.cards.map((card) => (_jsxs("div", { className: "flex-shrink-0 w-28 bg-mugen-bg border border-white/10 rounded-lg p-2", children: [_jsx("div", { className: "font-medium text-xs truncate", children: card.name }), _jsxs("div", { className: "text-xs text-gray-400 mt-1", children: ["Cost: ", card.cost] })] }, card.id))) }));
}
function LifeCounter() {
    const gameState = useGameStore((s) => s.gameState);
    const playerId = useGameStore((s) => s.playerId);
    const myPlayer = gameState?.players.find((p) => p.id === playerId);
    const life = myPlayer?.life ?? 0;
    const maxLife = myPlayer?.maxLife ?? 24;
    const pct = maxLife > 0 ? (life / maxLife) * 100 : 0;
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Heart, { size: 20, className: life <= 5 ? 'text-mugen-danger animate-pulse' : 'text-mugen-danger' }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "h-2 bg-mugen-bg rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${pct > 50 ? 'bg-mugen-success' : pct > 25 ? 'bg-mugen-gold' : 'bg-mugen-danger'}`, style: { width: `${pct}%` } }) }) }), _jsx("span", { className: "text-sm font-mono font-bold", children: life })] }));
}
function TurnIndicator() {
    const gameState = useGameStore((s) => s.gameState);
    const { isMyTurn } = useGameActions();
    if (!gameState)
        return null;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const phase = PHASE_LABELS[gameState.turnPhase] ?? gameState.turnPhase;
    return (_jsx("div", { className: `rounded-lg px-4 py-2 text-sm font-medium ${isMyTurn ? 'bg-mugen-accent/20 text-mugen-accent border border-mugen-accent/30' : 'bg-mugen-bg text-gray-400 border border-white/5'}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { size: 14 }), _jsx("span", { children: isMyTurn ? 'Your Turn' : `${currentPlayer?.name}'s Turn` }), _jsxs("span", { className: "text-xs opacity-60", children: ["\u2022 ", phase] })] }) }));
}
function PhaseControls() {
    const { isMyTurn, sendAdvancePhase, sendEndTurn } = useGameActions();
    const gameState = useGameStore((s) => s.gameState);
    if (!gameState || !isMyTurn)
        return null;
    return (_jsxs("div", { className: "flex gap-2", children: [gameState.turnPhase !== TurnPhase.END && (_jsxs("button", { onClick: sendAdvancePhase, className: "flex items-center gap-1.5 px-4 py-2 bg-mugen-accent hover:bg-mugen-accent/80 rounded-lg text-sm font-medium transition", children: [_jsx(ArrowRight, { size: 14 }), " Next Phase"] })), _jsxs("button", { onClick: sendEndTurn, className: "flex items-center gap-1.5 px-4 py-2 bg-mugen-gold hover:bg-mugen-gold/80 text-black rounded-lg text-sm font-bold transition", children: [_jsx(SkipForward, { size: 14 }), " End Turn"] })] }));
}
export function GameHUD() {
    const gameState = useGameStore((s) => s.gameState);
    const playerId = useGameStore((s) => s.playerId);
    const error = useGameStore((s) => s.error);
    const clearError = useGameStore((s) => s.clearError);
    if (!gameState)
        return null;
    const myPlayer = gameState.players.find((p) => p.id === playerId);
    const opponents = gameState.players.filter((p) => p.id !== playerId);
    return (_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 p-4 pointer-events-auto", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsx(TurnIndicator, {}), _jsx("div", { className: "flex gap-2", children: opponents.map((p) => (_jsxs("div", { className: `bg-mugen-surface border border-white/5 rounded-lg px-3 py-2 text-sm ${p.isEliminated ? 'opacity-40 line-through' : ''}`, children: [_jsx("div", { className: "font-medium", children: p.name }), _jsxs("div", { className: "flex items-center gap-1 text-mugen-danger text-xs", children: [_jsx(Heart, { size: 10 }), " ", p.life] })] }, p.id))) })] }) }), _jsx(UnitStatsPanel, {}), _jsxs("div", { className: "absolute right-0 top-20 bottom-32 w-52 p-4 pointer-events-auto overflow-y-auto", children: [_jsx("h3", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2", children: "Units" }), _jsx("div", { className: "space-y-2", children: myPlayer?.units.filter((u) => u.currentHp > 0).map((u) => (_jsx(UnitCard, { unit: u }, u.card.id))) })] }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 pointer-events-auto", children: _jsx("div", { className: "bg-mugen-surface/90 backdrop-blur-sm rounded-xl border border-white/5 p-4", children: _jsxs("div", { className: "flex items-end justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2", children: "Hand" }), _jsx(HandDisplay, {})] }), _jsxs("div", { className: "flex flex-col items-end gap-3 flex-shrink-0", children: [_jsx("div", { className: "w-48", children: _jsx(LifeCounter, {}) }), _jsx(PhaseControls, {})] })] }) }) }), error && (_jsx("div", { className: "absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto", children: _jsxs("button", { onClick: clearError, className: "bg-mugen-danger/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg", children: [error, " \u2715"] }) }))] }));
}
//# sourceMappingURL=GameHUD.js.map
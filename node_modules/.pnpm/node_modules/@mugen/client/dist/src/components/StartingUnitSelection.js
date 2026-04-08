import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGameStore } from '../store/game-store.js';
import { CardType } from '@mugen/shared';
import { Coins, Users, Shield, Swords } from 'lucide-react';
export function StartingUnitSelection() {
    const { selectedDeck, startingUnits, setStartingUnits, confirmStartingUnits } = useGameStore();
    // Filter only unit cards from deck
    const availableUnits = selectedDeck?.filter(card => card.cardType === CardType.UNIT) || [];
    const totalCost = startingUnits.reduce((sum, unit) => sum + unit.cost, 0);
    const isValidSelection = startingUnits.length === 6 && totalCost < 40;
    const toggleUnitSelection = (unit) => {
        const isSelected = startingUnits.some(u => u.id === unit.id);
        if (isSelected) {
            // Remove from selection
            setStartingUnits(startingUnits.filter(u => u.id !== unit.id));
        }
        else if (startingUnits.length < 6) {
            // Add to selection
            setStartingUnits([...startingUnits, unit]);
        }
        // If already have 6, don't add more (could show toast)
    };
    const selectedUnitIds = new Set(startingUnits.map(u => u.id));
    return (_jsx("div", { className: "min-h-screen bg-mugen-bg text-white p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8 text-center", children: "Select 6 Starting Units" }), _jsxs("div", { className: "bg-mugen-surface/50 rounded-xl p-6 mb-8 border border-white/10", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { size: 20, className: "text-mugen-accent" }), _jsxs("span", { className: "font-semibold", children: ["Selected: ", startingUnits.length, " / 6"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Coins, { size: 20, className: "text-mugen-gold" }), _jsxs("span", { className: `font-semibold ${totalCost >= 40 ? 'text-mugen-danger' : 'text-mugen-gold'}`, children: ["Total Cost: ", totalCost, " / 40"] })] })] }), _jsx("button", { onClick: confirmStartingUnits, disabled: !isValidSelection, className: `px-6 py-2 rounded-lg font-semibold transition-colors ${isValidSelection
                                        ? 'bg-mugen-accent hover:bg-mugen-accent/80 text-white'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`, children: "Confirm Selection" })] }), totalCost >= 40 && (_jsx("div", { className: "text-mugen-danger text-sm", children: "Cost exceeds limit! Total must be less than 40." })), startingUnits.length > 6 && (_jsx("div", { className: "text-mugen-danger text-sm", children: "Too many units selected! Select exactly 6." }))] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: availableUnits.map((unit) => {
                        const isSelected = selectedUnitIds.has(unit.id);
                        return (_jsxs("div", { onClick: () => toggleUnitSelection(unit), className: `bg-mugen-surface/50 rounded-lg p-4 border cursor-pointer transition-all ${isSelected
                                ? 'border-mugen-accent shadow-lg shadow-mugen-accent/20'
                                : 'border-white/10 hover:border-white/30'}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "font-semibold text-sm truncate", children: unit.name }), _jsxs("div", { className: "flex items-center gap-1 text-mugen-gold", children: [_jsx(Coins, { size: 14 }), _jsx("span", { className: "text-xs font-mono", children: unit.cost })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Swords, { size: 12 }), _jsx("span", { children: unit.atk })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Shield, { size: 12 }), _jsx("span", { children: unit.hp })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { children: "MOV" }), _jsx("span", { children: unit.movement })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { children: "RNG" }), _jsx("span", { children: unit.range })] })] }), _jsx("div", { className: "mt-2 text-xs text-gray-500", children: _jsx("div", { className: "truncate", children: unit.ability.name }) }), isSelected && (_jsx("div", { className: "mt-2 text-xs text-mugen-accent font-semibold", children: "SELECTED" }))] }, unit.id));
                    }) }), startingUnits.length > 0 && (_jsxs("div", { className: "mt-8 bg-mugen-surface/30 rounded-xl p-6 border border-white/10", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Your Starting Units" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: startingUnits.map((unit, index) => (_jsx("div", { className: "text-center", children: _jsxs("div", { className: "bg-mugen-surface/50 rounded-lg p-3 border border-mugen-accent/50", children: [_jsx("div", { className: "font-semibold text-sm truncate", children: unit.name }), _jsxs("div", { className: "text-xs text-mugen-gold font-mono mt-1", children: [unit.cost, " LP"] }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: index < 3 ? 'Active' : 'Reserve' })] }) }, unit.id))) })] }))] }) }));
}
//# sourceMappingURL=StartingUnitSelection.js.map
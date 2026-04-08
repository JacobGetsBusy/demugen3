import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGameStore } from '../store/game-store.js';
import { useUnitHover } from '../hooks/useUnitHover.js';
export function BenchUnits() {
    const benchUnits = useGameStore(state => state.benchUnits);
    const { handleMouseEnter, handleMouseLeave } = useUnitHover();
    if (benchUnits.length === 0) {
        return (_jsx("div", { "data-testid": "bench-units-container", className: "fixed right-0 top-1/2 -translate-y-1/2 w-64 bg-gray-900/90 border-l border-white/10 p-4", children: _jsx("div", { className: "text-gray-400 text-sm", children: "No bench units" }) }));
    }
    return (_jsxs("div", { "data-testid": "bench-units-container", className: "fixed right-0 top-1/2 -translate-y-1/2 w-64 bg-gray-900/90 border-l border-white/10 p-4", children: [_jsx("h3", { className: "text-white font-bold mb-3 text-sm", children: "Bench Units" }), _jsx("div", { className: "flex flex-col gap-2", children: benchUnits.map((unit) => (_jsxs("div", { "data-testid": "bench-unit", className: "bg-gray-800 border border-white/20 rounded p-3 cursor-pointer hover:bg-gray-700 hover:border-red-500 transition-colors", onMouseEnter: () => handleMouseEnter(unit), onMouseLeave: handleMouseLeave, children: [_jsx("div", { className: "text-white font-semibold text-sm", children: unit.name }), _jsxs("div", { className: "flex justify-between text-xs text-gray-300 mt-1", children: [_jsxs("span", { children: ["HP: ", unit.hp] }), _jsxs("span", { children: ["ATK: ", unit.atk] }), _jsxs("span", { children: ["Cost: ", unit.cost] })] }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: unit.ability.name })] }, unit.id))) })] }));
}
//# sourceMappingURL=BenchUnits.js.map
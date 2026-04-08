import { create } from 'zustand';
const initialState = {
    playerId: null,
    playerName: '',
    lobbyCode: null,
    screen: 'main-menu',
    lobbyPlayers: [],
    selectedDeck: null,
    startingUnits: [],
    gameState: null,
    selectedUnitId: null,
    validMoves: [],
    hoveredUnit: null,
    hoveredCard: null,
    activeUnits: [],
    benchUnits: [],
    error: null,
};
export const useGameStore = create((set, get) => ({
    ...initialState,
    setPlayerId: (id) => set({ playerId: id }),
    setPlayerName: (name) => set({ playerName: name }),
    setLobbyCode: (code) => set({ lobbyCode: code }),
    setScreen: (screen) => set({ screen }),
    setLobbyPlayers: (players) => set({ lobbyPlayers: players }),
    setGameState: (state) => {
        set({ gameState: state });
        // Sync active and bench units from server-authoritative state
        const playerId = get().playerId;
        if (state && playerId) {
            // activeUnits = ALL players' placed units (needed for full board rendering)
            const allActiveUnits = state.players.flatMap(p => p.units);
            // benchUnits = local player's reserve units only
            const currentPlayer = state.players.find(p => p.id === playerId);
            const bench = currentPlayer ? currentPlayer.team.reserveUnits : [];
            set({
                activeUnits: allActiveUnits,
                benchUnits: bench,
            });
        }
    },
    selectUnit: (unitId) => set({ selectedUnitId: unitId }),
    setValidMoves: (moves) => set({ validMoves: moves }),
    clearValidMoves: () => set({ validMoves: [] }),
    setSelectedDeck: (deck) => set({ selectedDeck: deck }),
    setStartingUnits: (units) => set({ startingUnits: units }),
    confirmStartingUnits: () => {
        const { startingUnits, setScreen } = get();
        // Validate selection (redundant with UI validation but safe)
        if (startingUnits.length !== 6) {
            set({ error: 'Must select exactly 6 units' });
            return;
        }
        const totalCost = startingUnits.reduce((sum, unit) => sum + unit.cost, 0);
        if (totalCost >= 40) {
            set({ error: 'Total cost must be less than 40' });
            return;
        }
        // TODO: Send to server for actual game initialization
        // For now, transition to game screen
        console.log('Confirming starting units:', startingUnits);
        setScreen('game');
    },
    setHoveredUnit: (unit) => set({ hoveredUnit: unit }),
    clearHoveredUnit: () => set({ hoveredUnit: null }),
    setHoveredCard: (card) => set({ hoveredCard: card }),
    clearHoveredCard: () => set({ hoveredCard: null }),
    setActiveUnits: (units) => set({ activeUnits: units }),
    setBenchUnits: (units) => set({ benchUnits: units }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    reset: () => set(initialState),
}));
//# sourceMappingURL=game-store.js.map
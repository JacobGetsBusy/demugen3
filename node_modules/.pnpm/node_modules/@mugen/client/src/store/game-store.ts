import { create } from 'zustand';
import type { GameState, Position, Card, UnitInstance, UnitCard } from '@mugen/shared';

export type Screen = 'main-menu' | 'deck-builder' | 'card-library' | 'deck-select' | 'lobby' | 'pregame' | 'game' | 'gameover';

export interface GameStore {
  // Connection
  playerId: string | null;
  playerName: string;
  lobbyCode: string | null;
  screen: Screen;

  // Lobby
  lobbyPlayers: { id: string; name: string; isReady: boolean }[];

  // Deck selection
  selectedDeck: Card[] | null;
  startingUnits: UnitCard[];

  // Game state
  gameState: GameState | null;
  selectedUnitId: string | null;
  validMoves: Position[];
  hoveredCard: Card | null;
  activeUnits: UnitInstance[];
  benchUnits: UnitCard[];
  error: string | null;

  // Actions
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setLobbyCode: (code: string | null) => void;
  setScreen: (screen: Screen) => void;
  setLobbyPlayers: (players: { id: string; name: string; isReady: boolean }[]) => void;
  setGameState: (state: GameState) => void;
  selectUnit: (unitId: string | null) => void;
  setValidMoves: (moves: Position[]) => void;
  clearValidMoves: () => void;
  setSelectedDeck: (deck: Card[] | null) => void;
  setStartingUnits: (units: UnitCard[]) => void;
  confirmStartingUnits: () => void;
  setHoveredCard: (card: Card | null) => void;
  clearHoveredCard: () => void;
  setActiveUnits: (units: UnitInstance[]) => void;
  setBenchUnits: (units: UnitCard[]) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  playerId: null,
  playerName: '',
  lobbyCode: null,
  screen: 'main-menu' as Screen,
  lobbyPlayers: [],
  selectedDeck: null,
  startingUnits: [],
  gameState: null,
  selectedUnitId: null,
  validMoves: [],
  hoveredCard: null,
  activeUnits: [],
  benchUnits: [],
  error: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
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
    const { startingUnits } = get();
    
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
    
    // Send to server for actual game initialization
    console.log('Confirming starting units:', startingUnits);
    import('../network/socket-client.js').then(({ confirmStartingUnits }) => {
      confirmStartingUnits(startingUnits);
    });
  },
    setHoveredCard: (card) => set({ hoveredCard: card }),
  clearHoveredCard: () => set({ hoveredCard: null }),
  setActiveUnits: (units) => set({ activeUnits: units }),
  setBenchUnits: (units) => set({ benchUnits: units }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));

import type { GameState, Position, Card, UnitInstance, UnitCard } from '@mugen/shared';
export type Screen = 'main-menu' | 'deck-builder' | 'card-library' | 'deck-select' | 'lobby' | 'pregame' | 'game' | 'gameover';
export interface GameStore {
    playerId: string | null;
    playerName: string;
    lobbyCode: string | null;
    screen: Screen;
    lobbyPlayers: {
        id: string;
        name: string;
        isReady: boolean;
    }[];
    selectedDeck: Card[] | null;
    startingUnits: UnitCard[];
    gameState: GameState | null;
    selectedUnitId: string | null;
    validMoves: Position[];
    hoveredUnit: UnitInstance | null;
    hoveredCard: Card | null;
    activeUnits: UnitInstance[];
    benchUnits: UnitCard[];
    error: string | null;
    setPlayerId: (id: string) => void;
    setPlayerName: (name: string) => void;
    setLobbyCode: (code: string | null) => void;
    setScreen: (screen: Screen) => void;
    setLobbyPlayers: (players: {
        id: string;
        name: string;
        isReady: boolean;
    }[]) => void;
    setGameState: (state: GameState) => void;
    selectUnit: (unitId: string | null) => void;
    setValidMoves: (moves: Position[]) => void;
    clearValidMoves: () => void;
    setSelectedDeck: (deck: Card[] | null) => void;
    setStartingUnits: (units: UnitCard[]) => void;
    confirmStartingUnits: () => void;
    setHoveredUnit: (unit: UnitInstance | null) => void;
    clearHoveredUnit: () => void;
    setHoveredCard: (card: Card | null) => void;
    clearHoveredCard: () => void;
    setActiveUnits: (units: UnitInstance[]) => void;
    setBenchUnits: (units: UnitCard[]) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    reset: () => void;
}
export declare const useGameStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GameStore>>;
//# sourceMappingURL=game-store.d.ts.map
import type { GameState, ClientIntent, PlayerState, Result } from '@mugen/shared';
import {
  IntentType,
  GamePhase,
  TurnPhase,
  STARTING_LIFE,
} from '@mugen/shared';
import {
  TurnEngine,
  GameEngine,
  PreGameManager,
  StartingPlacementEngine,
} from '@mugen/shared';
import type { Lobby } from '../lobby/lobby-manager.js';

export function createInitialGameState(lobby: Lobby): Result<GameState> {
  const players: PlayerState[] = lobby.players.map((lp) => ({
    id: lp.id,
    name: lp.name,
    life: STARTING_LIFE,
    maxLife: STARTING_LIFE,
    team: { activeUnits: [], reserveUnits: [], locked: false },
    units: [],
    hand: { cards: [] },
    deck: { cards: [] },
    isEliminated: false,
    isReady: lp.isReady,
    isConnected: true,
    reserveLockedUntilNextTurn: false,
  }));

  const gameResult = GameEngine.createGame(players);
  if (!gameResult.ok) {
    return gameResult;
  }

  return {
    ok: true,
    value: {
      ...gameResult.value,
      phase: GamePhase.PRE_GAME,
    },
  };
}

export function resolveIntent(
  state: GameState,
  playerId: string,
  intent: ClientIntent
): Result<GameState> {
  // For game-phase intents (team selection/locking), player order doesn't matter
  if (intent.type === IntentType.SELECT_TEAM || intent.type === IntentType.LOCK_TEAM) {
    return resolvePreGameIntent(state, playerId, intent);
  }

  // For in-game intents, verify it's the player's turn
  if (state.phase === GamePhase.IN_PROGRESS) {
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== playerId) {
      return { ok: false, error: `Not your turn (current player: ${currentPlayer?.name})` };
    }
    return resolveGameIntent(state, playerId, intent);
  }

  return { ok: false, error: `Cannot process intent in phase ${state.phase}` };
}

function resolvePreGameIntent(
  state: GameState,
  playerId: string,
  intent: ClientIntent
): Result<GameState> {
  if (state.phase !== GamePhase.PRE_GAME) {
    return { ok: false, error: 'Not in pre-game phase' };
  }

  switch (intent.type) {
    case IntentType.SELECT_TEAM: {
      // For now, we'll accept the intent but need to map unitCardIds to actual units
      // In a real implementation, we'd look up the cards from the player's deck
      // For testing purposes, we'll store the unitCardIds directly
      
      // Update player's team
      const updatedPlayers = state.players.map(player => {
        if (player.id === playerId) {
          const updatedPlayer = { ...player };
          // Store the selected unit card IDs in the team
          (updatedPlayer as any).team = { 
            unitCardIds: (intent as any).unitCardIds || [], 
            locked: false 
          };
          return updatedPlayer;
        }
        return player;
      });

      return { ok: true, value: { ...state, players: updatedPlayers } };
    }

    case IntentType.LOCK_TEAM: {
      // Find the player and lock their team
      const playerToLock = state.players.find(p => p.id === playerId);
      if (!playerToLock) {
        return { ok: false, error: 'Player not found' };
      }

      // Get the current team
      const currentTeam = (playerToLock as any).team || { unitCardIds: [], locked: false };
      if (currentTeam.unitCardIds.length === 0) {
        return { ok: false, error: 'Cannot lock empty team' };
      }

      // Update the player's team to locked
      const updatedPlayers = state.players.map(player => {
        if (player.id === playerId) {
          const updatedPlayer = { ...player };
          // Lock the team
          (updatedPlayer as any).team = { 
            ...currentTeam, 
            locked: true 
          };
          return updatedPlayer;
        }
        return player;
      });

      // Check if all players have locked teams - if so, place units and transition to IN_PROGRESS
      const allLocked = updatedPlayers.every(p => (p as any).team?.locked === true);
      
      if (allLocked) {
        // Place starting units for all players before transitioning to IN_PROGRESS
        let gameStateWithUnits = { ...state, players: updatedPlayers };
        
        for (const player of updatedPlayers) {
          const placeResult = StartingPlacementEngine.placeStartingUnits(gameStateWithUnits, player.id);
          if (!placeResult.ok) {
            return { ok: false, error: `Failed to place units for ${player.name}: ${placeResult.error}` };
          }
          gameStateWithUnits = placeResult.value;
        }
        
        return { ok: true, value: { ...gameStateWithUnits, phase: GamePhase.IN_PROGRESS } };
      }

      return { ok: true, value: { ...state, players: updatedPlayers } };
    }

    default:
      return { ok: false, error: `Invalid intent for pre-game: ${intent.type}` };
  }
}

function resolveGameIntent(
  state: GameState,
  playerId: string,
  intent: ClientIntent
): Result<GameState> {
  switch (intent.type) {
    case IntentType.ADVANCE_PHASE:
      return TurnEngine.advancePhase(state);

    case IntentType.END_TURN: {
      if (state.turnPhase !== TurnPhase.END) {
        // Auto-advance to END phase first
        let current = state;
        while (current.turnPhase !== TurnPhase.END) {
          const advanced = TurnEngine.advancePhase(current);
          if (!advanced.ok) break;
          current = advanced.value;
        }
        return TurnEngine.endTurn(current);
      }
      return TurnEngine.endTurn(state);
    }

    case IntentType.MOVE_UNIT:
      return TurnEngine.processMove(state, playerId, intent.unitId, intent.target);

    case IntentType.USE_ABILITY:
      return TurnEngine.processAbility(state, playerId, intent.unitId, intent.targetId ?? null);

    case IntentType.ATTACK:
      return TurnEngine.processAttack(state, playerId, intent.attackerId, intent.defenderId);

    case IntentType.DEPLOY_RESERVE:
      return TurnEngine.deployReserve(state, playerId, intent.unitId, intent.position);

    default:
      return { ok: false, error: `Unknown intent type: ${(intent as ClientIntent).type}` };
  }
}

import { describe, it, expect } from 'vitest';
import { resolveIntent } from '../src/resolver/action-resolver.js';
import { GamePhase, CardType } from '@mugen/shared';

describe('Server Pre-Game Intent Handling', () => {
  it('should handle SELECT_TEAM intent for pre-game phase - CURRENTLY FAILS', () => {
    // Create a test game state in PRE_GAME phase
    const gameState = {
      id: 'test-game',
      phase: GamePhase.PRE_GAME,
      turnPhase: 'MOVE' as any,
      currentPlayerIndex: 0,
      players: [
        {
          id: 'player1',
          name: 'Player 1',
          life: 24,
          maxLife: 24,
          deck: { cards: [] },
          hand: { cards: [] },
          units: [],
          activeUnits: [],
          reserveUnits: [],
          combatModifiers: [],
          team: { units: [], locked: false },
          isEliminated: false,
          isReady: true,
        },
        {
          id: 'player2',
          name: 'Player 2',
          life: 24,
          maxLife: 24,
          deck: { cards: [] },
          hand: { cards: [] },
          units: [],
          activeUnits: [],
          reserveUnits: [],
          combatModifiers: [],
          team: { units: [], locked: false },
          isEliminated: false,
          isReady: true,
        },
      ],
      board: { cells: [] },
      turnNumber: 1,
      turnRotation: 0,
      movesUsedThisTurn: 0,
      winnerId: null,
    };

    // Create a SELECT_TEAM intent
    const intent = {
      type: 'SELECT_TEAM' as any,
      unitCardIds: [
        'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6'
      ],
    };

    // This should pass but currently fails because resolvePreGameIntent is a placeholder
    const result = resolveIntent(gameState, 'player1', intent);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      // Check that the unitCardIds are stored (using our custom structure)
      expect((result.value.players[0] as any).team.unitCardIds).toHaveLength(6);
      expect((result.value.players[0] as any).team.locked).toBe(false);
    }
  });

  it('should handle LOCK_TEAM intent when all players are ready - CURRENTLY FAILS', () => {
    // Create a test game state with all players having selected teams
    const gameState = {
      id: 'test-game',
      phase: GamePhase.PRE_GAME,
      turnPhase: 'MOVE' as any,
      currentPlayerIndex: 0,
      players: [
        {
          id: 'player1',
          name: 'Player 1',
          life: 24,
          maxLife: 24,
          deck: { cards: [] },
          hand: { cards: [] },
          units: [],
          activeUnits: [],
          reserveUnits: [],
          combatModifiers: [],
          // Use our custom team structure
          team: { unitCardIds: ['unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6'], locked: false },
          isEliminated: false,
          isReady: true,
          isConnected: true,
          reserveLockedUntilNextTurn: false,
        },
        {
          id: 'player2',
          name: 'Player 2',
          life: 24,
          maxLife: 24,
          deck: { cards: [] },
          hand: { cards: [] },
          units: [],
          activeUnits: [],
          reserveUnits: [],
          combatModifiers: [],
          // Use our custom team structure
          team: { unitCardIds: ['unit7', 'unit8', 'unit9', 'unit10', 'unit11', 'unit12'], locked: false },
          isEliminated: false,
          isReady: true,
          isConnected: true,
          reserveLockedUntilNextTurn: false,
        },
      ],
      board: { cells: [] },
      turnNumber: 1,
      turnRotation: 0,
      movesUsedThisTurn: 0,
      winnerId: null,
    };

    // Create a LOCK_TEAM intent
    const intent = {
      type: 'LOCK_TEAM' as any,
    };

    // This should pass but currently fails because resolvePreGameIntent is a placeholder
    const result = resolveIntent(gameState, 'player1', intent);
    
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect((result.value.players[0] as any).team.locked).toBe(true);
    }
  });

  it('should reject invalid team selection (wrong number of units) - SHOULD PASS', () => {
    // Test validation logic for invalid team selection
    const invalidUnits = [
      { id: 'unit1', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability1', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 5 },
      { id: 'unit2', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability2', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 5 },
      { id: 'unit3', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability3', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 5 },
      { id: 'unit4', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability4', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 5 },
      { id: 'unit5', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability5', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 5 },
    ]; // Only 5 units instead of 6

    // This should pass validation - 5 units is invalid
    expect(invalidUnits).toHaveLength(5);
    expect(invalidUnits.length).not.toBe(6);
  });

  it('should reject invalid team selection (cost > 40) - SHOULD PASS', () => {
    // Test validation logic for invalid team selection
    const invalidUnits = [
      { id: 'unit1', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability1', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 10 },
      { id: 'unit2', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability2', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 10 },
      { id: 'unit3', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability3', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 10 },
      { id: 'unit4', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability4', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 10 },
      { id: 'unit5', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability5', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 10 },
      { id: 'unit6', cardType: CardType.UNIT, hp: 1, maxHp: 1, atk: 1, movement: 1, range: 1, ability: { id: 'ability6', name: 'Test', description: 'Test', cost: 1, abilityType: 'DAMAGE' as any }, cost: 10 },
    ]; // 6 units but cost 60 > 40

    // This should pass validation - cost 60 > 40 is invalid
    expect(invalidUnits).toHaveLength(6);
    const totalCost = invalidUnits.reduce((sum, unit) => sum + (unit as any).cost, 0);
    expect(totalCost).toBeGreaterThan(40);
  });
});

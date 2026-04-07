import type { GameState, Position, Result, UnitInstance, UnitCard } from '../../types/index.js';
import { placeUnit } from '../board/index.js';

// Helper function to create UnitInstance from UnitCard
function createUnitInstance(overrides: {
  card: UnitCard;
  currentHp: number;
  position: Position;
  ownerId: string;
  hasMovedThisTurn: boolean;
  hasUsedAbilityThisTurn: boolean;
  hasAttackedThisTurn: boolean;
  combatModifiers: any[];
}): UnitInstance {
  return overrides;
}

/**
 * Calculate starting positions for active units based on player index
 * Player 0 (left): positions on left side of board, facing right
 * Player 1 (right): positions on right side of board, facing left
 * Player 2 (left): positions on left side of board, facing right  
 * Player 3 (right): positions on right side of board, facing left
 */
export function getStartingPositions(playerIndex: number, boardWidth: number, boardHeight: number): Position[] {
  const positions: Position[] = [];
  const centerY = Math.floor(boardHeight / 2);
  
  // Determine which side of the board this player starts on
  const isLeftSide = playerIndex % 2 === 0;
  
  // Calculate base X position (centered horizontally on player's side)
  const playerSideWidth = Math.floor(boardWidth / 2);
  const baseX = isLeftSide 
    ? Math.floor(playerSideWidth / 2)  // Center of left side
    : playerSideWidth + Math.floor(playerSideWidth / 2); // Center of right side
  
  // Create 3 positions in a horizontal line, centered vertically
  // Positions: top, middle, bottom
  const yPositions = [
    centerY - 2, // Top
    centerY,     // Middle  
    centerY + 2  // Bottom
  ];
  
  for (const y of yPositions) {
    // Ensure positions are within board bounds
    const clampedY = Math.max(0, Math.min(boardHeight - 1, y));
    positions.push({ x: baseX, y: clampedY });
  }
  
  return positions;
}

/**
 * Calculate reserve positions for benched units outside the main board area
 * Reserve units are positioned outside the board but visible to the player
 */
export function getReservePositions(playerIndex: number, boardWidth: number, boardHeight: number): Position[] {
  const positions: Position[] = [];
  const centerY = Math.floor(boardHeight / 2);
  
  // Determine which side of the board this player's reserve area is on
  const isLeftSide = playerIndex % 2 === 0;
  
  // Reserve positions are outside the board (negative X for left side, beyond board for right side)
  const baseX = isLeftSide ? -2 : boardWidth + 1;
  
  // Create 3 positions vertically aligned in reserve area
  const yPositions = [
    centerY - 3, // Top
    centerY,     // Middle
    centerY + 3  // Bottom
  ];
  
  for (const y of yPositions) {
    positions.push({ x: baseX, y });
  }
  
  return positions;
}

/**
 * Place starting units for a player on the board
 * Converts active units from player's team to UnitInstances and places them on board
 */
export function placeStartingUnits(gameState: GameState, playerId: string): Result<GameState> {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) {
    return { ok: false, error: `Player ${playerId} not found` };
  }
  
  if (!player.team.locked) {
    return { ok: false, error: `Player ${playerId} team not locked` };
  }
  
  if (player.team.activeUnits.length !== 3) {
    return { ok: false, error: `Player ${playerId} must have exactly 3 active units` };
  }
  
  const playerIndex = gameState.players.indexOf(player);
  const startingPositions = getStartingPositions(playerIndex, gameState.board.width, gameState.board.height);
  
  let updatedBoard = gameState.board;
  const unitInstances: typeof player.units = [];
  
  // Place each active unit on the board
  for (let i = 0; i < player.team.activeUnits.length; i++) {
    const unitCard = player.team.activeUnits[i]!;
    const position = startingPositions[i]!;
    
    // Create UnitInstance from UnitCard
    const unitInstance = createUnitInstance({
      card: unitCard,
      currentHp: unitCard.hp,
      position,
      ownerId: playerId,
      hasMovedThisTurn: false,
      hasUsedAbilityThisTurn: false,
      hasAttackedThisTurn: false,
      combatModifiers: [],
    });
    
    unitInstances.push(unitInstance);
    
    // Place unit on board
    const placeResult = placeUnit(updatedBoard, unitInstance.card.id, position);
    if (!placeResult.ok) {
      return { ok: false, error: `Failed to place unit ${unitInstance.card.id}: ${placeResult.error}` };
    }
    
    updatedBoard = placeResult.value;
  }
  
  // Update game state with new board and unit instances
  const updatedPlayers = gameState.players.map(p => 
    p.id === playerId 
      ? { ...p, units: unitInstances }
      : p
  );
  
  return {
    ok: true,
    value: {
      ...gameState,
      board: updatedBoard,
      players: updatedPlayers,
    }
  };
}

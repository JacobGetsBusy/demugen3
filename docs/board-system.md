# Board System Documentation

## Overview

The board system manages the game grid, unit placement, and spatial interactions in Mugen. It provides a 30×30 grid where units are positioned, moved, and interact during combat.

## Core Components

### Board State
- **Dimensions**: 30×30 grid (configurable via DEFAULT_BOARD_WIDTH/HEIGHT)
- **Cells**: Each cell can contain at most one unit
- **Coordinates**: (0,0) = top-left, (29,29) = bottom-right

### Unit Placement

#### Active Units
Active units are placed on the board grid using the BoardEngine:

```typescript
// Place unit at specific position
const result = placeUnit(boardState, unitId, { x: 5, y: 10 });
if (result.ok) {
  const updatedBoard = result.value;
}
```

#### Starting Unit Placement
Phase 9 introduced automatic starting unit placement:

```typescript
// Calculate positions for player's active units
const positions = getStartingPositions(playerIndex, boardWidth, boardHeight);

// Place all starting units for a player
const result = placeStartingUnits(gameState, playerId);
```

### Positioning Logic

#### Active Unit Positions
- **Player 0 & 2** (left side): X = floor(boardWidth/4)
- **Player 1 & 3** (right side): X = floor(3*boardWidth/4)
- **Y positions**: [centerY-2, centerY, centerY+2] (top, middle, bottom)
- **Example**: 30×30 board, Player 1 gets positions at (7,13), (7,15), (7,17)

#### Reserve Unit Positions
- **Player 0 & 2** (left side): X = -2 (outside board)
- **Player 1 & 3** (right side): X = boardWidth + 1 (outside board)
- **Y positions**: [centerY-3, centerY, centerY+3]
- **Example**: 30×30 board, Player 1 gets positions at (-2,12), (-2,15), (-2,18)

## Board Engine Functions

### Core Operations

#### `createBoardState(width, height)`
Creates an empty board with specified dimensions.

#### `placeUnit(board, unitId, position)`
Places a unit at the given position if the cell is empty and in bounds.

#### `removeUnit(board, position)`
Removes a unit from the given position.

#### `moveUnit(board, from, to, movementRange)`
Moves a unit within movement range if target is valid and unoccupied.

#### `getValidMoves(board, position, movementRange)`
Returns all valid positions a unit can move to within range.

#### `getUnitAt(board, position)`
Returns the unit ID at the given position, or null if empty.

#### `getUnitsForPlayer(board, playerIdPrefix)`
Returns all units belonging to a specific player.

### Starting Placement Functions (Phase 9)

#### `getStartingPositions(playerIndex, boardWidth, boardHeight)`
Calculates 3 positions for active units on player's side of board.

#### `getReservePositions(playerIndex, boardWidth, boardHeight)`
Calculates 3 positions for reserve units outside board bounds.

#### `placeStartingUnits(gameState, playerId)`
Places all active units for a player and updates game state.

## Spatial Relationships

### Movement Range
- Units can move up to their movement stat in Manhattan distance
- Movement is blocked by other units
- Cannot move outside board boundaries

### Combat Range
- Units can attack targets within their attack range
- Range is calculated as Manhattan distance
- Typical range: 1 (adjacent cells)

### Board Zones
- **Left Half**: X < 15 (Players 0 & 2 starting area)
- **Right Half**: X >= 15 (Players 1 & 3 starting area)
- **Center Area**: X between 10-20 (contested zone)
- **Reserve Areas**: X < 0 or X >= 30 (outside board)

## Integration Points

### With Combat Engine
- Board provides unit positions for combat calculations
- Combat results update board state (unit removal)

### With Turn Engine
- Turn validation checks unit positions on board
- Move phase uses board movement validation

### With Client Rendering
- GameScene renders board grid and unit sprites
- Hover interactions use board position lookup

### With Multiplayer
- Board state synchronized across all clients
- Position updates broadcast via WebSocket

## Error Handling

### Common Errors
- **Out of bounds**: Position outside 0-29 range
- **Cell occupied**: Target position already has unit
- **Unit not found**: No unit at source position
- **Invalid movement**: Target outside movement range

### Validation
All board operations return `Result<T, Error>` type for consistent error handling.

## Performance Considerations

### Board Size
- 30×30 = 900 cells, manageable for real-time updates
- Grid operations are O(1) for direct access
- Range calculations are O(movementRange²) worst case

### Optimization Opportunities
- Spatial partitioning for large boards
- Cached movement calculations
- Incremental board updates

## Testing

### Board Tests (`engines/board.test.ts`)
- Grid creation and boundary validation
- Unit placement and removal
- Movement validation and range calculation
- Player unit lookup

### Starting Placement Tests (`starting-card-placement.test.ts`)
- Active unit positioning (5 tests)
- Reserve unit positioning (5 tests)  
- Edge cases and multiplayer sync (2 tests)

## Future Enhancements

### Potential Features
- Terrain effects on movement/combat
- Obstacles and impassable terrain
- Zone-based bonuses or effects
- Dynamic board size support

### Refactoring Opportunities
- Extract positioning constants to configuration
- Add board visualization tools
- Implement board state diff tracking
- Add board replay/recording system

# UI Hand & Reserve Area Documentation

## Overview

The UI hand system manages the visual presentation of cards in the Mugen game client, including the player's hand, reserve area, and card interactions. This documentation covers the rendering and interaction systems for cards both in-hand and on the board/reserve areas.

## Core Components

### Hand Display
- **Hand Size**: 4 cards maximum
- **Position**: Bottom of game screen
- **Layout**: Horizontal row with card overlap
- **Interaction**: Click to select, hover for details

### Reserve Area (Phase 9)
- **Location**: Outside board bounds (left/right of main game area)
- **Content**: 3 benched units per player
- **Layout**: Vertical column with spacing
- **State**: Visible but inactive until deployment

### Board Units
- **Location**: On 30×30 game grid
- **Content**: Active units during gameplay
- **Layout**: Grid-based positioning
- **Interaction**: Click to select, hover for stats

## Rendering Systems

### Phaser.js Integration

#### GameScene Rendering
```typescript
// Active units rendered on board
private drawUnits(state: GameState) {
  state.players.forEach((player, playerIndex) => {
    player.units.forEach((unit: UnitInstance) => {
      if (unit.position && unit.currentHp > 0) {
        // Render unit sprite at board position
        const px = unit.position.x * CELL_SIZE + CELL_SIZE / 2;
        const py = unit.position.y * CELL_SIZE + CELL_SIZE / 2;
        // ... sprite creation and positioning
      }
    });
  });
}
```

#### Reserve Area Rendering
```typescript
// Reserve units rendered outside board (Phase 9)
private drawReserveUnits(state: GameState) {
  state.players.forEach((player, playerIndex) => {
    const reservePositions = getReservePositions(playerIndex, boardWidth, boardHeight);
    player.team.reserveUnits.forEach((unit, index) => {
      const pos = reservePositions[index];
      // Render in UI layer outside game canvas
      // ... reserve sprite creation
    });
  });
}
```

### React Components

#### Hand Components
- **HandPanel**: Displays current hand cards
- **CardItem**: Individual card rendering
- **CardTooltip**: Hover details and stats

#### Reserve Components (Planned)
- **ReservePanel**: Displays benched units
- **ReserveUnit**: Individual reserve unit rendering
- **DeployButton**: Unit deployment controls

## Interaction Systems

### Hover Interactions

#### Board Unit Hover
```typescript
// GameScene pointer move handling
private handleCellHover(pos: Position) {
  const cell = state.board.cells[pos.y]?.[pos.x];
  if (cell && cell.occupantId) {
    // Find unit and set hover state
    store.setHoveredUnit(unit);
  }
}
```

#### Reserve Unit Hover (Phase 9)
```typescript
// Reserve area hover handling
private handleReserveHover(unit: UnitCard) {
  // Show unit stats and deployment options
  store.setHoveredReserveUnit(unit);
}
```

### Click Interactions

#### Unit Selection
```typescript
// Board unit selection
container.on('pointerdown', () => {
  if (store.selectedUnitId === unit.card.id) {
    store.selectUnit(null);
  } else {
    store.selectUnit(unit.card.id);
  }
});
```

#### Reserve Unit Deployment (Planned)
```typescript
// Reserve unit deployment
const deployUnit = (unitId: string) => {
  // Check deployment conditions
  // Find valid deployment positions
  // Execute deployment action
};
```

## State Management

### Zustand Store Integration

#### Game Store State
```typescript
interface GameStore {
  // Existing state
  selectedUnitId: string | null;
  hoveredUnit: UnitInstance | null;
  
  // Phase 9 additions
  hoveredReserveUnit: UnitCard | null;
  selectedReserveUnitId: string | null;
  reserveUnitsVisible: boolean;
}
```

#### Actions
```typescript
// Reserve unit interactions
setHoveredReserveUnit: (unit: UnitCard | null) => void;
selectReserveUnit: (unitId: string | null) => void;
toggleReserveVisibility: () => void;
deployReserveUnit: (unitId: string, targetPosition: Position) => void;
```

## Visual Design

### Card Styling

#### Active Units
- **Size**: 24×24 pixel sprites
- **Border**: White outline with player color tint
- **HP Bar**: Color-coded health indicator
- **Initial**: Unit name initial for identification

#### Reserve Units (Phase 9)
- **Size**: Same as active units (24×24)
- **Border**: Grayed out to indicate inactive state
- **Background**: Darker tint to distinguish from active
- **Position**: Outside board with visual separator

#### Hand Cards
- **Size**: Variable based on card type
- **Layout**: Overlapping horizontal row
- **Highlight**: Glow effect on hover
- **Selection**: Border highlight when selected

### Color Coding

#### Player Colors
- **Player 1**: Blue (#6366f1)
- **Player 2**: Red (#ef4444)  
- **Player 3**: Green (#22c55e)
- **Player 4**: Orange (#f59e0b)

#### State Indicators
- **Active**: Full opacity, bright colors
- **Reserve**: 70% opacity, muted colors
- **Selected**: Yellow border glow
- **Hovered**: White outline

## Performance Considerations

### Rendering Optimization
- **Sprite Pooling**: Reuse sprite objects
- **Dirty Flagging**: Only update changed units
- **Viewport Culling**: Don't render off-screen units
- **Batch Rendering**: Group similar draw operations

### Interaction Optimization
- **Hover Debouncing**: Prevent excessive hover updates
- **Click Cooldown**: Prevent rapid clicking
- **State Throttling**: Limit state update frequency

## Accessibility

### Visual Accessibility
- **High Contrast**: Clear borders and backgrounds
- **Color Blind Friendly**: Use patterns + colors
- **Text Size**: Readable fonts for card details
- **Focus Indicators**: Clear selection states

### Interaction Accessibility
- **Keyboard Navigation**: Arrow keys for unit selection
- **Screen Reader Support**: Alt text for card information
- **Click Targets**: Minimum 24×24 pixel hit areas
- **Tooltips**: Detailed information on hover

## Testing

### Unit Tests
- **Rendering Tests**: Verify sprite creation and positioning
- **Interaction Tests**: Click and hover event handling
- **State Tests**: Store updates and synchronization

### Integration Tests
- **Board Integration**: Unit placement and movement
- **Reserve Integration**: Reserve area rendering and interaction
- **Multiplayer Tests**: State synchronization across clients

### Visual Tests
- **Screenshot Tests**: Verify visual appearance
- **Interaction Tests**: User interaction flows
- **Responsive Tests**: Different screen sizes

## Future Enhancements

### Visual Improvements
- **Card Animations**: Smooth transitions and effects
- **Particle Effects**: Combat and ability visualizations
- **Dynamic Lighting**: Shadow and lighting effects
- **Card Backs**: Hidden card information

### Interaction Improvements
- **Drag and Drop**: Intuitive unit deployment
- **Gesture Support**: Touch and mobile interactions
- **Voice Commands**: Accessibility enhancements
- **Hotkeys**: Keyboard shortcuts for common actions

### UI Enhancements
- **Minimap**: Overview of board state
- **Timeline**: Turn history and future actions
- **Chat Integration**: Player communication
- **Spectator Mode**: Watch games without participating

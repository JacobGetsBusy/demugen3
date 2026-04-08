import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../src/store/game-store.js';
import { CardType, AbilityType } from '@mugen/shared';
const mockUnit = {
    card: {
        id: 'unit-1',
        name: 'Fire Warrior',
        cardType: CardType.UNIT,
        hp: 10,
        maxHp: 10,
        atk: 4,
        movement: 2,
        range: 1,
        ability: {
            id: 'a1',
            name: 'Fireball',
            description: 'Deals 3 damage',
            cost: 2,
            abilityType: AbilityType.DAMAGE,
        },
        cost: 5,
    },
    currentHp: 10,
    position: { x: 3, y: 4 },
    ownerId: 'p1',
    hasMovedThisTurn: false,
    hasUsedAbilityThisTurn: false,
    hasAttackedThisTurn: false,
    combatModifiers: [],
};
describe('GameStore — hover', () => {
    beforeEach(() => {
        useGameStore.getState().reset();
    });
    it('hoveredUnit is null by default', () => {
        expect(useGameStore.getState().hoveredUnit).toBeNull();
    });
    it('setHoveredUnit sets the hovered unit', () => {
        useGameStore.getState().setHoveredUnit(mockUnit);
        expect(useGameStore.getState().hoveredUnit).toEqual(mockUnit);
    });
    it('clearHoveredUnit resets to null', () => {
        useGameStore.getState().setHoveredUnit(mockUnit);
        useGameStore.getState().clearHoveredUnit();
        expect(useGameStore.getState().hoveredUnit).toBeNull();
    });
    it('reset clears hoveredUnit', () => {
        useGameStore.getState().setHoveredUnit(mockUnit);
        useGameStore.getState().reset();
        expect(useGameStore.getState().hoveredUnit).toBeNull();
    });
    it('rapid hover changes — last value wins', () => {
        const unit2 = {
            ...mockUnit,
            card: { ...mockUnit.card, id: 'unit-2', name: 'Ice Mage' },
        };
        useGameStore.getState().setHoveredUnit(mockUnit);
        useGameStore.getState().setHoveredUnit(unit2);
        expect(useGameStore.getState().hoveredUnit?.card.id).toBe('unit-2');
    });
});
//# sourceMappingURL=hover-store.test.js.map
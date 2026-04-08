export function getUnitDisplayStats(unit) {
    const { card } = unit;
    return {
        name: card.name,
        hp: unit.currentHp,
        maxHp: card.maxHp,
        atk: card.atk,
        movement: card.movement,
        range: card.range,
        cost: card.cost,
        abilityName: card.ability.name,
        abilityDescription: card.ability.description,
        abilityCost: card.ability.cost,
        abilityType: card.ability.abilityType,
    };
}
//# sourceMappingURL=hover-logic.js.map
import type { UnitCard } from '@mugen/shared';
/**
 * Reusable hover handlers for unit cards
 * Centralizes hover logic to prevent duplication across components
 */
export declare function useUnitHover(): {
    handleMouseEnter: (card: UnitCard) => void;
    handleMouseLeave: () => void;
};
/**
 * Hover props that can be spread onto React elements
 * Usage: {...getHoverProps(card)}
 */
export declare function getHoverProps(card: UnitCard): {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
};
//# sourceMappingURL=useUnitHover.d.ts.map
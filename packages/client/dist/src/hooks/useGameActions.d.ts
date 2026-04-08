import type { Position } from '@mugen/shared';
export declare function useGameActions(): {
    isMyTurn: boolean;
    sendMove: (unitId: string, target: Position) => void;
    sendAbility: (unitId: string, targetId?: string) => void;
    sendAttack: (attackerId: string, defenderId: string) => void;
    sendAdvancePhase: () => void;
    sendEndTurn: () => void;
    sendDeployReserve: (unitId: string, position: Position) => void;
};
//# sourceMappingURL=useGameActions.d.ts.map
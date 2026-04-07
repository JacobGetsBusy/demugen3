export function sanitizeForPlayer(state, playerId) {
    const sanitizedPlayers = state.players.map((p) => {
        if (p.id === playerId) {
            return p;
        }
        return {
            ...p,
            hand: { cards: [] },
            deck: { cards: [] },
        };
    });
    return {
        ...state,
        players: sanitizedPlayers,
    };
}
//# sourceMappingURL=sanitize.js.map
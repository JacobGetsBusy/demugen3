import type { GameState, PlayerState } from '@mugen/shared';

export function sanitizeForPlayer(state: GameState, playerId: string): GameState {
  const sanitizedPlayers = state.players.map((p): PlayerState => {
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

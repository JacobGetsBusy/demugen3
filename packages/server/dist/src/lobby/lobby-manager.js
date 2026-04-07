import { MAX_PLAYERS, MIN_PLAYERS } from '@mugen/shared';
function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}
export function createLobby(hostId, hostName) {
    return {
        code: generateCode(),
        hostId,
        players: [{ id: hostId, name: hostName, isReady: false }],
        gameStarted: false,
        disbanded: false,
    };
}
export function joinLobby(lobby, playerId, playerName) {
    if (lobby.gameStarted) {
        return { ok: false, error: 'Game has already started' };
    }
    if (lobby.players.length >= MAX_PLAYERS) {
        return { ok: false, error: `Lobby is full (max ${MAX_PLAYERS} players)` };
    }
    const exists = lobby.players.some((p) => p.id === playerId);
    if (exists) {
        return { ok: false, error: 'Player already in lobby' };
    }
    return {
        ok: true,
        value: {
            ...lobby,
            players: [...lobby.players, { id: playerId, name: playerName, isReady: false }],
        },
    };
}
export function setReady(lobby, playerId, ready) {
    const playerIdx = lobby.players.findIndex((p) => p.id === playerId);
    if (playerIdx === -1) {
        return { ok: false, error: `Player ${playerId} not found in lobby` };
    }
    const newPlayers = lobby.players.map((p) => p.id === playerId ? { ...p, isReady: ready } : p);
    return {
        ok: true,
        value: { ...lobby, players: newPlayers },
    };
}
export function leaveLobby(lobby, playerId) {
    if (playerId === lobby.hostId) {
        return {
            ok: true,
            value: { ...lobby, disbanded: true },
        };
    }
    const newPlayers = lobby.players.filter((p) => p.id !== playerId);
    return {
        ok: true,
        value: { ...lobby, players: newPlayers },
    };
}
export function startGame(lobby) {
    if (lobby.players.length < MIN_PLAYERS) {
        return { ok: false, error: `Need at least ${MIN_PLAYERS} players to start` };
    }
    const allReady = lobby.players.every((p) => p.isReady);
    if (!allReady) {
        return { ok: false, error: 'All players must be ready to start' };
    }
    return {
        ok: true,
        value: { ...lobby, gameStarted: true },
    };
}
//# sourceMappingURL=lobby-manager.js.map
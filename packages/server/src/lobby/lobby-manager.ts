import type { Result } from '@mugen/shared';
import { MAX_PLAYERS, MIN_PLAYERS } from '@mugen/shared';

export interface LobbyPlayer {
  id: string;
  name: string;
  isReady: boolean;
}

export interface Lobby {
  code: string;
  hostId: string;
  players: LobbyPlayer[];
  gameStarted: boolean;
  disbanded: boolean;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createLobby(hostId: string, hostName: string): Lobby {
  return {
    code: generateCode(),
    hostId,
    players: [{ id: hostId, name: hostName, isReady: false }],
    gameStarted: false,
    disbanded: false,
  };
}

export function joinLobby(lobby: Lobby, playerId: string, playerName: string): Result<Lobby> {
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

export function setReady(lobby: Lobby, playerId: string, ready: boolean): Result<Lobby> {
  const playerIdx = lobby.players.findIndex((p) => p.id === playerId);
  if (playerIdx === -1) {
    return { ok: false, error: `Player ${playerId} not found in lobby` };
  }

  const newPlayers = lobby.players.map((p) =>
    p.id === playerId ? { ...p, isReady: ready } : p
  );

  return {
    ok: true,
    value: { ...lobby, players: newPlayers },
  };
}

export function leaveLobby(lobby: Lobby, playerId: string): Result<Lobby> {
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

export function startGame(lobby: Lobby): Result<Lobby> {
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

import { Server as SocketServer, Socket } from 'socket.io';
import type { GameState, ClientIntent } from '@mugen/shared';
import type { ServerState } from '../state/game-store.js';
import {
  createLobby,
  joinLobby,
  setReady,
  leaveLobby,
  startGame,
} from '../lobby/lobby-manager.js';
import type { Lobby } from '../lobby/lobby-manager.js';
import { resolveIntent, createInitialGameState } from '../resolver/action-resolver.js';
import { sanitizeForPlayer } from '../resolver/sanitize.js';

export function setupGateway(io: SocketServer, state: ServerState): void {
  io.on('connection', (socket: Socket) => {
    const playerId = socket.id;

    socket.emit('connected', { playerId });

    socket.on('create_lobby', (data: { name: string }) => {
      const lobby = createLobby(playerId, data.name);
      state.lobbies.set(lobby.code, lobby);
      state.playerToLobby.set(playerId, lobby.code);
      socket.join(lobby.code);
      socket.emit('lobby_created', { code: lobby.code, lobby });
    });

    socket.on('join_lobby', (data: { code: string; name: string }) => {
      const lobby = state.lobbies.get(data.code);
      if (!lobby) {
        socket.emit('error', { message: 'Lobby not found' });
        return;
      }

      const result = joinLobby(lobby, playerId, data.name);
      if (!result.ok) {
        socket.emit('error', { message: result.error });
        return;
      }

      state.lobbies.set(data.code, result.value);
      state.playerToLobby.set(playerId, data.code);
      socket.join(data.code);
      socket.emit('lobby_joined', { code: data.code });
      io.to(data.code).emit('lobby_updated', result.value);
    });

    socket.on('set_ready', (data: { ready: boolean }) => {
      const code = state.playerToLobby.get(playerId);
      if (!code) return;
      const lobby = state.lobbies.get(code);
      if (!lobby) return;

      const result = setReady(lobby, playerId, data.ready);
      if (result.ok) {
        state.lobbies.set(code, result.value);
        io.to(code).emit('lobby_updated', result.value);
      }
    });

    socket.on('start_game', () => {
      const code = state.playerToLobby.get(playerId);
      if (!code) return;
      const lobby = state.lobbies.get(code);
      if (!lobby || lobby.hostId !== playerId) return;

      const startResult = startGame(lobby);
      if (!startResult.ok) {
        socket.emit('error', { message: startResult.error });
        return;
      }

      state.lobbies.set(code, startResult.value);

      const gameResult = createInitialGameState(startResult.value);
      if (!gameResult.ok) {
        socket.emit('error', { message: gameResult.error });
        return;
      }

      const gameState = gameResult.value;
      state.games.set(gameState.id, gameState);

      for (const player of startResult.value.players) {
        state.playerToGame.set(player.id, gameState.id);
      }

      broadcastGameState(io, gameState, startResult.value);
    });

    socket.on('game_intent', (intent: ClientIntent) => {
      const gameId = state.playerToGame.get(playerId);
      if (!gameId) {
        socket.emit('error', { message: 'Not in a game' });
        return;
      }

      const gameState = state.games.get(gameId);
      if (!gameState) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const result = resolveIntent(gameState, playerId, intent);
      if (!result.ok) {
        socket.emit('intent_error', { message: result.error });
        return;
      }

      state.games.set(gameId, result.value);

      const code = state.playerToLobby.get(playerId);
      const lobby = code ? state.lobbies.get(code) : undefined;
      if (lobby) {
        broadcastGameState(io, result.value, lobby);
      }
    });

    socket.on('disconnect', () => {
      const code = state.playerToLobby.get(playerId);
      if (code) {
        const lobby = state.lobbies.get(code);
        if (lobby) {
          const result = leaveLobby(lobby, playerId);
          if (result.ok) {
            if (result.value.disbanded) {
              state.lobbies.delete(code);
            } else {
              state.lobbies.set(code, result.value);
            }
            io.to(code).emit('player_disconnected', { playerId });
          }
        }
        state.playerToLobby.delete(playerId);
      }
      state.playerToGame.delete(playerId);
    });
  });
}

function broadcastGameState(io: SocketServer, gameState: GameState, lobby: Lobby): void {
  for (const player of lobby.players) {
    const sanitized = sanitizeForPlayer(gameState, player.id);
    io.to(player.id).emit('game_state', sanitized);
  }
}

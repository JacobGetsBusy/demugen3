import { io } from 'socket.io-client';
import { useGameStore } from '../store/game-store.js';
let socket = null;
export function connect(url) {
    if (socket?.connected)
        return;
    socket = io(url, { autoConnect: true });
    const store = useGameStore.getState();
    socket.on('connected', (data) => {
        store.setPlayerId(data.playerId);
    });
    socket.on('lobby_created', (data) => {
        store.setLobbyCode(data.code);
    });
    socket.on('lobby_joined', (data) => {
        store.setLobbyCode(data.code);
    });
    socket.on('lobby_updated', (lobby) => {
        store.setLobbyPlayers(lobby.players);
    });
    socket.on('game_state', (state) => {
        store.setGameState(state);
    });
    socket.on('error', (data) => {
        store.setError(data.message);
    });
    socket.on('intent_error', (data) => {
        store.setError(data.message);
    });
    socket.on('player_disconnected', (_data) => {
        // Handled via lobby_updated / game_state
    });
}
export function disconnect() {
    socket?.disconnect();
    socket = null;
}
export function createLobby(name) {
    socket?.emit('create_lobby', { name });
}
export function joinLobby(code, name) {
    socket?.emit('join_lobby', { code, name });
}
export function setReady(ready) {
    socket?.emit('set_ready', { ready });
}
export function startGame() {
    socket?.emit('start_game');
}
export function sendIntent(intent) {
    socket?.emit('game_intent', intent);
}
export function getSocket() {
    return socket;
}
//# sourceMappingURL=socket-client.js.map
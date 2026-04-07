import { describe, it, expect, beforeEach } from 'vitest';
import { createLobby, joinLobby, setReady, leaveLobby, startGame, } from '../../src/lobby/lobby-manager.js';
describe('LobbyManager', () => {
    beforeEach(() => {
        // Reset lobby state between tests handled by creating fresh lobbies
    });
    describe('createLobby', () => {
        it('returns lobby with host player', () => {
            const lobby = createLobby('host-1', 'HostPlayer');
            expect(lobby.hostId).toBe('host-1');
            expect(lobby.players).toHaveLength(1);
            expect(lobby.players[0].id).toBe('host-1');
            expect(lobby.players[0].name).toBe('HostPlayer');
            expect(lobby.code).toBeTruthy();
        });
    });
    describe('joinLobby', () => {
        it('valid lobby code — player added', () => {
            const lobby = createLobby('host-1', 'Host');
            const result = joinLobby(lobby, 'p2', 'Player2');
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value.players).toHaveLength(2);
            }
        });
        it('lobby full (4 players) — returns error', () => {
            let lobby = createLobby('h', 'Host');
            let r = joinLobby(lobby, 'p2', 'P2');
            if (r.ok)
                lobby = r.value;
            r = joinLobby(lobby, 'p3', 'P3');
            if (r.ok)
                lobby = r.value;
            r = joinLobby(lobby, 'p4', 'P4');
            if (r.ok)
                lobby = r.value;
            const result = joinLobby(lobby, 'p5', 'P5');
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toContain('full');
            }
        });
        it('game already started — returns error', () => {
            const lobby = createLobby('h', 'Host');
            const startedLobby = { ...lobby, gameStarted: true };
            const result = joinLobby(startedLobby, 'p2', 'P2');
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toContain('started');
            }
        });
    });
    describe('setReady', () => {
        it('player in lobby — marks ready', () => {
            const lobby = createLobby('h', 'Host');
            const result = setReady(lobby, 'h', true);
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value.players[0].isReady).toBe(true);
            }
        });
        it('player not in lobby — returns error', () => {
            const lobby = createLobby('h', 'Host');
            const result = setReady(lobby, 'unknown', true);
            expect(result.ok).toBe(false);
        });
        it('all players ready — lobby allReady flag true', () => {
            let lobby = createLobby('h', 'Host');
            let r = joinLobby(lobby, 'p2', 'P2');
            if (r.ok)
                lobby = r.value;
            r = setReady(lobby, 'h', true);
            if (r.ok)
                lobby = r.value;
            r = setReady(lobby, 'p2', true);
            if (r.ok)
                lobby = r.value;
            const allReady = lobby.players.every((p) => p.isReady);
            expect(allReady).toBe(true);
        });
    });
    describe('leaveLobby', () => {
        it('player leaves — removed from lobby', () => {
            let lobby = createLobby('h', 'Host');
            const r = joinLobby(lobby, 'p2', 'P2');
            if (r.ok)
                lobby = r.value;
            const result = leaveLobby(lobby, 'p2');
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value.players).toHaveLength(1);
            }
        });
        it('host leaves — lobby disbanded', () => {
            const lobby = createLobby('h', 'Host');
            const result = leaveLobby(lobby, 'h');
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value.disbanded).toBe(true);
            }
        });
    });
    describe('startGame', () => {
        it('all ready, >= 2 players — transitions to started', () => {
            let lobby = createLobby('h', 'Host');
            let r = joinLobby(lobby, 'p2', 'P2');
            if (r.ok)
                lobby = r.value;
            r = setReady(lobby, 'h', true);
            if (r.ok)
                lobby = r.value;
            r = setReady(lobby, 'p2', true);
            if (r.ok)
                lobby = r.value;
            const result = startGame(lobby);
            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value.gameStarted).toBe(true);
            }
        });
        it('not all ready — returns error', () => {
            let lobby = createLobby('h', 'Host');
            const r = joinLobby(lobby, 'p2', 'P2');
            if (r.ok)
                lobby = r.value;
            // host not ready
            const result = startGame(lobby);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toContain('ready');
            }
        });
        it('only 1 player — returns error', () => {
            const lobby = createLobby('h', 'Host');
            const r = setReady(lobby, 'h', true);
            let readyLobby = lobby;
            if (r.ok)
                readyLobby = r.value;
            const result = startGame(readyLobby);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error).toContain('2');
            }
        });
    });
});
//# sourceMappingURL=lobby-manager.test.js.map
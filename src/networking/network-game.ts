import { component, inject } from "tsdi";
import { equals } from "ramda";
import { RemoteUsers } from "./remote-users";
import { Matrix } from "game";
import { RemoteGameState } from "./messages";
import { Config } from "config";

@component
export class NetworkGame {
    @inject private users: RemoteUsers;
    @inject private config: Config;

    public seed: string;
    private states = new Map<string, RemoteGameState>();

    private playfields = new Map<string, Matrix>();

    public emptyState() {
        return {
            score: 0,
            lines: 0,
            level: 0,
            milliseconds: 0,
            toppedOut: false,
        };
    }

    public start(seed: string) {
        this.seed = seed;
        this.users.all.forEach(user => {
            this.playfields.set(user.id, new Matrix(this.config.logicalSize));
            this.states.set(user.id, this.emptyState());
        });
    }

    public get allStates() {
        return Array.from(this.states.values());
    }

    public get all() {
        return Array.from(this.playfields.values());
    }

    public update(userId: string, matrix: Matrix) {
        this.playfields.get(userId)!.update(matrix);
    }

    public updateState(userId: string, state: RemoteGameState) {
        if (!equals(this.states.get(userId), state)) { return; }
        this.states.set(userId, state);
    }

    public byUser(userId: string) {
        return this.playfields.get(userId);
    }

    public stateForUser(userId: string) {
        return this.states.get(userId);
    }

    public reset() {
        this.users.all.forEach(user => {
            this.playfields.forEach(matrix => matrix.update(new Matrix(this.config.logicalSize)));
            this.states.set(user.id, this.emptyState());
        });
    }

    public get allToppedOut() {
        return this.allStates.every(({ toppedOut }) => toppedOut);
    }
}

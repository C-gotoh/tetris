import Peer from "peerjs";
import { observable } from "mobx";
import { component, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { Message, MessageType } from "./messages";
import { RemoteUsers } from "./remote-users";
import { NetworkGame } from "./network-game";
import { generateName } from "names";
import { UI, Page } from "ui";
import { Matrix, Playfield } from "game";
import { Chat } from "./chat";
import { Config } from "config";

export enum NetworkingMode {
    CLIENT = "client",
    HOST = "host",
    DISCONNECTED = "disconnected",
}

@component
export class Networking {
    @inject private users: RemoteUsers;
    @inject private chat: Chat;
    @inject private ui: UI;
    @inject private networkGame: NetworkGame;
    @inject private config: Config;
    @inject private playfield: Playfield;

    private peer: Peer;
    private connection: Peer.DataConnection;
    private connections = new Map<string, Peer.DataConnection>();

    @observable public id: string;
    @observable public remoteId: string;
    @observable public name = generateName();
    @observable public mode = NetworkingMode.DISCONNECTED;

    protected initialize(): Promise<undefined> {
        return new Promise(resolve => {
            this.peer = new Peer(null as any, { debug: 3 });
            this.peer.on("open", () => {
                this.id = this.peer.id;
                this.peer.on("connection", this.handleConnect);
                resolve();
            });
        });
    }

    private forwardMessage(originId: string, message: Message) {
        if (this.mode !== NetworkingMode.HOST) {
            return;
        }
        if ([MessageType.HELLO, MessageType.WELCOME].includes(message.message)) {
            return;
        }
        Array.from(this.connections.entries())
            .filter(([id, connection]) => id !== originId)
            .forEach(([id, connection]) => this.sendTo(connection, message));
    }

    @bind private handleMessage(connectionId: string, message: Message) {
        this.forwardMessage(connectionId, message);
        switch (message.message) {
            case MessageType.CHAT_MESSAGE: {
                this.chat.add(message.chatMessage);
                break;
            }
            case MessageType.WELCOME: {
                this.users.add(...message.users);
                break;
            }
            case MessageType.USER_CONNECTED: {
                this.users.add(message.user);
                break;
            }
            case MessageType.START: {
                this.ui.page = Page.MULTI_PLAYER;
                this.startGame(message.seed);
                break;
            }
            case MessageType.UPDATE_PLAYFIELD: {
                this.ui.page = Page.MULTI_PLAYER;
                this.networkGame.update(message.userId, new Matrix(this.config.logicalSize, message.matrix));
                break;
            }
        }
    }

    public send(message: Message) {
        if (this.mode === NetworkingMode.CLIENT) {
            this.sendTo(this.connection, message);
            return;
        }
        this.connections.forEach(connection => this.sendTo(connection, message));
    }

    public sendTo(connection: Peer.DataConnection, message: Message) {
        connection.send(JSON.stringify(message));
    }

    @bind private handleConnect(connection: Peer.DataConnection) {
        console.log("Client connected."); // tslint:disable-line
        let connectionId: string;
        connection.on("data", json => {
            const message: Message = JSON.parse(json);
            if (message.message === MessageType.HELLO) {
                connectionId = message.user.id;
                this.users.add(message.user);
                this.sendTo(connection, {
                    message: MessageType.WELCOME,
                    users: this.users.all,
                });
                this.send({
                    message: MessageType.USER_CONNECTED,
                    user: message.user,
                });
                this.connections.set(connectionId, connection);
                return;
            }
            if (connectionId) {
                this.handleMessage(connectionId, message);
                return;
            }
            console.error(`Received message without previous HELLO: ${json}`);
        });
    }

    public connect(remoteId: string) {
        this.initialize();
        this.remoteId = remoteId;
        this.mode = NetworkingMode.CLIENT;
        this.connection = this.peer.connect(remoteId, { reliable: true });
        this.connection.on("open", () => {
            console.log("Connected to host."); // tslint:disable-line
            const { name, id } = this;
            this.connection.send(JSON.stringify({
                message: MessageType.HELLO,
                user: { id, name },
            }));
            this.connection.on("data", json => {
                this.handleMessage(remoteId, JSON.parse(json));
            });
        });
    }

    public async host() {
        await this.initialize();
        this.mode = NetworkingMode.HOST;
        this.users.add({
            id: this.id,
            name: this.name,
        });
    }

    public sendChatMessage(text: string) {
        const chatMessage = { text, userId: this.id, date: new Date() };
        this.chat.add(chatMessage);
        this.send({
            message: MessageType.CHAT_MESSAGE,
            chatMessage,
        });
    }

    public start() {
        if (this.mode !== NetworkingMode.HOST) {
            return;
        }
        const seed = `${Math.random()}`.replace(/\./, "");
        this.send({
            message: MessageType.START,
            seed,
        });
        this.ui.page = Page.MULTI_PLAYER;
        this.startGame(seed);
    }

    private startGame(seed: string) {
        this.networkGame.start(seed);
        this.playfieldLoop();
    }

    public updateMatrix(matrix: Matrix) {
        this.send({
            message: MessageType.UPDATE_PLAYFIELD,
            userId: this.id,
            matrix: matrix.toBase64(),
        });
    }

    public playfieldLoop() {
        this.updateMatrix(this.playfield);
        setTimeout(() => this.playfieldLoop(), this.config.networkSpeed * 1000);
    }
}

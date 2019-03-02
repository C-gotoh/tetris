import * as React from "react";
import { Networking, RemoteUsers, NetworkGame } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { OwnGameCanvas } from "./own-game-canvas";
import { Info } from "./info";
import * as css from "./multi-player.scss";
import { Sounds } from "resources";
import { RemoteGame } from "./remote-game";
import { GameState, ShuffleBag } from "game";
import { Input } from "input";
import { UI, GameMode } from "ui";
import { TetriminoPreviews } from "./tetrimino-previews";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private sounds: Sounds;
    @inject private networking: Networking;
    @inject private users: RemoteUsers;
    @inject private networkGame: NetworkGame;
    @inject private shuffleBag: ShuffleBag;
    @inject private gameState: GameState;
    @inject private input: Input;
    @inject private ui: UI;

    @initialize protected initialize() {
        this.shuffleBag.seed(this.networkGame.seed);
        this.sounds.startGame();
        this.gameState.start();
        this.input.enable();
        this.ui.gameMode = GameMode.MULTI_PLAYER;
    }

    public render() {
        return (
            <section className={css.multiPlayer}>
                <div className={css.wrapper}>
                    <Info />
                    <OwnGameCanvas />
                    <TetriminoPreviews />
                </div>
                <div className={css.others}>
                    {
                        this.users.all
                            .filter(user => user.id !== this.networking.id)
                            .map(user => <RemoteGame key={user.id} userId={user.id} />)
                    }
                </div>
            </section>
        );
    }
}

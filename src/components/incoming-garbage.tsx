import * as React from "react";
import { differenceInMilliseconds } from "date-fns";
import { Config } from "config";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { Garbage } from "types";
import * as css from "./incoming-garbage.scss";

@external @observer
export class IncomingGabage extends React.Component<{ garbage: Garbage }> {
    @inject private config: Config;
    private interval: any;

    @initialize protected initialize() {
        this.interval = setInterval(() => this.forceUpdate(), 100);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public get milliseconds() {
        return differenceInMilliseconds(new Date(), this.props.garbage.date);
    }

    public get progress() {
        return this.milliseconds / (this.config.garbageTimeout * 1000);
    }

    public render() {
        return (
            <div className={css.garbage}>
                <div className={css.label}>{`${this.props.garbage.lines} Lines`}</div>
                <div className={css.garbageProgress}>
                    <div className={css.progressInner} style={{ width: `${this.progress * 100}%` }}>
                    </div>
                </div>
            </div>
        );
    }
}

import { EventEmitter } from "events";

export default class Emitter<TEventData> {
    private _emitter = new EventEmitter();
    private _event?: (listener: EventHandler<TEventData>) => void;

    get event(): EventHandlerAttach<TEventData> {
        if (!this._event) {
            this._event = (listener: EventHandler<TEventData>) => {
                this._emitter.on("EVENT", listener);
            };
        }
        return this._event;
    }

    fire(arg: TEventData) {
        this._emitter.emit("EVENT", arg);
    }
}

export type EventHandler<T> = (arg: T) => void;

export type EventHandlerAttach<T> = (listener: EventHandler<T>) => void;

import { EmeterRealtime } from "./EmeterRealtime";

export default interface IServerToClientEvents {
    hello: (initialDevices: DeviceState[]) => void;
    "device-update": (update: DeviceUpdate) => void;
}

export type DeviceUpdate = {
    id: string;
    name: string;
    emeter: EmeterRealtime;
};

export type DeviceState = {
    id: string;
    name: string;
    emeter: {
        latest: EmeterRealtime;
        history: EmeterRealtime[];
    };
};

import { EmeterRealtime } from "./EmeterRealtime";

export default interface IServerToClientEvents {
    hello: (initialDeviceList: DeviceUpdate[]) => void;
    "device-update": (update: DeviceUpdate) => void;
}

export type DeviceUpdate = {
    id: string;
    name: string;
    emeter: EmeterRealtime;
};

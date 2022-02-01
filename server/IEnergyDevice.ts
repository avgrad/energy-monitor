import { EmeterRealtime } from "~/types/EmeterRealtime";
import { EventHandlerAttach } from "./Emitter";

export default interface IEnergyDevice {
    getInfo(): IEnergyDeviceInfo;

    getEmeterRealtime(): EmeterRealtime;
    getEmeterHistory(): EmeterRealtime[];
    onEmeterUpdate: EventHandlerAttach<EmeterRealtime>;
}

export type IEnergyDeviceInfo = {
    id: string;
    name: string;
};

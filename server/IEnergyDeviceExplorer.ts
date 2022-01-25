import IEnergyDevice from "IEnergyDevice";
import { EventHandlerAttach } from "./Emitter";

export default interface IEnergyDeviceExplorer {
    discoverDevices(): void;
    onDeviceFound: EventHandlerAttach<IEnergyDevice>;
}

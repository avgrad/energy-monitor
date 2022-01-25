import { Client, Device, Plug } from "tplink-smarthome-api";
import { isPlugSysinfo } from "tplink-smarthome-api/lib/device";
import Emitter from "../Emitter";
import IEnergyDevice from "../IEnergyDevice";
import IEnergyDeviceExplorer from "../IEnergyDeviceExplorer";
import TpLinkEnergyDevice from "./TpLinkEnergyDevice";

export default class TpLinkDeviceExplorer implements IEnergyDeviceExplorer {
    private client = new Client();
    private onDeviceFoundEmitter = new Emitter<IEnergyDevice>();

    discoverDevices(): void {
        this.client.on("device-new", this.handleDeviceFound.bind(this));
        this.client.startDiscovery({
            discoveryInterval: 60 * 60 * 1000,
            filterCallback: (sysInfo) => {
                return (
                    isPlugSysinfo(sysInfo) &&
                    sysInfo.feature.split(":").includes("ENE")
                );
            },
        });
    }

    private handleDeviceFound(device: Device) {
        const tplinkDevice = new TpLinkEnergyDevice(device as Plug);
        this.onDeviceFoundEmitter.fire(tplinkDevice);
    }

    onDeviceFound = this.onDeviceFoundEmitter.event;
}

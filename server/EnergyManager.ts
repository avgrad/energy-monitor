import IEnergyDevice from "./IEnergyDevice";
import IEnergyDeviceExplorer from "./IEnergyDeviceExplorer";
import TpLinkDeviceExplorer from "./TpLink/TpLinkDeviceExplorer";
import { Server as SocketIoServer } from "socket.io";
import IClientToServerEvents from "~/types/IClientToServerEvents";
import IServerToClientEvents from "~/types/IServerToClientEvents";

export default class EnergyManager {
    constructor(
        io: SocketIoServer<IClientToServerEvents, IServerToClientEvents>
    ) {
        this.io = io;
    }

    private io: SocketIoServer<IClientToServerEvents, IServerToClientEvents>;
    private initialized = false;
    devices: IEnergyDevice[] = [];

    private deviceExplorers: IEnergyDeviceExplorer[] = [
        new TpLinkDeviceExplorer(),
    ];

    discoverDevices() {
        if (this.initialized) return;
        this.deviceExplorers.forEach((e) => {
            e.onDeviceFound((d) => this.handleNewDevice(d));
            e.discoverDevices();
        });
        this.initialized = true;
    }

    private handleNewDevice(device: IEnergyDevice) {
        console.log("NEW DEVICE FOUND!", device.getInfo());

        // register emeter update handler
        device.onEmeterUpdate((emeterUpdate) => {
            const info = device.getInfo();
            // TODO log updates to console for debugging
            console.log(device.getInfo().name + ": ", emeterUpdate);
            this.io.emit("device-update", {
                id: info.id,
                name: info.name,
                emeter: emeterUpdate,
            });
        });

        this.devices.push(device);
    }
}

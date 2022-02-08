import { Plug, RealtimeNormalized } from "tplink-smarthome-api";
import { EmeterRealtime } from "~/types/EmeterRealtime";
import Emitter from "../Emitter";
import IEnergyDevice from "../IEnergyDevice";

export default class TpLinkEnergyDevice implements IEnergyDevice {
    constructor(plug: Plug) {
        this.plug = plug;
        // TODO implement polling because of deprecation by package.
        this.plug.startPolling(5000);
        this.plug.on("emeter-realtime-update", (values: RealtimeNormalized) => {
            const realtime = this.convertValues(values);
            if (this.history.length > 300) this.history.splice(0, 1);
            this.history.push(realtime);
            this.onEmeterUpdateEmitter.fire(realtime);
        });
    }

    private onEmeterUpdateEmitter = new Emitter<EmeterRealtime>();
    private plug: Plug;
    private history: EmeterRealtime[] = [];

    getInfo() {
        return {
            id: this.plug.id,
            name: this.plug.name,
        };
    }

    getEmeterRealtime(): EmeterRealtime {
        return this.convertValues(this.plug.emeter.realtime);
    }

    getEmeterHistory(): EmeterRealtime[] {
        return this.history.slice(-10);
    }

    onEmeterUpdate = this.onEmeterUpdateEmitter.event;

    private convertValues(apiValues: RealtimeNormalized): EmeterRealtime {
        return {
            timestamp: new Date(),
            power: apiValues.power ?? -1,
            current: apiValues.current ?? -1,
            voltage: apiValues.voltage ?? -1,
        };
    }
}

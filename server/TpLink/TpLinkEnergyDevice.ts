import { Plug, RealtimeNormalized } from "tplink-smarthome-api";
import { EmeterRealtime } from "../../types/EmeterRealtime";
import Emitter from "../Emitter";
import IEnergyDevice from "../IEnergyDevice";

export default class TpLinkEnergyDevice implements IEnergyDevice {
    constructor(plug: Plug) {
        this.plug = plug;
        // TODO implement polling because of deprecation by package.
        this.plug.startPolling(5000);
        this.plug.on("emeter-realtime-update", (values: RealtimeNormalized) => {
            this.onEmeterUpdateEmitter.fire(this.convertValues(values));
        });
    }

    private onEmeterUpdateEmitter = new Emitter<EmeterRealtime>();
    private plug: Plug;

    getInfo() {
        return {
            id: this.plug.id,
            name: this.plug.name,
        };
    }

    getEmeterRealtime(): EmeterRealtime {
        return this.convertValues(this.plug.emeter.realtime);
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

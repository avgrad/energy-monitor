import { useCallback } from "react";
import createStore from "zustand";
import socket from "./socket";
import { DeviceUpdate } from "~/types/IServerToClientEvents";
import { EmeterRealtime } from "~/types/EmeterRealtime";

export type DeviceEmeterHistoryEntry = {
    timestamp: Date;
    power: number;
};

export type DeviceState = {
    id: string;
    name: string;
    emeter: EmeterRealtime & {
        history: DeviceEmeterHistoryEntry[];
    };
};

export type DevicesState = {
    devices: { [key: string]: DeviceState };
};

export const useDeviceStore = createStore<DevicesState>(() => ({
    devices: {},
}));

export const useDeviceData = (id: string) =>
    useDeviceStore(useCallback((state) => state.devices[id], [id]));

const selectDeviceIds = (state: DevicesState) => Object.keys(state.devices);
export const useDeviceIds = () => useDeviceStore(selectDeviceIds);

export const useDeviceName = (id: string) =>
    useDeviceStore(useCallback((state) => state.devices[id].name, [id]));

// socket connection and data ingestion

const updateMultipleDevices = (update: DeviceUpdate[]) => {
    useDeviceStore.setState((state) => ({
        ...state,
        devices: {
            ...state.devices,
            ...update.reduce(
                (p, c): { [id: string]: DeviceState } => ({
                    ...p,
                    [c.id]: {
                        ...c,
                        emeter: {
                            ...c.emeter,
                            history: [
                                ...(state.devices[c.id]?.emeter?.history ?? []),
                                {
                                    timestamp: new Date(c.emeter.timestamp),
                                    power: c.emeter.power,
                                },
                            ],
                        },
                    },
                }),
                {}
            ),
        },
    }));
};

const updateDevice = (update: DeviceUpdate) => {
    useDeviceStore.setState((state) => ({
        ...state,
        devices: {
            ...state.devices,
            [update.id]: {
                ...update,
                emeter: {
                    ...update.emeter,
                    history: [
                        ...state.devices[update.id].emeter.history,
                        {
                            timestamp: new Date(update.emeter.timestamp),
                            power: update.emeter.power,
                        },
                    ],
                },
            },
        },
    }));
};

// attach handlers
socket.on("hello", updateMultipleDevices);
socket.on("device-update", updateDevice);

// connect here instead of in socket.ts or else event-handlers for hello wont be called
socket.connect();

// say hello to server
socket.emit("hello");

import { useCallback } from "react";
import createStore from "zustand";
import socket from "./socket";
import { DeviceState, DeviceUpdate } from "~/types/IServerToClientEvents";
import { EmeterRealtime } from "../../types/EmeterRealtime";

export type DeviceEmeterHistoryEntry = {
    timestamp: Date;
    power: number;
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

// helper functions

function convertTimestamp(input: EmeterRealtime): EmeterRealtime {
    return {
        ...input,
        timestamp: new Date(input.timestamp),
    };
}

function sortByTimestamp(a: EmeterRealtime, b: EmeterRealtime): number {
    return a.timestamp.getTime() - b.timestamp.getTime();
}

// socket connection and data ingestion

const updateMultipleDevices = (update: DeviceState[]) => {
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
                            latest: c.emeter.latest,
                            history: [
                                ...c.emeter.history
                                    .concat(
                                        state.devices[c.id]?.emeter?.history ??
                                            []
                                    )
                                    .map(convertTimestamp)
                                    .sort(sortByTimestamp),
                                convertTimestamp(c.emeter.latest), // add latest to history
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
                    latest: update.emeter,
                    history: [
                        ...state.devices[update.id].emeter.history,
                        convertTimestamp(update.emeter), // add latest to history
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

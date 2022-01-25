import { useCallback } from "react";
import createStore from "zustand";
import socket from "./socket";
import { DeviceUpdate } from "~/types/IServerToClientEvents";

export type DevicesState = {
    devices: { [key: string]: DeviceUpdate };
    updateDevice: (device: DeviceUpdate) => void;
};

export const useDeviceStore = createStore<DevicesState>((set) => ({
    devices: {},
    updateDevice: (device: DeviceUpdate) =>
        set((s) => ({
            ...s,
            devices: { ...s.devices, [device.id]: device },
        })),
}));

export const useUpdateDevice = () =>
    useDeviceStore((state) => state.updateDevice);

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
            ...update.reduce((p, c) => ({ ...p, [c.id]: c }), {}),
        },
    }));
};

const updateDevice = (update: DeviceUpdate) => {
    useDeviceStore.setState((state) => ({
        ...state,
        devices: {
            ...state.devices,
            [update.id]: update,
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

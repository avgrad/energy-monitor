import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import IClientToServerEvents from "~/types/IClientToServerEvents";
import IServerToClientEvents from "~/types/IServerToClientEvents";

const socket: Socket<IServerToClientEvents, IClientToServerEvents> = io();

export function useSocketConnected() {
    const [state, setState] = useState<boolean>(false);

    function handleConnect() {
        setState(true);
    }

    function handleDisconnect() {
        setState(false);
    }

    useEffect(() => {
        socket.on("connect", handleConnect);
        return () => void socket.off("connect", handleConnect);
    }, []);

    useEffect(() => {
        socket.on("disconnect", handleDisconnect);
        return () => void socket.off("disconnect", handleDisconnect);
    }, []);

    return state;
}

socket.onAny((...args) => console.info("SOCKET.IO", ...args));
// connection is established in Store.ts because initial state depends on that
//socket.connect();

export default socket;

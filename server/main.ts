import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import IClientToServerEvents from "~/types/IClientToServerEvents";
import IServerToClientEvents, {
    DeviceState,
} from "~/types/IServerToClientEvents";
import EnergyManager from "./EnergyManager";
import IEnergyDevice from "./IEnergyDevice";

const { PORT = 3001 } = process.env;

function createHelloMessage(): DeviceState[] {
    const devices: IEnergyDevice[] = energyManager.devices;

    return devices.map((d) => ({
        id: d.getInfo().id,
        name: d.getInfo().name,
        emeter: {
            latest: d.getEmeterRealtime(),
            history: d.getEmeterHistory(),
        },
    }));
}

const app = express();
const server = http.createServer(app);
const io = new Server<IClientToServerEvents, IServerToClientEvents>(server);

const energyManager = new EnergyManager(io);
energyManager.discoverDevices();

// handle incoming socket connections
io.on("connection", (socket) => {
    console.log("user connected to socket!", socket.id);

    socket.on("hello", () => socket.emit("hello", createHelloMessage()));
    socket.emit("hello", createHelloMessage());

    // TODO debug log all socket events
    socket.onAny(console.log);
});

// serve client frontend production bundle
app.use(express.static("dist/app"));

// Handle client routing, return all requests to the app
app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "app/index.html"));
});

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

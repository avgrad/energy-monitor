import "./header.css";
import useCurrentTime from "../../hooks/useCurrentTime";
import { useSocketConnected } from "../../data/socket";

const ConnectionStatusLed = () => {
    const connected = useSocketConnected();
    return <div className="connection-status" data-connected={connected}></div>;
};

export default function Header(): JSX.Element {
    const dateTime = useCurrentTime();

    return (
        <header>
            <h1>{dateTime.toLocaleTimeString()}</h1>
            <ConnectionStatusLed />
        </header>
    );
}

import Card from "./Card";
import { useDeviceStore } from "../../data/Store";
import "./card.css";

export default function CardList(): JSX.Element {
    //const match = useMatch("/device/:id");
    const deviceIds = useDeviceStore((s) => Object.keys(s.devices));

    return (
        <ul className="card-list">
            {deviceIds.map((id) => (
                <Card key={id} id={id} />
            ))}
        </ul>
    );
}

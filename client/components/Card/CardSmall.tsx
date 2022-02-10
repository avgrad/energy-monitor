import { Link, useMatch } from "react-router-dom";
import CardCommon from "./CardCommon";

export default function CardSmall({ id }: { id: string }): JSX.Element {
    // HACK rerender also triggers a reset of the framer-motion animation, and the open card will become visible in the background.
    // THIS HACK ALSO RESULTS IN A TINY FLICKER WHEN THE CARD IS CLICKED TO OPEN!!!
    const match = useMatch("/device/:id");
    const matchId = match?.params.id ?? false;
    const vis = matchId && id === matchId ? "hidden" : "visible";

    return (
        <li className="card" style={{ visibility: vis }}>
            <CardCommon id={id} />
            <Link to={`/device/${id}`} className="card-open-link" />
        </li>
    );
}

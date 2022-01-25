import { Link, useMatch } from "react-router-dom";
import { motion } from "framer-motion";
import FakeGraph from "./FakeGraph";
import { useDeviceData } from "../../data/Store";

export default function Card({ id }: { id: string }): JSX.Element {
    const {
        name,
        emeter: { power },
    } = useDeviceData(id);

    // HACK rerender also triggers a reset of the framer-motion animation, and the open card will become visible in the background.
    // THIS HACK ALSO RESULTS IN A TINY FLICKER WHEN THE CARD IS CLICKED TO OPEN!!!
    const match = useMatch("/device/:id");
    const matchId = match?.params.id ?? false;
    const vis = matchId && id === matchId ? "hidden" : "visible";

    return (
        <li className="card" style={{ visibility: vis }}>
            <div className="card-content-container">
                <motion.div
                    className="card-content"
                    layoutId={`card-container-${id}`}>
                    <motion.div
                        className="card-graph-container"
                        layoutId={`card-graph-container-${id}`}>
                        <FakeGraph />
                    </motion.div>
                    <motion.div
                        className="title-container"
                        layoutId={`title-container-${id}`}>
                        <h2>{name}</h2>
                        <span className="category">{power.toFixed(1)} W</span>
                    </motion.div>
                    {/*<!--
                        here is the content in the open card
                        -->*/}
                </motion.div>
            </div>
            <Link to={`/device/${id}`} className="card-open-link" />
        </li>
    );
}

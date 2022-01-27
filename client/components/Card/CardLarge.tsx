import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDeviceData } from "../../data/Store";
import RealtimePowerGraph from "../Graph/RealtimePowerGraph";

export default function CardLarge({ id }: { id: string }): JSX.Element {
    const {
        name,
        emeter: { power },
    } = useDeviceData(id);

    return (
        <>
            <ClickAwayBackdrop />
            <div className="card-content-container open">
                <motion.div
                    className="card-content"
                    layoutId={`card-container-${id}`}>
                    <motion.div
                        className="card-graph-container"
                        layoutId={`card-graph-container-${id}`}>
                        <RealtimePowerGraph id={id} />
                    </motion.div>
                    <motion.div
                        className="title-container"
                        layoutId={`title-container-${id}`}>
                        <h2>{name}</h2>
                        <span className="realtime-power">
                            {power.toFixed(1)} W
                        </span>
                    </motion.div>
                    <motion.div className="content-container" animate>
                        <PlaceholderContent />
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}

function ClickAwayBackdrop() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, delay: 0.15 }}
            style={{ pointerEvents: "auto" }}
            className="backdrop">
            <Link to="/" />
        </motion.div>
    );
}

function PlaceholderContent() {
    return (
        <>
            <ul className="card-detail-list">
                {[
                    "Usage Today",
                    "Daily Average",
                    "Usage this Month",
                    "Monthly Average",
                ].map((title, i) => (
                    <li className="card-detail" key={title}>
                        <h3>{title}:</h3>
                        <hr />
                        <span className="consumption">
                            {(80 + i * 21.2) /* TODO DUMMY VALUES */
                                .toFixed(1)}{" "}
                            kWh
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FakeGraph from "./FakeGraph";
import { useDeviceData } from "../../data/Store";

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
                        <FakeGraph />
                    </motion.div>
                    <motion.div
                        className="title-container"
                        layoutId={`title-container-${id}`}>
                        <h2>{name}</h2>
                        <span className="category">{power.toFixed(1)} W</span>
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
                    <li className="card-detail">
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
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque nec sollicitudin ante, sed pulvinar felis.
                Suspendisse fringilla felis in ultricies dapibus. Aenean
                elementum rhoncus consectetur. Interdum et malesuada fames ac
                ante ipsum primis in faucibus.
            </p>
            <p>
                Morbi volutpat mi a lorem aliquam, nec sagittis massa suscipit.
                Vivamus quam nisl, tempor vel scelerisque vitae, lobortis sed
                ante. Nunc nec est dictum, vestibulum purus et, pharetra nisi.
                Integer vel enim tellus. Praesent nec urna non lectus aliquam
                consequat at eget eros.
            </p>
        </>
    );
}

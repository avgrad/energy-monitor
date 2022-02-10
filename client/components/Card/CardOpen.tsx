import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CardCommon from "./CardCommon";

export default function CardOpen({ id }: { id: string }): JSX.Element {
    return (
        <>
            <ClickAwayBackdrop />
            <CardCommon id={id} type="open">
                <PlaceholderContent />
            </CardCommon>
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

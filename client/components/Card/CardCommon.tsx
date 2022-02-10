import { motion } from "framer-motion";
import { useDeviceData } from "../../data/Store";
import RealtimePowerGraph from "../Graph/RealtimePowerGraph";

export default function CardCommon({
    id,
    type = "small",
    children,
}: {
    id: string;
    type?: "small" | "open";
    children?: JSX.Element;
}) {
    const {
        name,
        emeter: {
            latest: { power },
        },
    } = useDeviceData(id);

    const clsName = "card-content-container" + (type === "open" ? " open" : "");

    return (
        <div className={clsName}>
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
                    <span className="realtime-power">{power.toFixed(1)} W</span>
                </motion.div>
                {children && (
                    <motion.div className="content-container" animate>
                        {children}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

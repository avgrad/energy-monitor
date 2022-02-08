import {
    Chart,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    TooltipModel,
} from "chart.js";
import "chartjs-adapter-luxon";
import ChartStreaming from "chartjs-plugin-streaming";
import { motion, useMotionValue } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { EmeterRealtime } from "~/types/EmeterRealtime";
import { DevicesState, useDeviceStore } from "../../data/Store";
import "./graph.css";
import "./tooltipPositionerMouse";
import {
    buildExternalTooltipHandler,
    TooltipUpdateFunc,
} from "./tooltipUpdateHandler";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    ChartStreaming
);

const createChartOptions = (
    updateTooltip: (args: {
        chart: Chart<"line">;
        tooltip: TooltipModel<"line">;
    }) => void
): ChartOptions<"line"> => ({
    responsive: false,
    animation: {
        duration: 0,
    },
    plugins: {
        streaming: {
            duration: 30000,
        },
        filler: {
            propagate: false,
        },
        tooltip: {
            enabled: false,
            position: "mouse",
            mode: "nearest",
            axis: "x",
            intersect: false,
            callbacks: {
                label: function (tooltipContext) {
                    const power = (tooltipContext.raw as EmeterRealtime).power;
                    return power.toFixed(1) + "W";
                },
                beforeLabel: function (tooltipContext) {
                    const timeDiffMs =
                        new Date().getTime() -
                        (
                            tooltipContext.raw as EmeterRealtime
                        ).timestamp.getTime();
                    return "-" + (timeDiffMs / 1000).toFixed(0) + "s";
                },
            },
            external: updateTooltip,
        },
    },
    layout: {
        padding: 0,
        autoPadding: false,
    },
    scales: {
        x: {
            type: "realtime",
            realtime: {
                //duration: 30000,
                delay: 5000,
            },
            display: false,
        },
        y: {
            min: 0,
            //max: 200,
            //suggestedMax: 150,
            display: false,
        },
    },
});

export default function RealtimePowerGraph({ id }: { id: string }) {
    const data = useDeviceStore(
        (s: DevicesState): ChartData<"line", EmeterRealtime[]> => ({
            datasets: [
                {
                    data: s.devices[id].emeter.history,
                    //data: s.data.map((d) => ({ x: d.timestamp.getTime(), y: d.power}))
                    borderColor: "transparent",
                    borderWidth: 0,
                    backgroundColor: "#0099ff",
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    parsing: {
                        // TODO better to use parsing here, or to map it by myself on data attribute?
                        // https://www.chartjs.org/docs/latest/general/data-structures.html#object-using-custom-properties
                        xAxisKey: "timestamp",
                        yAxisKey: "power",
                    },
                    cubicInterpolationMode: "monotone",
                    tension: 0,
                },
            ],
        })
    );

    // separate label states, because combined label object results in render depth error
    const [tooltipLabelTime, setTooltipLabelTime] = useState("-0s");
    const [tooltipLabelPower, setTooltipLabelPower] = useState("0W");
    // tooltip visibility and positioning for framer-motion
    const tooltipOpacityValue = useMotionValue(0);
    const tooltipXValue = useMotionValue(0);
    const tooltipHeightValue = useMotionValue(0);

    // tooltip update function
    const setTooltipInfo = useCallback<TooltipUpdateFunc>(
        (visible, tooltipArgs) => {
            tooltipOpacityValue.set(visible ? 1 : 0);
            if (visible && tooltipArgs) {
                tooltipXValue.set(tooltipArgs.x);
                tooltipHeightValue.set(tooltipArgs.height);
                setTooltipLabelTime(tooltipArgs.labelTime);
                setTooltipLabelPower(tooltipArgs.labelPower);
            }
        },
        [tooltipOpacityValue, tooltipXValue, tooltipHeightValue]
    );

    // memoize chart options with info update callback
    const options = useMemo(
        () => createChartOptions(buildExternalTooltipHandler(setTooltipInfo)),
        [setTooltipInfo]
    );

    return (
        <div className="graph-container">
            <Line width={700} height={200} options={options} data={data} />
            <motion.div
                className="chart-tooltip"
                style={{
                    opacity: tooltipOpacityValue,
                    x: tooltipXValue,
                    height: tooltipHeightValue,
                }}>
                <span className="time">{tooltipLabelTime}</span>
                <span className="power">{tooltipLabelPower}</span>
            </motion.div>
        </div>
    );
}

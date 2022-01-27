import { Chart, TooltipModel } from "chart.js";

export type TooltipUpdateFunc = (
    visible: boolean,
    tooltipArgs?: {
        x: number;
        height: number;
        labelTime: string;
        labelPower: string;
    }
) => void;

export const buildExternalTooltipHandler =
    (setTooltipInfo: TooltipUpdateFunc) =>
    (context: { chart: Chart; tooltip: TooltipModel<"line"> }) => {
        const { chart, tooltip } = context;

        // hide if no tooltip
        if (tooltip.opacity === 0) {
            setTooltipInfo(false);
            return;
        }

        // labels
        const labelTime = tooltip.body[0]?.before[0] ?? "-0s";
        const labelPower = tooltip.body[0]?.lines[0] ?? "0W";

        // chart position
        const { offsetLeft, offsetHeight } = chart.canvas;

        // calculate tooltip position
        const left = offsetLeft + tooltip.caretX;
        const height = offsetHeight - tooltip.caretY;

        // update tooltip
        setTooltipInfo(true, {
            x: left,
            height,
            labelTime,
            labelPower,
        });
    };

import {
    ChartTypeRegistry,
    Tooltip,
    TooltipModel,
    TooltipPosition,
} from "chart.js";
import { DeviceEmeterHistoryEntry } from "../../data/Store";

// type for custom tooltip position at mouse
declare module "chart.js" {
    export interface TooltipPositionerMap {
        mouse: TooltipPositionerFunction<ChartType>;
    }
}

// register custom mouse tooltip positioner
Tooltip.positioners.mouse = function (
    this: TooltipModel<keyof ChartTypeRegistry>,
    items,
    e
): false | TooltipPosition {
    if (!e) return false;

    const pos = Tooltip.positioners.nearest.bind(this)(items, e);

    // happens when nothing is found
    if (pos === false || !items[0]) {
        return false;
    }

    const datasetIndex = items[0].datasetIndex;
    const chart = this.chart;
    const meta = chart.getDatasetMeta(datasetIndex);
    const xScale = chart.scales[meta.xAxisID ?? "x"];
    const yScale = chart.scales[meta.yAxisID ?? "y"];

    const mouseX = e.x;
    const index = items[0].index;
    const itemX = items[0].element.x;
    const diff = mouseX - itemX;

    // HACK cast type over unknown to get rid of type errors for dataset entries
    const data = chart.data.datasets[datasetIndex]
        .data as unknown as DeviceEmeterHistoryEntry[];
    const nextData = diff <= 0 ? data[index] : data[index + 1];
    const prevData = diff > 0 ? data[index] : data[index - 1];

    const nextPoint = nextData
        ? {
              x: xScale.getPixelForValue(nextData.timestamp.getTime()),
              y: yScale.getPixelForValue(nextData.power),
          }
        : null;
    const prevPoint = prevData
        ? {
              x: xScale.getPixelForValue(prevData.timestamp.getTime()),
              y: yScale.getPixelForValue(prevData.power),
          }
        : null;

    // mouse after last point
    if (!nextPoint && prevPoint)
        return {
            ...prevPoint,
        };

    // mouse before first point
    if (!prevPoint && nextPoint)
        return {
            ...nextPoint,
        };

    // no points (type guard)
    if (!(prevPoint && nextPoint)) return false;

    // linear interpolation is precise enough
    const slope = (nextPoint.y - prevPoint.y) / (nextPoint.x - prevPoint.x);
    const interpolatedValueAtMouse =
        prevPoint.y + (mouseX - prevPoint.x) * slope;

    return {
        x: mouseX,
        y: interpolatedValueAtMouse,
    };
};

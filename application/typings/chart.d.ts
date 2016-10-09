// Type definitions for Chart.js
// Project: https://github.com/nnnick/Chart.js

interface LineChartDataset {
    label: string;
    data: number[];
}

interface LineChartData {
    labels: string[];
    datasets: LineChartDataset[];
}

interface ChartTitleConfiguration {
    display?: boolean;
    text?: string;
}

interface ChartLegendLabelConfiguration {
    boxWidth?: number;
}

interface ChartLegendConfiguration {
    display?: boolean;
    position?: "top" | "left" | "bottom" | "right";
    fullWidth?: boolean;
    labels: ChartLegendLabelConfiguration;
}

interface ChartScaleConfiguration {
    type?: "category" | "linear" | "logarithmic" | "time" | "radialLinear";
    display?: boolean;
    position?: "top" | "left" | "bottom" | "right";
    id?: string;
    ticks?: {
        autoSkip?: boolean;
        suggestedMin?: number;
        suggestedMax?: number;
    }
}

interface ChartOptions {
    title?: ChartTitleConfiguration;
    legend?: ChartLegendConfiguration;
    scales?: {
        yAxes?: ChartScaleConfiguration[];
        xAxes?: ChartScaleConfiguration[]
    };
    responsive?: boolean;
    responsiveAnimationDuration?: number;
    maintainAspectRatio?: boolean;
    events?: string[];
    onClick?: () => void,
    legendCallback?: () => void,
    onResize?: () => void
}

interface ChartConfig {
    type: string;
}

interface LineChartConfig extends ChartConfig {
    type: "line";
    data: LineChartData;
    options?: ChartOptions;
}


interface Chart {
    update(): void;
}

declare var Chart: {
    new (context: any, config: ChartConfig): Chart;

    defaults: {
        global: ChartOptions;
    };
};

/// <reference path="../typings/chart.d.ts" />

/**
 * MyLineChart
 */
export class MyLineChart {
    protected chart: Chart;
    protected data: LineChartData;
    protected dataset: LineChartDataset;
    protected maxItemToShow: number = 20;

    constructor(canvas: HTMLCanvasElement, label: string) {
        this.dataset = {
            data: [],
            label,
        };
        this.data = {
            datasets: [this.dataset],
            labels: [],
        };
        let config: LineChartConfig = {
            data: this.data,
            type: "line",
            options: this.options(),
        };
        this.chart = new Chart(canvas.getContext("2d"), config);
    }

    public add(value: number, label: string) {
        if (this.dataset.data.length >= this.maxItemToShow) {
            this.dataset.data.shift();
            this.data.labels.shift();
        }
        this.dataset.data.push(value);
        this.data.labels.push(label);
        this.update();
    }

    public update() {
        this.chart.update();
    }

    protected options(): ChartOptions {
        return {};
    }
}

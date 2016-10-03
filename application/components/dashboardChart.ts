/// <reference path="../typings/chart.d.ts" />

/**
 * MyLineChart
 */
export class MyLineChart {
    private chart: Chart;
    private data: LineChartData;
    private dataset: LineChartDataset;

    constructor(canvas: HTMLCanvasElement, label: string) {
        this.dataset = {
            data: [],
            label: label,
        };
        this.data = {
            datasets: [this.dataset],
            labels: [],
        };
        let config: LineChartConfig = {
            data: this.data,
            type: "line",
        };
        this.chart = new Chart(canvas.getContext("2d"), config);
    }

    public add(value: number, label: string) {
        this.dataset.data.push(value);
        this.data.labels.push(label);
        this.update();
    }

    public update() {
        this.chart.update();
    }
}

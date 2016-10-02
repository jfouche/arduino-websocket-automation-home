/// <reference path="../typings/chart.d.ts" />

/**
 * MyLineChart
 */
export class MyLineChart {
    chart: Chart;
    data: LineChartData;
    dataset: LineChartDataset;

    constructor(canvas: HTMLCanvasElement, label: string) {
        this.dataset = {
            label: label,
            data: []
        }
        this.data = {
            labels: [],
            datasets: [this.dataset]
        }
        let config: LineChartConfig = {
            type: "line",
            data: this.data
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

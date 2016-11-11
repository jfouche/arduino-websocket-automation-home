/// <reference path="../typings/highcharts.d.ts" />

/**
 * MyLineChart
 */
export class MyLineChart {
    protected chart: __Highcharts.ChartObject;
    /*protected data: LineChartData;
    protected dataset: LineChartDataset;*/
    protected maxItemToShow: number = 10;

    constructor(element: HTMLElement, label: string) {
        /*this.dataset = {
            data: [],
            label,
            backgroundColor: "#FF8080",
            borderColor: "#FF0000",
        };
        this.data = {
            datasets: [this.dataset],
            labels: [],
        };
        let config: LineChartConfig = {
            data: this.data,
            type: "line",
            options: this.options(),
        };*/
        this.chart = Highcharts.chart(element, {
            chart: {
                type: "spline",
                animation: true,
                marginRight: 10,
            },
            title : {
                text: label,
            },
            xAxis: {
                type: "datetime",
                tickPixelInterval: 150,
            },
            yAxis: {
                title: {
                    text: "Value",
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: "#808080",
                }],
            },
            series: [{
                name: label,
                data: [],
            }],
        });
    }

    public add(value: number, label: number) {
        let shift =  (this.chart.series[0].data.length >= this.maxItemToShow)
        this.chart.series[0].addPoint([label, value], true, shift);
    }
}

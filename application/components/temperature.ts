/// <reference path="../typings/webcomponents.d.ts" />

import { DashboardWebSocketTemperatureListener, theWsApi } from "../wsApi";
import { MyLineChart } from "./dashboardChart";

class TemperatureChart extends MyLineChart {

    protected options(): ChartOptions {
        return {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 0.0,
                        suggestedMax: 25.0,
                    },
                }],
            },
        };
    }
}

class TemperatureChartElement extends HTMLDivElement {
    private chart: TemperatureChart;
    private controller: TemperatureController;

    constructor() {
        super();
    }

    public add(temperature: number, time: string) {
        this.chart.add(temperature, time);
    }

    protected createdCallback(): void {
        console.log("TemperatureChartElement.createdCallback()");
        let canvas = document.createElement("canvas");
        this.appendChild(canvas);
        this.chart = new TemperatureChart(canvas, this.title);
        this.controller = new TemperatureController(this);
    }
}

/**
 * TemperatureController
 */
class TemperatureController implements DashboardWebSocketTemperatureListener {

    private view: TemperatureChartElement;

    constructor(chartElement: TemperatureChartElement) {
        this.view = chartElement;
        theWsApi.addTemperatureListener(this);
    }

    public onTemperature(temperature: number, time: Date) {
        this.view.add(temperature, time.toTimeString().split(" ")[0]);
    }
}

export function registerTemperatureChartElement() {
    document.registerElement("dashboard-temperature", TemperatureChartElement);
}

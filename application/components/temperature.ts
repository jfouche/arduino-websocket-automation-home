/// <reference path="../typings/webcomponents.d.ts" />

import { DashboardWebSocketTemperatureListener, theWsApi } from '../wsApi';
import { MyLineChart } from './dashboardChart'

class TemperatureChartElement extends HTMLElement {
    chart: MyLineChart;

    constructor() {
        super();
    }

    createdCallback(): void {
        console.log("TemperatureChartElement.createdCallback()");
        let canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 400;
        this.appendChild(canvas);
        this.chart = new MyLineChart(canvas, this.title);
        new TemperatureController(this);
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

    public onTemperature(temperature: number, time: number) {
        let d = new Date(time);
        this.view.chart.add(temperature, d.toTimeString());
    }
}

export function registerTemperatureChartElement()
{
    document.registerElement('dashboard-temperature', TemperatureChartElement);
}

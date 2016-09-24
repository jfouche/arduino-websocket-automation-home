import { ConnectionController } from './components/connection.ts'
import { LoggerController } from './components/logger.ts'
import { TemperatureController } from './components/temperature.ts'

let c: DashboadController;

/**
 * DashboadController
 */
class DashboadController  {

    connectionController: ConnectionController
    loggerController: LoggerController;
    temperatureController: TemperatureController;

    constructor() {
        this.connectionController = new ConnectionController();
        this.loggerController = new LoggerController();
        this.temperatureController = new TemperatureController();
    }
}

$(function () {
    c = new DashboadController();
});
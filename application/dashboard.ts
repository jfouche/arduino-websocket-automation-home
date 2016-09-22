import { ConnectionController } from './components/connection.ts'
import { LoggerController } from './components/logger.ts'

let c: DashboadController;

/**
 * DashboadController
 */
class DashboadController  {

    connectionController: ConnectionController
    loggerController: LoggerController;

    constructor() {
        this.connectionController = new ConnectionController();
        this.loggerController = new LoggerController();
    }
}

$(function () {
    c = new DashboadController();
});
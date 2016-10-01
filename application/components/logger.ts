import { DashboardWebSocketConnectionListener, DashboardWebSocketApi, theWsApi } from '../wsApi';

/**
 * LoggerView
 */
class LoggerView {
    btnClear: HTMLElement;
    output: HTMLElement;

    constructor() {
        this.btnClear = document.getElementById("clearButton");
        this.output = document.getElementById("outputtext");

        this.btnClear.addEventListener("click", (e) => { this.clearText(); });
    }

    private clearText() {
        this.output.innerHTML = "";
    }

    public writeToScreen(message: string) {
        this.output.innerHTML = this.output.innerHTML + message;
        this.output.scrollTop = this.output.scrollHeight;
    }
}

/**
 * LoggerController
 */
export class LoggerController implements DashboardWebSocketConnectionListener {

    private view: LoggerView;

    constructor() {
        this.view = new LoggerView();
        theWsApi.addConnectionListener(this);
    }

    public onWsOpen(evt: Event) {
        this.view.writeToScreen("connected\n");
    }

    public onWsClose(evt: CloseEvent) {
        this.view.writeToScreen("disconnected\n");
    }

    public onWsMessage(evt: MessageEvent) {
        this.view.writeToScreen("response: " + evt.data + '\n');
    }

    public onWsError(evt: Event) {
        this.view.writeToScreen('error: ' + evt.returnValue + '\n');
    }
}

import { DashboardWebSocketConnectionListener, DashboardWebSocketApi, theWsApi } from "../wsApi";

enum State { CONNECTED = 1, DISCONNECTED };

class DashboardConnectionElement extends HTMLDivElement {
    private controller: ConnectionController;
    private btnConnect: HTMLButtonElement;
    private state: State;

    public setController(controller: ConnectionController) {
        this.controller = controller;
    }

    public setStateConnected() {
        this.state = State.CONNECTED;
        this.btnConnect.value = "Disconnect";
    }

    public setStateDisconnected() {
        this.state = State.DISCONNECTED;
        this.btnConnect.value = "Connect";
    }

    protected createdCallback(): void {
        console.log("DashboardConnectionElement.createdCallback()");

        this.btnConnect = document.createElement("input");
        this.btnConnect.type = "button";
        this.appendChild(this.btnConnect);

        this.state = State.DISCONNECTED;
        this.controller = new ConnectionController(this);

        this.btnConnect.addEventListener("click", (e) => {
            switch (this.state) {
                case State.CONNECTED: this.controller.disconnect(); break;
                case State.DISCONNECTED: this.controller.connect(); break;
                default: break;
            }
        });

        this.setStateDisconnected();
    }

    protected attachedCallback(): void {
        console.log("DashboardConnectionElement.attachedCallback()");
    }
}

/**
 * ConnectionController
 */
export class ConnectionController implements DashboardWebSocketConnectionListener {

    private view: DashboardConnectionElement;

    constructor(view: DashboardConnectionElement) {
        this.view = view;
        this.view.setController(this);

        theWsApi.addConnectionListener(this);
    }

    public connect() {
        theWsApi.connect("ws://localhost:8000/");
    }

    public disconnect() {
        theWsApi.close();
    }

    public onWsOpen(evt: Event) {
        this.view.setStateConnected();
    }

    public onWsClose(evt: CloseEvent) {
        this.view.setStateDisconnected();
    }

    public onWsMessage(evt: MessageEvent) {
    }

    public onWsError(evt: Event) {
        this.view.setStateDisconnected();
    }
}

export function registerDashboardConnectionElement() {
    document.registerElement("dashboard-connection", DashboardConnectionElement);
}

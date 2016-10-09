import { DashboardWebSocketConnectionListener, DashboardWebSocketApi, theWsApi } from "../wsApi";

enum State { CONNECTED = 1, DISCONNECTED };

/**
 * DashboardConnectionElement
 */
class DashboardConnectionElement extends HTMLDivElement {
    private controller: ConnectionController;
    private inputUrl: HTMLInputElement;
    private btnConnect: HTMLButtonElement;
    private state: State;

    public setController(controller: ConnectionController) {
        this.controller = controller;
    }

    public setStateConnected() {
        this.state = State.CONNECTED;
        this.inputUrl.hidden = true;
        this.btnConnect.value = "Disconnect";
    }

    public setStateDisconnected() {
        this.state = State.DISCONNECTED;
        this.inputUrl.hidden = false;
        this.btnConnect.value = "Connect";
    }

    public set url(uri: string) {
        this.inputUrl.value = uri;
    }

    public get url(): string {
        return this.inputUrl.value;
    }

    protected createdCallback(): void {
        console.log("DashboardConnectionElement.createdCallback()");

        this.inputUrl = document.createElement("input");
        this.inputUrl.type = "text";
        this.appendChild(this.inputUrl);

        this.btnConnect = document.createElement("input");
        this.btnConnect.type = "button";
        this.appendChild(this.btnConnect);

        this.state = State.DISCONNECTED;
        this.controller = new ConnectionController(this);

        this.btnConnect.addEventListener("click", (e) => { this.connect(); });

        this.setStateDisconnected();
    }

    protected attachedCallback(): void {
        console.log("DashboardConnectionElement.attachedCallback()");
    }

    private connect() {
        switch (this.state) {
            case State.CONNECTED:
                this.controller.disconnect();
                break;

            case State.DISCONNECTED:
                if (this.inputUrl.value) {
                    this.controller.connect();
                };
                break;
            default: break;
        }
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

        this.view.url = "ws://localhost:8000/";

        theWsApi.addConnectionListener(this);
    }

    public connect() {
        theWsApi.connect(this.view.url);
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

import { DashboardWebSocketConnectionListener, DashboardWebSocketApi, theWsApi } from '../wsApi';

interface ConnectionViewListener
{
    connect() : void;
    disconnect() : void;
}

/**
 * ConnectionView
 */
class ConnectionView {;
    listener: ConnectionViewListener
    btnConnect: HTMLElement;
    btnDisconnect: HTMLElement;

    constructor(listener: ConnectionViewListener) {
        this.listener = listener;
        this.btnConnect = document.getElementById("connectButton");
        this.btnDisconnect =document.getElementById("disconnectButton");

        this.btnConnect.addEventListener("click", (e) => { this.listener.connect(); });
        this.btnDisconnect.addEventListener("click", (e) => { this.listener.disconnect(); });

        this.setStateDisconnected();
    }

    public setStateConnected() {
        this.btnConnect.setAttribute("disabled", "true");
        this.btnDisconnect.removeAttribute("disabled");
    }

    public setStateDisconnected() {
        this.btnConnect.removeAttribute("disabled");
        this.btnDisconnect.setAttribute("disabled", "true");
    }
}

/**
 * ConnectionController
 */
export class ConnectionController implements DashboardWebSocketConnectionListener, ConnectionViewListener {

    private view: ConnectionView;

    constructor() {
        this.view = new ConnectionView(this);
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
/// <reference path="jquery.d.ts" />

let c: DashboadController;

interface DashboardWebSocketApiHandler
{
    onWsOpen(evt: Event);
    onWsClose(evt: CloseEvent);
    onWsError(evt: Event);

    onTemperature(temperature: number);
}

/**
 * DashboardWebSocketApi
 */
class DashboardWebSocketApi {
    private url: string;
    private handler: DashboardWebSocketApiHandler;
    private ws: WebSocket = null;

    constructor(url: string, handler: DashboardWebSocketApiHandler) {
        this.url = url;
        this.handler = handler;
    }

    public connect()
    {
        this.ws = new WebSocket("ws://localhost:8000/");
        this.ws.onopen  = (evt: Event) => { this.onWsOpen(evt); };
        this.ws.onclose = (evt: CloseEvent) => { this.onWsClose(evt); };
        this.ws.onmessage = (evt: MessageEvent) => { this.onWsMessage(evt); };
        this.ws.onerror = (evt: Event) => { this.onWsError(evt); };
    }

    public close() {
        this.ws.close();
    }

    private onWsOpen(evt: Event) {
        this.handler.onWsOpen(evt);
    }

    private onWsClose(evt: CloseEvent) {
        this.ws = null;
        this.handler.onWsClose(evt);
    }

    private onWsMessage(evt: MessageEvent) {
        let obj: any = JSON.parse(evt.data);
        if (obj.msg && obj.msg === "temperature")
        {
            let temperature: number = Number(obj.temperature);
            if (!isNaN(temperature))
            {
                this.handler.onTemperature(temperature);
            }
        }
    }

    private onWsError(evt: Event) {
        this.close()
    }

    public setTemperature(t: number) {
        let obj = { 'msg': 'setTemperature', 'temperature': t};
        let frame: string = JSON.stringify(obj);
        this.send(frame);
    }

    private send(data: string) {
        this.ws.send(data);
    }
}

/**
 * DashboadView
 */
class DashboadView {
    btnConnect: JQuery;
    btnDisconnect: JQuery;
    btnSend: JQuery;
    btnClear: JQuery;
    text: JQuery;
    output: JQuery;

    constructor() {
        this.btnConnect = $("#connectButton");
        this.btnDisconnect = $("#disconnectButton");
        this.btnSend = $("#sendButton");
        this.btnClear = $("#clearButton");
        this.text = $("#inputtext");
        this.output = $("#outputtext");

        this.setStateDisconnected();
    }

    public setStateConnected() {
        this.btnConnect.prop("disabled", true);
        this.btnDisconnect.prop("disabled", false);
    }

    public setStateDisconnected() {
        this.btnConnect.prop("disabled", false);
        this.btnDisconnect.prop("disabled", true);
    }

    public clearText() {
        $("#outputtext").val("");
    }

    public getText() : string {
        return this.text.val();
    }

    public writeToScreen(message: string) {
        this.output.val(this.output.val() + message);
        // $("#outputtext").scrollTop = $("#outputtext").scrollHeight;
    }

}

/**
 * DashboadController
 */
class DashboadController implements DashboardWebSocketApiHandler {

    private view: DashboadView;
    private wsApi: DashboardWebSocketApi;

    constructor() {
        this.view = new DashboadView();
        this.wsApi = new DashboardWebSocketApi("ws://localhost:8000/", this);

        this.view.btnConnect.on("click", (e) => { this.connect(); });
        this.view.btnDisconnect.on("click", (e) => { this.disconnect(); });
        this.view.btnClear.on("click", (e) => { this.view.clearText(); });
        this.view.btnSend.on("click", (e) => { this.sendText(); });
    }

    public connect() {
        this.wsApi.connect();
    }

    public disconnect() {
        this.wsApi.close();
    }

    public sendText() {
        this.view.writeToScreen("sending...\n");
        let temperature: number = Number(this.view.getText());
        if (!isNaN(temperature)) {
            this.wsApi.setTemperature(temperature);
        }
    }

    public onWsOpen(evt: Event) {
        this.view.writeToScreen("connected\n");
        this.view.setStateConnected();
    }

    public onWsClose(evt: CloseEvent) {
        this.view.writeToScreen("disconnected\n");
        this.view.setStateDisconnected();
    }

    public onWsMessage(evt: MessageEvent) {
        this.view.writeToScreen("response: " + evt.data + '\n');
    }

    public onWsError(evt: Event) {
        this.view.writeToScreen('error: ' + evt.returnValue + '\n');
        this.view.setStateDisconnected();
    }

    public onTemperature(temperature: number) {
        this.view.writeToScreen('received temperature: ' + temperature + '\n');
    }
}

$(function () {
    c = new DashboadController();
});
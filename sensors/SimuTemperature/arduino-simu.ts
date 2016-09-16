/// <reference path="../../application/jquery.d.ts" />

import { DashboardWebSocketApiHandler, DashboardWebSocketApi } from '../../application/wsApi';


let c: DashboadController;

/**
 * DashboadView
 */
class DashboadView {
    btnConnect: JQuery;
    btnDisconnect: JQuery;
    btnSend: JQuery;
    btnClear: JQuery;
    temperature: JQuery;
    output: JQuery;

    constructor() {
        this.btnConnect = $("#connectButton");
        this.btnDisconnect = $("#disconnectButton");
        this.btnSend = $("#sendButton");
        this.btnClear = $("#clearButton");
        this.temperature = $("#temperature");
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
        return this.temperature.val();
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
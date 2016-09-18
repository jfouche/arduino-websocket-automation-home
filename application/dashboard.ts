/// <reference path="jquery.d.ts" />

import { DashboardWebSocketConnectionListener, DashboardWebSocketTempertureListener, DashboardWebSocketApi, theWsApi } from './wsApi';

let c: DashboadController;

interface DashboadViewListener
{
    connect() : void;
    disconnect() : void;
}

/**
 * DashboadView
 */
class DashboadView {;
    listener: DashboadViewListener
    btnConnect: JQuery;
    btnDisconnect: JQuery;
    btnClear: JQuery;
    output: JQuery;

    constructor(listener: DashboadViewListener) {
        this.listener = listener;
        this.btnConnect = $("#connectButton");
        this.btnDisconnect = $("#disconnectButton");
        this.btnClear = $("#clearButton");
        this.output = $("#outputtext");

        this.btnClear.on("click", (e) => { this.clearText(); });
        this.btnConnect.on("click", (e) => { this.listener.connect(); });
        this.btnDisconnect.on("click", (e) => { this.listener.disconnect(); });

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

    public writeToScreen(message: string) {
        this.output.val(this.output.val() + message);
        // $("#outputtext").scrollTop = $("#outputtext").scrollHeight;
    }

}

/**
 * DashboadController
 */
class DashboadController implements DashboardWebSocketConnectionListener, DashboardWebSocketTempertureListener, DashboadViewListener {

    private view: DashboadView;

    constructor() {
        this.view = new DashboadView(this);
        theWsApi.addConnectionListener(this);
        theWsApi.addTemperatureListener(this);
    }

    public connect() {
        theWsApi.connect("ws://localhost:8000/");
    }

    public disconnect() {
        theWsApi.close();
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

    public onTemperature(temperature: number, time: number) {
        let d = new Date(time*1000)
        this.view.writeToScreen('received temperature: ' + temperature + ' (' + d.toLocaleString() + ')\n');
    }
}

$(function () {
    c = new DashboadController();
});
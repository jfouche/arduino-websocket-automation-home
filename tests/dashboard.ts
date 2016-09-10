/// <reference path="jquery.d.ts" />

let c: DashboadController;
let ws: WebSocket;

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
class DashboadController {

    private view: DashboadView;

    constructor() {
        this.view = new DashboadView();

        this.view.btnConnect.on("click", (e) => { this.connect(); });
        this.view.btnDisconnect.on("click", (e) => { this.disconnect(); });
        this.view.btnClear.on("click", (e) => { this.view.clearText(); });
        this.view.btnSend.on("click", (e) => { this.sendText(); });
    }

    public connect() {
        init_ws("ws://localhost:8000/");
    }

    public disconnect() {
        ws.close();
    }

    public sendText() {
        this.view.writeToScreen("sending...\n");
        //this.view.writeToScreen("sending" + this.view.getText() + "\n");
        ws.send(this.view.getText());
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
        ws.close()
        this.view.setStateDisconnected();
    }

}

function init_ws(url: string) {
    ws = new WebSocket("ws://localhost:8000/");
    ws.onopen = function (evt: Event) {
        c.onWsOpen(evt);
    };
    ws.onclose = function (evt: CloseEvent) {
        c.onWsClose(evt);
    };
    ws.onmessage = function (evt: MessageEvent) {
        c.onWsMessage(evt);
    };
    ws.onerror = function (evt: Event) {
        c.onWsError(evt);
    };
}

$(function () {
    c = new DashboadController();
});
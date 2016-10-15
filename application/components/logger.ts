/// <reference path="../typings/webcomponents.d.ts" />

import { DashboardWebSocketConnectionListener, theWsApi } from "../wsApi";

export class DashboardLoggerElement extends HTMLCanvasElement {

    private content: HTMLDivElement;
    private controller: LoggerController;

    constructor() {
        super();
    }

    public writeToScreen(message: string) {
        let now = new Date();
        this.content.innerHTML = this.content.innerHTML + now.toLocaleTimeString() + " : " + message + "<br>";
        this.content.scrollTop = this.content.scrollHeight;
    }

    protected createdCallback(): void {
        console.log("DashboardLoggerElement.createdCallback()");
        this.content = document.createElement("div");
        let btnClear = document.createElement("input");
        btnClear.type = "button";
        btnClear.value = "clear";
        this.appendChild(btnClear);
        this.appendChild(this.content);

        btnClear.addEventListener("click", (e) => {
            this.clearText();
        });

        this.controller = new LoggerController(this);
    }

    private clearText() {
        this.content.innerHTML = "";
    }
}

/**
 * LoggerController
 */
class LoggerController implements DashboardWebSocketConnectionListener {

    private view: DashboardLoggerElement;

    constructor(view: DashboardLoggerElement) {
        this.view = view;
        theWsApi.addConnectionListener(this);
    }

    public onWsOpen(evt: Event) {
        this.view.writeToScreen("connected");
    }

    public onWsClose(evt: CloseEvent) {
        this.view.writeToScreen("disconnected");
    }

    public onWsMessage(evt: MessageEvent) {
        this.view.writeToScreen("response=" + evt.data);
    }

    public onWsError(evt: Event) {
        this.view.writeToScreen("error: " + evt.returnValue);
    }
}


export function registerDashboardLoggerElement() {
    document.registerElement("dashboard-logger", DashboardLoggerElement);
}

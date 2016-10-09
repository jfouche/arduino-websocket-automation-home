/// <reference path="../typings/webcomponents.d.ts" />

import { DashboardWebSocketConnectionListener, theWsApi } from "../wsApi";

export class DashboardLoggerElement extends HTMLCanvasElement {

    private textarea: HTMLTextAreaElement;
    private controller: LoggerController;

    constructor() {
        super();
    }

    public writeToScreen(message: string) {
        let now = new Date();
        this.textarea.innerHTML = this.textarea.innerHTML + now.toLocaleTimeString() + " : " + message;
        this.textarea.scrollTop = this.textarea.scrollHeight;
    }

    protected createdCallback(): void {
        console.log("DashboardLoggerElement.createdCallback()");
        this.textarea = document.createElement("textarea");
        let btnClear = document.createElement("input");
        btnClear.type = "button";
        btnClear.value = "clear";
        this.appendChild(this.textarea);
        this.appendChild(btnClear);

        btnClear.addEventListener("click", (e) => {
            this.clearText();
        });

        this.controller = new LoggerController(this);
    }

    private clearText() {
        this.textarea.innerHTML = "";
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
        this.view.writeToScreen("connected\n");
    }

    public onWsClose(evt: CloseEvent) {
        this.view.writeToScreen("disconnected\n");
    }

    public onWsMessage(evt: MessageEvent) {
        this.view.writeToScreen("response: " + evt.data + "\n");
    }

    public onWsError(evt: Event) {
        this.view.writeToScreen("error: " + evt.returnValue + "\n");
    }
}


export function registerDashboardLoggerElement() {
    document.registerElement("dashboard-logger", DashboardLoggerElement);
}

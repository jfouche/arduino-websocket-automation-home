export interface DashboardWebSocketApiHandler {
    onWsOpen(evt: Event): void;
    onWsClose(evt: CloseEvent): void;
    onWsError(evt: Event): void;

    onTemperature(temperature: number): void;
}

/**
 * DashboardWebSocketApi
 */
export class DashboardWebSocketApi {
    private url: string;
    private handler: DashboardWebSocketApiHandler;
    private ws: WebSocket = null;

    constructor(url: string, handler: DashboardWebSocketApiHandler) {
        this.url = url;
        this.handler = handler;
    }

    public connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = (evt: Event) => { this.onWsOpen(evt); };
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
        switch (obj.msg) {
            case "temperature":
                this.onTemperature(obj);
                break;

            default:
                console.error("Unknonw message : " + obj.msg);
                break;
        }
    }

    private onTemperature(obj: any) {
        let temperature: number = Number(obj.temperature);
        if (!isNaN(temperature)) {
            this.handler.onTemperature(temperature);
        }
    }

    private onWsError(evt: Event) {
        this.close()
    }

    public setTemperature(t: number) {
        let obj = { 'msg': 'setTemperature', 'temperature': t };
        let frame: string = JSON.stringify(obj);
        this.send(frame);
    }

    private send(data: string) {
        this.ws.send(data);
    }
}

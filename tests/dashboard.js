/// <reference path="jquery.d.ts" />
var c;
/**
 * DashboardWebSocketApi
 */
var DashboardWebSocketApi = (function () {
    function DashboardWebSocketApi(url, handler) {
        this.ws = null;
        this.url = url;
        this.handler = handler;
    }
    DashboardWebSocketApi.prototype.connect = function () {
        var _this = this;
        this.ws = new WebSocket("ws://localhost:8000/");
        this.ws.onopen = function (evt) { _this.onWsOpen(evt); };
        this.ws.onclose = function (evt) { _this.onWsClose(evt); };
        this.ws.onmessage = function (evt) { _this.onWsMessage(evt); };
        this.ws.onerror = function (evt) { _this.onWsError(evt); };
    };
    DashboardWebSocketApi.prototype.close = function () {
        this.ws.close();
    };
    DashboardWebSocketApi.prototype.onWsOpen = function (evt) {
        this.handler.onWsOpen(evt);
    };
    DashboardWebSocketApi.prototype.onWsClose = function (evt) {
        this.ws = null;
        this.handler.onWsClose(evt);
    };
    DashboardWebSocketApi.prototype.onWsMessage = function (evt) {
        var obj = JSON.parse(evt.data);
        if (obj.msg && obj.msg === "temperature") {
            var temperature = Number(obj.temperature);
            if (!isNaN(temperature)) {
                this.handler.onTemperature(temperature);
            }
        }
    };
    DashboardWebSocketApi.prototype.onWsError = function (evt) {
        this.close();
    };
    DashboardWebSocketApi.prototype.setTemperature = function (t) {
        var obj = { 'msg': 'setTemperature', 'temperature': t };
        var frame = JSON.stringify(obj);
        this.send(frame);
    };
    DashboardWebSocketApi.prototype.send = function (data) {
        this.ws.send(data);
    };
    return DashboardWebSocketApi;
}());
/**
 * DashboadView
 */
var DashboadView = (function () {
    function DashboadView() {
        this.btnConnect = $("#connectButton");
        this.btnDisconnect = $("#disconnectButton");
        this.btnSend = $("#sendButton");
        this.btnClear = $("#clearButton");
        this.text = $("#inputtext");
        this.output = $("#outputtext");
        this.setStateDisconnected();
    }
    DashboadView.prototype.setStateConnected = function () {
        this.btnConnect.prop("disabled", true);
        this.btnDisconnect.prop("disabled", false);
    };
    DashboadView.prototype.setStateDisconnected = function () {
        this.btnConnect.prop("disabled", false);
        this.btnDisconnect.prop("disabled", true);
    };
    DashboadView.prototype.clearText = function () {
        $("#outputtext").val("");
    };
    DashboadView.prototype.getText = function () {
        return this.text.val();
    };
    DashboadView.prototype.writeToScreen = function (message) {
        this.output.val(this.output.val() + message);
        // $("#outputtext").scrollTop = $("#outputtext").scrollHeight;
    };
    return DashboadView;
}());
/**
 * DashboadController
 */
var DashboadController = (function () {
    function DashboadController() {
        var _this = this;
        this.view = new DashboadView();
        this.wsApi = new DashboardWebSocketApi("ws://localhost:8000/", this);
        this.view.btnConnect.on("click", function (e) { _this.connect(); });
        this.view.btnDisconnect.on("click", function (e) { _this.disconnect(); });
        this.view.btnClear.on("click", function (e) { _this.view.clearText(); });
        this.view.btnSend.on("click", function (e) { _this.sendText(); });
    }
    DashboadController.prototype.connect = function () {
        this.wsApi.connect();
    };
    DashboadController.prototype.disconnect = function () {
        this.wsApi.close();
    };
    DashboadController.prototype.sendText = function () {
        this.view.writeToScreen("sending...\n");
        var temperature = Number(this.view.getText());
        if (!isNaN(temperature)) {
            this.wsApi.setTemperature(temperature);
        }
    };
    DashboadController.prototype.onWsOpen = function (evt) {
        this.view.writeToScreen("connected\n");
        this.view.setStateConnected();
    };
    DashboadController.prototype.onWsClose = function (evt) {
        this.view.writeToScreen("disconnected\n");
        this.view.setStateDisconnected();
    };
    DashboadController.prototype.onWsMessage = function (evt) {
        this.view.writeToScreen("response: " + evt.data + '\n');
    };
    DashboadController.prototype.onWsError = function (evt) {
        this.view.writeToScreen('error: ' + evt.returnValue + '\n');
        this.view.setStateDisconnected();
    };
    DashboadController.prototype.onTemperature = function (temperature) {
        this.view.writeToScreen('received temperature: ' + temperature + '\n');
    };
    return DashboadController;
}());
$(function () {
    c = new DashboadController();
});

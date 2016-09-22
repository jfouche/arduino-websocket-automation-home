/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var connection_ts_1 = __webpack_require__(1);
	var logger_ts_1 = __webpack_require__(3);
	var c;
	var DashboadController = (function () {
	    function DashboadController() {
	        this.connectionController = new connection_ts_1.ConnectionController();
	        this.loggerController = new logger_ts_1.LoggerController();
	    }
	    return DashboadController;
	}());
	$(function () {
	    c = new DashboadController();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var wsApi_1 = __webpack_require__(2);
	var ConnectionView = (function () {
	    function ConnectionView(listener) {
	        var _this = this;
	        this.listener = listener;
	        this.btnConnect = $("#connectButton");
	        this.btnDisconnect = $("#disconnectButton");
	        this.btnConnect.on("click", function (e) { _this.listener.connect(); });
	        this.btnDisconnect.on("click", function (e) { _this.listener.disconnect(); });
	        this.setStateDisconnected();
	    }
	    ;
	    ConnectionView.prototype.setStateConnected = function () {
	        this.btnConnect.prop("disabled", true);
	        this.btnDisconnect.prop("disabled", false);
	    };
	    ConnectionView.prototype.setStateDisconnected = function () {
	        this.btnConnect.prop("disabled", false);
	        this.btnDisconnect.prop("disabled", true);
	    };
	    return ConnectionView;
	}());
	var ConnectionController = (function () {
	    function ConnectionController() {
	        this.view = new ConnectionView(this);
	        wsApi_1.theWsApi.addConnectionListener(this);
	    }
	    ConnectionController.prototype.connect = function () {
	        wsApi_1.theWsApi.connect("ws://localhost:8000/");
	    };
	    ConnectionController.prototype.disconnect = function () {
	        wsApi_1.theWsApi.close();
	    };
	    ConnectionController.prototype.onWsOpen = function (evt) {
	        this.view.setStateConnected();
	    };
	    ConnectionController.prototype.onWsClose = function (evt) {
	        this.view.setStateDisconnected();
	    };
	    ConnectionController.prototype.onWsMessage = function (evt) {
	    };
	    ConnectionController.prototype.onWsError = function (evt) {
	        this.view.setStateDisconnected();
	    };
	    return ConnectionController;
	}());
	exports.ConnectionController = ConnectionController;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var DashboardWebSocketApi = (function () {
	    function DashboardWebSocketApi() {
	        this.ws = null;
	        this.connectionListeners = [];
	        this.temperatureListeners = [];
	    }
	    DashboardWebSocketApi.prototype.connect = function (url) {
	        var _this = this;
	        this.ws = new WebSocket(url);
	        this.ws.onopen = function (evt) { _this.onWsOpen(evt); };
	        this.ws.onclose = function (evt) { _this.onWsClose(evt); };
	        this.ws.onmessage = function (evt) { _this.onWsMessage(evt); };
	        this.ws.onerror = function (evt) { _this.onWsError(evt); };
	    };
	    DashboardWebSocketApi.prototype.close = function () {
	        this.ws.close();
	    };
	    DashboardWebSocketApi.prototype.addConnectionListener = function (listener) {
	        this.connectionListeners.push(listener);
	    };
	    DashboardWebSocketApi.prototype.addTemperatureListener = function (listener) {
	        this.temperatureListeners.push(listener);
	    };
	    DashboardWebSocketApi.prototype.setTemperature = function (t) {
	        var obj = { 'msg': 'setTemperature', 'temperature': t };
	        var frame = JSON.stringify(obj);
	        this.send(frame);
	    };
	    DashboardWebSocketApi.prototype.sendTemperature = function (temperature, time) {
	        this.temperatureListeners.forEach(function (l) {
	            l.onTemperature(temperature, time);
	        });
	    };
	    DashboardWebSocketApi.prototype.onWsOpen = function (evt) {
	        this.connectionListeners.forEach(function (l) {
	            l.onWsOpen(evt);
	        });
	    };
	    DashboardWebSocketApi.prototype.onWsClose = function (evt) {
	        this.ws = null;
	        this.connectionListeners.forEach(function (l) {
	            l.onWsClose(evt);
	        });
	    };
	    DashboardWebSocketApi.prototype.onWsError = function (evt) {
	        this.connectionListeners.forEach(function (l) {
	            l.onWsError(evt);
	        });
	        this.close();
	    };
	    DashboardWebSocketApi.prototype.onWsMessage = function (evt) {
	        this.connectionListeners.forEach(function (l) {
	            l.onWsMessage(evt);
	        });
	        var obj = JSON.parse(evt.data);
	        switch (obj.msg) {
	            case "temperature":
	                this.onTemperature(obj);
	                break;
	            default:
	                console.error("Unknonw message : " + obj.msg);
	                break;
	        }
	    };
	    DashboardWebSocketApi.prototype.onTemperature = function (obj) {
	        var temperature = Number(obj.temperature);
	        var time = Number(obj.time);
	        if (!isNaN(temperature) && !isNaN(time)) {
	            this.sendTemperature(temperature, time);
	        }
	    };
	    DashboardWebSocketApi.prototype.send = function (data) {
	        this.ws.send(data);
	    };
	    return DashboardWebSocketApi;
	}());
	exports.DashboardWebSocketApi = DashboardWebSocketApi;
	exports.theWsApi = new DashboardWebSocketApi();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var wsApi_1 = __webpack_require__(2);
	var c;
	var LoggerView = (function () {
	    function LoggerView() {
	        var _this = this;
	        this.btnClear = $("#clearButton");
	        this.output = $("#outputtext");
	        this.btnClear.on("click", function (e) { _this.clearText(); });
	    }
	    ;
	    LoggerView.prototype.clearText = function () {
	        $("#outputtext").val("");
	    };
	    LoggerView.prototype.writeToScreen = function (message) {
	        this.output.val(this.output.val() + message);
	    };
	    return LoggerView;
	}());
	var LoggerController = (function () {
	    function LoggerController() {
	        this.view = new LoggerView();
	        wsApi_1.theWsApi.addConnectionListener(this);
	    }
	    LoggerController.prototype.onWsOpen = function (evt) {
	        this.view.writeToScreen("connected\n");
	    };
	    LoggerController.prototype.onWsClose = function (evt) {
	        this.view.writeToScreen("disconnected\n");
	    };
	    LoggerController.prototype.onWsMessage = function (evt) {
	        this.view.writeToScreen("response: " + evt.data + '\n');
	    };
	    LoggerController.prototype.onWsError = function (evt) {
	        this.view.writeToScreen('error: ' + evt.returnValue + '\n');
	    };
	    return LoggerController;
	}());
	exports.LoggerController = LoggerController;


/***/ }
/******/ ]);
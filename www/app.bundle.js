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
	var temperature_ts_1 = __webpack_require__(4);
	connection_ts_1.registerDashboardConnectionElement();
	logger_ts_1.registerDashboardLoggerElement();
	temperature_ts_1.registerTemperatureChartElement();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var wsApi_1 = __webpack_require__(2);
	var State;
	(function (State) {
	    State[State["CONNECTED"] = 1] = "CONNECTED";
	    State[State["DISCONNECTED"] = 2] = "DISCONNECTED";
	})(State || (State = {}));
	;
	var DashboardConnectionElement = (function (_super) {
	    __extends(DashboardConnectionElement, _super);
	    function DashboardConnectionElement() {
	        _super.apply(this, arguments);
	    }
	    DashboardConnectionElement.prototype.setController = function (controller) {
	        this.controller = controller;
	    };
	    DashboardConnectionElement.prototype.setStateConnected = function () {
	        this.state = State.CONNECTED;
	        this.btnConnect.value = "Disconnect";
	    };
	    DashboardConnectionElement.prototype.setStateDisconnected = function () {
	        this.state = State.DISCONNECTED;
	        this.btnConnect.value = "Connect";
	    };
	    DashboardConnectionElement.prototype.createdCallback = function () {
	        var _this = this;
	        console.log("DashboardConnectionElement.createdCallback()");
	        this.btnConnect = document.createElement("input");
	        this.btnConnect.type = "button";
	        this.appendChild(this.btnConnect);
	        this.state = State.DISCONNECTED;
	        this.controller = new ConnectionController(this);
	        this.btnConnect.addEventListener("click", function (e) {
	            switch (_this.state) {
	                case State.CONNECTED:
	                    _this.controller.disconnect();
	                    break;
	                case State.DISCONNECTED:
	                    _this.controller.connect();
	                    break;
	                default: break;
	            }
	        });
	        this.setStateDisconnected();
	    };
	    DashboardConnectionElement.prototype.attachedCallback = function () {
	        console.log("DashboardConnectionElement.attachedCallback()");
	    };
	    return DashboardConnectionElement;
	}(HTMLDivElement));
	var ConnectionController = (function () {
	    function ConnectionController(view) {
	        this.view = view;
	        this.view.setController(this);
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
	function registerDashboardConnectionElement() {
	    document.registerElement("dashboard-connection", DashboardConnectionElement);
	}
	exports.registerDashboardConnectionElement = registerDashboardConnectionElement;


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
	        var obj = { "msg": "setTemperature", "temperature": t };
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
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var wsApi_1 = __webpack_require__(2);
	var DashboardLoggerElement = (function (_super) {
	    __extends(DashboardLoggerElement, _super);
	    function DashboardLoggerElement() {
	        _super.call(this);
	    }
	    DashboardLoggerElement.prototype.writeToScreen = function (message) {
	        var now = new Date();
	        this.textarea.innerHTML = this.textarea.innerHTML + now.toLocaleTimeString() + " : " + message;
	        this.textarea.scrollTop = this.textarea.scrollHeight;
	    };
	    DashboardLoggerElement.prototype.createdCallback = function () {
	        var _this = this;
	        console.log("DashboardLoggerElement.createdCallback()");
	        this.textarea = document.createElement("textarea");
	        var btnClear = document.createElement("input");
	        btnClear.type = "button";
	        btnClear.value = "clear";
	        this.appendChild(this.textarea);
	        this.appendChild(btnClear);
	        btnClear.addEventListener("click", function (e) {
	            _this.clearText();
	        });
	        new LoggerController(this);
	    };
	    DashboardLoggerElement.prototype.clearText = function () {
	        this.textarea.innerHTML = "";
	    };
	    return DashboardLoggerElement;
	}(HTMLCanvasElement));
	exports.DashboardLoggerElement = DashboardLoggerElement;
	var LoggerController = (function () {
	    function LoggerController(view) {
	        this.view = view;
	        wsApi_1.theWsApi.addConnectionListener(this);
	    }
	    LoggerController.prototype.onWsOpen = function (evt) {
	        this.view.writeToScreen("connected\n");
	    };
	    LoggerController.prototype.onWsClose = function (evt) {
	        this.view.writeToScreen("disconnected\n");
	    };
	    LoggerController.prototype.onWsMessage = function (evt) {
	        this.view.writeToScreen("response: " + evt.data + "\n");
	    };
	    LoggerController.prototype.onWsError = function (evt) {
	        this.view.writeToScreen("error: " + evt.returnValue + "\n");
	    };
	    return LoggerController;
	}());
	function registerDashboardLoggerElement() {
	    document.registerElement("dashboard-logger", DashboardLoggerElement);
	}
	exports.registerDashboardLoggerElement = registerDashboardLoggerElement;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var wsApi_1 = __webpack_require__(2);
	var dashboardChart_1 = __webpack_require__(5);
	var TemperatureChartElement = (function (_super) {
	    __extends(TemperatureChartElement, _super);
	    function TemperatureChartElement() {
	        _super.call(this);
	    }
	    TemperatureChartElement.prototype.add = function (temperature, time) {
	        this.chart.add(temperature, time);
	    };
	    TemperatureChartElement.prototype.createdCallback = function () {
	        console.log("TemperatureChartElement.createdCallback()");
	        var canvas = document.createElement("canvas");
	        canvas.width = 600;
	        canvas.height = 400;
	        this.appendChild(canvas);
	        this.chart = new dashboardChart_1.MyLineChart(canvas, this.title);
	        new TemperatureController(this);
	    };
	    return TemperatureChartElement;
	}(HTMLElement));
	var TemperatureController = (function () {
	    function TemperatureController(chartElement) {
	        this.view = chartElement;
	        wsApi_1.theWsApi.addTemperatureListener(this);
	    }
	    TemperatureController.prototype.onTemperature = function (temperature, time) {
	        var d = new Date(time);
	        this.view.add(temperature, d.toTimeString());
	    };
	    return TemperatureController;
	}());
	function registerTemperatureChartElement() {
	    document.registerElement("dashboard-temperature", TemperatureChartElement);
	}
	exports.registerTemperatureChartElement = registerTemperatureChartElement;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var MyLineChart = (function () {
	    function MyLineChart(canvas, label) {
	        this.dataset = {
	            data: [],
	            label: label,
	        };
	        this.data = {
	            datasets: [this.dataset],
	            labels: [],
	        };
	        var config = {
	            data: this.data,
	            type: "line",
	        };
	        this.chart = new Chart(canvas.getContext("2d"), config);
	    }
	    MyLineChart.prototype.add = function (value, label) {
	        this.dataset.data.push(value);
	        this.data.labels.push(label);
	        this.update();
	    };
	    MyLineChart.prototype.update = function () {
	        this.chart.update();
	    };
	    return MyLineChart;
	}());
	exports.MyLineChart = MyLineChart;


/***/ }
/******/ ]);
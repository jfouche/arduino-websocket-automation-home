!function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={exports:{},id:o,loaded:!1};return t[o].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";var o=n(2),r=n(4),i=n(5);o.registerDashboardConnectionElement(),r.registerDashboardLoggerElement(),i.registerTemperatureChartElement()},function(t,e){"use strict";var n=function(){function t(){this.ws=null,this.connectionListeners=[],this.temperatureListeners=[]}return t.prototype.connect=function(t){var e=this;this.ws=new WebSocket(t),this.ws.onopen=function(t){e.onWsOpen(t)},this.ws.onclose=function(t){e.onWsClose(t)},this.ws.onmessage=function(t){e.onWsMessage(t)},this.ws.onerror=function(t){e.onWsError(t)}},t.prototype.close=function(){this.ws.close()},t.prototype.addConnectionListener=function(t){this.connectionListeners.push(t)},t.prototype.addTemperatureListener=function(t){this.temperatureListeners.push(t)},t.prototype.setTemperature=function(t){var e={msg:"setTemperature",temperature:t},n=JSON.stringify(e);this.send(n)},t.prototype.sendTemperature=function(t,e){var n=new Date(1e3*e);this.temperatureListeners.forEach(function(e){e.onTemperature(t,n)})},t.prototype.onWsOpen=function(t){this.connectionListeners.forEach(function(e){e.onWsOpen(t)})},t.prototype.onWsClose=function(t){this.ws=null,this.connectionListeners.forEach(function(e){e.onWsClose(t)})},t.prototype.onWsError=function(t){this.connectionListeners.forEach(function(e){e.onWsError(t)}),this.close()},t.prototype.onWsMessage=function(t){this.connectionListeners.forEach(function(e){e.onWsMessage(t)});var e=JSON.parse(t.data);switch(e.msg){case"temperature":this.onTemperature(e);break;default:console.error("Unknonw message : "+e.msg)}},t.prototype.onTemperature=function(t){var e=Number(t.temperature),n=Number(t.time);isNaN(e)||isNaN(n)||this.sendTemperature(e,n)},t.prototype.send=function(t){this.ws.send(t)},t}();e.DashboardWebSocketApi=n,e.theWsApi=new n},function(t,e,n){"use strict";function o(){document.registerElement("dashboard-connection",c)}var r,i=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},s=n(1);!function(t){t[t.CONNECTED=1]="CONNECTED",t[t.DISCONNECTED=2]="DISCONNECTED"}(r||(r={}));var c=function(t){function e(){t.apply(this,arguments)}return i(e,t),e.prototype.setController=function(t){this.controller=t},e.prototype.setStateConnected=function(){this.state=r.CONNECTED,this.inputUrl.hidden=!0,this.btnConnect.value="Disconnect"},e.prototype.setStateDisconnected=function(){this.state=r.DISCONNECTED,this.inputUrl.hidden=!1,this.btnConnect.value="Connect"},Object.defineProperty(e.prototype,"url",{get:function(){return this.inputUrl.value},set:function(t){this.inputUrl.value=t},enumerable:!0,configurable:!0}),e.prototype.createdCallback=function(){var t=this;console.log("DashboardConnectionElement.createdCallback()"),this.inputUrl=document.createElement("input"),this.inputUrl.type="text",this.appendChild(this.inputUrl),this.btnConnect=document.createElement("input"),this.btnConnect.type="button",this.appendChild(this.btnConnect),this.state=r.DISCONNECTED,this.controller=new a(this),this.btnConnect.addEventListener("click",function(e){t.connect()}),this.setStateDisconnected()},e.prototype.attachedCallback=function(){console.log("DashboardConnectionElement.attachedCallback()")},e.prototype.connect=function(){switch(this.state){case r.CONNECTED:this.controller.disconnect();break;case r.DISCONNECTED:this.inputUrl.value&&this.controller.connect()}},e}(HTMLDivElement),a=function(){function t(t){this.view=t,this.view.setController(this),this.view.url="ws://localhost:8000/",s.theWsApi.addConnectionListener(this)}return t.prototype.connect=function(){s.theWsApi.connect(this.view.url)},t.prototype.disconnect=function(){s.theWsApi.close()},t.prototype.onWsOpen=function(t){this.view.setStateConnected()},t.prototype.onWsClose=function(t){this.view.setStateDisconnected()},t.prototype.onWsMessage=function(t){},t.prototype.onWsError=function(t){this.view.setStateDisconnected()},t}();e.ConnectionController=a,e.registerDashboardConnectionElement=o},function(t,e){"use strict";var n=function(){function t(t,e){this.maxItemToShow=10,this.chart=Highcharts.chart(t,{chart:{type:"spline",animation:!0,marginRight:10},title:{text:e},xAxis:{type:"datetime",tickPixelInterval:150},yAxis:{title:{text:"Value"},plotLines:[{value:0,width:1,color:"#808080"}]},series:[{name:e,data:[]}]})}return t.prototype.add=function(t,e){var n=this.chart.series[0].data.length>=this.maxItemToShow;this.chart.series[0].addPoint([e,t],!0,n)},t}();e.MyLineChart=n},function(t,e,n){"use strict";function o(){document.registerElement("dashboard-logger",s)}var r=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},i=n(1),s=function(t){function e(){t.call(this)}return r(e,t),e.prototype.writeToScreen=function(t){var e=new Date;this.content.innerHTML=this.content.innerHTML+e.toLocaleTimeString()+" : "+t+"<br>",this.content.scrollTop=this.content.scrollHeight},e.prototype.createdCallback=function(){var t=this;console.log("DashboardLoggerElement.createdCallback()"),this.content=document.createElement("div");var e=document.createElement("input");e.type="button",e.value="clear",this.appendChild(e),this.appendChild(this.content),e.addEventListener("click",function(e){t.clearText()}),this.controller=new c(this)},e.prototype.clearText=function(){this.content.innerHTML=""},e}(HTMLCanvasElement);e.DashboardLoggerElement=s;var c=function(){function t(t){this.view=t,i.theWsApi.addConnectionListener(this)}return t.prototype.onWsOpen=function(t){this.view.writeToScreen("connected")},t.prototype.onWsClose=function(t){this.view.writeToScreen("disconnected")},t.prototype.onWsMessage=function(t){this.view.writeToScreen("response="+t.data)},t.prototype.onWsError=function(t){this.view.writeToScreen("error: "+t.returnValue)},t}();e.registerDashboardLoggerElement=o},function(t,e,n){"use strict";function o(){document.registerElement("dashboard-temperature",c)}var r=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},i=n(1),s=n(3),c=function(t){function e(){t.call(this)}return r(e,t),e.prototype.add=function(t,e){this.chart.add(t,e)},e.prototype.createdCallback=function(){console.log("TemperatureChartElement.createdCallback()"),this.chart=new s.MyLineChart(this,this.title),this.controller=new a(this)},e}(HTMLDivElement),a=function(){function t(t){this.view=t,i.theWsApi.addTemperatureListener(this)}return t.prototype.onTemperature=function(t,e){this.view.add(t,e.getTime())},t}();e.registerTemperatureChartElement=o}]);
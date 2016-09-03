ws = null;

var ws_handler = {
    onOpen: function(evt) {
        writeToScreen("connected\n");
        $("#connectButton").prop("disabled", true);
        $("#disconnectButton").prop("disabled", false);
    },
    onMessage: function(evt) {
        writeToScreen("response: " + evt.data + '\n');
    },
    onerror: function(evt) {
        writeToScreen('error: ' + evt.data + '\n');
        ws.close();
        $("#connectButton").prop("disabled", false);
        $("#disconnectButton").prop("disabled", true);
    },
    onClose: function(evt) {
        writeToScreen("disconnected\n");
        $("#connectButton").prop("disabled", false);
        $("#disconnectButton").prop("disabled", true);
    }
}

function sendText() {
    ws.send($("#inputtext").val());
}

function clearText() {
    $("#outputtext").val("");
}

function writeToScreen(message) {
    var output = $("#outputtext"); 
    output.val(output.val() + message);
    // $("#outputtext").scrollTop = $("#outputtext").scrollHeight;
}

function doDisconnect() {
    ws.close();
}

function doConnect() {
    init_websocket("ws://localhost:8000/", ws_handler)
}

function init() {
    $("#disconnectButton").prop("disabled", true);
    $("#inputtext").val("Hello World!");

    $("#sendButton").on("click", sendText);
    $("#clearButton").on("click", clearText);
    $("#disconnectButton").on("click", doDisconnect);
    $("#connectButton").on("click", doConnect);
}

$(function() { init(); });
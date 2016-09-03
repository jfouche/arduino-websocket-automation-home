function init_websocket(url, handler) {
    ws = new WebSocket(url);
    ws.onopen = handler.onOpen;
    ws.onclose = handler.onClose;
    ws.onmessage = handler.onMessage;
    ws.onerror = handler.onError;
    return ws
}
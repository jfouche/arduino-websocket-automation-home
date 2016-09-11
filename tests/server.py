from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import json

class DashboardWebSocketHandler(WebSocket):

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

    def handleMessage(self):
        print('message :', self.data)
        obj = json.loads(self.data)
        if not obj : return
        msg = obj["msg"]
        print('msg :', msg)
        if not msg: return
        print('msg OK')
        if msg == 'setTemperature' :
            temperature = int(obj["temperature"])
            print('temperature ', temperature)
            self.sendTemperature(temperature)

    def sendTemperature(self, temperature):
        print('sendTemperature :', temperature)
        obj = {'msg': 'temperature', 'temperature': temperature}
        self.sendMessage(json.dumps(obj))



server = SimpleWebSocketServer('', 8000, DashboardWebSocketHandler)
server.serveforever()
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import json
import sqlite3
import time
import config

# ============================================================================
# DataBase Structure
# ============================================================================

SQL_CREATE_MODULES = """
    CREATE TABLE IF NOT EXISTS modules (
        address     text,
        sensor      text,
        time        integer,
        location    text,
        status      text
    )
"""

SQL_CREATE_TEMPERATURE = """
    CREATE TABLE IF NOT EXISTS temperatures (
        time        integer,
        temperature real
    )
"""

# ============================================================================


class DashboardDatabase(object):

    def __init__(self, dbname):
        self.db = sqlite3.connect(dbname)
        cursor = self.db.cursor()
        cursor.execute(SQL_CREATE_MODULES)
        cursor.execute(SQL_CREATE_TEMPERATURE)
        self.db.commit()

    def addTemperature(self, time, temperature):
        cursor = self.db.cursor()
        cursor.execute(
            "INSERT INTO temperatures values (?, ?)", (time, temperature))
        self.db.commit()
    
    def setModule(self):
        cursor = self.db.cursor()
        cursor.execute("INSERT INTO temperatures values (?, ?)", (time, temperature))
        

DB = DashboardDatabase("dashboard.db3")

# ============================================================================


class DashboardWebSocketHandler(WebSocket):

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

    def handleMessage(self):
        print('message :', self.data)
        obj = json.loads(self.data)
        if not obj:
            return
        msg = obj["msg"]
        print('msg :', msg)
        if not msg:
            return
        methodName = "handle_" + msg
        if hasattr(self, methodName):
            getattr(self, methodName)(obj)

    def handle_setTemperature(self, obj):
        temperature = int(obj["temperature"])
        print('temperature', temperature)
        now = int(time.time())
        print('time', now)
        DB.addTemperature(now, temperature)
        self.sendTemperature(temperature, now)

    
    def broadcast(self, msg) :
        if type(msg) is dict :
            msg = json.dumps(obj)
        for _, connection in self.server.connections.items():
            connection.sendMessage(msg)
        
    def sendTemperature(self, temperature, time):
        print('sendTemperature :', temperature)
        obj = {'msg': 'temperature', 'temperature': temperature, 'time': time}
        self.broadcast(obj)


# ============================================================================
if __name__ == "__main__":
    server = SimpleWebSocketServer(
        config.socketBind,
        config.socketPort,
        DashboardWebSocketHandler)
    server.serveforever()

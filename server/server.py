from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import json
import sqlite3
import time
import config

# TODO : define specification of database
SQL_CREATE_TEMPERATURE = """
    CREATE TABLE IF NOT EXISTS temperatures (
        id integer primary key,
	location text,
        time integer,
        temperature real
    )
"""

# ============================================================================
class DashboardDatabase(object) :

    def __init__(self, dbname) :
        self.db = sqlite3.connect(dbname)
        cursor = self.db.cursor()
        cursor.execute(SQL_CREATE_TEMPERATURE)
        self.db.commit()

    def addTemperature(self, time, location, temperature):
        cursor = self.db.cursor()
        cursor.execute("INSERT INTO temperatures values (NULL, ?, ?, ?)", (time, location, temperature))
        self.db.commit()

DB = DashboardDatabase("dashboard.db3")

# ============================================================================
class DashboardWebSocketHandler(WebSocket):

    def handleConnected(self):
        print(self.address, 'connected')

    def handleClose(self):
        print(self.address, 'closed')

	# Example Json OBJ ==> { 'msg': 'setTemperature', 'location': 'CUMULUS', 'temperature': '18.13' }
    def handleMessage(self):
        print('message :', self.data)
        obj = json.loads(self.data)
        if not obj: return
        msg = obj['msg']
        print('msg :', msg)
        if not msg: return
        methodName = "handle_" + msg
        if hasattr(self, methodName) :
            getattr(self, methodName)(obj)

    def handle_setTemperature(self, obj):
        temperature = float(obj['temperature'])
        print('temperature', temperature)
        now = int(time.time())
        print('time', now)
        location = obj['location']
        print('location', location)
        DB.addTemperature(now, location, temperature)
        self.sendTemperature(temperature, location, now)

    def sendTemperature(self, temperature, time):
        print('sendTemperature :', temperature)
        obj = {'msg': 'temperature', 'temperature': temperature, 'time': time}
        msg = json.dumps(obj)
        for fileno, connection in self.server.connections.items() :
            connection.sendMessage(msg)
            

# ============================================================================
if __name__ == "__main__" : 
    server = SimpleWebSocketServer(config.socketBind, config.socketPort, DashboardWebSocketHandler)
    server.serveforever()

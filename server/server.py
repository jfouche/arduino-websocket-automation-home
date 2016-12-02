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
	ID		integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	address  	varchar(30) NOT NULL UNIQUE,
	sensor		varchar(30) DEFAULT UNKNOWN,
	location	varchar(30) DEFAULT UNKNOWN,
	status		varchar(15) NULL
)
"""

SQL_CREATE_TEMPERATURES = """
CREATE TABLE IF NOT EXISTS temperatures (
	ID         	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	ID_Module  	integer NOT NULL,
	temperature     float(50) NOT NULL,
	time     	datetime NOT NULL
)
"""

SQL_CREATE_HYGROMETRIE = """
CREATE TABLE IF NOT EXISTS hygrometrie (
	ID         	integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	ID_Module  	integer NOT NULL,
	hygrometrie     integer NOT NULL,
	time     	datetime NOT NULL
)
"""

# ============================================================================


class Database(object):

    def __init__(self, dbname):
        self.db = sqlite3.connect(dbname)
        cursor = self.db.cursor()
        cursor.execute(SQL_CREATE_MODULES)
        cursor.execute(SQL_CREATE_TEMPERATURES)
        cursor.execute(SQL_CREATE_HYGROMETRIE)
        self.db.commit()

    def addTemperature(self, address, time, temperature):
        cursor = self.db.cursor()
        cursor.execute(
            "INSERT INTO temperatures(id_Module,temperature,time) SELECT ID, ?, ? FROM modules WHERE address=?", [
                temperature, time, address])
        self.db.commit()

    def addModule(self, address, sensor):
        cursor = self.db.cursor()
        cursor.execute(
            "INSERT OR IGNORE INTO modules(address, sensor, status) VALUES (?, ?, 'CONNECTED')", [
                address, sensor])
        self.db.commit()

    def updateModule(self, address, status):
        cursor = self.db.cursor()
        cursor.execute(
            "UPDATE modules SET status=? WHERE address=?", [
                status, address])
        self.db.commit()

    def getAllTemperatures(self, address):
        print('recupere temperature')
        cursor = self.db.cursor()
        temperatures = cursor.execute(
            "SELECT temperature,time FROM temperatures INNER JOIN modules WHERE id_module=modules.id and address=?",
            [address])

DB = Database("database.db3")

# ============================================================================


class WebSocketHandler(WebSocket):

    def handleConnected(self):
        print(self.address, 'connected')
        DB.updateModule(self.address[0], 'CONNECTED')

    def handleClose(self):
        print(self.address, 'closed')
        DB.updateModule(self.address[0], 'DISCONNECTED')

        # Request type Json OBJ ==> { 'msg': '<methode><request>', 'sensor': 'arduino' '<resquest>': '18.13' }
        # Example { 'msg': 'setTemperature', 'sensor': 'arduino' 'temperature':
        # '18.13' }
    def handleMessage(self):
        print('message :', self.data)
        obj = json.loads(self.data)
        if obj['sensor']:
            DB.addModule(self.address[0], obj['sensor'])
        if not obj:
            return
        msg = obj['msg']
        print('msg :', msg)
        if not msg:
            return
        methodName = "handle_" + msg
        if hasattr(self, methodName):
            getattr(self, methodName)(obj)

        # JSON structure { 'msg': 'setTemperature', 'sensor': 'arduino'
        # 'temperature': '18.13' }
    def handle_setTemperature(self, obj):
        temperature = float(obj['temperature'])
        print('temperature', temperature)
        now = int(time.time())
        print('time', now)
        DB.addTemperature(self.address[0], now, temperature)
        #self.sendTemperature(now, temperature)

        # Example Json OBJ ==> { 'msg': 'getTemperature', 'address':
        # 'xxx.xxx.xxx.xxx' }
    def handle_getTemperature(self, obj):
        address = obj['address']
        print('address', address)
        DB.getAllTemperatures(self, address)

#    def sendTemperature(self, time, temperature):
#        print('sendTemperature :', temperature)
#        obj = {'msg': 'temperature', 'temperature': temperature, 'time': time}
#        msg = json.dumps(obj)
#        for fileno, connection in self.server.connections.items() :
#            connection.sendMessage(msg)

# ============================================================================
if __name__ == "__main__":
    server = SimpleWebSocketServer(
        config.socketBind,
        config.socketPort,
        WebSocketHandler)
    server.serveforever()

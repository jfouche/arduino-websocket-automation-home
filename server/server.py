#!/usr/bin/env python

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import time
import sqlite3
import config

conn = sqlite3.connect('domoDatabase.db')
print ('Opened database successfully')
       
class SimpleEcho(WebSocket):

    def traiteRequeteRecue(self):
       #cursor = conn.execute('SELECT * FROM tempsHum WHERE idSonde=5')
       msg = self.data
       dataRecu = msg.split("/")
       t = (dataRecu[0],dataRecu[1],dataRecu[2])
       cursor = conn.execute('INSERT INTO tempsHum values (5, ?, ?, ?, date(\'now\'))', t)
       #for row in cursor:
       #   self.sendMessage("Temperature de "+ str(row[2])+ "°C dans la "+ str(row[1])+" avec "+ str(row[3])+"% d'humidité.")
       conn.commit()
       self.sendMessage("OK");
       
    def handleMessage(self):
        self.traiteRequeteRecue()

    def handleConnected(self):
        print (self.address, 'connected')

    def handleClose(self):
        print (self.address, 'closed')
         

server = SimpleWebSocketServer(sockethost, socketport, SimpleEcho)
server.serveforever()
conn.close()

#!/usr/bin/env python

import websocket
import _thread
import time
import json
import random

def on_message(ws, message):
    print(message)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    print("WS OPENED")
    def run(*args):
        simu = Simu(ws)
        simu.sendInfo('DEHORS')
        while ws.sock :
            simu.sendTemperature(random.randint(50, 300) / 10)
            time.sleep(3)
    _thread.start_new_thread(run, ())

class Simu(object) :

    def __init__(self, ws) :
        self.ws = ws

    def send(self, obj) :
        self.ws.send(json.dumps(obj))
    
    def sendTemperature(self, temperature) :
        self.send( {'msg': 'setTemperature', 'temperature' : temperature} )
    
    def sendInfo(self, location) :
        self.send( {'msg': 'sensor', 'location': location} )

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://localhost:8000/",
                              on_open=on_open,
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.run_forever()

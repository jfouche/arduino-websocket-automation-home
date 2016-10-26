/*
Desc: Affiche le différentiel de température entre deux sondes et pilote la chaudière.
Auteur: bardon.jeanalexandre@gmail.com

Matériel:
Sonde: 2 x DS18B20
Arduino Ethernet PoE
Relay 5v

Library : https://github.com/djsb/arduino-websocketclient
*/

#include <SPI.h>
#include <Ethernet.h>
#include "WSClient.h"
#include <OneWire.h>
#include <DallasTemperature.h>

// Define a maximum framelength to 64 bytes. Default is 256. Don't Work !!! 
#define MAX_FRAME_LENGTH 256
#define CALLBACK_FUNCTIONS 1

// Debug
#define DEBUG  1

//PIN capteurs
#define SENSORA 2
#define SENSORB 3

//Définition des capteurs
OneWire TMP_CUMULUS(SENSORA);
OneWire TMP_OUT(SENSORB);

DallasTemperature sensor_cumulus(&TMP_CUMULUS);
DallasTemperature sensor_out(&TMP_OUT);

#define HOSTNAME   "192.168.1.1"            // Serveur distant
#define PORT        8000                    // Port du serveur distant
//#define HOSTNAME     "echo.websocket.org" // Serveur distant
//#define PORT         80                   // Port du serveur distant
#define PATH         "/"                    // Path

// Ethernet Configuration
byte mac[] = {0x52, 0x4F, 0x43, 0x4B, 0x45, 0x54};
IPAddress ip(192, 168, 1 , 150);
IPAddress subnet(255, 255, 255, 0);
//IPAddress myDNS(192, 168, 100, 245);
//IPAddress gateway(192, 168, 100, 254);

EthernetClient client;

// Websocket initialization
WSClient websocket;

void setup() {

  #ifdef DEBUG  
    Serial.begin(115200);
  #endif

  //Init Ethernet
  Ethernet.begin(mac, ip, subnet);
  //Ethernet.begin(mac, ip, subnet, myDNS, gateway);
  #ifdef DEBUG
    Serial.print("IP : ");
    Serial.println(Ethernet.localIP());
    Serial.println("Starting...");
  #endif

  delay(1000);

  //Init Sonde
  sensor_cumulus.begin();
  sensor_out.begin();

  // Connect and test websocket server connectivity
  if (client.connect(HOSTNAME, PORT)) {
    #ifdef DEBUG  
      Serial.print("Connected to ");
      Serial.print(HOSTNAME);
      Serial.print(":");
      Serial.println(PORT);
    #endif
  } else {
    #ifdef DEBUG  
      Serial.println("Connection failed.");
    #endif
    while(1) {
      // Hang on failure
    }
  }
  
  // Define path and host for Handshaking with the server
  websocket.path = PATH;
  websocket.host = HOSTNAME;

  if (websocket.handshake(client)) {
    #ifdef DEBUG  
      Serial.println("Handshake successful");
    #endif
  } 
  else {
    #ifdef DEBUG  
      Serial.println("Handshake failed.");
    #endif
    while(1) {
      // Hang on failure
    }
  }

}

void loop() {
 
  char result[20];
  String wsMessage;
  
  sensor_cumulus.requestTemperatures();
  sensor_out.requestTemperatures();

  int tempa = (sensor_cumulus.getTempCByIndex(0) * 100);  
  int tempb = (sensor_out.getTempCByIndex(0) * 100);

  #ifdef DEBUG
    Serial.println(tempa);
    Serial.println(tempb);
  #endif
  
  //assemble the websocket outgoing message
  wsMessage = "temperature," + String(tempa, DEC);
  wsMessage.toCharArray(result,18);
  
  #ifdef DEBUG
    Serial.println(wsMessage);
  #endif
 
  if (client.connected()) {
    String data = websocket.getData();
    if (data.length() > 0) {
    #ifdef DEBUG
      Serial.print("Received data: ");
      Serial.println(data);
    #endif
    }

    #ifdef DEBUG
      Serial.println(F("Sending Data"));
    #endif
    websocket.sendData(result);
  } else {
    #ifdef DEBUG
      Serial.println("Client disconnected.");
    #endif
    while (1) {
      // Hang on disconnect.
    }
  }

  delay(3000);
}

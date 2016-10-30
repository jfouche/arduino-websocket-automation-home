/*
Desc: Affiche le différentiel de température entre deux sondes et pilote la chaudière.
Auteur: zasquash

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
    Serial.print("IP Arduino : ");
    Serial.println(Ethernet.localIP());
  #endif

  delay(1000);

  sensor_cumulus.begin();
  sensor_out.begin();

  delay(100);

  if (client.connect(HOSTNAME, PORT)) {
  #ifdef DEBUG  
      Serial.print("Connected to ");
      Serial.print(HOSTNAME);
      Serial.print(":");
      Serial.println(PORT);
  #endif
  } else {
    Serial.println("Connection failed.");
  delay(10000);
  }

}

void loop() {
 
  char chartmp[75];
  String wsMessage;
  
  sensor_cumulus.requestTemperatures();
  sensor_out.requestTemperatures();

  float tmpa = (sensor_cumulus.getTempCByIndex(0));  
  float tmpb = (sensor_out.getTempCByIndex(0));
  
  //assemble the websocket outgoing message
  wsMessage = "{setTemperature: {title: Chauffe eau, sensorIn: " + String(tmpa, 2) + ", sensorOut: " + String(tmpb, 2) + "}";
  wsMessage.toCharArray(chartmp,75);
  
      // Define path and host for Handshaking with the server
      websocket.path = PATH;
      websocket.host = HOSTNAME;
    
      if (websocket.handshake(client)) {
        #ifdef DEBUG
          Serial.println("Handshake successful");
        #endif
        
        String data = websocket.getData();
        if (data.length() > 0) {
        #ifdef DEBUG
          Serial.print("Received data: ");
          Serial.println(data);
        #endif
        }

#ifdef DEBUG
        Serial.print("senddata => ");
        Serial.println(chartmp);
#endif

        websocket.sendData(chartmp);
      }
      else {
        #ifdef DEBUG  
          Serial.println("Handshake failed.");
        #endif
      }
}

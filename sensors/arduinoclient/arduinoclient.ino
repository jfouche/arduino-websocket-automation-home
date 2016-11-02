/*
  Desc: Affiche le différentiel de température entre deux sondes et pilote la chaudière.
  Auteur: zasquash

  Matériel:
  Sonde: 2 x DS18B20
  Arduino Ethernet PoE
  Relay 5v

  Library from : https://github.com/djsb/arduino-websocketclient
*/

#include <SPI.h>
#include <Ethernet.h>
#include "WSClient.h"
#include <OneWire.h>
#include <DallasTemperature.h>

// Define a maximum framelength to 64 bytes. Default is 256. Don't Work !!!
#define MAX_FRAME_LENGTH 256

//PIN capteurs
#define SENSORA 2

//Définition des capteurs
OneWire TMP_CUMULUS(SENSORA);

DallasTemperature sensor_cumulus(&TMP_CUMULUS);

#define HOSTNAME   "192.168.1.1"            // Serveur distant
#define PORT        8000                    // Port du serveur distant
#define PATH        "/"                     // Path

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

  Serial.begin(115200);

  //Init Ethernet
  Ethernet.begin(mac, ip, subnet);
  //Ethernet.begin(mac, ip, subnet, myDNS, gateway);
  Serial.print("IP Arduino : ");
  Serial.println(Ethernet.localIP());

  delay(1000);

  sensor_cumulus.begin();

  delay(100);

  // Define path and host for Handshaking with the server
  websocket.path = PATH;
  websocket.host = HOSTNAME;
}

void loop() {

  char chartmp[56];
  String wsMessage;

  sensor_cumulus.requestTemperatures();

  float temperature = (sensor_cumulus.getTempCByIndex(0));

  //assemble the websocket outgoing message
  wsMessage = "{setTemperature: {name: cumulus, temperature: " + String(temperature, 2) + "}}";
  wsMessage.toCharArray(chartmp, 56);

  if (client.connect(HOSTNAME, PORT)) {
    Serial.println("Connected");

    if (websocket.handshake(client)) {
      Serial.println("Handshake successful");

      String data = websocket.getData();
  
      if (data.length() > 0) {
         Serial.print("Received data: ");
         Serial.println(data);
      }

      websocket.sendData(chartmp);

    } else {
      Serial.println("Handshake failed.");
    }
 
  } else {
    Serial.println("Connection failed.");
  }

  delay(1000);
  websocket.disconnect();
  
  delay(9000);
}

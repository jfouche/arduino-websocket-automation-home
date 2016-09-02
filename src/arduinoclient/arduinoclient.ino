/*
Desc: Affiche le différentiel de température entre deux sondes et pilote la chaudière.
Auteur: bardon.jeanalexandre@gmail.com

Matériel:
Sonde: 2 x DS18B20
Arduino Ethernet PoE
Relay 5v

Logiciel:
WebSocket: https://github.com/ejeklint/ArduinoWebsocketServer

TODO:
- Graphique températeure cumulus sur 24h
- Utiliser un capteur PIR tout ou rien numérique pour déclenchement écran
- Serveur web affichage température
- Controle distant extinction chaudière
- Déclenchement pompe
- Déclenchement bruleur/gaz
*/

#include <SPI.h>
#include <Ethernet.h>
#include <SocketIOClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

SocketIOClient client;

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

#define HOSTNAME   "192.168.1.1"    // Serveur distant
#define PORT        8000            // Port du serveur distant

byte mac[] = {0x52, 0x4F, 0x43, 0x4B, 0x45, 0x54 };
byte ip[] = {192, 168, 1 , 150 };
IPAddress subnet(255, 255, 255, 0);
//IPAddress myDns(192,168,100, 245);
//IPAddress gateway(192, 168, 100, 254);

void setup() {
  #ifdef DEBUG  
    Serial.begin(115200);
  #endif

  //Init Ethernet
  Ethernet.begin(mac, ip, subnet);

  //Init Sonde
  sensor_cumulus.begin();
  sensor_out.begin();

  delay(100); // Attend le chargement de la lib Ethernet
  
  #ifdef DEBUG  
    Serial.println("connecting...");
  #endif  

  client.setDataArrivedDelegate(ondata);

  int line = 1;
  while (true) {
    if (!client.connect(HOSTNAME, PORT)) {
      Serial.print(line);
      Serial.print(" - ");
      Serial.println("Not connected.");
    } else {
      Serial.println("Connected.");
      client.send("Client Ready!");
      break;
    }
    line += 1;
    delay(5000);
  }
  Serial.println("end loop");
}

#define HELLO_INTERVAL 3000
unsigned long lasthello;

void loop() {
/*
  sensor_cumulus.requestTemperatures();
  sensor_out.requestTemperatures();

  int tempa = (sensor_cumulus.getTempCByIndex(0) * 100);  
  int tempb = (sensor_out.getTempCByIndex(0) * 100);

  #ifdef DEBUG
    Serial.println(tempa);
    Serial.println(tempb);
  #endif
  
  //assemble the websocket outgoing message
  String wsMessage = String(tempa) + "," + String(tempb);

  #ifdef DEBUG
    Serial.println(wsMessage);
  #endif

  client.listen();

  unsigned long now = millis();
  
  //Envoi toutes les HELLO INTERVAL
  if ((now - lasthello) >= HELLO_INTERVAL) {
    lasthello = now;*/
    if (client.connected()) {
      client.send("Hello, world!\n");
    } else {
      #ifdef DEBUG
        Serial.println("Not connected.");
      #endif
    }/*
  }
  
*/  delay(5000);
}

/* #### Fonction #### */

// Affiche les données provenant du serveur
void ondata(SocketIOClient client, char *data) {
  #ifdef DEBUG
    Serial.print(data);
  #endif
}

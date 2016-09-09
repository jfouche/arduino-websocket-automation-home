## Arduino Websocket Automation Home

### Description
L'objectif de ce github est de creer une application opensource de domotique très simple. Elle regroupe des fonctionnalités:
- Dashboard bootstrap: Va permettre afficher les données simplement
- Un serveur: Ecrit en python, ce serveur récupère les données provenant d'un client pour classé dans une base de donnée- Une base de donnée: Stock les données
- Un client collectant les données.

```Javascript
                                                |-----------|
                                                | Webserver |
                                                | dashboard |
                                                |-----------| 
                                                      ||
                                                      ||
                                                      ||(WebSocket)
                                                      ||
|-----------|                                   |-----------|        |-----------|
| Arduino   |                                   |  Python   |        | Data Base |
|  Client   |<=========Ethernet/Wireless=======>|  Server   |<======>|  SQLlite  |
| Websocket |            (WebSocket)            | Websocket |        |-----------|
|-----------|                                   |-----------|
```

### ROADMAP

- Client:
	- Ecriture du client (C/C++): Regroupe essentiellement des capteurs: Température, Pression, Niveau, UV, Hall
	- Gérer la possibilité d'envoyer des commandes au client: Pilotage relay, moteur

- Serveur:
	- Ecriture du serveur
	- Inscription des valeurs dans la base de données
	- fichier de configuration du serveur (config.py)

Base de donnée:
	- Créer/trouver une organisation de la base de données

IHM/Dashboard:
	- Organiser le dashboard
	- Exploiter la remonter des données de la base de données
	- Intégrer des graphiques style http://www.highcharts.com/demo/dynamic-update

### Prerequis

Compiler avec l'IDE arduino 1.6.2 ou superieur.


### Credit

https://github.com/djsb/arduino-websocketclient

---------------------
The MIT License (MIT)

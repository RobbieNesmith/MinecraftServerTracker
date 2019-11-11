# Minecraft Server Tracker

Using [Dinnerbone's python library](https://github.com/Dinnerbone/mcstatus) for fetching data from a Vanilla Minecraft server.

## Installation

1. Set up a cron job to fetch data from your server(s) if you want server history. Use the `crontemplate.sh` script to generate the entry
1. Install requirements for Python server with `pip install -r requirements.txt`
1. run the server with `app.py`

## Other Scripts
* `getRankings.sh`: lists players by how many hours they have played on the server (assuming the cron polls every 5 minutes)
* `hourscount.sh`: gets how many hours a particular player has played on the server

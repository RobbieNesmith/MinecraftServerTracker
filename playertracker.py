from mcstatus import MinecraftServer
import sys
import datetime
import json

if len(sys.argv) != 2:
  exit()

server_name = sys.argv[1];
now = datetime.datetime.now()

onlineplayers = []
latency = 0

try:
    server = MinecraftServer.lookup(server_name)
    status = server.status()
    latency = status.latency
    isOk = True
    if status.players.sample:
        onlineplayers = [{"name": p.name, "id": p.id} for p in status.players.sample]
except Exception as e:
    print(e)
    isOk = False

filename = "/home/pi/minecraftinfoserver/servertracking/minecraft-server-info-{}-{}-{}-{}.json".format(server_name, now.year, now.month, now.day)

try:
    logfile = open(filename, "r")
    data = logfile.read()
    logfile.close()
    jsonData = json.loads(data)
except Exception as e:
    jsonData = []

jsonData.append({"timestamp": int(now.timestamp()), "players": onlineplayers, "latency": latency, "isOk": isOk})

outfile = open(filename, "w")
outfile.write(json.dumps(jsonData))
outfile.close()

from mcstatus import MinecraftServer
from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import socket

app = Flask(__name__)

recent_searches = []

@app.route("/server_enter")
def server_enter():
  return render_template("server_enter.html")

@app.route("/server_info")
def server_info_ajax():
  server_name = request.args.get("server_name")
  if server_name:
    return render_template("server_display_ajax.html", server_name = server_name)
  return redirect(url_for("server_enter"))

@app.route("/")
def homepage():
  return redirect(url_for("server_enter"))

@app.route("/recent")
def showrecent():
  return render_template("recent_searches.html", recent_searches = recent_searches)

@app.route("/server_history")
def server_track():
    server_name = request.args.get("server_name")
    return render_template("server_tracking.html", server_name = server_name)

# API

@app.route("/api/server_info")
def json_server_info():
  server_name = request.args.get("server_name")
  if server_name:
    try:
      mcserver = MinecraftServer.lookup(server_name)
      server_status = mcserver.status()
      if server_status.players.sample:
        sample = [{"name": p.name, "id": p.id} for p in server_status.players.sample]
      else:
        sample = []
      json_status = {"name": server_name,
          "description": server_status.description,
          "players": {"online": server_status.players.online,
              "max": server_status.players.max,
              "sample" : sample},
          "favicon": server_status.favicon,
          "version": {"name": server_status.version.name,
              "protocol": server_status.version.protocol},
          "latency": server_status.latency
      }
      if server_name not in recent_searches:
        recent_searches.append(server_name)
    except socket.gaierror:
      return jsonify(message="server not found")
    except socket.timeout:
      return jsonify(message="socket timed out")
    return jsonify(json_status)

@app.route("/api/server_history")
def json_server_track():
  server_name = request.args.get("server_name")
  year = request.args.get("year")
  month = request.args.get("month")
  day = request.args.get("day")
  try:
    return jsonify(json.load(open("servertracking/minecraft-server-info-{}-{}-{}-{}.json".format(server_name, year, month, day))))
  except FileNotFoundError:
    return jsonify({"error": "FileNotFoundError", "message": "File not found, make sure to enter the date in UTC."})

app.run(host="0.0.0.0", port=8000)

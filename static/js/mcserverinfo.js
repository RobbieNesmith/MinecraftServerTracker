function loadServerInfo(serverName) {
  fetch(`/api/server_info?server_name=${serverName}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(server_info) {
        document.getElementById("favicon").src = server_info.favicon;
        document.getElementById("description").innerText = server_info.description.text;
        document.getElementById("onlineplayers").innerText = server_info.players.online;
        document.getElementById("maxplayers").innerText = server_info.players.max;
        let playerList = document.getElementById("facelist");
        for (let player of server_info.players.sample) {
          playerList.appendChild(generatePlayerListElement(player.name, player.id));
        }
      });
}

function generatePlayerListElement(playerName, playerId) {
  let listElement = document.createElement("li");
  let nameHolder = document.createElement("span");
  let image = document.createElement("img");
  let fetchedImage = new Image();
  fetchedImage.onload = () => { setTimeout(() => { image.src = fetchedImage.src }, 100) };
  fetchedImage.src = `https://crafatar.com/avatars/${playerId}?overlay&size=32`;
  image.src = "/static/img/spingrass.gif";
  image.className = "face";
  nameHolder.innerText = playerName;
  nameHolder.className = "username";
  listElement.appendChild(image);
  listElement.appendChild(nameHolder);
  return listElement;
}

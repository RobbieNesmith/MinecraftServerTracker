function loadServerInfo(server_name) {
	let today = new Date();
	let todayYear = today.getUTCFullYear();
	let todayMonth = today.getUTCMonth() + 1;
	let todayDay = today.getUTCDate();

	const urlParams = new URLSearchParams(window.location.search);
	const urlYear = urlParams.get("year");
	const urlMonth = urlParams.get("month");
	const urlDay = urlParams.get("day");

	if (urlYear) {
		todayYear = urlYear;
		today.setUTCFullYear(urlYear);
	}
	if (urlMonth) {
		todayMonth = urlMonth;
		today.setUTCMonth(urlMonth - 1);
	}
	if (urlDay) {
		todayDay = urlDay;
		today.setUTCDate(urlDay);
	}

	const container = document.getElementById("serverInfo");

	container.appendChild(generateDayButtons(server_name, today));

	fetch(`/api/server_history?server_name=${server_name}&year=${todayYear}&month=${todayMonth}&day=${todayDay}`)
		.then(res => res.json())
		.then(json => {
				if (!json.error) {
					container.appendChild(generateTable(json));
				} else {
					let errorMessage = document.createElement("div");
					errorMessage.innerText = json.message;
					container.appendChild(errorMessage);
				}
				});
}

function getAllPlayers(history) {
	let players = {};
	for (let entry of history) {
		for (let player of entry.players) {
			if (!(player.name in players)) {
				players[player.name] = player.id;
			}
		}
	}
	return players;
}

function generateTable(history) {
	const palette = getShuffledPalette();
	const players = getAllPlayers(history);
	let table = document.createElement("table");
	table.className = "playerListTable";
	let tbody = document.createElement("tbody");

	let serverAliveRow = document.createElement("tr");
	let serverAliveTitle = document.createElement("td");
	serverAliveTitle.innerText = "Server status";
	serverAliveRow.appendChild(serverAliveTitle);
	for (let entry of history) {
		let td = document.createElement("td");
		td.className = "playerListCell";
		let serverIndicator = document.createElement("div");
		if (entry.isOk) {
			serverIndicator.className = "playerIndicator serverAlive";
		} else {
			serverIndicator.className = "playerIndicator serverDead";
		}
		td.appendChild(serverIndicator);
		serverAliveRow.appendChild(td);
	}
	tbody.appendChild(serverAliveRow);

	let playerKeys = Object.keys(players);

	for (i = 0; i < playerKeys.length; i++) {
		const player = playerKeys[i];
		let tr = document.createElement("tr");
		let playerName = document.createElement("td");
		let playerNameText = document.createElement("span");
		let playerImage = document.createElement("img");
		let playerImageLink = document.createElement("a");
		let fetchedImage = new Image();
		fetchedImage.onload = () => { setTimeout(() => { playerImage.src = fetchedImage.src }, 100) };
		fetchedImage.src = `https://crafatar.com/avatars/${players[player]}?size=16`;
		playerImageLink.href=`https://namemc.com/profile/${players[player]}`;
		playerImage.src = "/static/img/spingrass.gif";
		playerImage.className = "smallFace";
		playerNameText.innerText = player;
		playerNameText.style.marginLeft = "0.5rem";
		playerNameText.style.marginRight = "0.5rem";
		playerImageLink.appendChild(playerImage);
		playerName.appendChild(playerImageLink);
		playerName.appendChild(playerNameText);
		tr.appendChild(playerName);
		for (let entry of history) {
			let containsThisPlayer = false;
			for (let p of entry.players) {
				if (p.name === player) {
					containsThisPlayer = true;
					break;
				}
			}

			let td = document.createElement("td");
			td.className = "playerListCell";
			let playerIndicator = document.createElement("div");
			playerIndicator.className = "playerIndicator";
			if (containsThisPlayer) {
				const theColor = palette[i % palette.length];
				playerIndicator.style.backgroundColor = `rgb(${theColor[0]},${theColor[1]},${theColor[2]})`;
			}
			td.append(playerIndicator);
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	return table;
}

function generateDayButtons(server_name, date) {
	const buttonPrefix = `/server_history?server_name=${server_name}`;
	let prevDate = new Date(date);
	prevDate.setUTCDate(prevDate.getUTCDate() - 1)
	let nextDate = new Date(date);
	nextDate.setUTCDate(nextDate.getUTCDate() + 1)
	let buttonContainer = document.createElement("div");
	let prevButton = document.createElement("button");
	let nextButton = document.createElement("button");
	let todayButton = document.createElement("button");
	let prevButtonLink = document.createElement("a");
	let nextButtonLink = document.createElement("a");
	let todayButtonLink = document.createElement("a");
	prevButtonLink.href = `${buttonPrefix}&year=${prevDate.getUTCFullYear()}&month=${prevDate.getUTCMonth() + 1}&day=${prevDate.getUTCDate()}`;
	nextButtonLink.href = `${buttonPrefix}&year=${nextDate.getUTCFullYear()}&month=${nextDate.getUTCMonth() + 1}&day=${nextDate.getUTCDate()}`;
	todayButtonLink.href = buttonPrefix;
	prevButton.innerText = "Previous day";
	nextButton.innerText = "Next day";
	todayButton.innerText = "Today";
	prevButtonLink.appendChild(prevButton);
	nextButtonLink.appendChild(nextButton);
	todayButtonLink.appendChild(todayButton);
	buttonContainer.appendChild(prevButtonLink);
	buttonContainer.appendChild(nextButtonLink);
	buttonContainer.appendChild(todayButtonLink);
	return buttonContainer;
}

loadServerInfo(document.getElementById("serverInfo").dataset.serverName);

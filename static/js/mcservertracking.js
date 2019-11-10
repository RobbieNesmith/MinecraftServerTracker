class ServerHistoryPage extends React.Component {
	render() {
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
		return (
			<div>
				<DaySelectionButtons date={ today } serverName={ this.props.serverName }/>
				<PlayerTable date={ today } serverName={ this.props.serverName } />
			</div>
		);
	}
}

class PlayerTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = { entries: [], filterValue: "", playerList: [], errorMessage: "", palette: getShuffledPalette(), status: "loading"};
	}

	componentDidMount() {
		const todayYear = this.props.date.getUTCFullYear();
		const todayMonth = this.props.date.getUTCMonth() + 1;
		const todayDay = this.props.date.getUTCDate();
		fetch(`/api/server_history?server_name=${this.props.serverName}&year=${todayYear}&month=${todayMonth}&day=${todayDay}`)
			.then(res => res.json())
			.then(json => {
					if (!json.error) {
						let playersWithTimes = [];
						let serverAlive = [];
						let latencies = [];
						const players = getAllPlayers(json)
						for (let player of players) {
							let times = [];
							for (let entry of json) {
								let containsThisPlayer = false;
								for (let p of entry.players) {
									if (p.name === player.name) {
										containsThisPlayer = true;
										break;
									}
								}
								times.push(containsThisPlayer);
							}
							playersWithTimes.push({...player, "onlineTimes": times});
						}
						this.setState({status:"loaded", entries: json, latencies: latencies, serverAlive: serverAlive, playerList: playersWithTimes});
					} else {
						this.setState({status: "error", errorMessage: json.message});
					}
			});
	}

	render() {
		if (this.state.status === "loading") {
			return <div>Loading server history...</div>;
		} else if (this.state.status === "error") {
			return(
				<div>
					<div><b>Error!!</b></div>
					<div>{ this.state.errorMessage }</div>
				</div>
			);
		}
		return (
			<div>
				<span>
					<span>Filter players: </span>
					<input id="playerFilter" onInput={ (ev) => this.setState({filterValue: ev.target.value})} />
				</span>
				<table className="playerListTable">
					<tbody>
						<tr>
							<td>Time:</td>
							{ this.state.entries.map((entry) => {
								const theDate = new Date(entry.timestamp * 1000);
								let nearestHour = null;
								if (theDate.getMinutes() < 3) {
									nearestHour = theDate.getHours();
								} else if (theDate.getMinutes() > 57) {
									nearestHour = theDate.getHours() + 1;
								}
								if (nearestHour !== null) {
									return (<td style={{position: "absolute"}}>
										{ `${nearestHour}:00` }
									</td>);
								} else {
									return <td />
								}
							}) }
						</tr>
						<tr>
							<td>Server Status</td>
							{ this.state.entries.map((entry) => {
								let className = "serverDead";
								if (entry.isOk) {
									className = "serverAlive";
								}
								return <td className="playerListCell"><div className={ `${className} playerIndicator` } /></td>
							}) }
						</tr>
						<tr>
							<td>Latency</td>
							{ this.state.entries.map((entry) => {
								if (entry.isOk) {
									return(
										<td className="playerListCell">
											<div
												style={ {backgroundColor: "blue", width: "0.25rem", height: `${entry.latency / 100}rem`} }
											/>
										</td>
									);
								} else {
									return <td className="playerListCell"/>
								}
							}) }
						</tr>
						{ this.state.playerList.map((player, index) => {
							return (<PlayerTableRow playerFilter={this.state.filterValue} playerName={player.name} playerId={ player.id } color={ this.state.palette[index % this.state.palette.length] } onlineTimes={ player.onlineTimes }/>);
						}) }
					</tbody>
				</table>
			</div>
		);
	}
}

class PlayerTableRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {imgUrl: "/static/img/spingrass.gif"};
	}

	componentDidMount() {
		let fetchedImage = new Image();
		fetchedImage.onload = () => { setTimeout(() => { this.setState({imgUrl: fetchedImage.src })}, 100) };
		fetchedImage.src = `https://crafatar.com/avatars/${this.props.playerId}?overlay&size=16`;
	}

	render() {
		let show = "none";
		for (let keyword of this.props.playerFilter.split(" ")) {
			if (this.props.playerName.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
				show = null;
			}
		}
		return(
			<tr style={{display: show}} >
				<td className="playerListCell">
					<a href={ `https://namemc.com/profile/${this.props.playerId}` }>
						<img src={ this.state.imgUrl } className="smallFace" />
					</a>
					<span>
						{ this.props.playerName }
					</span>
				</td>
				{ this.props.onlineTimes.map((timeSlot) => {
					let backgroundColor = "white";
					if (timeSlot) {
						backgroundColor = `rgb(${this.props.color[0]}, ${this.props.color[1]}, ${this.props.color[2]})`;
					}
					return (<td className="playerListCell"><div className="playerIndicator" style={{"backgroundColor": backgroundColor}}/></td>);
				}) }
			</tr>
		);
	}
}

class DaySelectionButtons extends React.Component{
	render() {
		const buttonPrefix = `/server_history?server_name=${this.props.serverName}`;
		let prevDate = new Date(this.props.date);
		prevDate.setUTCDate(prevDate.getUTCDate() - 1)
		let nextDate = new Date(this.props.date);
		nextDate.setUTCDate(nextDate.getUTCDate() + 1)
		return (
			<div>
				<a href={ `${buttonPrefix}&year=${prevDate.getUTCFullYear()}&month=${prevDate.getUTCMonth() + 1}&day=${prevDate.getUTCDate()}` }>
					<button>Previous Day</button>
				</a>
				<a href={ `${buttonPrefix}&year=${nextDate.getUTCFullYear()}&month=${nextDate.getUTCMonth() + 1}&day=${nextDate.getUTCDate()}` }>
					<button>Next Day</button>
				</a>
				<a href={ buttonPrefix }>
					<button>Today</button>
				</a>
			</div>
		);
	}
}

function getAllPlayers(history) {
	let playerNames = [];
	let players = [];
	for (let entry of history) {
		for (let player of entry.players) {
			if (!playerNames.includes(player.name)) {
				players.push({"name": player.name, "id": player.id});
				playerNames.push(player.name);
			}
		}
	}
	return players;
}

ReactDOM.render(<ServerHistoryPage serverName={ document.getElementById("serverInfo").dataset.serverName }/>, document.getElementById("serverInfo"));

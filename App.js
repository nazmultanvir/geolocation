import React, { Component } from 'react';
import { View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			latitude: null,
			longitude: null,
			error: null,
		};
	}

	componentDidMount() {
		this.watchId = navigator.geolocation.watchPosition(
			position => {
				let data =
					'deviceId=' +
					DeviceInfo.getUniqueID() +
					'&latitude=' +
					position.coords.latitude +
					'&longitude=' +
					position.coords.longitude +
					'&accuracy=' +
					position.coords.accuracy;
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;

				xhr.addEventListener('readystatechange', function() {
					if (this.readyState === 4) {
						console.log(this.responseText);
					}
				});

				xhr.open('POST', 'http://cf591025.ngrok.io/api/tracker/');
				xhr.setRequestHeader('Cache-Control', 'no-cache');
				xhr.setRequestHeader('Postman-Token', '94a5e68e-3c8b-4269-90e4-150ffb34c4be');
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send(data);
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					error: null,
				});
			},
			error => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
		);
	}

	componentWillUnmount() {
		setInterval(function() {
			navigator.geolocation.clearWatch(this.watchId);
			console.log('ping2');
		}, 3000);
	}

	render() {
		return (
			<View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text>Latitude: {this.state.latitude}</Text>
				<Text>Longitude: {this.state.longitude}</Text>
				{this.state.error ? <Text>Error: {this.state.error}</Text> : null}
			</View>
		);
	}
}

export default App;

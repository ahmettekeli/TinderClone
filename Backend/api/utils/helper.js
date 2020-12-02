const degreesToRadians = (degrees) => {
		return (degrees * Math.PI) / 180;
	},
	getDistanceBetweenCoordinatesInKm = (lat1, lon1, lat2, lon2) => {
		const earthRadiusKm = 6371;

		let dLat = degreesToRadians(lat2 - lat1),
			dLon = degreesToRadians(lon2 - lon1);

		lat1 = degreesToRadians(lat1);
		lat2 = degreesToRadians(lat2);

		//Haversine formula
		let a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earthRadiusKm * c;
	};

module.exports = { getDistanceBetweenCoordinatesInKm };

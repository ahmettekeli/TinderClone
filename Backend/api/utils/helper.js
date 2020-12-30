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
	},
	generateQueryForUserPrefrence = (user) => {
		const query = [
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: user.location.coordinates,
					},
					distanceField: "distance.calculated", //output field that contains calculated distance
					maxDistance: user.distancePrefrence,
					query: {
						$and: [
							{
								isActive: true,
							},
							{
								gender: user.lookingFor,
							},
							{
								dateOfBirth: {
									$lte: new Date(Date.now() - 31557600000 * user.agePreference.min),
									$gte: new Date(Date.now() - 31557600000 * user.agePreference.max),
								},
							},
							{
								_id: { $nin: user.dislikes },
							},
							{
								_id: { $nin: user.likes },
							},
							{
								_id: { $nin: user._id },
							},
							// the user is not already a matched user.
						],
					},
				},
			},
			{
				//Show only the fields below.
				$project: {
					personalInfo: true,
					gender: true,
					distance: true,
					age: {
						$let: {
							vars: {
								diff: {
									$subtract: [new Date(), "$dateOfBirth"],
								},
							},
							in: {
								$divide: ["$$diff", 31557600000],
							},
						},
					},
				},
			},
		];
		return query;
	};

module.exports = {
	getDistanceBetweenCoordinatesInKm,
	generateQueryForUserPrefrence,
};

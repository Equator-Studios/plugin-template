const providers = [
	{
		name: "Bill's and Bob's fences",
		costPerMeter: 10,
		time: '10 days',
		id: 0,
	},
	{
		name: "Ron's discount fences",
		costPerMeter: 8,
		time: '20 days',
		id: 1,
	},
	{
		name: "Jill's speedy fences",
		costPerMeter: 13,
		time: '5 days',
		id: 2
	},
];

return () => ({
	packetHandler: ({points}) => {
		let len = 0;
		for (let i = 0; i < points.length - 1; i++) {
			len += points[i].distance(points[i + 1]);
		}
		
		return providers.map(provider => {
			return {
				name: provider.name,
				cost: '$' + (provider.costPerMeter * len).toFixed(2),
				time: provider.time,
			};
		});
	}
});

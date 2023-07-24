
return ({shared}) => {
	const BidInspector = ({bid, exit}) => {
		return React.createElement(style.HorizontalAlign, {style: {height: '100%'}},
			React.createElement(style.Contain, {style: {height: '100%'}, scroll: true},
				React.createElement('div', {},
					Object.keys(bid.details).map(detail => {
						return React.createElement('div', {style: {fontSize: 10}, key: detail}, `${detail} ${bid.details[detail]}`);
					})
				),
			),
			React.createElement(style.Center, {style: {width: '100%'}},
				React.createElement(style.Button, {onClick: exit}, "Go Back"),
			),
			React.createElement(style.Button, {
				onClick: () => {
					window.open(bid.viewUrl);
				}
			}, "Open Offer Page"),
		);
	};

	const BidElement = ({bid, inspect}) => {
		return React.createElement('div', {},
			React.createElement(style.Paper, {
				style: {
					width: 250,
					height: 200,
					margin: 5,
				},
				onClick: () => {
					inspect();
				},
			},
				React.createElement(style.HorizontalAlign, {style: {height: '100%'}},
					React.createElement(style.Text, {value: Observer.immutable(bid.name), style: {height: 20}}),
					React.createElement(style.Center, {style: {width: '100%', height: '100%'}},
						React.createElement('img', {src: bid.logo, style: {width: '100%'}}),
					),
				),
			),
		);
	};

	const Menu = () => {
		const [bids, setBids] = React.useState(null);
		const [inspecting, setInspecting] = React.useState(null);
		
		React.useEffect(() => {
			shared.socket.send("plugins/bat", {}).then(bids => {
				setBids(bids);
			});
		}, []);

		// create a map of the bid locations (or at least their institution locations)
		React.useEffect(() => {
			if (!bids) return;

			const points = Layer.fromName('points')();

			let locs = bids.filter(bid => bid.location);
			let geom = new Float32Array(locs.length * 3);

			for (let i = 0; i < locs.length; i++) {
				const bid = locs[i];

				const pos = Projection.projectFromWGS(Math.vec3(
					bid.location.geometry.location.lng, bid.location.geometry.location.lat, 0));

				let ii = i * 3;
				geom[ii + 0] = pos[0];
				geom[ii + 1] = pos[1];
				geom[ii + 2] = pos[2];
			}

			points._feature = {
				geom,
				offset: Math.vec3(0, 0, 0),
				shapeSplits: [0],
			};
			
			shared.view.$hidden.push(points);
			return () => {
				let i = shared.view.$hidden.indexOf(points);
				if (i >= 0) shared.view.$hidden.splice(i, 1);
			}
		}, [bids]);

		if (!bids) return null;

		if (inspecting) {
			return React.createElement(BidInspector, {bid: inspecting, exit: () => {
				setInspecting(null);
			}});
		}

		let categories = new Map();
		for (const bid of bids) {
			const org = bid.organization.name;
			if (!categories.has(org)) categories.set(org, []);
			categories.get(org).push(bid);
		}

		return React.createElement('div', {}, [...categories.entries()].map(([name, bids]) => {
			return React.createElement(style.Category, {name, key: name},
				 bids.map(bid => React.createElement(BidElement, {bid, key: bid.name, inspect: () => {
					setInspecting(bid);
				 }}))
			);
		}));
	};

	return {
		nav: {mode: 'side', icon: style.Icon('globe'), Menu},
		translation: {
			en: {
				translation: {
					'plugins/bat': 'Bids',
				}
			}
		},
	};
};

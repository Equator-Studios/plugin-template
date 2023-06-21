
return ({shared}) => {
	const TrackingModal = ({modal}) => {
		const button = (name) => {
			return React.createElement(style.Button, {
				onClick: () => {
					shared.user.settings.pluginFences_tracking = name;
					modal.close();
				},
			}, name);
		};

		return React.createElement(style.Paper, {},
			React.createElement(style.HorizontalAlign, {style: {padding: 20}},
				React.createElement(style.Center, {style: {height: 50}}, "Select what you'll be using this plugin for"),
				React.createElement(style.VerticalAlign, {style: {width: '100%', height: '100%'}},
					button("Customer"),
					button("Provider"),
				)
			)
		);
	};

	const ModalInfo = ({info}) => {
		if (!info) {
			return 'Loading...';
		}

		return React.createElement(style.VerticalAlign, {},
			info.map(provider => {
				return React.createElement(style.Paper, {key: provider.id, style: {margin: 10, minHeight: 200}},
					React.createElement(style.HorizontalAlign, {style: {height: '100%'}},
						React.createElement('div', {style: {height: '100%', margin: 10}},
							React.createElement(style.Center, {style: {fontSize: 20, marginBottom: 10}}, `${provider.name}`),
							React.createElement('div', {}, `Estimated Cost: ${provider.cost}`),
							React.createElement('div', {}, `Estimated Completion Time: ${provider.time}`),
						),
						React.createElement(style.Button, {}, "Contact Business"),
					),
				);
			}),
		);
	};

	const CostModal = ({modal}) => {
		const [info, setInfo] = React.useState(null);
		const [failed, setFailed] = React.useState(false);
		const [points] = useObserver(modal.layer, o => o.path('points').map(layers => [...layers]));

		React.useEffect(() => {
			setFailed(false);

			shared.socket.send("plugins/fences", {points}).then(info => {
				setInfo(info);
			}).catch(e => {
				setFailed('Something went wrong!');
			});
		}, [points]);

		return React.createElement(style.Paper, {}, 
			React.createElement(style.HorizontalAlign, {},
				React.createElement(style.Center, {style: {width: '100%', height: '100%'}},
					failed ? failed : React.createElement(ModalInfo, {info}),
				),
				React.createElement(style.Center, {style: {width: '100%', height: 50}},
					React.createElement(style.Button, {
						onClick: () => modal.close(),
						style: {width: 200},
					}, "Okay"),
				),
			),
		);
	};

	const FenceLayer = ({layer}) => {
		const [distance] = useObserver(layer, '$distance');

		return React.createElement(style.Paper, {
			style: {
				width: 'calc(100% - 40)',
				height: 100,
				margin: 5,
			},
		},
			React.createElement(style.Text, {value: layer.observer.path('name'), style: {height: 20}}),
			`Fence length: ${distance.toFixed(0)}m`,
			React.createElement(style.Button, {
				onClick: () => {
					shared.ui.showModal(CostModal, {layer: layer});
				}
			}, "Calculate Cost"),
		);
	};

	const Menu = (stuff) => {
		const [layers] = useObserver(shared, o => o.path('project', 'layers').shallow(1).map(layers => {
			return layers.filter(layer => layer.pluginFences_layer);
		}));

		return React.createElement(style.HorizontalAlign, {
			style: {width: '100%', height: '100%'}
		},
			React.createElement(style.Contain, {style: {
				background: 'white',
				height: '100%',
				width: 300,
			}}, React.createElement('div', {},
				layers.map(layer => {
					return React.createElement(FenceLayer, {layer, key: layer.id});
				})
			)),
			React.createElement(style.Button, {
				background: 'white',
				style: {
					height: 30,
				},
				onClick: async () => {
					const layer = await Layer.fromName('measurement').requestFromUser('Cross Section', shared.view);
					layer.pluginFences_layer = true;
					layer.name = "Fence Boundary";
					shared.project.add(layer);
				},
			}, 'Add Fence'),
		);
	};

	return {
		nav: {mode: 'side', icon: style.Icon('globe'), Menu},
		translation: {
			en: {
				translation: {
					'plugins/fences': 'Fences',
				}
			}
		},
		init: ({autoLoaded}) => {
			if (autoLoaded && !shared.user.settings.pluginFences_tracking) {
				shared.ui.showModal(TrackingModal);
			}
		},
	};
};

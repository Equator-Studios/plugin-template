return ({ shared }) => {
	const BusinessInfoModal = ({ info }) => {
		if (!info) {
			return 'Loading...';
		}

		return React.createElement('div', {},
			info.map(business => {
				return React.createElement('div', { key: business.name },
					React.createElement('h3', {}, business.name),
					React.createElement('div', {}, `Rating: ${business.rating}`),
					React.createElement('div', {}, `Phone: ${business.phoneNumber}`)
				);
			})
		);
	};

	const FetchBusinessInfoButton = ({ setBusinessInfo, formData }) => {
		return React.createElement('button', {
			onClick: async () => {
				try {
					const businessInfo = await shared.socket.send("plugins/jobs_and_leads", formData);
					setBusinessInfo(businessInfo);
				} catch (error) {
					console.error('Failed to fetch business info', error);
				}
			}
		}, 'Fetch Business Info');
	};

	const Menu = () => {
		const [businessInfo, setBusinessInfo] = React.useState(null);
		const [formData, setFormData] = React.useState({
			location: '37.7749,-122.4194',
			radius: '500',
			keyword: 'restaurant',
			type: 'restaurant'
		});

		const handleInputChange = (e) => {
			setFormData({
				...formData,
				[e.target.name]: e.target.value
			});
		};

		return React.createElement('div', {},
			React.createElement('label', {}, 'Location:',
				React.createElement('input', {
					type: 'text',
					name: 'location',
					value: formData.location,
					onChange: handleInputChange
				})
			),
			React.createElement('label', {}, 'Radius:',
				React.createElement('input', {
					type: 'text',
					name: 'radius',
					value: formData.radius,
					onChange: handleInputChange
				})
			),
			React.createElement('label', {}, 'Keyword:',
				React.createElement('input', {
					type: 'text',
					name: 'keyword',
					value: formData.keyword,
					onChange: handleInputChange
				})
			),
			React.createElement('label', {}, 'Type:',
				React.createElement('select', {
					name: 'type',
					value: formData.type,
					onChange: handleInputChange
				},
					React.createElement('option', { value: 'general_contractor' }, 'General Contractor'),
					React.createElement('option', { value: 'electrician' }, 'Electrician'),
				)
			),
			React.createElement(FetchBusinessInfoButton, {
				setBusinessInfo,
				formData
			}),
			businessInfo && React.createElement(BusinessInfoModal, { info: businessInfo })
		);
	};

	return {
		nav: { mode: 'side', icon: style.Icon('icon'), Menu },
		translation: {
			en: {
				translation: {
					'plugins/jobs_and_leads': 'Jobs and Leads'
				}
			}
		}
	};
};

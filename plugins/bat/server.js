return () => {
	const search = async query => {
		if (!persistent.locations) persistent.locations = OArray();
		let cached = persistent.locations.find(e => e.query === query);
		if (cached) return cached;

		if (!persistent.googleKey) return null;

		const options = {
			key: persistent.googleKey,
			inputtype: 'textquery',
			query: query,
		};

		let req = await fetch("https://maps.googleapis.com/maps/api/place/textsearch/json?" + Object.entries(options).map(([key, val]) => {
			return key + '=' + encodeURIComponent(val);
		}).join("&"));

		let results = await req.json();

		if (results.status === 'ZERO_RESULTS'){
			return null;
		} else if (results.status !== 'OK') {
			return null;
		}

		persistent.locations.push({
			...results.results[0],
			query: query,
		});

		return results.results[0];
	};

	const updateTender = async tender => {
		// see if we already know about the tender
		if (persistent.bids) {
			const bid = persistent.bids.find(bid => bid.viewUrl === tender.viewUrl);
			if (bid) {
				if (bid.location === null) bid.location = await search(tender.organization.displayName);
				return bid;
			}
		}

		const bidText = await (await fetch(tender.viewUrl)).text();
		const bid = await new Promise((ok, error) => {
			new htmlparser.Parser(new htmlparser.DomHandler ((err, dom) => {
				if (err) return error(err);
				ok(dom);
			})).parseComplete(bidText);
		});

		const details = {};

		const getString = elems => {
			let e = '';
			for (let elem of elems) {
				if (elem.type === 'text') {
					e += elem.data;
				} else if (elem.type === 'tag') {
					e += getString(elem.children);
				}
			}

			return e;
		};

		const findImageSource = elem => {
			for (let e of elem) {
				if (e.type === 'tag' && e.name === 'img') {
					return e.attribs.src;
				} else if (e.children) {
					let src = findImageSource(e.children);
					if (src) return src;
				}
			}
		};

		let logo;

		const find = elem => {
			for (let e of elem) {
				if (e.type === 'tag' && e.name === 'table' && e.attribs['aria-label'] === 'Bid Details') {
					for (let ee of e.children) {
						if (ee.type === 'tag' && ee.name === 'tr') {
							let key, value;
							for (let eee of ee.children) {
								if (eee.type === 'tag' && eee.name === 'th') {
									key = getString(eee.children).trim();
								}
								if (eee.type === 'tag' && eee.name === 'td') {
									value = getString(eee.children).trim();
								}
							}
							details[key] = value;
						}
					}
				} else if (e.type === 'tag' && e.name === 'div' && e.attribs.id === 'logo') {
					logo = findImageSource(e.children);
				} else if (e.children) {
					find(e.children);
				}
			}
		};

		find(bid);

		// some logos are relative paths
		if (logo.startsWith('/')) {
			let url = new URL(tender.viewUrl);
			logo = url.protocol + "//" + url.host + logo;
		}

		return {
			...tender,
			location: await search(tender.organization.displayName),
			details,
			logo,
		};
	};

	const update = async () => {
		const bids = await (await fetch('https://bidsandtenders.ic9.esolg.ca/Modules/BidsAndTenders/services/bidsSearch.ashx?pageNum=1&pageSize=25&statusId=1&organizationId=0&sortColumn=UtcPublishDate&sortDir=DESC')).json();

		if (!bids.success) {
			throw new Error("Could not get bids!");
		}

		const tenders = bids.data.tenders;
		const results = [];
		for (const tender of tenders) {
			results.push(await updateTender(tender));
		}

		persistent.bids = results;
	};

	// update every 30 minutes
	const interval = setInterval(update, 1000 * 60 * 30);

	update();

	return {
		packetHandler: () => {
			return persistent.bids;
		},
		unload: () => {
			clearInterval(interval);
		}
	}
};

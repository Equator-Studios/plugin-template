const dummyBusinessContactInfo = [
	{
		name: "Bill's and Bob's Fences",
		rating: 4.6,
		phoneNumber: "804-222-1111",
		address: "566 South Rockledge Lane Houston, TX 77016"
	},
	{
		name: "Smithson Construction",
		rating: 4.8,
		phoneNumber: "555-123-4567",
		address: "123 Main Street Seattle, WA 98101"
	},
	{
		name: "Elite Roofing Solutions",
		rating: 4.5,
		phoneNumber: "777-456-7890",
		address: "789 Elm Avenue Miami, FL 33133"
	},
	{
		name: "All-Star Plumbing Services",
		rating: 4.7,
		phoneNumber: "888-987-6543",
		address: "456 Oak Street Denver, CO 80202"
	},
	{
		name: "Master Electricians Inc.",
		rating: 4.9,
		phoneNumber: "555-555-5555",
		address: "789 Maple Avenue San Francisco, CA 94102"
	}
];

const nearbySearchBaseURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const placeDetailsBaseURL = 'https://maps.googleapis.com/maps/api/place/details/json';
const apiKey = '';

const fetchNearbyPlaces = async (location, radius, keyword, type) => {
	const url = `${nearbySearchBaseURL}?location=${location}&radius=${radius}&keyword=${keyword}&type=${type}&key=${apiKey}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();

	if (data.status !== 'OK') {
		throw new Error(`API error! status: ${data.status}`);
	}

	return data.results;
};

const fetchPlaceDetails = async (placeId) => {
	const fields = 'name,rating,formatted_phone_number,formatted_address';
	const url = `${placeDetailsBaseURL}?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();

	if (data.status !== 'OK') {
		throw new Error(`API error! status: ${data.status}`);
	}

	return data.result;
};

const fetchBusinessContactInfo = async (location, radius, keyword, type) => {
	const fetchedPlaces = await fetchNearbyPlaces(location, radius, keyword, type);

	const businessContactInfo = [];

	for (const place of fetchedPlaces) {
		const details = await fetchPlaceDetails(place.place_id);
		businessContactInfo.push({
			name: details.name,
			rating: details.rating,
			phoneNumber: details.formatted_phone_number,
			address: details.formatted_address
		});
	}

	return businessContactInfo;
};

return () => ({
	packetHandler: async ({location, radius, keyword, type}) => {
		console.log(`Received values from client:`);
		console.log(`Location: ${location}`);
		console.log(`Radius: ${radius}`);
		console.log(`Keyword: ${keyword}`);
		console.log(`Type: ${type}`);

		if (!apiKey) {
			console.log("Using dummy data because the API key is not set.");
			return dummyBusinessContactInfo;
		}
		const businessContactInfo = await fetchBusinessContactInfo(location, radius, keyword, type);
		return businessContactInfo;
	}
});
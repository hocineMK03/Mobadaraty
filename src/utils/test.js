function haversineDistance(coord1, coord2) {
    const toRad = (angle) => (Math.PI / 180) * angle;
    const R = 6371; 
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);
    const lat1 = toRad(coord1[0]);
    const lat2 = toRad(coord2[0]);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function assignVolunteers(volunteers, locations) {
    let assignments = {};
    locations.forEach(loc => assignments[loc.locationId] = []);

   
    locations.sort((a, b) => 
        (b.requiredVolunteers - b.currentVolunteers) - (a.requiredVolunteers - a.currentVolunteers)
    );

    volunteers.forEach(volunteer => {
        let bestLocation = null;
        let minDistance = Infinity;

        for (const location of locations) {
            let gap = location.requiredVolunteers - location.currentVolunteers;
            if (gap <= -2) continue; 

            const distance = haversineDistance(volunteer.coordinates, location.coordinates);
            if (distance < minDistance) {
                minDistance = distance;
                bestLocation = location;
            }
        }

        
        if (!bestLocation) {
            for (const location of locations) {
                const distance = haversineDistance(volunteer.coordinates, location.coordinates);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestLocation = location;
                }
            }
        }

        if (bestLocation) {
            assignments[bestLocation.locationId].push(volunteer.volunteerID);
            bestLocation.currentVolunteers++; // Update assigned count
        }
    });

    return assignments;
}


const volunteers =[
	{
		"volunteerID": "67d407431b3ca1bb5fefb029",
		"volunteerType": "independent",
		"skills": [
			"JavaScript",
			"React",
			"Node.js"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d407671b3ca1bb5fefb02c",
		"volunteerType": "independent",
		"skills": [
			"JavaScript",
			"React",
			"Node.js"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d407891b3ca1bb5fefb02f",
		"volunteerType": "independent",
		"skills": [
			"JavaScript",
			"React",
			"Node.js"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d407911b3ca1bb5fefb032",
		"volunteerType": "independent",
		"skills": [
			"JavaScript",
			"React",
			"Node.js"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d40849324064b90574c2ff",
		"volunteerType": "independent",
		"skills": [
			"JavaScript",
			"React",
			"Node.js"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d44c6ce545e949f6120d9a",
		"volunteerType": "independent",
		"skills": [
			"JavaScript",
			"React",
			"Node.js"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d44ccfe545e949f6120d9d",
		"volunteerType": "independent",
		"skills": [
			"Delivery",
			"Cooking"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	},
	{
		"volunteerID": "67d44d26e545e949f6120da0",
		"volunteerType": "independent",
		"skills": [
			"Delivery",
			"Cooking"
		],
		"coordinates": [
			43.3258846,
			2.8871717
		]
	}
]
const locations = [
	{
		"locationId": "67d4057176c5291c11ae680c",
		"associationId": "67d4056e76c5291c11ae6809",
		"skills": [
			"first aid",
			"event management",
			"teaching"
		],
		"requiredVolunteers": 5,
		"currentVolunteers": 2,
		"coordinates": [
			36.7014097,
			3.2293304654793413
		]
	},
	{
		"locationId": "67d4057176c5291c11ae680d",
		"associationId": "67d4056e76c5291c11ae6809",
		"skills": [],
		"requiredVolunteers": 0,
		"currentVolunteers": 0,
		"coordinates": [
			36.7700535,
			3.055364365850858
		]
	},
	{
		"locationId": "67d4057176c5291c11ae680e",
		"associationId": "67d4056e76c5291c11ae6809",
		"skills": [],
		"requiredVolunteers": 0,
		"currentVolunteers": 0,
		"coordinates": [
			36.74853945,
			3.0759318861461464
		]
	},
	{
		"locationId": "67d4057176c5291c11ae680f",
		"associationId": "67d4056e76c5291c11ae6809",
		"skills": [],
		"requiredVolunteers": 0,
		"currentVolunteers": 0,
		"coordinates": [
			36.8011287,
			3.0430556
		]
	},
	{
		"locationId": "67d43394b0ca3697b1b9a939",
		"associationId": "67d43390b0ca3697b1b9a937",
		"skills": [],
		"requiredVolunteers": 0,
		"currentVolunteers": 0,
		"coordinates": [
			36.7014097,
			3.2293304654793413
		]
	},
	{
		"locationId": "67d43394b0ca3697b1b9a93a",
		"associationId": "67d43390b0ca3697b1b9a937",
		"skills": [],
		"requiredVolunteers": 0,
		"currentVolunteers": 0,
		"coordinates": [
			36.7700535,
			3.055364365850858
		]
	},
	{
		"locationId": "67d43394b0ca3697b1b9a93b",
		"associationId": "67d43390b0ca3697b1b9a937",
		"skills": [
			"first aid",
			"event management",
			"teaching"
		],
		"requiredVolunteers": 2,
		"currentVolunteers": 0,
		"coordinates": [
			36.74853945,
			3.0759318861461464
		]
	},
	{
		"locationId": "67d43394b0ca3697b1b9a93c",
		"associationId": "67d43390b0ca3697b1b9a937",
		"skills": [],
		"requiredVolunteers": 0,
		"currentVolunteers": 0,
		"coordinates": [
			36.8011287,
			3.0430556
		]
	}
]
console.log("starting")
console.log(assignVolunteers(volunteers, locations));

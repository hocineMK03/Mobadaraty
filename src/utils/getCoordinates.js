const getCoordinates = async (address) => {
    try {
        const theURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
        const response = await fetch(theURL);
        const data = await response.json();
        
        if (data.length === 0) {
            const error = new Error("Invalid address");
            error.statusCode = 400;
            throw error;
        }
        

        return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
};

module.exports = { getCoordinates };

const axios = require('axios');

const getBooksByAuthor = async (author) => {
    try {
        // Make a GET request to the server endpoint
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(JSON.stringify(response.data, null, 4));
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx (e.g., 404 Not Found)
            console.log(error.response.data.message);
        } else if (error.request) {
            // The request was made but no response was received
            console.log("No response received from server");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }
};

// Example usage
getBooksByAuthor("Chinua Achebe");
getBooksByAuthor("Unknown Author");
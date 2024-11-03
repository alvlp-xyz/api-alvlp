// resolveUrl.js
import axios from 'axios';

const resolveUrl = async (url) => {
    if (!url) {
        throw new Error('Missing required "url" parameter. Please provide a URL to resolve.');
    }

    const resolvedUrl = decodeURIComponent(url);

    const resolveRedirect = async (url) => {
        try {
            const response = await axios.get(url, { 
                maxRedirects: 5, 
                validateStatus: (status) => status >= 200 && status < 400 
            });
            const finalUrl = response.request.res.responseUrl;
            return finalUrl;
        } catch (error) {
            console.error(`Failed to resolve redirect for URL: ${url}`, error);

            // Specific error handling for network or axios issues
            if (error.response) {
                // Server responded with a status outside the allowed range
                throw new Error(`Failed to resolve redirect. Server responded with status code ${error.response.status}.`);
            } else if (error.request) {
                // No response received from server
                throw new Error('Failed to resolve redirect. No response received from the server.');
            } else {
                // Other errors, such as incorrect URL format
                throw new Error('Failed to resolve redirect. There may be an issue with the URL format.');
            }
        }
    };

    const data = await resolveRedirect(resolvedUrl);
    if (!data) {
        // Handle cases where no final URL was returned
        throw new Error('Could not resolve to a final URL. The link may be broken or restricted.');
    }

    return data; // Return the resolved URL
};

export default resolveUrl;

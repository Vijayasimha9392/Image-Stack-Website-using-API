const API_KEY = "RQm0cLVvuLyyMRlB63Mn82dltnttaPaKsQdHPr7qlPtrhPNE4gsGbzzs";

/**
 * Fetch images from Pexels API based on type and query.
 * @param {string} type - Type of images to fetch ('curated' or 'search').
 * @param {object} query - Query parameters.
 * @returns {Promise<object>} - JSON response from the API.
 */
async function getStack(type = "curated", query = {}) {
    const baseUrl = `https://api.pexels.com/v1/${type}`;
    const queryString = new URLSearchParams(query).toString();
    const url = `${baseUrl}?${queryString}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch images:", error);
        return null;
    }
}

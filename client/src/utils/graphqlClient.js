// src/utils/graphqlClient.js

const fetchGraphQLData = async (query) => {
    try {
        const response = await fetch('http://localhost:3001/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            credentials: 'include',  // Required for cookies and sessions
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching GraphQL data:', error);
    }
};

export default fetchGraphQLData;

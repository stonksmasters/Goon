const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Extract wallet address from query parameters
  const walletAddress = event.queryStringParameters?.wallet;

  // Validate the wallet address input
  if (!walletAddress) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Missing wallet address parameter' }),
    };
  }

  // Magic Eden API endpoint for fetching tokens
  const url = `https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens?type=solana`;

  try {
    console.log(`[fetchTokens] Fetching tokens for wallet: ${walletAddress}`);

    // Fetch data from the Magic Eden API
    const response = await fetch(url);

    // Check for non-200 responses from the API
    if (!response.ok) {
      console.error(`[fetchTokens] Error from Magic Eden API: ${response.statusText}`);
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*', // Ensure CORS is included even on errors
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: `Magic Eden API error: ${response.statusText}` }),
      };
    }

    // Parse the JSON data
    const data = await response.json();

    // Return the data with appropriate CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Log and handle unexpected errors
    console.error(`[fetchTokens] Unexpected error: ${error.message}`);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Ensure CORS headers are included in error responses
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        error: 'An unexpected error occurred while fetching tokens',
        details: error.message,
      }),
    };
  }
};

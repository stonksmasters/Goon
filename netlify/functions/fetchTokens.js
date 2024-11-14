const fetch = require('node-fetch');

exports.handler = async (event) => {
  const walletAddress = event.queryStringParameters.wallet;
  const url = `https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens?type=solana`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allows access from any origin
        'Access-Control-Allow-Headers': 'Content-Type', // Allows specific headers
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Ensures CORS headers are included in error responses
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

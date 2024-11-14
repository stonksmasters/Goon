const fetch = require('node-fetch');

exports.handler = async (event) => {
  const walletAddress = event.queryStringParameters.wallet;
  const url = `https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens?type=solana`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

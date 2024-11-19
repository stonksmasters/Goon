// netlify/functions/fetchTokens.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const walletAddress = event.queryStringParameters?.wallet;

  // Validate wallet address
  if (!walletAddress) {
    console.error('[fetchTokens] Missing wallet address');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing wallet address parameter',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  // Magic Eden API URL
  const url = `https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens?type=solana`;

  try {
    console.log(`[fetchTokens] Fetching tokens for wallet: ${walletAddress}`);

    // Fetch tokens from Magic Eden API
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[fetchTokens] Magic Eden API error: ${response.statusText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Magic Eden API error: ${response.statusText}`,
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    const data = await response.json();

    // Handle empty or no tokens
    if (!data || !data.length) {
      console.warn('[fetchTokens] No tokens found');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No tokens found for this wallet' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    }

    // Return tokens data
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  } catch (err) {
    console.error('[fetchTokens] Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred while fetching tokens',
        details: err.message,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }
};

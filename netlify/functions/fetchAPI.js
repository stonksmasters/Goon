exports.handler = async (event) => {
    const API_BASE_URL = process.env.API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}${event.queryStringParameters.endpoint}`, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        Authorization: event.headers.authorization || '',
      },
      body: event.body,
    });
  
    const data = await response.json();
    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  };
  
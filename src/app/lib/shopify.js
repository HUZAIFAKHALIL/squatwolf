const domain = process.env.SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.STOREFRONT_API_TOKEN;

export async function shopifyFetch(query) {

  if (!domain) {
    throw new Error('SHOPIFY_DOMAIN environment variable is not set');
  }
  if (!storefrontAccessToken) {
    throw new Error('STOREFRONT_API_TOKEN environment variable is not set');
  }

  const URL = `https://${domain}/api/2024-07/graphql.json`;

  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetch(URL, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();

    if (data.errors) {
      console.error("Shopify GraphQL Errors:", JSON.stringify(data.errors, null, 2));
      throw new Error(`Shopify GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
    }

    return data.data;
  } catch (error) {
    console.error("Shopify fetch failed:", error.message);
    console.error("URL:", URL);
    console.error("Domain:", domain);
    console.error("Has token:", !!storefrontAccessToken);
    throw error;
  }
}
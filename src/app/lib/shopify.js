const domain = process.env.SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.STOREFRONT_API_TOKEN;

export async function shopifyFetch(query) {
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
    const data = await response.json();

    if (data.errors) {
      console.error("Shopify GraphQL Errors:", data.errors);
      throw new Error("Shopify GraphQL error");
    }

    return data.data;
  } catch (error) {
    console.error("Shopify fetch failed:", error);
    throw error;
  }
}
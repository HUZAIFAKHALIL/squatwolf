import {shopifyFetch} from '@/app/lib/shopify';

// GraphQL Query Builder
const getProductsByIdsQuery = (ids) => {
  const formattedIds = ids.map(id => `"${id}"`).join(', ');
  return `
    {
      nodes(ids: [${formattedIds}]) {
        ... on Product {
          id
          handle
          availableForSale
          title
          productType
          totalInventory
          description
          descriptionHtml
          model_info_text: metafield(namespace: "info", key: "model_and_size_info") { value }
          rating: metafield(namespace: "reviews", key: "rating") { value }
          rating_count: metafield(namespace: "reviews", key: "rating_count") { value }
          fit: metafield(namespace: "features", key: "badge_fit") { value }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
        }
      }
    }
  `;
};

export async function getRecommendedProducts(rawIdString) {
  let ids = [];

  try {
    ids = JSON.parse(rawIdString);
  } catch (err) {
    console.error("Error parsing recommended product IDs:", err);
    return [];
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  const query = getProductsByIdsQuery(ids);

  try {
    const { data } = await shopifyFetch({ query });
    return data?.nodes?.filter(Boolean) || [];
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}

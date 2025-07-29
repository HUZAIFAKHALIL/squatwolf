    export const getProductQuery = (handle) => `
    {
    productByHandle(handle: "${handle}") {
        id
        handle
        availableForSale
        title
        productType
        totalInventory
        description
        descriptionHtml

        filter_fit: metafield(namespace: "filter", key: "fit") {
        value
        }
        fit: metafield(namespace: "features", key: "badge_fit") {
        value
        }
        color: metafield(namespace: "colors", key: "selected") {
        value
        }
        color_swatches: metafield(namespace: "pdp", key: "color_swatches") {
        value
        }
        length: metafield(namespace: "alpha", key: "sw_length_title") {
        value
        }
        shop_the_look: metafield(namespace: "custom", key: "shop_the_look_venn_apps") {
        value
        }
        model_info_text: metafield(namespace: "info", key: "model_and_size_info") {
        value
        }
        rating: metafield(namespace: "reviews", key: "rating") {
        value
        }
        rating_count: metafield(namespace: "reviews", key: "rating_count") {
        value
        }

        priceRange {
        minVariantPrice {
            amount
            currencyCode
        }
        maxVariantPrice {
            amount
            currencyCode
        }
        }
        compareAtPriceRange {
        minVariantPrice {
            amount
            currencyCode
        }
        }
        images(first: 10) {
        edges {
            node {
            id
            url
            altText
            width
            height
            }
        }
        }
        variants(first: 50) {
        edges {
            node {
            id
            title
            availableForSale
            selectedOptions {
                name
                value
            }
            price {
                amount
                currencyCode
            }
            compareAtPrice {
                amount
                currencyCode
            }
            }
        }
        }
        options {
        id
        name
        values
        }
        tags
    }
    }
    `;

// src/app/product/[handle]/page.jsx
import { getProductQuery } from '../../lib/queries/productDetails';
import { shopifyFetch } from '../../lib/shopify';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { parse } from 'dotenv';

async function getProductData(handle) {
    try {
        const query = getProductQuery(handle);
        const data = await shopifyFetch(query);

        return data.productByHandle;
    } catch (error) {
        console.error(`Error fetching product "${handle}":`, error);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { handle } = await params;
    const product = await getProductData(handle);

    if (!product || !product.title) {
        return {
            title: 'Product Not Found - SquatWolf',
            description: 'The requested product could not be found.',
        };
    }

    const price = parseFloat(product.priceRange.minVariantPrice.amount);

    return {
        title: `${product.title} - SquatWolf`,
        description: product.description 
            ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
            : `Shop ${product.title} at SquatWolf. Premium athletic wear and gym essentials.`,
        openGraph: {
            title: `${product.title} - SquatWolf`,
            description: product.description 
                ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
                : `Shop ${product.title} at SquatWolf. Premium athletic wear and gym essentials.`,
            type: 'website',
            images: product.images.edges.length > 0 ? [
                {
                    url: product.images.edges[0].node.url,
                    width: product.images.edges[0].node.width || 800,
                    height: product.images.edges[0].node.height || 800,
                    alt: product.images.edges[0].node.altText || product.title,
                }
            ] : [],
        },
    };
}

const parseColorSwatch = (option) => {
    const parsedData = option?.color_swatches?.value ? JSON.parse(option.color_swatches.value) : [];
    return parsedData
    }


export default async function ProductPage({ params }) {
    const { handle } = await params;
    const product = await getProductData(handle);
        

    if (!product || !product.title) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}
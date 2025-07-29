// src\app\collections\[handle]\page.jsx
import {getProductsInCollectionQuery} from '../../lib/queries/collection';
import ProductCard from '../../components/ProductCard';
import { notFound } from 'next/navigation';
import { shopifyFetch } from '@/app/lib/shopify';

// Generate metadata for SEO
async function getCollectionData(handle) {
    try {
        const query = getProductsInCollectionQuery(handle);
        const data = await shopifyFetch(query);
        return data.collectionByHandle;
    } catch (error) {
        console.error(`Error fetching collection "${handle}":`, error);
        return null;
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { handle } = await params;
    const collection = await getCollectionData(handle);

    if (!collection || !collection.title) {
        return {
            title: 'Collection Not Found - SquatWolf',
            description: 'The requested collection could not be found.',
        };
    }

    return {
        title: `${collection.title} - SquatWolf`,
        description: collection.description || `Shop ${collection.title} collection at SquatWolf. Premium athletic wear and gym essentials.`,
        openGraph: {
            title: `${collection.title} - SquatWolf`,
            description: collection.description || `Shop ${collection.title} collection at SquatWolf. Premium athletic wear and gym essentials.`,
            type: 'website',
        },
    };
}

export default async function CollectionPage({ params }) {
    const { handle } = await params;
    const collection = await getCollectionData(handle);

    if (!collection || !collection.title) {
        notFound();
    }

    const products = collection.products?.edges || [];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Collection Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                        {collection.title}
                    </h1>
                    {collection.description && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {collection.description}
                        </p>
                    )}
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">
                            {products.length} {products.length === 1 ? 'product' : 'products'}
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map(({ node: product }) =>
                            product ? <ProductCard key={product.id} product={product} /> : null
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">
                            No products found
                        </h2>
                        <p className="text-gray-600 mb-8">
                            This collection is currently empty. Check back soon for new products!
                        </p>
                        <a
                            href="/"
                            className="bg-black text-white px-8 py-3 uppercase tracking-wide text-sm font-medium hover:bg-gray-800 transition-colors inline-block"
                        >
                            Continue Shopping
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
import React from 'react';
import { getProducts } from '@/lib/data/products';
import ProductsManager from './ProductsManager';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold text-[#D7FF45] uppercase tracking-widest">
          CATALOGUE REPOSITORIES
        </span>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-black uppercase tracking-tight text-[#F5F3EE] mt-1">
          PRODUCT MANAGEMENT
        </h1>
        <p className="text-xs text-[#888884] mt-1">
          Add, edit, delete, and alter the drop status of sneakers across PostgreSQL storage.
        </p>
      </div>

      <ProductsManager initialProducts={products} />
    </div>
  );
}

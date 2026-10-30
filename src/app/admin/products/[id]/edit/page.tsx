import React from 'react';
import { getProductById } from '@/lib/data/products';
import EditProductClient from './EditProductClient';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <EditProductClient product={product} />;
}

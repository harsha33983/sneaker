import React from 'react';
import AdminLayoutWrapper from './AdminLayoutWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console — SneakerDrop',
  description: 'Manage exclusive sneaker releases, inventory availability, and customer waitlists.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}


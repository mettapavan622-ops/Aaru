import React, { useState } from 'react';
import { Database, Table, Layers, Code, CheckCircle2, Copy } from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'prisma'>('tables');
  const [copied, setCopied] = useState(false);

  const tables = [
    {
      name: 'users',
      purpose: 'Identity, customer records, and administrative role-based access control (RBAC).',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique identifier (uuid_generate_v4)' },
        { name: 'email', type: 'VARCHAR(255) UNIQUE', desc: 'Login identity & order communication' },
        { name: 'phone', type: 'VARCHAR(30) UNIQUE', desc: 'WhatsApp & SMS notifications' },
        { name: 'role', type: 'VARCHAR(30)', desc: 'CUSTOMER, ADMIN, ATELIER_MANAGER' }
      ]
    },
    {
      name: 'products',
      purpose: 'Core catalog entries, pricing, fabric provenance, and SEO metadata.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique product ID' },
        { name: 'title', type: 'VARCHAR(255)', desc: 'Heirloom title (e.g. Kavya Emerald Banarasi)' },
        { name: 'slug', type: 'VARCHAR(255) UNIQUE', desc: 'URL slug for indexable routing' },
        { name: 'category_id', type: 'UUID FK', desc: 'References categories(id)' },
        { name: 'collection_id', type: 'UUID FK', desc: 'References collections(id)' },
        { name: 'base_price', type: 'NUMERIC(10,2)', desc: 'Standard boutique price' },
        { name: 'sale_price', type: 'NUMERIC(10,2)', desc: 'Discounted campaign price' },
        { name: 'is_ready_to_ship', type: 'BOOLEAN', desc: '24-48h dispatch eligibility' },
        { name: 'fabric', type: 'VARCHAR(150)', desc: 'Pure Mulberry Silk, Kanjeevaram, etc.' },
        { name: 'craft', type: 'VARCHAR(150)', desc: 'Kadwa Handloom Weave, Zardozi' }
      ]
    },
    {
      name: 'product_variants',
      purpose: 'Individual SKUs representing sizes, colorways, and real-time inventory counts.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Variant record ID' },
        { name: 'product_id', type: 'UUID FK', desc: 'Cascade delete with parent product' },
        { name: 'size', type: 'VARCHAR(30)', desc: 'XS, S, M, L, XL, Free Size, Custom' },
        { name: 'sku', type: 'VARCHAR(100) UNIQUE', desc: 'Stock Keeping Unit barcode' },
        { name: 'inventory', type: 'INT', desc: 'Physical stock remaining in atelier' }
      ]
    },
    {
      name: 'orders & order_items',
      purpose: 'Transactions, payment IDs, Blue Dart / courier tracking, and timeline statuses.',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Internal order ID' },
        { name: 'order_number', type: 'VARCHAR(50) UNIQUE', desc: 'Customer tracking ID (e.g. AARU-2026-89421)' },
        { name: 'status', type: 'VARCHAR(40)', desc: 'Confirmed, Processing, Shipped, Delivered' },
        { name: 'payment_id', type: 'VARCHAR(120)', desc: 'Idempotent transaction token' },
        { name: 'tracking_number', type: 'VARCHAR(120)', desc: 'Courier AWB tracking number' }
      ]
    },
    {
      name: 'cms_announcements',
      purpose: 'Global announcement bar and active sale alert synchronization.',
      columns: [
        { name: 'text', type: 'TEXT', desc: 'Global announcement banner message' },
        { name: 'is_sale_active', type: 'BOOLEAN', desc: 'Toggles sale highlight badge in storefront' },
        { name: 'sale_highlight', type: 'VARCHAR(150)', desc: 'Mid-Season Atelier Sale headline' }
      ]
    }
  ];

  const sqlSample = `-- PostgreSQL Relational Table Schema for AARU
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id UUID NOT NULL REFERENCES categories(id),
    collection_id UUID REFERENCES collections(id),
    base_price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    is_ready_to_ship BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    fabric VARCHAR(150) NOT NULL,
    craft VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(30) NOT NULL,
    color VARCHAR(60) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    inventory INT DEFAULT 0 CHECK (inventory >= 0)
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E8DFD5] p-6 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD5] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#0F4C5C]">
            <Database className="w-5 h-5" />
            <h3 className="font-serif text-xl font-bold text-[#24211E]">
              PostgreSQL Relational Database Schema
            </h3>
          </div>
          <p className="text-xs text-[#736B5E] mt-0.5">
            Normalized 3NF relational schema powering the AARU luxury commerce engine.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex p-0.5 bg-[#FAF7F2] border border-[#D4C7B5]">
          <button
            type="button"
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1 text-xs font-semibold ${
              activeTab === 'tables' ? 'bg-[#0F4C5C] text-white' : 'text-[#5C5549]'
            }`}
          >
            Table Architecture
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1 text-xs font-semibold ${
              activeTab === 'sql' ? 'bg-[#0F4C5C] text-white' : 'text-[#5C5549]'
            }`}
          >
            SQL DDL Script
          </button>
        </div>
      </div>

      {activeTab === 'tables' ? (
        <div className="space-y-6">
          {tables.map((tbl) => (
            <div key={tbl.name} className="border border-[#E8DFD5] rounded-none overflow-hidden">
              <div className="bg-[#FAF7F2] p-3 border-b border-[#E8DFD5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-[#0F4C5C]" />
                  <span className="font-mono text-xs font-bold text-[#24211E]">{tbl.name}</span>
                </div>
                <span className="text-[11px] text-[#736B5E] italic">{tbl.purpose}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-white border-b border-[#E8DFD5] text-[#8C6D37] font-semibold">
                    <tr>
                      <th className="p-2.5">Column Name</th>
                      <th className="p-2.5">Data Type / Constraint</th>
                      <th className="p-2.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD5]/60 font-mono text-[11px]">
                    {tbl.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-2.5 font-bold text-[#24211E]">{col.name}</td>
                        <td className="p-2.5 text-[#0F4C5C]">{col.type}</td>
                        <td className="p-2.5 font-sans text-xs text-[#5C5549]">{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={copySql}
            className="absolute top-3 right-3 px-3 py-1.5 bg-[#FAF7F2] border border-[#D4C7B5] text-xs font-medium text-[#24211E] hover:bg-white flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy DDL'}
          </button>
          <pre className="p-4 bg-[#1A2421] text-emerald-300 font-mono text-xs overflow-x-auto rounded-none">
            {sqlSample}
          </pre>
        </div>
      )}
    </div>
  );
};

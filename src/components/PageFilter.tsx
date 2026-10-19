'use client';

import React from 'react';
import { MetaPage } from '@/types/campaign';
import { Flag } from 'lucide-react';

interface PageFilterProps {
  pages: MetaPage[];
  selectedPageId: string;
  onSelectPage: (id: string) => void;
}

export function PageFilter({ pages, selectedPageId, onSelectPage }: PageFilterProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <Flag className="h-3.5 w-3.5 text-blue-400" />
        <label htmlFor="page-select" className="whitespace-nowrap">
          Filter by Page:
        </label>
      </div>
      <select
        id="page-select"
        value={selectedPageId}
        onChange={(e) => onSelectPage(e.target.value)}
        className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm transition-colors hover:border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
      >
        <option value="ALL">All Pages ({pages.length})</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id} className="bg-zinc-900 text-zinc-100">
            {page.name}
          </option>
        ))}
      </select>
    </div>
  );
}
export default PageFilter;

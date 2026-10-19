'use client';

import React from 'react';
import { MetaAdAccount } from '@/types/campaign';
import { Briefcase } from 'lucide-react';

interface AdAccountFilterProps {
  accounts: MetaAdAccount[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
}

export function AdAccountFilter({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: AdAccountFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <Briefcase className="h-3.5 w-3.5 text-blue-400" />
        <label htmlFor="account-select" className="whitespace-nowrap">
          Ad Account:
        </label>
      </div>
      <select
        id="account-select"
        value={selectedAccountId}
        onChange={(e) => onSelectAccount(e.target.value)}
        className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-100 shadow-sm transition-colors hover:border-zinc-750 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
      >
        <option value="ALL">All Accounts (Combined)</option>
        {accounts.map((act) => (
          <option key={act.id} value={act.id} className="bg-zinc-900 text-zinc-100">
            {act.name}
          </option>
        ))}
      </select>
    </div>
  );
}

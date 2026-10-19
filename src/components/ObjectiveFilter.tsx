import React from 'react';
import { CampaignObjective } from '@/types/campaign';
import { OBJECTIVE_CONFIG } from '@/lib/objective-config';

interface ObjectiveFilterProps {
  selectedObjective: CampaignObjective | 'ALL';
  onSelect: (obj: CampaignObjective | 'ALL') => void;
  counts: Record<string, number>;
}

export function ObjectiveFilter({
  selectedObjective,
  onSelect,
  counts,
}: ObjectiveFilterProps) {
  const options: Array<{ id: CampaignObjective | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Objectives' },
    { id: 'OUTCOME_SALES', label: 'Sales' },
    { id: 'OUTCOME_LEADS', label: 'Leads' },
    { id: 'OUTCOME_TRAFFIC', label: 'Traffic' },
    { id: 'OUTCOME_ENGAGEMENT', label: 'Engagement' },
    { id: 'OUTCOME_AWARENESS', label: 'Awareness' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const isSelected = selectedObjective === opt.id;
        const count = counts[opt.id] ?? 0;

        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <span>{opt.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                isSelected
                  ? 'bg-blue-700 text-blue-100'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

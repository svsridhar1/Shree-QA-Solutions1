'use client';

import React from 'react';
import { useCRM } from '@/lib/crmStore';
import { useRouter } from 'next/navigation';
import { BarChart3, PieChart, Layers } from 'lucide-react';

export const ServiceTypeChart: React.FC = () => {
  const { metrics, clients } = useCRM();
  const router = useRouter();

  // Color palette rotation: gold/orange, deep red, navy
  const palette = [
    { bg: 'bg-[#E08A3E]', text: 'text-[#C26F25]', light: 'bg-[#FFF7ED]', border: 'border-[#E08A3E]' },
    { bg: 'bg-[#B33A2E]', text: 'text-[#B33A2E]', light: 'bg-[#FEF2F2]', border: 'border-[#B33A2E]' },
    { bg: 'bg-[#1B2A4A]', text: 'text-[#1B2A4A]', light: 'bg-[#F0F4F8]', border: 'border-[#1B2A4A]' },
  ];

  const maxCount = Math.max(...metrics.serviceDistribution.map((d) => d.count), 1);
  const total = clients.length || 1;

  const handleBarClick = (service: string) => {
    router.push(`/clients?service=${encodeURIComponent(service)}`);
  };

  return (
    <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6DCce] gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-[#1B2A4A] text-white">
            <BarChart3 className="w-5 h-5 text-[#E08A3E]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1B2A4A]">
              Appraisal Portfolio by Standard & Service Type
            </h3>
            <p className="text-xs text-gray-600">
              Distribution of active CMMI maturity levels, ISO management standards, and security frameworks
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-[#EBDDC9]/60 text-[#1B2A4A] rounded-full border border-[#DEC6A6]">
          Total Engagements: {clients.length}
        </span>
      </div>

      {/* Horizontal Bar Chart List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {metrics.serviceDistribution.map((item, idx) => {
          const colorTheme = palette[idx % palette.length];
          const percentage = Math.round((item.count / total) * 100);
          const barWidthPercent = Math.max(8, Math.round((item.count / maxCount) * 100));

          return (
            <div
              key={item.service}
              onClick={() => handleBarClick(item.service)}
              className="flex flex-col space-y-1.5 p-2.5 rounded-lg hover:bg-[#EBDDC9]/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1B2A4A] group-hover:text-[#B33A2E] transition-colors flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${colorTheme.bg}`} />
                  <span>{item.service}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-[11px] font-medium">{percentage}%</span>
                  <span className="font-bold text-[#1B2A4A] px-2 py-0.5 rounded bg-white border border-[#DEC6A6]">
                    {item.count} {item.count === 1 ? 'client' : 'clients'}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 bg-[#EBDDC9]/50 rounded-full overflow-hidden p-0.5 border border-[#DEC6A6]/40">
                <div
                  className={`h-full rounded-full ${colorTheme.bg} transition-all duration-500 ease-out group-hover:opacity-90`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="mt-6 pt-3 border-t border-[#E6DCce] flex items-center justify-between text-[11px] text-gray-500">
        <span>Click any standard bar to filter the client directory</span>
        <span className="italic font-serif text-[#B33A2E]">Shree QA Solutions • Authorized CMMI & ISO Registry</span>
      </div>
    </div>
  );
};

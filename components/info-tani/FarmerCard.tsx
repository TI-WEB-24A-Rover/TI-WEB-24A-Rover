'use client';
import Image from 'next/image';
import React from 'react';
import { Farmer } from '@/lib/data-dummy';

type FarmerCardProps = {
  farmer: Farmer;
  onVisit: (id: string) => void;
};

export default function FarmerCard({ farmer, onVisit }: FarmerCardProps) {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-cyan-50 flex flex-col h-full transition-all hover:shadow-md">
      <div className="p-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={farmer.image}
            alt={farmer.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={farmer.id === '1'}
          />
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium">{farmer.product}</p>
            <h3 className="text-xl font-bold text-gray-800 leading-tight">{farmer.name}</h3>
          </div>

          <div className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm ${
            farmer.statusType === 'success' ? 'bg-[#e7f9f1] text-[#22c55e]' : 'bg-[#fff7ed] text-[#f97316]'
          }`}>
            <span>{farmer.statusType === 'success' ? 'Ready' : '📦'}</span>
            {farmer.status}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span className="text-sm font-semibold">{farmer.location}</span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{farmer.desc}</p>

        <button
          onClick={() => onVisit(farmer.id)}
          className="w-fit px-8 py-2.5 bg-[#4F46E5] text-white rounded-xl font-bold hover:bg-[#4338CA] transition-all transform active:scale-95 shadow-md shadow-indigo-100"
        >
          Kunjungi
        </button>
      </div>
    </div>
  );
}
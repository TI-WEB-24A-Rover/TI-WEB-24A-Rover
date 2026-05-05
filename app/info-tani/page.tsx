'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import FarmerCard from '@/components/info-tani/FarmerCard';
import { farmers } from '@/lib/data-dummy';

export default function InfoTaniPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);

  const handleOpenModal = (id: string) => {
    const data = farmers.find(f => f.id === id);
    setSelectedFarmer(data);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#A5F3FC] p-4 md:p-10 lg:px-20">
      {/* Container Putih Besar (Card Utama) */}
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 border border-white/50 shadow-2xl">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-cyan-100/50 pb-10">
          <span className="text-cyan-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block">
            Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            Katalog Petani Info Tani
          </h1>
          <p className="text-slate-500 text-lg max-w-3xl leading-relaxed">
            Pilih mitra petani terbaik berdasarkan lokasi, kualitas komoditas, dan status stok terbaru.
          </p>
        </div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {farmers.map((farmer) => (
            <FarmerCard 
              key={farmer.id} 
              farmer={farmer} 
              onVisit={handleOpenModal}
            />
          ))}
        </div>
      </div>

      {/* Modal - Kerangka yang sudah kita buat sebelumnya */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Detail Stok Komoditas"
        subtitle={selectedFarmer ? `Informasi produk dari ${selectedFarmer.name}` : ''}
      >
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
             <svg className="text-cyan-500 animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
          </div>
          <p className="text-gray-400 font-medium italic">
            Memuat detail stok untuk {selectedFarmer?.name}...
          </p>
        </div>
      </Modal>
    </main>
  );
}
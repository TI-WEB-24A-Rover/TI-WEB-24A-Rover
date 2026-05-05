'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  // Ukuran modal: mengatur max-width / full
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  // Warna background header (bisa hex / kelas tailwind)
  headerBg?: string;
  // Animasi: 'fade' | 'zoom' | 'slide'
  animation?: 'fade' | 'zoom' | 'slide';
  // Apakah klik pada overlay menutup modal
  closeOnOverlayClick?: boolean;
}

export default function Modal({ isOpen, onClose, title, subtitle, children, footer, size = 'md', headerBg, animation = 'fade', closeOnOverlayClick = true, }: ModalProps) {
  // Mencegah scroll pada background (body) ketika pop-up terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // size, headerBg, animation, closeOnOverlayClick are destructured with defaults above

  // Determine size class
  const sizeClassMap: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-none w-full h-full',
  };

  // Determine animation classes
  const animationClass = (() => {
    switch (animation) {
      case 'zoom':
        return 'animate-in zoom-in-95 duration-200';
      case 'slide':
        return 'animate-in slide-in-from-bottom-8 duration-300';
      case 'fade':
      default:
        return 'animate-in fade-in duration-200';
    }
  })();

  // Ensure headerBg has fallback
  const headerStyle = headerBg ? { background: headerBg } : undefined;

  return (
    // Backdrop / Overlay gelap transparan
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      
      {/* Kotak Pop-up */}
      <div
        className={`w-full ${sizeClassMap[size || 'md']} bg-white rounded-[28px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] ${animationClass} ring-1 ring-cyan-50`}
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam kotak menutup pop-up
        style={size === 'full' ? { height: '100vh' } : undefined}
      >
        
        {/* Bagian Header (Warna Cyan Muda seperti di gambar) */}
        <div className="px-8 py-6 flex items-start justify-between border-b border-cyan-100" style={headerStyle ?? { background: '#eafaf8' }}>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">{title}</h2>
            {subtitle && <p className="text-sm md:text-base text-gray-600 mt-2">{subtitle}</p>}
          </div>
          
          {/* Tombol Close (X) */}
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-cyan-100/50"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Bagian Content (Dalamnya pop-up, bisa di-scroll jika panjang) */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Bagian Footer (Opsional, untuk tombol Tutup / Aksi lainnya) */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
            {footer}
          </div>
        )}
        
      </div>
    </div>
  );
}
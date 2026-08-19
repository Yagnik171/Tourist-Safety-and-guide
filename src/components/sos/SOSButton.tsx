'use client';

import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SOSModal } from './SOSModal';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'floating';
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  className,
  variant = 'compact',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSosActive } = useAppStore();

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-40 flex items-center justify-center p-4 rounded-full font-black text-white shadow-2xl transition-transform active:scale-95',
            isSosActive
              ? 'bg-rose-600 animate-sos-glow border-2 border-white'
              : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-950/80',
            className
          )}
          aria-label="Emergency SOS"
        >
          <AlertOctagon className="w-7 h-7" />
          <span className="sr-only">Emergency SOS</span>
        </button>

        <SOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === 'full') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            'w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-white transition-all transform active:scale-98 shadow-lg',
            isSosActive
              ? 'bg-rose-600 animate-sos-glow text-white'
              : 'bg-rose-600/90 hover:bg-rose-500 border border-rose-500/40 text-rose-50 hover:shadow-rose-950/40',
            className
          )}
        >
          <AlertOctagon className="w-5 h-5" />
          <span>{isSosActive ? 'SOS ACTIVE (VIEW)' : 'EMERGENCY SOS'}</span>
        </button>

        <SOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-md active:scale-95',
          isSosActive
            ? 'bg-rose-600 animate-sos-glow border border-white'
            : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50',
          className
        )}
      >
        <AlertOctagon className="w-4 h-4" />
        <span className="tracking-wider">SOS</span>
      </button>

      <SOSModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

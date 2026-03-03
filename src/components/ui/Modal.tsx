'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop com desfoque */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <Card className="relative w-full max-w-lg bg-apple-card border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-apple-text tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-apple-textSecondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
}
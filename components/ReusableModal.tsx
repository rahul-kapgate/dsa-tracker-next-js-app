"use client";

import { X } from "lucide-react";
import React from "react";

type ReusableModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
};

export default function ReusableModal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: ReusableModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#202020] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-white/60">{description}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/* =========================================================================
   BUTTON
   ========================================================================= */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none rounded-xl active:scale-[0.98] min-h-[44px]';

  const sizeStyles = {
    sm: 'text-sm py-2 px-3 gap-1.5',
    md: 'text-sm sm:text-base py-2.5 px-5 gap-2',
    lg: 'text-base sm:text-lg py-3 px-6 gap-2.5 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 font-bold shadow-md shadow-amber-950/40 hover:from-amber-500 hover:to-yellow-400 border border-amber-400/50',
    purple:
      'bg-purple-700/90 hover:bg-purple-600 text-white shadow-md shadow-stone-950/40 border border-purple-400/40',
    cyan:
      'bg-sky-700/90 hover:bg-sky-600 text-white shadow-md shadow-stone-950/40 border border-sky-400/40',
    secondary:
      'bg-stone-850 hover:bg-stone-800 text-stone-100 border border-stone-700 shadow-sm hover:border-amber-500/40',
    ghost:
      'bg-transparent hover:bg-stone-800/60 text-stone-300 hover:text-white border border-transparent',
    danger:
      'bg-red-700/90 hover:bg-red-600 text-white shadow-md shadow-stone-950/40 border border-red-500/30',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

/* =========================================================================
   MODAL
   ========================================================================= */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthStyles} max-h-[92vh] flex flex-col bg-slate-900/95 border border-slate-700/70 rounded-2xl shadow-2xl shadow-purple-950/50 text-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/50">
          <div>
            <h2 id="modal-headline" className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors focus-visible:ring-2 focus-visible:ring-purple-400 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   CARD
   ========================================================================= */

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  interactive = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/80 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 sm:p-5 ${
        interactive
          ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-850 transition-all duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-purple-400 focus:outline-none'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* =========================================================================
   PROGRESS BAR
   ========================================================================= */

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  color?: 'purple' | 'cyan' | 'amber' | 'emerald';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  color = 'purple',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const barColors = {
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
  }[color];

  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs mb-1.5 text-slate-300 font-medium">
          {label && <span>{label}</span>}
          {sublabel && <span className="text-slate-400">{sublabel}</span>}
        </div>
      )}
      <div
        className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/50"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${barColors}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

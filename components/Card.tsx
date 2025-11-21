import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-[#0f172a]/80 backdrop-blur-md border border-cyan-900/50 rounded-lg relative flex flex-col ${className}`}>
      {/* Corner decorations */}
      <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-md"></div>
      <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-md"></div>
      <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-md"></div>
      <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-md"></div>

      <div className="px-4 py-2 border-b border-cyan-900/30 flex items-center justify-between bg-gradient-to-r from-cyan-900/20 to-transparent">
        <h3 className="text-cyan-100 font-sans font-semibold tracking-wide text-lg flex items-center gap-2">
          <span className="w-1 h-4 bg-cyan-500 rounded-sm"></span>
          {title}
        </h3>
      </div>
      <div className="p-4 flex-1 min-h-0 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};
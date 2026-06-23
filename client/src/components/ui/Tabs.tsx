import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface TabsProps {
  tabs: { label: string; id: string; icon?: React.ReactNode }[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: (tabId: string) => React.ReactNode;
}

export function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div>
      <div className="flex gap-1 border-b border-white/5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'text-white border-b-brand-500'
                : 'text-white/60 border-b-transparent hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {children(activeTab)}
      </div>
    </div>
  );
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: { label: string; icon?: React.ReactNode; onClick: () => void; isDangerous?: boolean }[];
}

export function Dropdown({ trigger, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/5 rounded-lg transition-all"
      >
        {trigger}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 bg-surface-700 border border-white/10 rounded-lg shadow-lg shadow-black/50 overflow-hidden z-20 animate-fade-in">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                  item.isDangerous
                    ? 'text-red-400 hover:bg-red-500/10'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 bg-surface-900 border border-white/10 rounded-lg text-xs text-white/80 whitespace-nowrap ${positionClasses[position]} animate-fade-in`}
        >
          {content}
          <div className={`absolute w-1.5 h-1.5 bg-surface-900 border border-white/10 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45' :
            'right-full top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45'
          }`} />
        </div>
      )}
    </div>
  );
}

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Switch({ label, className = '', ...props }: SwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative w-10 h-6">
        <input
          type="checkbox"
          className="sr-only"
          {...props}
        />
        <div className="absolute inset-0 bg-surface-700 border border-white/10 rounded-full transition-all" />
        <div className="absolute inset-0.5 bg-gradient-to-r from-surface-800 to-surface-700 rounded-full transition-all" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all" />
      </div>
      {label && <span className="text-sm text-white">{label}</span>}
    </label>
  );
}

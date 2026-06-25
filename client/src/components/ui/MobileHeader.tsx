import { Menu } from 'lucide-react';
import Logo from './Logo';
import { useUIStore } from '../../store/uiStore';

export default function MobileHeader() {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#111118]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-30 md:hidden">
      <Logo size="sm" />
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Video, CheckSquare, LogOut, Settings, Plus } from 'lucide-react';
import Logo from './Logo';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <aside className="w-64 h-screen flex flex-col bg-surface-800 border-r border-surface-600 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 border-b border-surface-600">
        <Logo size="md" />
      </div>

      {/* New Meeting Button */}
      <div className="p-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 btn-primary w-full justify-center text-sm"
          onClick={() => {
            // trigger new meeting modal via state
            sessionStorage.setItem('openNewMeeting', 'true');
          }}
        >
          <Plus size={16} />
          New Meeting
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={href}
            to={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              location.pathname === href
                ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-surface-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-sm w-full px-2 py-1.5 rounded-lg hover:bg-surface-700 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

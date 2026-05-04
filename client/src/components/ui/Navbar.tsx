import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Video, LayoutDashboard, CheckSquare, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  return (
    <nav className="glass-dark border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Video size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">IntellMeet</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <div className="w-7 h-7 bg-brand-600/30 rounded-full flex items-center justify-center text-xs font-semibold text-brand-400">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden sm:block">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white/80 p-1.5 rounded-lg hover:bg-white/5 transition-all"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}

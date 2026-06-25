import { useState } from 'react';
import { Tv, Search, Play, Download, Trash2, Calendar, Clock, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';

interface Recording {
  id: string;
  title: string;
  duration: string;
  size: string;
  date: string;
  meetingId: string;
}

const mockRecordings: Recording[] = [
  { id: '1', title: 'Q4 Product Roadmap Discussion', duration: '45m 12s', size: '280 MB', date: '2026-06-21', meetingId: 'YTE-902' },
  { id: '2', title: 'Engineering Sprint Planning', duration: '28m 45s', size: '185 MB', date: '2026-06-19', meetingId: 'ZQA-119' },
  { id: '3', title: 'AI Integration Design Review', duration: '1h 05m', size: '420 MB', date: '2026-06-15', meetingId: 'KLP-824' },
];

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>(mockRecordings);
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    toast.success('Recording deleted');
  };

  const handlePlay = (title: string) => {
    toast.success(`Playing recording: ${title} (Mock Video Stream started)`);
  };

  const filtered = recordings.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.meetingId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0E0E11] text-slate-200">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
                <Tv size={24} className="text-[#0E71EB]" />
              </div>
              Cloud Recordings
            </h1>
            <p className="text-slate-400 text-sm mt-1">Access recorded calls, check durations, and download audio/video clips</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search recordings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#16161B] border border-slate-800 rounded-lg text-white text-xs placeholder-slate-550 focus:border-[#0E71EB]/50 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Recordings Table / List */}
        <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
            <h3 className="font-bold text-white text-sm">Stored Recordings ({filtered.length})</h3>
          </div>
          
          <div className="p-6">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Tv size={36} className="text-slate-600 mx-auto mb-4" />
                <p className="text-white font-semibold text-sm mb-1">No recordings found</p>
                <p className="text-slate-500 text-xs">Try searching for another topic or record your next active call.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(r => (
                  <div 
                    key={r.id}
                    className="p-4 bg-[#1F1F26] border border-slate-850 hover:border-slate-750 hover:bg-[#25252F] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E71EB]/20 to-[#0E71EB]/5 flex items-center justify-center flex-shrink-0">
                        <Video size={18} className="text-[#0E71EB]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate text-sm hover:text-[#0E71EB] cursor-pointer" onClick={() => handlePlay(r.title)}>{r.title}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-slate-500 text-xs">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {r.date}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {r.duration}</span>
                          <span>·</span>
                          <span>{r.size}</span>
                          <span>·</span>
                          <span className="font-mono">ID: {r.meetingId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button 
                        onClick={() => handlePlay(r.title)}
                        className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Play size={14} fill="white" /> Play
                      </button>
                      <button 
                        onClick={() => toast.success(`Downloading video files... (${r.size})`)}
                        className="bg-[#1F1F26] hover:bg-[#2C2C36] border border-slate-800 text-slate-300 p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={14} /> Download
                      </button>
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="p-2 border border-slate-850 hover:border-red-500/30 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

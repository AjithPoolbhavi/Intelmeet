import { useState, useEffect } from 'react';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Task } from '../types';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, GripVertical, Clock, AlertCircle, Flag, Loader2 } from 'lucide-react';

type Column = { id: Task['status']; label: string; color: string; badgeVariant: 'info' | 'warning' | 'success' };

const COLUMNS: Column[] = [
  { id: 'todo', label: 'To Do', color: 'border-slate-700', badgeVariant: 'info' },
  { id: 'inprogress', label: 'In Progress', color: 'border-amber-600', badgeVariant: 'warning' },
  { id: 'done', label: 'Done', color: 'border-emerald-600', badgeVariant: 'success' },
];

const PRIORITIES: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-slate-400' },
  medium: { label: 'Medium', color: 'text-amber-400' },
  high: { label: 'High', color: 'text-red-400' },
};

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo' as Task['status'] });

  useEffect(() => {
    tasksAPI.getAll()
      .then(r => setTasks(r.data.tasks || []))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error('Task title required');
    try {
      const { data } = await tasksAPI.create(form);
      setTasks(prev => [data.task, ...prev]);
      setForm({ title: '', description: '', priority: 'medium', status: 'todo' });
      setShowForm(false);
      toast.success('Task created!');
    } catch { 
      toast.error('Failed to create task'); 
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => (t._id === taskId || t.id === taskId) ? { ...t, status: newStatus } : t));
    try {
      await tasksAPI.update(taskId, { status: newStatus });
    } catch { 
      toast.error('Failed to update task'); 
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t._id !== taskId && t.id !== taskId));
    try { 
      await tasksAPI.delete(taskId); 
      toast.success('Task deleted');
    } catch { 
      toast.error('Failed to delete task'); 
    }
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedId) handleStatusChange(draggedId, status);
    setDraggedId(null);
  };

  return (
    <div className="flex h-screen bg-[#0E0E11] text-slate-200 overflow-hidden">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 overflow-auto ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 flex flex-col max-w-6xl mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
                  <Plus size={24} className="text-[#0E71EB]" />
                </div>
                Kanban Task Board
              </h1>
              <p className="text-slate-400 text-sm mt-1">Drag and drop tasks to update status and track project completion</p>
            </div>
            <button onClick={() => setShowForm(true)} className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              <Plus size={16} /> New Task
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-[#16161B] border border-slate-800 rounded-2xl shadow-lg">
              <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{tasks.length}</p>
            </div>
            <div className="p-4 bg-[#16161B] border border-slate-800 rounded-2xl shadow-lg">
              <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-amber-400">{tasks.filter(t => t.status === 'inprogress').length}</p>
            </div>
            <div className="p-4 bg-[#16161B] border border-slate-800 rounded-2xl shadow-lg">
              <p className="text-slate-500 text-xs font-semibold mb-1 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-emerald-400">{tasks.filter(t => t.status === 'done').length}</p>
            </div>
          </div>
        </div>

        {/* Create form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1A1A22] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-white text-lg">Create Task</h3>
                  <p className="text-slate-400 text-xs mt-1">Add a new task to the board</p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-350 mb-1.5 block">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Task title"
                    className="w-full bg-[#1F1F26] border border-slate-850 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-355 mb-1.5 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Optional description..."
                    rows={3}
                    className="w-full bg-[#1F1F26] border border-slate-850 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none resize-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-360 mb-1.5 block">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(p => ({ ...p, priority: e.target.value as any }))}
                      className="w-full bg-[#1F1F26] border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:border-[#0E71EB]/50 focus:outline-none transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-365 mb-1.5 block">Column</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value as Task['status'] }))}
                      className="w-full bg-[#1F1F26] border border-slate-850 rounded-lg px-3 py-2 text-xs text-white focus:border-[#0E71EB]/50 focus:outline-none transition-all"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-3">
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="flex-1 py-2 bg-[#1F1F26] hover:bg-[#2A2A35] border border-slate-800 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreate} 
                    className="flex-1 py-2 bg-[#0E71EB] hover:bg-[#0C62CC] text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {COLUMNS.map((col, colIndex) => {
            const colTasks = tasks.filter(t => t.status === col.id);
            const statusColors = {
              todo: { border: 'border-slate-800', indicator: 'bg-slate-500', bg: 'from-slate-600/5 to-slate-650/5' },
              inprogress: { border: 'border-amber-600/30', indicator: 'bg-amber-400 animate-pulse', bg: 'from-amber-600/5 to-amber-650/5' },
              done: { border: 'border-emerald-600/30', indicator: 'bg-emerald-400', bg: 'from-emerald-600/5 to-emerald-650/5' },
            };
            const colors = statusColors[col.id];
            
            return (
              <div
                key={col.id}
                className="flex flex-col h-full min-h-[450px]"
                onDragOver={e => e.preventDefault()}
                onDrop={e => onDrop(e, col.id)}
              >
                <div className={`bg-gradient-to-br ${colors.bg} bg-[#16161B] rounded-2xl border ${colors.border} overflow-hidden flex flex-col flex-1 shadow-lg`}>
                  <div className="p-5 border-b border-slate-850 bg-[#1A1A22]/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${colors.indicator}`} />
                        <h3 className="font-bold text-white text-sm">{col.label}</h3>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded-full">{colTasks.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {isLoading ? (
                      [1, 2].map(i => <div key={i} className="h-24 bg-slate-800/40 rounded-lg animate-pulse border border-slate-850" />)
                    ) : colTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs py-8">
                        <Plus size={20} className="mb-2 opacity-30" />
                        <span>Drop tasks here</span>
                      </div>
                    ) : colTasks.map((task, i) => {
                      const taskId = task._id || task.id || '';
                      return (
                        <div
                          key={taskId}
                          draggable
                          onDragStart={e => onDragStart(e, taskId)}
                          className={`bg-[#1F1F26] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:bg-[#25252F] transition-all group border border-slate-850 hover:border-slate-750 hover:shadow-lg
                            ${draggedId === taskId ? 'opacity-50 scale-95' : ''}`}
                          style={{ animationDelay: `${i * 30}ms` }}
                        >
                          <div className="flex items-start gap-2">
                            <GripVertical size={14} className="text-slate-600 mt-1 flex-shrink-0 group-hover:text-[#0E71EB] transition-colors" />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold leading-snug ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white group-hover:text-[#0E71EB] transition-colors'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 group-hover:text-slate-400 transition-colors">{task.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-3">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800/60 ${PRIORITIES[task.priority]?.color}`}>
                                  <Flag size={8} />
                                  {PRIORITIES[task.priority]?.label}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete(taskId)}
                              className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all flex-shrink-0 p-1 hover:bg-red-500/10 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Task } from '../types';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, X, GripVertical, Clock, AlertCircle, Flag } from 'lucide-react';

type Column = { id: Task['status']; label: string; color: string; badgeVariant: 'default' | 'info' | 'warning' | 'success' };

const COLUMNS: Column[] = [
  { id: 'todo', label: 'To Do', color: 'border-gray-600', badgeVariant: 'default' },
  { id: 'inprogress', label: 'In Progress', color: 'border-amber-600', badgeVariant: 'warning' },
  { id: 'done', label: 'Done', color: 'border-emerald-600', badgeVariant: 'success' },
];

const PRIORITIES: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-400' },
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
    api.get('/tasks').then(r => setTasks(r.data)).catch(() => toast.error('Failed to load tasks')).finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error('Task title required');
    try {
      const { data } = await api.post('/tasks', form);
      setTasks(prev => [data, ...prev]);
      setForm({ title: '', description: '', priority: 'medium', status: 'todo' });
      setShowForm(false);
      toast.success('Task created!');
    } catch { toast.error('Failed to create task'); }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
    } catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));
    try { await api.delete(`/tasks/${taskId}`); }
    catch { toast.error('Failed to delete task'); }
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
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Task Board</h1>
            <p className="text-gray-400 text-sm mt-1">Drag and drop to update task status</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} />
            New Task
          </Button>
        </div>

        {/* Create form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-md animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">Create Task</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Task title"
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Optional description..."
                    rows={3}
                    className="w-full bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 resize-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(p => ({ ...p, priority: e.target.value as any }))}
                      className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Column</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(p => ({ ...p, status: e.target.value as Task['status'] }))}
                      className="w-full bg-surface-700 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button onClick={handleCreate} className="flex-1">Create Task</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-160px)]">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col"
                onDragOver={e => e.preventDefault()}
                onDrop={e => onDrop(e, col.id)}
              >
                <div className={`glass rounded-2xl border-t-2 ${col.color} overflow-hidden flex flex-col flex-1`}>
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{col.label}</h3>
                      <Badge variant={col.badgeVariant}>{colTasks.length}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {isLoading ? (
                      [1, 2].map(i => <div key={i} className="h-20 bg-surface-700 rounded-xl animate-pulse" />)
                    ) : colTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-600 text-sm">
                        <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center mb-2">
                          <Plus size={18} />
                        </div>
                        Drop tasks here
                      </div>
                    ) : colTasks.map(task => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={e => onDragStart(e, task._id)}
                        className={`bg-surface-700 rounded-xl p-3 cursor-grab active:cursor-grabbing hover:bg-surface-600 transition-all group border border-transparent hover:border-white/10
                          ${draggedId === task._id ? 'opacity-50 scale-95' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`flex items-center gap-1 text-xs ${PRIORITIES[task.priority]?.color}`}>
                                <Flag size={10} />
                                {PRIORITIES[task.priority]?.label}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
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

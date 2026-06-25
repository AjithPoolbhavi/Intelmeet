import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, Loader2, CheckSquare, Circle, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';

import { tasksAPI } from '../services/api';
import { Task } from '../types';
import clsx from 'clsx';

type Status = 'todo' | 'inprogress' | 'done';
type Priority = 'low' | 'medium' | 'high';

const COLUMNS: { id: Status; label: string; color: string; bg: string }[] = [
  { id: 'todo', label: 'To Do', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/30' },
  { id: 'inprogress', label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
  { id: 'done', label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'text-slate-400 bg-slate-500/20',
  medium: 'text-amber-400 bg-amber-500/20',
  high: 'text-red-400 bg-red-500/20',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as Priority });
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data.tasks || []);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return toast.error('Title required');
    setCreating(true);
    try {
      const res = await tasksAPI.create(newTask);
      setTasks(t => [res.data.task, ...t]);
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'medium' });
      toast.success('Task created!');
    } catch { toast.error('Failed to create task'); } finally { setCreating(false); }
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    const id = taskId;
    setTasks(prev => prev.map(t => (t._id === id || t.id === id) ? { ...t, status: newStatus } : t));
    try {
      await tasksAPI.update(id, { status: newStatus });
    } catch { toast.error('Failed to update task'); }
  };

  const handleDelete = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t._id !== taskId && t.id !== taskId));
    try {
      await tasksAPI.delete(taskId);
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const getTaskId = (task: Task) => task._id || task.id || '';

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    handleStatusChange(taskId, status);
    setDragOver(null);
  };

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare, color: 'text-brand-400' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'inprogress').length, icon: Clock, color: 'text-amber-400' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, icon: CheckSquare, color: 'text-emerald-400' },
  ];

  return (
    <div className="flex min-h-screen bg-surface-900">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-brand-600/20">
                  <CheckSquare size={24} className="text-brand-400" />
                </div>
                Task Board
              </h1>
              <p className="text-slate-400 text-sm">Organize and track your action items</p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 py-2.5 px-4">
              <Plus size={18} /> New Task
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color }, i) => (
              <div 
                key={label}
                className="card hover:border-surface-400 transition-all duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                  <Icon size={20} className={color} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-brand-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            {COLUMNS.map((col, colIndex) => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div
                  key={col.id}
                  className={clsx(
                    'rounded-xl border-2 bg-surface-800/40 backdrop-blur-sm p-5 min-h-[500px] transition-all duration-200 flex flex-col',
                    dragOver === col.id 
                      ? `ring-2 ring-${col.color.split('-')[1]}-500 bg-${col.color.split('-')[1]}-500/5 border-${col.color.split('-')[1]}-500/50` 
                      : `border-${col.color.split('-')[1]}-500/30`
                  )}
                  onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, col.id)}
                  style={{ animationDelay: `${colIndex * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-surface-700/50">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-2.5 h-2.5 rounded-full',
                        col.id === 'todo' && 'bg-slate-400',
                        col.id === 'inprogress' && 'bg-amber-400 animate-pulse',
                        col.id === 'done' && 'bg-emerald-400'
                      )} />
                      <h3 className={`font-bold text-sm ${col.color}`}>{col.label}</h3>
                      <span className={clsx(
                        'badge border text-xs font-semibold',
                        col.bg,
                        col.color
                      )}>
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-slate-600 hover:text-brand-400 transition-colors p-1 hover:bg-surface-700/50 rounded-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto pr-2">
                    {colTasks.map((task, i) => (
                      <TaskCard
                        key={getTaskId(task)}
                        task={task}
                        taskId={getTaskId(task)}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onDragStart={handleDragStart}
                        delay={i}
                      />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="text-center py-12 text-slate-600 text-sm border-2 border-dashed border-surface-600/50 rounded-lg flex items-center justify-center flex-1">
                        <div className="text-center">
                          <Plus size={20} className="mx-auto mb-2 opacity-50" />
                          <span className="text-xs">Drop tasks here</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Create Task</h2>
                <p className="text-slate-400 text-sm mt-1">Add a new action item</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-2 rounded-lg hover:bg-surface-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Title</label>
                <input 
                  className="w-full px-4 py-3 bg-surface-700/50 border border-surface-600 rounded-lg text-white placeholder-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all" 
                  placeholder="Task title..." 
                  value={newTask.title}
                  onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))} 
                  autoFocus 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-surface-700/50 border border-surface-600 rounded-lg text-white placeholder-slate-500 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none transition-all" 
                  rows={3} 
                  placeholder="Optional description..."
                  value={newTask.description}
                  onChange={e => setNewTask(n => ({ ...n, description: e.target.value }))} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map(p => (
                    <button 
                      key={p} 
                      type="button"
                      onClick={() => setNewTask(n => ({ ...n, priority: p }))}
                      className={clsx(
                        'flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize',
                        newTask.priority === p
                          ? `${PRIORITY_COLORS[p]} ring-2 ring-current`
                          : 'bg-surface-700 text-slate-400 hover:bg-surface-600'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2" 
                  disabled={creating}
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, taskId, onStatusChange, onDelete, onDragStart, delay = 0 }: {
  task: Task; taskId: string;
  onStatusChange: (id: string, s: Status) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  delay?: number;
}) {
  const PRIORITY_COLORS: Record<string, string> = {
    low: 'text-slate-400', medium: 'text-amber-400', high: 'text-red-400',
  };

  const nextStatus: Record<string, Status> = { todo: 'inprogress', inprogress: 'done', done: 'todo' };

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, taskId)}
      className="bg-gradient-to-br from-surface-700/60 to-surface-700/30 hover:from-surface-700 hover:to-surface-600/50 border border-surface-600/50 hover:border-surface-500 rounded-lg p-4 cursor-grab active:cursor-grabbing group transition-all hover:shadow-lg hover:shadow-brand-600/5 animate-slide-up"
      style={{ animationDelay: `${delay * 30}ms` }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm text-white font-semibold flex-1 leading-snug group-hover:text-brand-100 transition-colors">{task.title}</p>
        <button
          onClick={() => onDelete(taskId)}
          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all flex-shrink-0 p-1 hover:bg-red-500/20 rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 group-hover:text-slate-400 transition-colors">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs flex items-center gap-1.5 font-semibold px-2 py-1 rounded-md bg-surface-600/50', PRIORITY_COLORS[task.priority])}>
          <AlertCircle size={12} />
          {task.priority}
        </span>
        <button
          onClick={() => onStatusChange(taskId, nextStatus[task.status])}
          className="text-xs text-slate-500 hover:text-brand-400 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
        >
          <Circle size={11} />
          {nextStatus[task.status] === 'inprogress' ? 'Start' : nextStatus[task.status] === 'done' ? 'Done' : 'Reset'}
        </button>
      </div>
    </div>
  );
}

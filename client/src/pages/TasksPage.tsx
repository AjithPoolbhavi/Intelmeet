import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, Loader2, CheckSquare, Circle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
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

  return (
    <div className="flex min-h-screen bg-surface-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckSquare size={24} className="text-brand-400" /> Task Board
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your action items and tasks</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Task
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-brand-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COLUMNS.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div
                  key={col.id}
                  className={clsx(
                    'rounded-xl border bg-surface-800/60 p-4 min-h-[400px] transition-all duration-150',
                    dragOver === col.id ? 'ring-2 ring-brand-500 bg-brand-500/5' : 'border-surface-600'
                  )}
                  onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, col.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm ${col.color}`}>{col.label}</h3>
                      <span className={`badge border text-xs ${col.bg} ${col.color}`}>{colTasks.length}</span>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-slate-600 hover:text-slate-300 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {colTasks.map(task => (
                      <TaskCard
                        key={getTaskId(task)}
                        task={task}
                        taskId={getTaskId(task)}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onDragStart={handleDragStart}
                      />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-surface-600 rounded-lg">
                        Drop tasks here
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">New Task</h2>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                <input className="input" placeholder="Task title..." value={newTask.title}
                  onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))} autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                <textarea className="input resize-none" rows={3} placeholder="Optional description..."
                  value={newTask.description}
                  onChange={e => setNewTask(n => ({ ...n, description: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map(p => (
                    <button key={p} type="button"
                      onClick={() => setNewTask(n => ({ ...n, priority: p }))}
                      className={clsx(
                        'flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                        newTask.priority === p
                          ? `${PRIORITY_COLORS[p]} ring-1 ring-current`
                          : 'bg-surface-700 text-slate-400 hover:bg-surface-600'
                      )}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={creating}>
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

function TaskCard({ task, taskId, onStatusChange, onDelete, onDragStart }: {
  task: Task; taskId: string;
  onStatusChange: (id: string, s: Status) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const PRIORITY_COLORS: Record<string, string> = {
    low: 'text-slate-400', medium: 'text-amber-400', high: 'text-red-400',
  };

  const nextStatus: Record<string, Status> = { todo: 'inprogress', inprogress: 'done', done: 'todo' };

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, taskId)}
      className="bg-surface-700 hover:bg-surface-600 border border-surface-500 rounded-lg p-3 cursor-grab active:cursor-grabbing group transition-all hover:border-surface-400"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm text-slate-200 font-medium flex-1 leading-snug">{task.title}</p>
        <button
          onClick={() => onDelete(taskId)}
          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs flex items-center gap-1 font-medium', PRIORITY_COLORS[task.priority])}>
          <AlertCircle size={11} />
          {task.priority}
        </span>
        <button
          onClick={() => onStatusChange(taskId, nextStatus[task.status])}
          className="text-xs text-slate-500 hover:text-brand-400 transition-colors flex items-center gap-1"
        >
          <Circle size={11} />
          {nextStatus[task.status] === 'inprogress' ? 'Start' : nextStatus[task.status] === 'done' ? 'Complete' : 'Reset'}
        </button>
      </div>
    </div>
  );
}

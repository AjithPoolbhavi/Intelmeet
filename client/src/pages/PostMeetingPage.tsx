import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, CheckSquare, ArrowLeft, Copy, Download, Loader2, Plus, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import { aiAPI, meetingsAPI, tasksAPI } from '../services/api';
import { AISummaryResponse } from '../types';

export default function PostMeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState<AISummaryResponse | null>(null);
  const [savingTask, setSavingTask] = useState<string | null>(null);
  const [savedTasks, setSavedTasks] = useState<Set<string>>(new Set());

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.generateSummary({ meetingTitle: `Meeting ${meetingId}`, participantCount: 3 });
      setAiData(res.data);
      // Save to meeting
      await meetingsAPI.saveSummary(meetingId!, {
        summary: res.data.summary,
        actionItems: res.data.actionItems,
      }).catch(() => {});
      toast.success('AI summary generated!');
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (item: string, index: number) => {
    const key = index.toString();
    setSavingTask(key);
    try {
      await tasksAPI.create({ title: item, status: 'todo', priority: 'medium' });
      setSavedTasks(s => new Set(s).add(key));
      toast.success('Task added to board!');
    } catch {
      toast.error('Failed to save task');
    } finally {
      setSavingTask(null);
    }
  };

  const copyToClipboard = () => {
    if (!aiData) return;
    const text = `Meeting Summary\n\n${aiData.summary}\n\nAction Items:\n${aiData.actionItems.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex min-h-screen bg-surface-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2 rounded-lg hover:bg-surface-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Meeting Summary</h1>
            <p className="text-slate-500 text-sm font-mono mt-1">{meetingId}</p>
          </div>
        </div>

        {/* Recording placeholder */}
        <div className="card mb-6 flex items-center gap-4 animate-slide-up bg-gradient-to-r from-rose-600/20 to-rose-600/5 border-rose-600/40 hover:border-rose-500/60">
          <div className="w-14 h-14 rounded-xl bg-rose-500/30 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">Meeting Recording</p>
            <p className="text-slate-500 text-sm">Processing... will be available in a few minutes</p>
          </div>
          <button className="btn-secondary text-sm ml-auto flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
            <Download size={14} /> Download
          </button>
        </div>

        {/* AI Summary */}
        <div className="card mb-6 animate-slide-up bg-gradient-to-br from-brand-600/15 to-brand-600/5 border-brand-600/40" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-surface-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-brand-600/30">
                <Sparkles size={18} className="text-brand-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">AI Meeting Summary</h2>
                {aiData && (
                  <span className="badge bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs mt-1">
                    {(parseFloat(aiData.confidence) * 100).toFixed(0)}% confidence
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {aiData && (
                <button onClick={copyToClipboard} className="btn-ghost text-sm flex items-center gap-1.5 hover:bg-surface-700/50">
                  <Copy size={14} /> Copy
                </button>
              )}
              <button
                onClick={generateSummary}
                disabled={loading}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loading ? 'Generating...' : aiData ? 'Regenerate' : 'Generate Summary'}
              </button>
            </div>
          </div>

          {!aiData && !loading && (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/30 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={32} className="text-slate-600" />
              </div>
              <p className="font-semibold text-slate-400">No summary yet</p>
              <p className="text-sm mt-2">Click "Generate Summary" to create an AI-powered meeting summary</p>
            </div>
          )}

          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-surface-600 rounded w-full" />
              <div className="h-4 bg-surface-600 rounded w-5/6" />
              <div className="h-4 bg-surface-600 rounded w-4/6" />
              <div className="h-4 bg-surface-600 rounded w-full" />
              <div className="h-4 bg-surface-600 rounded w-3/4" />
            </div>
          )}

          {aiData && (
            <div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{aiData.summary}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-surface-600/50 text-xs text-slate-600">
                <span>Generated by <strong>{aiData.model}</strong></span>
                <span>·</span>
                <span>{new Date(aiData.generatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Items */}
        {aiData && (
          <div className="card animate-slide-up bg-gradient-to-br from-emerald-600/15 to-emerald-600/5 border-emerald-600/40" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-surface-700/50">
              <div className="p-2.5 rounded-lg bg-emerald-600/30">
                <CheckSquare size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Action Items</h2>
                <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs mt-1">
                  {aiData.actionItems.length} items
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {aiData.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg bg-surface-700/30 hover:bg-surface-700/60 transition-all group animate-slide-up"
                  style={{ animationDelay: `${(i + 2) * 50}ms` }}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    savedTasks.has(i.toString())
                      ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/50'
                      : 'border-surface-500 group-hover:border-emerald-500/70'
                  }`}>
                    {savedTasks.has(i.toString()) && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm flex-1 pt-1">{item}</p>
                  <button
                    onClick={() => handleSaveTask(item, i)}
                    disabled={savedTasks.has(i.toString()) || savingTask === i.toString()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost text-xs flex items-center gap-1 py-1.5 px-3 flex-shrink-0 whitespace-nowrap hover:bg-emerald-500/20 hover:text-emerald-400"
                  >
                    {savingTask === i.toString() ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : savedTasks.has(i.toString()) ? (
                      <><CheckSquare size={12} /> Added</>
                    ) : (
                      <><Plus size={12} /> Add Task</>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-5 border-t border-surface-600/50">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-secondary text-sm flex items-center gap-2 flex-1"
              >
                <LayoutDashboard size={14} /> View Task Board
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ghost text-sm flex items-center gap-2 flex-1"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

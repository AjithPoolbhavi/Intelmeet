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
      <main className="flex-1 ml-64 p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Meeting Summary</h1>
            <p className="text-slate-400 text-sm font-mono mt-0.5">{meetingId}</p>
          </div>
        </div>

        {/* Recording placeholder */}
        <div className="card mb-6 flex items-center gap-4 animate-slide-up">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
          </div>
          <div>
            <p className="text-white font-medium">Meeting Recording</p>
            <p className="text-slate-500 text-sm">Recording processing... will be available in a few minutes</p>
          </div>
          <button className="btn-secondary text-sm ml-auto flex items-center gap-2" disabled>
            <Download size={14} /> Download
          </button>
        </div>

        {/* AI Summary */}
        <div className="card mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-400" />
              <h2 className="font-semibold text-white">AI Meeting Summary</h2>
              {aiData && (
                <span className="badge bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  {(parseFloat(aiData.confidence) * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {aiData && (
                <button onClick={copyToClipboard} className="btn-ghost text-sm flex items-center gap-1.5">
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
            <div className="text-center py-10 text-slate-500">
              <Sparkles size={36} className="mx-auto mb-3 text-slate-600" />
              <p className="font-medium text-slate-400">No summary yet</p>
              <p className="text-sm mt-1">Click "Generate Summary" to create an AI-powered meeting summary</p>
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
              <p className="text-slate-300 text-sm leading-relaxed">{aiData.summary}</p>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-600">
                <span className="text-xs text-slate-600">Generated by {aiData.model}</span>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-600">
                  {new Date(aiData.generatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Items */}
        {aiData && (
          <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare size={18} className="text-emerald-400" />
              <h2 className="font-semibold text-white">Action Items</h2>
              <span className="badge bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {aiData.actionItems.length} items
              </span>
            </div>
            <div className="space-y-2">
              {aiData.actionItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-700 hover:bg-surface-600 transition-colors group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    savedTasks.has(i.toString())
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-surface-400 group-hover:border-brand-500'
                  }`}>
                    {savedTasks.has(i.toString()) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm flex-1">{item}</p>
                  <button
                    onClick={() => handleSaveTask(item, i)}
                    disabled={savedTasks.has(i.toString()) || savingTask === i.toString()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost text-xs flex items-center gap-1 py-1 flex-shrink-0"
                  >
                    {savingTask === i.toString() ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : savedTasks.has(i.toString()) ? (
                      'Added'
                    ) : (
                      <><Plus size={12} /> Add Task</>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-surface-600">
              <button
                onClick={() => navigate('/tasks')}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <LayoutDashboard size={14} /> View Task Board
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ghost text-sm flex items-center gap-2"
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

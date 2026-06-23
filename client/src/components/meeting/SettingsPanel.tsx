import { X, Mic, Video, Volume2, Monitor, Moon } from 'lucide-react';
import { useMeetingStore } from '../../store/meetingStore';
import { useState } from 'react';

export default function SettingsPanel() {
  const { toggleSettings } = useMeetingStore();
  const [tab, setTab] = useState<'audio' | 'video' | 'general'>('audio');
  const [noiseCancel, setNoiseCancel] = useState(true);
  const [hdVideo, setHdVideo] = useState(false);
  const [mirrorVideo, setMirrorVideo] = useState(true);
  const [volume, setVolume] = useState(80);

  return (
    <div className="flex flex-col h-full bg-surface-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-600 flex-shrink-0">
        <h3 className="font-semibold text-white text-sm">Settings</h3>
        <button onClick={toggleSettings} className="btn-ghost p-1 hover:bg-surface-600 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-600 flex-shrink-0">
        {(['audio', 'video', 'general'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${
              tab === t
                ? 'text-brand-400 border-b-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === 'audio' && (
          <>
            <SettingSection icon={Mic} title="Microphone">
              <select className="settings-select">
                <option>Default Microphone</option>
                <option>Built-in Microphone</option>
              </select>
            </SettingSection>

            <SettingSection icon={Volume2} title="Speaker">
              <select className="settings-select">
                <option>Default Speaker</option>
                <option>Built-in Speaker</option>
              </select>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Volume</span>
                  <span>{volume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="settings-slider"
                />
              </div>
            </SettingSection>

            <SettingToggle
              label="Suppress background noise"
              description="AI-powered noise cancellation"
              value={noiseCancel}
              onChange={setNoiseCancel}
            />
          </>
        )}

        {tab === 'video' && (
          <>
            <SettingSection icon={Video} title="Camera">
              <select className="settings-select">
                <option>Default Camera</option>
                <option>Built-in Camera</option>
              </select>
            </SettingSection>

            <SettingToggle
              label="HD Video"
              description="Enable 720p or higher resolution"
              value={hdVideo}
              onChange={setHdVideo}
            />

            <SettingToggle
              label="Mirror my video"
              description="Flip video for selfie view"
              value={mirrorVideo}
              onChange={setMirrorVideo}
            />
          </>
        )}

        {tab === 'general' && (
          <>
            <SettingSection icon={Monitor} title="Display">
              <select className="settings-select">
                <option>Grid View</option>
                <option>Speaker View</option>
              </select>
            </SettingSection>

            <SettingSection icon={Moon} title="Theme">
              <select className="settings-select">
                <option>Dark (Default)</option>
                <option>System</option>
              </select>
            </SettingSection>
          </>
        )}
      </div>
    </div>
  );
}

function SettingSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-brand-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SettingToggle({
  label, description, value, onChange,
}: {
  label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div>
        <p className="text-sm text-slate-200 font-medium">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`flex-shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 relative mt-0.5 ${
          value ? 'bg-brand-500' : 'bg-surface-600'
        }`}
        style={{ minWidth: 40, height: 22 }}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? 'translate-x-[18px]' : ''
          }`}
        />
      </button>
    </div>
  );
}

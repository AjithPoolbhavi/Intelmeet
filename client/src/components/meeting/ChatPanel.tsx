import { useState, useEffect, useRef } from 'react';
import { Send, X, Smile, Paperclip } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../../store/meetingStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

const GRADIENTS = [
  ['#7c3aed', '#4f46e5'],
  ['#0891b2', '#1d4ed8'],
  ['#059669', '#0d9488'],
  ['#e11d48', '#db2777'],
  ['#d97706', '#ea580c'],
];
function getGradient(name: string) {
  return GRADIENTS[name?.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
}

const QUICK_EMOJIS = ['👍', '😂', '❤️', '🎉', '👏'];

export default function ChatPanel({ meetingId, socket }: { meetingId: string; socket: Socket | null }) {
  const { messages, toggleChat } = useMeetingStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit('send-message', { meetingId, content: text.trim(), senderName: user?.name || 'Guest' });
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#18181b' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
      }}>
        <div>
          <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, margin: 0 }}>In-Meeting Chat</p>
          <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0' }}>{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={toggleChat}
          style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 10, textAlign: 'center', paddingTop: 40 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} style={{ color: '#475569' }} />
            </div>
            <div>
              <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, margin: '0 0 4px' }}>No messages yet</p>
              <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Say hello to everyone 👋</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.senderId === user?.id || msg.senderName === user?.name;
          const prevSame = messages[i - 1]?.senderName === msg.senderName;
          const [g1, g2] = getGradient(msg.senderName || '?');

          return (
            <div key={msg.id} style={{ display: 'flex', gap: 8, flexDirection: isMe ? 'row-reverse' : 'row' }}>
              {/* Avatar */}
              {!prevSame ? (
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${g1}, ${g2})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 11, fontWeight: 700, marginTop: 2,
                }}>
                  {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              ) : (
                <div style={{ width: 28, flexShrink: 0 }} />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '74%', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                {!prevSame && !isMe && (
                  <span style={{ color: '#94a3b8', fontSize: 11, fontWeight: 500, paddingLeft: 2 }}>{msg.senderName}</span>
                )}
                <div style={{
                  padding: '9px 13px', borderRadius: 16,
                  borderBottomRightRadius: isMe ? 4 : 16,
                  borderBottomLeftRadius: isMe ? 16 : 4,
                  fontSize: 13, lineHeight: 1.5, wordBreak: 'break-word',
                  ...(isMe ? {
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: '#fff',
                    boxShadow: '0 2px 12px rgba(99,102,241,0.3)',
                  } : {
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#e2e8f0',
                  }),
                }}>
                  {msg.content}
                </div>
                <span style={{ color: '#475569', fontSize: 10, paddingLeft: 2, paddingRight: 2 }}>
                  {format(new Date(msg.timestamp), 'h:mm a')}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick emoji */}
      {showEmoji && (
        <div style={{ display: 'flex', gap: 6, padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {QUICK_EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => { setText(t => t + e); inputRef.current?.focus(); }}
              style={{ fontSize: 22, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'transform 0.12s', borderRadius: 8, padding: '2px 4px' }}
              onMouseEnter={e2 => (e2.currentTarget as HTMLElement).style.transform = 'scale(1.3)'}
              onMouseLeave={e2 => (e2.currentTarget as HTMLElement).style.transform = 'scale(1)'}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <form onSubmit={sendMessage} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 14, padding: '4px 6px 4px 4px',
        }}>
          <button
            type="button"
            onClick={() => setShowEmoji(v => !v)}
            style={{
              width: 34, height: 34, borderRadius: 10, border: 'none',
              background: showEmoji ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: showEmoji ? '#818cf8' : '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <Smile size={17} />
          </button>
          <button
            type="button"
            style={{
              width: 34, height: 34, borderRadius: 10, border: 'none', background: 'transparent',
              color: '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Paperclip size={15} />
          </button>
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Message everyone…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#e2e8f0', fontSize: 13, fontFamily: 'inherit', padding: '6px 4px',
            }}
          />
          <button
            type="submit"
            disabled={!text.trim() || !socket}
            style={{
              width: 36, height: 36, borderRadius: 11, border: 'none',
              background: text.trim() && socket ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.05)',
              color: text.trim() && socket ? '#fff' : '#475569',
              cursor: text.trim() && socket ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: text.trim() && socket ? '0 2px 12px rgba(99,102,241,0.35)' : 'none',
              transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}

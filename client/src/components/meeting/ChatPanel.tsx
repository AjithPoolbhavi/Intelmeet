import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../../store/meetingStore';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function ChatPanel({ meetingId, socket }: { meetingId: string; socket: Socket | null }) {
  const { messages, toggleChat } = useMeetingStore();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit('send-message', {
      meetingId,
      content: text.trim(),
      senderName: user?.name || 'Guest',
    });
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-600 flex-shrink-0">
        <h3 className="font-semibold text-white text-sm">In-Meeting Chat</h3>
        <button onClick={toggleChat} className="btn-ghost p-1">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm py-8">
            <p>No messages yet</p>
            <p className="text-xs mt-1">Say hello to your team!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id || msg.senderName === user?.name;
          return (
            <div key={msg.id} className={clsx('flex flex-col', isMe ? 'items-end' : 'items-start')}>
              {!isMe && (
                <span className="text-xs text-slate-500 mb-1 px-1">{msg.senderName}</span>
              )}
              <div className={clsx(
                'max-w-[80%] px-3 py-2 rounded-2xl text-sm',
                isMe
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'bg-surface-600 text-slate-200 rounded-tl-sm'
              )}>
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-600 mt-0.5 px-1">
                {format(new Date(msg.timestamp), 'h:mm a')}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-surface-600 flex-shrink-0">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="input text-sm flex-1 py-2"
            placeholder="Message everyone..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button type="submit" className="btn-primary p-2" disabled={!text.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

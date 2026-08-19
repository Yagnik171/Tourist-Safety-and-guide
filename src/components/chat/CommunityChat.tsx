'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DEMO_CHAT_MESSAGES } from '@/lib/demo-data';
import type { ChatMessage } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export const CommunityChat: React.FC = () => {
  const { currentLocation, user } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender_id: user?.id || 'demo-user',
      region_id: currentLocation.id,
      message: inputMessage.trim(),
      is_system_message: false,
      created_at: new Date().toISOString(),
      sender: {
        id: user?.id || 'demo-user',
        name: user?.name || 'Verified Tourist',
      },
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {currentLocation.city} Tourist Community
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Live updates & safety tips from travelers on the ground
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>128 Online</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {/* Safety guidelines notice */}
        <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Please share verified safety information only. Emergency requests should use the SOS button.</span>
        </div>

        {messages.map((msg, idx) => {
          const isCurrentUser = msg.sender_id === (user?.id || 'demo-user') || msg.sender?.name?.includes('Demo');

          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">
                  {isCurrentUser ? 'You' : msg.sender?.name || 'Traveler'}
                </span>
                <span>•</span>
                <span>{formatRelativeTime(msg.created_at)}</span>
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  isCurrentUser
                    ? 'bg-cyan-600 text-white rounded-br-none shadow-md shadow-cyan-950/40'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                {msg.message}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask or share a safety tip in ${currentLocation.city}...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition-colors shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAppStore } from '@/lib/store';
import { getRecommendationsForLocation, getEmergencyContactsForLocation } from '@/lib/demo-data';
import { generateInteractiveAIResponse } from '@/lib/services/ai-agent';
import {
  Bot,
  Send,
  User,
  Sparkles,
  MapPin,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Compass,
  Hotel,
  Utensils,
  Phone,
  Calendar,
  AlertOctagon,
  Cpu,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  modelUsed?: string;
}

const MODEL_OPTIONS = [
  { id: 'gemini', name: 'Gemini 1.5 Flash', icon: '♊', desc: 'Google Advanced Multimodal Intelligence' },
  { id: 'chatgpt', name: 'ChatGPT (GPT-4o)', icon: '✨', desc: 'OpenAI Conversational Reasoning' },
  { id: 'safewander', name: 'SafeWander Travel Expert', icon: '🛡️', desc: 'Real-time Ground Safety & Emergency Dispatch' },
];

const PRESET_TOPICS = [
  { label: '☀️ How is the weather today?', prompt: 'How is the weather today?' },
  { label: '🎉 I am bored, what should I do?', prompt: 'I am bored, what should I do right now?' },
  { label: '😄 Tell me a joke', prompt: 'Tell me a funny joke!' },
  { label: '📖 Tell me a story', prompt: 'Tell me a short story' },
  { label: '🗺️ 3-Day Trip Itinerary', prompt: 'Create a 3-day travel itinerary for me with timings' },
  { label: '🏨 Safe Hotels & Stay', prompt: 'What are the top-rated safe hotels nearby?' },
  { label: '🍽️ Food & Restaurants', prompt: 'Recommend hygienic local food and top restaurants' },
  { label: '🚔 Emergency Responders', prompt: 'Give me the nearest police station and hospital contacts' },
];

export default function AssistantPage() {
  const { currentLocation } = useAppStore();
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'chatgpt' | 'safewander'>('gemini');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: `👋 Hello! I am **SafeWander AI Agent**, your travel & AI companion for **${currentLocation.city}, ${currentLocation.state || 'India'}**.\n\nYou can ask me **ANYTHING** in chat — weather updates, boredom fixes, stories, jokes, 3-day trip itineraries, safe hotels, or emergency responder contacts.\n\n💡 *Voice chat is optional — click the 🎙️ mic button to speak or tap 🔊 Speak on any message to listen out loud!*`,
      timestamp: new Date(),
      modelUsed: 'Gemini 1.5 Flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const places = getRecommendationsForLocation(currentLocation);
  const contacts = getEmergencyContactsForLocation(currentLocation);

  // Initialize Speech Recognition (Voice Input)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
            handleSend(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-to-Speech (Voice Output)
  const speakText = useCallback((text: string) => {
    if (!isVoiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown formatting for speech
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 300));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [isVoiceOutputEnabled]);

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Reset chat when location changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: `👋 Hello! I am **SafeWander AI Agent**, your interactive travel companion for **${currentLocation.city}, ${currentLocation.state || 'India'}**.\n\nAsk me anything about this region or tap any quick suggestion below! 🗺️`,
        timestamp: new Date(),
        modelUsed: MODEL_OPTIONS.find(m => m.id === selectedModel)?.name,
      },
    ]);
  }, [currentLocation.id, selectedModel]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate interactive reasoning delay
    await new Promise(r => setTimeout(r, 600));

    const replyText = generateInteractiveAIResponse(text, currentLocation, places, contacts);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: replyText,
      timestamp: new Date(),
      modelUsed: MODEL_OPTIONS.find(m => m.id === selectedModel)?.name,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);

    // Speak response out loud if Voice Output enabled
    speakText(replyText);
  }, [input, isLoading, currentLocation, places, contacts, selectedModel, speakText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    window.speechSynthesis?.cancel();
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: `👋 Chat reset! Ready to assist you in **${currentLocation.city}**. What would you like to explore next?`,
        timestamp: new Date(),
        modelUsed: MODEL_OPTIONS.find(m => m.id === selectedModel)?.name,
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render markdown text formatting
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*|\`.*?\`|\*.*?\*)/g);
      return (
        <div key={lineIdx} className={line.startsWith('- ') || line.startsWith('• ') ? 'pl-3 my-0.5' : 'my-0.5'}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={partIdx} className="bg-slate-950 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-xs">{part.slice(1, -1)}</code>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={partIdx} className="text-slate-300 italic">{part.slice(1, -1)}</em>;
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar type="tourist" />

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header Bar */}
          <div className="shrink-0 px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-white">Interactive AI Agent</h1>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Real-time LLM
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  Active Region: <strong className="text-white">{currentLocation.name}, {currentLocation.city}</strong>
                </p>
              </div>
            </div>

            {/* Model Switcher & Control Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                {MODEL_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      selectedModel === m.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title={m.desc}
                  >
                    <span>{m.icon}</span>
                    <span className="hidden sm:inline">{m.name}</span>
                  </button>
                ))}
              </div>

              {/* Voice Output Toggle */}
              <button
                onClick={() => {
                  setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
                  if (isVoiceOutputEnabled) window.speechSynthesis?.cancel();
                }}
                className={`p-2.5 rounded-xl border text-xs transition-colors ${
                  isVoiceOutputEnabled
                    ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                title={isVoiceOutputEnabled ? 'Voice output enabled' : 'Voice output muted'}
              >
                {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset Chat */}
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center shadow-md ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-200'
                  }`}
                >
                  {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Container */}
                <div className="max-w-[80%] space-y-1.5">
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'assistant'
                        ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-xl rounded-tl-sm'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold rounded-tr-sm shadow-lg shadow-cyan-950/40'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderFormattedText(msg.text) : msg.text}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className={`flex items-center gap-3 text-[10px] text-slate-500 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.modelUsed && (
                      <span className="text-cyan-400 font-mono font-semibold">• {msg.modelUsed}</span>
                    )}
                    {msg.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => speakText(msg.text)}
                          className="hover:text-cyan-400 transition-colors flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" /> Speak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shrink-0 text-white">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 text-xs text-cyan-400 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Interactive Agent processing prompt for {currentLocation.city}...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestion Topic Pills */}
          <div className="shrink-0 px-4 md:px-8 pb-2 pt-1 border-t border-slate-900 bg-slate-950/60">
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
              {PRESET_TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => handleSend(topic.prompt)}
                  disabled={isLoading}
                  className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-slate-400 text-xs font-semibold transition-all disabled:opacity-40"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Voice Control Bar */}
          <div className="shrink-0 px-4 md:px-8 pb-5 pt-2 bg-slate-950">
            <div
              className={`flex items-end gap-2 bg-slate-900 border rounded-2xl px-4 py-3 transition-colors shadow-2xl ${
                isListening
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-slate-800 focus-within:border-cyan-500/60'
              }`}
            >
              {/* Microphone Voice Input Button */}
              <button
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak using your microphone'}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Textarea */}
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? '🎙️ Listening to your voice... Speak now...'
                    : `Ask SafeWander AI about ${currentLocation.city} hotels, safety, food, or itinerary...`
                }
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none max-h-32 leading-relaxed"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 flex items-center justify-center transition-all shrink-0 shadow-lg shadow-cyan-950/60"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Send className="w-4 h-4 text-slate-950" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <ShieldCheck className="w-3 h-3" /> Voice & Text LLM Active
              </span>
              <span>Ask anything: 3-day itineraries, police dispatch, safe hotels, food, transport</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

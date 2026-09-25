import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  X,
  MessageSquare,
  ChevronDown,
  Loader2,
  Lightbulb,
  Compass,
} from 'lucide-react';
import { aiService } from '../services/aiService';

export const TravelAssistant = ({ tripContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm your TripGenie AI Assistant for **${tripContext?.destination || 'your trip'}**. Ask me anything about packing, local cuisine, pacing your itinerary, or hidden gems!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'What should I pack for this trip?',
    `Best local street food in ${tripContext?.destination || 'the city'}?`,
    'Can you make our itinerary more relaxed?',
    'Top safety and local etiquette tips?',
  ];

  useEffect(() => {
    setMessages((prev) => {
      const hasUserMsg = prev.some((m) => m.sender === 'user');
      if (!hasUserMsg) {
        return [
          {
            id: 'welcome-1',
            sender: 'ai',
            text: `Hello! I'm your TripGenie AI Assistant for your ${tripContext?.duration || 1}-day trip to **${tripContext?.destination || 'your destination'}** (${tripContext?.travelers || 1} traveler${(tripContext?.travelers || 1) > 1 ? 's' : ''}). Ask me anything about packing, local cuisine, pacing your itinerary, or hidden gems!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [tripContext?.destination, tripContext?.duration, tripContext?.travelers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await aiService.askTravelAssistant(query, tripContext);
      const aiReply = res.data?.reply || "I'm ready to help with any details of your trip!";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "I couldn't reach the AI service at the moment. Please check your network or try again shortly.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: errMsg,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4.5 py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-sm rounded-full shadow-glow hover:scale-108 active:scale-95 transition-all duration-300 btn-shimmer border border-sky-400/40 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
          </div>
          <span className="hidden sm:inline tracking-tight">Ask TripGenie AI</span>
          <Sparkles className="w-4 h-4 text-sky-200" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 sm:right-6 z-50 w-[94vw] sm:w-[440px] h-[580px] max-h-[86vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Subtle Travel Watermark Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none bg-repeat bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10 L65 25 L80 25 L68 35 L72 50 L60 40 L48 50 L52 35 L40 25 L55 25 Z M10 80 A5 5 0 1 1 10 70 A5 5 0 1 1 10 80 Z M110 90 A4 4 0 1 1 110 82 A4 4 0 1 1 110 90 Z' fill='%230284c7'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
            }}
          />

          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-navy-900 text-white flex items-center justify-between border-b border-slate-700/60 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold flex items-center gap-1.5 tracking-tight">
                  TripGenie AI Concierge
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                </h4>
                <p className="text-[11px] text-sky-200/80 font-medium truncate max-w-[240px]">
                  {tripContext?.destination
                    ? `📍 ${tripContext.destination} • ${tripContext.duration || 1} Days`
                    : 'Ready to help'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 relative z-10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm transition-all ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 text-right font-semibold ${
                      msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200/80 max-w-[75%] shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span className="font-medium animate-pulse">TripGenie AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-white/90 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 flex-shrink-0 uppercase tracking-wider">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Suggestions:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100/90 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 text-slate-600 border border-slate-200/80 transition-all cursor-pointer flex-shrink-0 active:scale-95"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about this trip..."
              className="flex-1 bg-slate-50/90 text-slate-900 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-40 text-white transition-all shadow-md shadow-sky-500/20 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default TravelAssistant;

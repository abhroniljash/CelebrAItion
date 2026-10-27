import React, { useState, useRef, useEffect } from 'react';
import { 
  BotMessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  RotateCcw,
  User,
  ArrowRight
} from 'lucide-react';
import { EventPlan, AiChatMessage } from '../types';
import { generateAiChatReply } from '../services/aiEngine';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
  apiKey?: string;
  onUpdateEvent: (updated: EventPlan) => void;
}

const DEFAULT_SUGGESTIONS = [
  'How can I cut 15% from catering costs?',
  'Draft an inquiry email for a photographer',
  'What is a solid Plan B for rain/weather?',
  'Write a 2-minute heartfelt welcome toast',
  'Unique interactive guestbook ideas'
];

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  event,
  apiKey,
  onUpdateEvent
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `👋 Hi! I'm **PlanBot**, your GenAI planning director for **${event.title}**.

I can help you:
• Optimize budgets & suggest where to save money
• Draft professional vendor inquiry emails & negotiation notes
• Solve day-of scheduling bottlenecks
• Brainstorm custom cocktails, guest icebreakers, and themes

What can we work on right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await generateAiChatReply(q, event, history, apiKey);

      const assistantMsg: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestions: response.actionSuggestions
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get AI chat reply', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleAction = (action: any, msgContent: string) => {
    if (action.actionType === 'copy_text') {
      navigator.clipboard.writeText(msgContent);
      alert('Copied advice to clipboard!');
    } else if (action.actionType === 'add_expense' && action.payload) {
      const newItem = {
        id: `b-ai-${Date.now()}`,
        category: action.payload.category || 'Contingency & Emergency Reserve',
        name: action.payload.name || 'AI Buffer Item',
        estimatedCost: action.payload.estimatedCost || 500,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned' as const,
        priority: 'essential' as const,
        notes: 'Added via PlanBot suggestion'
      };
      onUpdateEvent({
        ...event,
        budgetItems: [...event.budgetItems, newItem],
        updatedAt: new Date().toISOString()
      });
      alert(`Added "${newItem.name}" to your Budget items!`);
    } else if (action.actionType === 'add_timeline' && action.payload) {
      const newSlot = {
        id: `t-ai-${Date.now()}`,
        phase: action.payload.phase || 'week_of',
        timeLabel: action.payload.timeLabel || 'Week Before',
        title: action.payload.title || 'Plan B Weather Confirmation',
        description: 'Review forecast, trigger tent contracts if rain probability exceeds 40%.',
        category: action.payload.category || 'Logistics',
        completed: false,
        isKeyMilestone: true
      };
      onUpdateEvent({
        ...event,
        timelineItems: [...event.timelineItems, newSlot],
        updatedAt: new Date().toISOString()
      });
      alert(`Added "${newSlot.title}" to your Timeline!`);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] glass-dropdown shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-up sm:animate-fade-in">
      
      {/* Drawer Top Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>PlanBot AI Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Active Context: {event.title}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mb-1 px-1">
              <span>{msg.role === 'user' ? 'You' : 'PlanBot AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed shadow-sm relative group ${
                msg.role === 'user'
                  ? 'bg-rose-600 text-white rounded-br-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* Action buttons suggested by AI */}
              {msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                  {msg.actionSuggestions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(act, msg.content)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Copy button on assistant messages */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopyText(msg.id, msg.content)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  title="Copy response"
                >
                  {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
            <span>PlanBot is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Suggested Inquiries:
        </span>
        <div className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar">
          {DEFAULT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-500 hover:text-rose-600 transition-colors shrink-0"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask PlanBot anything about your event..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

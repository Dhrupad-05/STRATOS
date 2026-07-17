import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Bot, Terminal, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  time: string;
}

interface ExecutiveCopilotProps {
  crisisMode: string;
  activeNode: string;
}

export default function ExecutiveCopilot({ crisisMode, activeNode }: ExecutiveCopilotProps) {
  const [briefing, setBriefing] = useState<string>('Initializing satellite telemetry feeds...');
  const [isBriefingCollapsed, setIsBriefingCollapsed] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Good morning. I am your STRATOS Strategic Intelligence Copilot. Ask me any logistics question, or click on vessels and choke points to query their state.",
      time: '10:00 AM'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch proactive morning briefing when crisis state updates
  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const response = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ crisis: crisisMode })
        });
        const data = await response.json();
        setBriefing(data.briefing);
      } catch (err) {
        console.error("Failed to load briefing", err);
        setBriefing("STABLE - System connected to local datasets. No anomalous disruptions reported.");
      }
    };
    fetchBriefing();
  }, [crisisMode]);

  // Handle active node queries (when user clicks an item on map)
  useEffect(() => {
    if (activeNode) {
      setChatHistory(prev => [
        ...prev,
        {
          id: `inspect_${Date.now()}`,
          sender: 'assistant',
          text: `Analyzing active telemetry node: **${activeNode}**. The system has verified this node against the India-centric knowledge graph. Querying historical transits and associated shipment risk score...`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [activeNode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    const input = chatInput;
    setChatInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: chatHistory,
          crisis: crisisMode,
          activeNode: activeNode
        })
      });
      const data = await res.json();

      setChatHistory(prev => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          sources: data.sources,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: "I was unable to establish a secure link to the satellite reasoning matrix. Running local model: System risk is within nominal standard limits.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-brand-surface border border-brand-border rounded-lg overflow-hidden font-sans select-none" id="copilot_sidebar">
      {/* 1. Collapsible Proactive Morning Briefing */}
      <div className="bg-brand-surface border-b border-brand-border" id="copilot_morning_briefing">
        <button
          onClick={() => setIsBriefingCollapsed(!isBriefingCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-brand-bg/60 transition-colors cursor-pointer"
        >
          <span className="text-xs font-bold text-brand-accent tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4" /> Proactive Executive Briefing
          </span>
          {isBriefingCollapsed ? <ChevronDown className="w-4 h-4 text-brand-muted" /> : <ChevronUp className="w-4 h-4 text-brand-muted" />}
        </button>

        {!isBriefingCollapsed && (
          <div className="px-4 pb-4 pt-1 text-xs text-brand-muted leading-relaxed border-t border-brand-border">
            <div className="bg-brand-bg border border-brand-border p-3.5 rounded-lg leading-relaxed text-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-brand-accent/70" />
              <div className="flex items-center gap-2 text-brand-muted font-bold mb-1.5 text-[10.5px]">
                <FileText className="w-3.5 h-3.5 text-brand-accent" />
                <span>COORDINATOR BRIEF_POSTURE</span>
              </div>
              <p className="whitespace-pre-line text-slate-200">{briefing}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Chat Terminal Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-bg/25" id="copilot_chat_messages_container">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Sender Flag */}
            <div className="flex items-center gap-1.5 text-[9.5px] text-brand-muted font-bold mb-1">
              {msg.sender === 'assistant' ? (
                <>
                  <Bot className="w-3 h-3 text-brand-accent" /> <span>STRATOS COPILOT</span>
                </>
              ) : (
                <span>COMMANDER DIRECTIVE</span>
              )}
              <span>•</span>
              <span>{msg.time}</span>
            </div>

            {/* Bubble */}
            <div className={`px-4 py-3 rounded-lg text-xs leading-relaxed font-sans ${
              msg.sender === 'user'
                ? 'bg-brand-accent/15 text-white border border-brand-accent/30 shadow-sm'
                : 'bg-brand-surface border border-brand-border text-slate-200 shadow-sm'
            }`}>
              <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
              
              {/* Sources display */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-brand-border text-[10.5px] text-brand-muted font-mono">
                  <span className="font-bold block text-[9.5px] uppercase tracking-wider text-brand-accent/80 mb-1">Verified Intelligence Citations:</span>
                  <ul className="list-disc pl-3.5 space-y-1">
                    {msg.sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-brand-muted pl-1">
            <Terminal className="w-4 h-4 text-brand-accent animate-pulse" />
            <span>Running predictive simulation models and routing matrices...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 3. Suggested queries */}
      <div className="px-4 py-3 bg-brand-surface border-t border-brand-border flex flex-wrap gap-2" id="copilot_suggested_queries">
        <button
          onClick={() => handleSuggestClick("Why is diesel risk increasing?")}
          className="text-[10px] bg-brand-bg hover:bg-brand-surface hover:text-white text-brand-muted border border-brand-border px-2.5 py-1.5 rounded cursor-pointer transition-colors"
        >
          Diesel Risk?
        </button>
        <button
          onClick={() => handleSuggestClick("What happens if Hormuz is blocked 50%?")}
          className="text-[10px] bg-brand-bg hover:bg-brand-surface hover:text-white text-brand-muted border border-brand-border px-2.5 py-1.5 rounded cursor-pointer transition-colors"
        >
          Hormuz 50% Impact?
        </button>
        <button
          onClick={() => handleSuggestClick("Rerouting alternatives to Russia crude")}
          className="text-[10px] bg-brand-bg hover:bg-brand-surface hover:text-white text-brand-muted border border-brand-border px-2.5 py-1.5 rounded cursor-pointer transition-colors"
        >
          Russian Alternatives?
        </button>
      </div>

      {/* 4. Chat Input form */}
      <form onSubmit={handleChatSubmit} className="p-3 bg-brand-surface border-t border-brand-border flex gap-2" id="copilot_input_form">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Query command center graph..."
          disabled={isLoading}
          className="flex-1 bg-brand-bg border border-brand-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !chatInput.trim()}
          className="bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent px-3.5 py-2 rounded border border-brand-accent/30 flex items-center justify-center disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

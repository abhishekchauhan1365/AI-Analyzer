import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { analysisService } from '../services/analysisService';
import { useAuth } from '../hooks/useAuth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DocumentChatProps {
  analysisId: string;
}

const DocumentChat: React.FC<DocumentChatProps> = ({ analysisId }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I've analyzed this document. What would you like to know about it?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !token) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // The full history to send to backend (including new user message)
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Create an empty assistant message that will be populated via stream
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      // Map to the format expected by the backend
      const historyPayload = newMessages.map(m => ({ role: m.role, content: m.content }));
      
      const stream = analysisService.streamChat(analysisId, historyPayload, token);
      
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages((prev) => 
          prev.map((msg) => msg.id === assistantId ? { ...msg, content: fullText } : msg)
        );
        scrollToBottom();
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => 
        prev.map((msg) => msg.id === assistantId ? { ...msg, content: 'Sorry, I encountered an error while trying to answer that. Please try again.' } : msg)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 400, maxHeight: 600,
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(24px)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--gradient-brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(79, 70, 229, 0.2)'
        }}>
          <Bot size={18} color="#fff" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>Document Chat</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-secondary)' }}>Ask anything about this document</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 16
      }}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              gap: 12,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              maxWidth: '85%'
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--color-bg)' : 'var(--gradient-brand)',
              border: msg.role === 'user' ? '1px solid var(--color-border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {msg.role === 'user' ? <User size={14} color="var(--color-primary)" /> : <Bot size={14} color="#fff" />}
            </div>
            
            <div style={{
              padding: '12px 16px',
              borderRadius: 16,
              borderTopRightRadius: msg.role === 'user' ? 4 : 16,
              borderTopLeftRadius: msg.role === 'assistant' ? 4 : 16,
              background: msg.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: msg.role === 'user' ? '#fff' : 'var(--color-primary)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Loader2 size={14} color="#fff" className="spin" />
            </div>
            <div style={{
              padding: '12px 16px', borderRadius: 16, borderTopLeftRadius: 4,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <span className="dot-bounce" style={{ animationDelay: '0s' }}>.</span>
                <span className="dot-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="dot-bounce" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)'
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-primary)',
              fontSize: '0.95rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!input.trim() || isLoading}
            type="submit"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: input.trim() && !isLoading ? 'var(--gradient-brand)' : 'var(--color-border)',
              color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s'
            }}
          >
            <Send size={18} />
          </motion.button>
        </form>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .dot-bounce {
          display: inline-block;
          font-weight: bold;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DocumentChat;

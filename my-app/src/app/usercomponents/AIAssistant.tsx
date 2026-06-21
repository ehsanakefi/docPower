import { useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import api from '../services/api';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; message: string }>>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setLoading(true);

    try {
      const response = await api.sendAIMessage(userMessage, conversationId);
      
      if (response.success && response.data) {
        // Update conversation ID if new
        if (!conversationId && response.data.conversationId) {
          setConversationId(response.data.conversationId);
        }
        
        // Add assistant response
        setMessages(prev => [
          ...prev,
          { role: 'assistant', message: response.data.reply }
        ]);
      } else {
        toast.error('خطا در دریافت پاسخ از دستیار هوشمند');
        // Add error message as assistant response
        setMessages(prev => [
          ...prev,
          { role: 'assistant', message: 'متأسفم، در حال حاضر نمی‌توانم به سوال شما پاسخ دهم. لطفاً دوباره تلاش کنید.' }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام');
      setMessages(prev => [
        ...prev,
        { role: 'assistant', message: 'متأسفم، خطایی رخ داده است. لطفاً دوباره تلاش کنید.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-96 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-[calc(100vh-73px)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="font-semibold dark:text-white">دستیار هوشمند</h2>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                سوال خود را بپرسید
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-slate-100 dark:bg-slate-800 text-right'
                    : 'bg-blue-600 text-white text-right'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Suggestions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 mb-2 text-right">پیشنهادات:</p>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setInput('توضیح ضرایب همزمانی')}
          >
            ضرایب همزمانی
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setInput('توزیع گامبل چیست؟')}
          >
            توزیع گامبل
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2">
          <Button
            disabled={loading}
            size="icon"
            className="bg-[#10B981] hover:bg-[#059669]"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
          <Input
            type="text"
            placeholder="سوال خود را بپرسید..."
            className="text-right"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
      </div>
    </div>
  );
}

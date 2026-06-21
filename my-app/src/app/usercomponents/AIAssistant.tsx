import { useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { aiChatHistory } from '../data/mockData';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState(aiChatHistory);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, message: input },
      {
        role: 'assistant' as const,
        message: 'این یک پاسخ نمونه از دستیار هوشمند است. در حالت واقعی، این پاسخ از مدل زبانی پیشرفته تولید می‌شود.',
      },
    ];
    setMessages(newMessages);
    setInput('');
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
      </div>
    </div>
  );
}

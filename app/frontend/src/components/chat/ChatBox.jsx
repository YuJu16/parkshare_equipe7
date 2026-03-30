import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { generateChatResponse } from '../../utils/gemini';
import { mockZones } from '../../data/mockData';

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Bonjour ! Je suis l\'assistant IA de Parkshare. Posez-moi vos questions sur nos zones !' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Historique sans l'ID et mis en format pour l'IA
  const chatHistory = useRef([]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentText = inputValue;
    
    // 1. Ajouter le message de l'utilisateur
    const userMsg = { id: Date.now(), sender: 'user', text: currentText };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. Appel à l'IA Gemini avec l'historique et les données
      const aiResponse = await generateChatResponse(chatHistory.current, currentText, mockZones);
      
      // 3. Ajouter la réponse
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: aiResponse };
      setMessages(prev => [...prev, botMsg]);

      // 4. Mettre à jour l'historique interne du contexte
      chatHistory.current.push({ sender: 'user', text: currentText });
      chatHistory.current.push({ sender: 'bot', text: aiResponse });

    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 2, sender: 'bot', text: "Erreur de connexion à l'IA..." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl shadow-blue-600/20 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all animate-in slide-in-from-bottom-5">
          {/* Header du Chat */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 rounded-full p-1.5">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Assistant Parkshare IA</h3>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  En ligne (Gemini)
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Corps du Chat */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-2 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input du Chat */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 disabled={isLoading}
                 placeholder="Demandez quelle zone est idéale..."
                 className="flex-1 bg-slate-100 text-slate-800 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-400 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-full p-2.5 transition-colors flex items-center justify-center"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="translate-x-[1px]" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

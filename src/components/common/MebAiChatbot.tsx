import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles, FileText, CheckCircle2, ChevronUp } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

export const MebAiChatbot: React.FC = () => {
  const { systemSettings, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: `Merhaba ${currentUser?.fullName || "Öğretmenim"}! Ben 2Evrak MEB Yapay Zeka Asistanıyım. Yeni Maarif Modeline uygun yıllık plan, zümre tutanağı, ortak sınav soruları hazırlayabilir veya MEB duyurularını tarayabilirim. Size nasıl yardımcı olabilirim?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = "";
      const lower = query.toLowerCase();

      if (lower.includes("yıllık plan") || lower.includes("plan")) {
        botResponseText = `Seçtiğiniz branş ve sınıf kademesi için MEB 2025-2026 Yeni Maarif Modeli kazanımlarına uygun yıllık ders planı taslağı oluşturuldu. Evraklar modülünden indirebilirsiniz.`;
      } else if (lower.includes("zümre") || lower.includes("toplantı")) {
        botResponseText = `Sene başı / 2. dönem zümre öğretmenler kurulu tutanağı gündem maddeleriyle birlikte hazırlandı. Karar tutanağını imza sirküsüyle birlikte dışarı aktarabilirsiniz.`;
      } else if (lower.includes("sınav") || lower.includes("soru")) {
        botResponseText = `1. Dönem 1. Ortak Yazılı Sınavı için senaryo tabanlı açık uçlu 5 adet kazanım sorusu ve değerlendirme rubriği üretilmiştir.`;
      } else if (lower.includes("scraper") || lower.includes("duyuru") || lower.includes("meb")) {
        botResponseText = `MEB Tebliğler Dergisi ve resmi duyurular taranmış, okunabilirlik düzenlemesinden geçirilerek moderasyon havuzuna eklenmiştir.`;
      } else {
        botResponseText = `Belirttiğiniz "${query}" talebi için 2Evrak yapay zeka motoru (${systemSettings.aiApi?.defaultModel || "Gemini 2.5 Flash"}) devreye alındı. Resmi MEB formatında evrak üretimi başarıyla tamamlandı.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-2xl shadow-indigo-500/30 border border-white/20 transition-all duration-300 transform hover:scale-105"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>MEB AI Asistanı</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-[10px] text-emerald-100 font-medium">Plan, Zümre, Sınav Sorusu</div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>2Evrak MEB AI Bot</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Aktif ({systemSettings.aiApi?.primaryProvider || "Gemini"})
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Yıllık Plan, Zümre ve Evrak Üreticisi</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/80 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.sender === "user" ? "text-indigo-200" : "text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl rounded-bl-none text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>Yapay zeka MEB evrakını hazırlıyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setInputText("9. Sınıf Matematik Yıllık Plan Hazırla");
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 transition-colors"
            >
              📅 Yıllık Plan İste
            </button>
            <button
              onClick={() => {
                setInputText("Sene Başı Zümre Öğretmenler Kurulu Tutanağı Hazırla");
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 transition-colors"
            >
              📝 Zümre Tutanağı
            </button>
            <button
              onClick={() => {
                setInputText("Ortak Yazılı Sınav Soruları ve Rubrik Üret");
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] whitespace-nowrap border border-slate-700 transition-colors"
            >
              ✍️ Sınav Soruları
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Evrak, plan veya soru isteyin..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

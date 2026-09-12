import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  Bot,
  Play,
  Send,
  Cpu,
  History,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Share2,
  Copy,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { AIAgent } from "../../types";

export const AiAgentsView: React.FC = () => {
  const {
    aiAgents,
    aiLogs,
    runAgent,
    addDocument,
    currentUser,
    setActiveModuleId,
  } = useApp();

  const [selectedAgentKey, setSelectedAgentKey] = useState<string>("dokuman_ajani");
  const [promptText, setPromptText] = useState<string>(
    "9. Sınıf Matematik 2. Dönem 1. Zümre Öğretmenler Kurulu Karar Tutanağı hazırla. Gündem maddeleri: Başarı değerlendirmesi, ortak sınav analizi, BEP planı öğrencileri ve proje ödevleri olsun."
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastOutput, setLastOutput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const currentAgent = aiAgents.find((a) => a.key === selectedAgentKey) || aiAgents[0];

  const handleExecuteAgent = async () => {
    if (!promptText.trim() || isRunning) return;
    setIsRunning(true);
    setSaveSuccess(false);

    try {
      const result = await runAgent(selectedAgentKey, promptText);
      setLastOutput(result);
    } catch (e: any) {
      setLastOutput("Hata oluştu: " + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(lastOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsDocument = () => {
    if (!lastOutput) return;

    addDocument({
      title: `AI Üretimi: ${currentAgent.name} Çıktısı`,
      slug: `ai-dokuman-${Date.now()}`,
      description: promptText.slice(0, 160),
      categoryId: "cat_zumre",
      docType: "Zümre Kararı",
      gradeLevel: "9. Sınıf",
      lesson: "Matematik",
      fileUrl: "https://storage.2evrak.com/ai/generated_evrak.docx",
      fileSize: "450 KB",
      fileExtension: "docx",
      status: "pending", // Sends to moderation queue automatically!
      authorId: currentUser.id,
      authorName: `${currentUser.fullName} (AI Destekli)`,
      accessLevel: "free",
      tags: ["yapay-zeka", "meb", currentAgent.key],
      seoTitle: `AI MEB Dokümanı - 2Evrak`,
      seoDescription: promptText.slice(0, 140),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">15 — AI / Ajan Merkezi</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              9 MEB Uzman Ajanı Aktif
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gemini 2.5 Flash Destekli Müfredat, Sınav, Zümre ve Moderasyon Ajanları
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModuleId("16_moderation")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Moderasyon Havuzuna Git
          </button>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {aiAgents.map((agent) => {
          const isSelected = agent.key === selectedAgentKey;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setSelectedAgentKey(agent.key);
                if (agent.key === "soru_ajani") {
                  setPromptText("10. Sınıf Biyoloji 'Hücre Bölünmeleri' konusunda 4 adet açık uçlu kazanım sorusu ve rubrik değerlendirme anahtarı üret.");
                } else if (agent.key === "dokuman_ajani") {
                  setPromptText("9. Sınıf Matematik 2. Dönem 1. Zümre Öğretmenler Kurulu Karar Tutanağı hazırla. Gündem maddeleri ve karar metni MEB formatında olsun.");
                } else if (agent.key === "icerik_ajani") {
                  setPromptText("11. Sınıf Tarih 'Milli Mücadele Dönemi' için öğretmen ders sunum özeti ve kavram haritası metni hazırla.");
                } else if (agent.key === "sosyal_ajani") {
                  setPromptText("Öğretmenler Günü yaklaşırken MEB öğretmenlerinin kullanabileceği zümre planlama tüyolarını içeren 3 tweetlik bir X zinciri ve Instagram metni yaz.");
                }
              }}
              className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-purple-600/20 border-purple-500/60 shadow-lg shadow-purple-600/10"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? "bg-purple-500 text-white" : "bg-slate-800 text-purple-400"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    %{agent.accuracyRate}
                  </span>
                </div>
                <div className="font-bold text-xs text-white truncate">{agent.name}</div>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{agent.runsCount} İşlem</span>
                <span className="text-purple-400">Seç</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Agent Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prompt Editor (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">{currentAgent.name}</h3>
              </div>
              <span className="text-[11px] text-slate-400">Model: {currentAgent.model}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
              Maks {currentAgent.maxTokens} Token
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Öğretmen İstemi / Görev Tarifi:
            </label>
            <textarea
              rows={6}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ajan için MEB dersi, sınıf, konu, format ve yönergeleri buraya yazın..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-sans leading-relaxed"
            />
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400">Hızlı MEB Şablonları:</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() =>
                  setPromptText(
                    "LGS 8. Sınıf Türkçe 'Fiilimsiler ve Cümlenin Ögeleri' için yeni nesil beceri temelli 3 soru ve ayrıntılı çözüm basamakları hazırla."
                  )
                }
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                + LGS Türkçe Yeni Nesil Soru
              </button>
              <button
                onClick={() =>
                  setPromptText(
                    "Kaynaştırma öğrencisi için 6. Sınıf Fen Bilimleri Bireyselleştirilmiş Eğitim Planı (BEP) aylık kazanım tablosu üret."
                  )
                }
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                + BEP Planı Tablosu
              </button>
              <button
                onClick={() =>
                  setPromptText(
                    "11. Sınıf Kimya Gazlar Ünitesi 2. Dönem 1. Ortak Yazılı Sınavı (MEB Formatı Senaryo 1 uyumlu) hazırla."
                  )
                }
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                + Ortak Yazılı Sınavı
              </button>
            </div>
          </div>

          <button
            onClick={handleExecuteAgent}
            disabled={isRunning}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Gemini Motoru Çalışıyor...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Ajanı Çalıştır & İçerik Üret
              </>
            )}
          </button>
        </div>

        {/* Right: AI Output Console & Direct Pipeline (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Üretilen Çıktı & Önizleme</h3>
              </div>

              {lastOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Kopyalandı!" : "Kopyala"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              {isRunning ? (
                <div className="h-72 flex flex-col items-center justify-center space-y-3 text-slate-400">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                  <div className="text-xs font-medium">MEB Müfredatına ve kazanımlara göre taranıyor...</div>
                  <div className="text-[10px] text-slate-500">Gemini 2.5 Flash API Çağrısı Aktif</div>
                </div>
              ) : lastOutput ? (
                <div className="h-96 overflow-y-auto bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed custom-scrollbar">
                  {lastOutput}
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center space-y-2 text-slate-500 border border-dashed border-slate-800 rounded-xl p-6 text-center">
                  <Bot className="w-10 h-10 text-slate-700" />
                  <div className="text-xs font-semibold text-slate-400">
                    Henüz bir ajan çalıştırılmadı.
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Sol panelden bir MEB ajanı seçip yönergenizi yazarak çalıştırın. Üretilen doküman doğrudan moderasyona veya yayına aktarılabilir.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar (The 7 Commandments: Hiçbir AI çıktısı körlemesine yayınlanamaz, Moderasyona gider!) */}
          {lastOutput && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-amber-400/90 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Kural 3: AI çıktıları onay için Moderasyon Merkezine aktarılır.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Moderasyon Havuzuna Eklendi!
                  </span>
                ) : (
                  <button
                    onClick={handleSaveAsDocument}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Evrak Olarak Kaydet & Moderasyona İlet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Execution Logs (Denetim İzi & Token Harcaması) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Ajan Çalıştırma Kayıtları & Token Telemetrisi
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {aiLogs.length} Kayıt Bulundu
          </span>
        </div>

        {aiLogs.length === 0 ? (
          <div className="text-xs text-slate-500 py-4 text-center">
            Bu oturumda henüz ajan çalıştırma kaydı bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-slate-800 text-xs">
            {aiLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-purple-400">{log.agentKey}</span>
                    <span className="text-[10px] text-slate-500">{log.createdAt}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-400 truncate text-[11px] mt-0.5">{log.prompt}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-300 font-mono text-[11px]">
                    {log.tokensUsed} Token
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">Gemini 2.5 Flash</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

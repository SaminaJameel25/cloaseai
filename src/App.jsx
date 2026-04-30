import { useState, useRef, useEffect, useCallback } from "react";
 
const SYSTEM_PROMPT = `You are DumbGPT, a satirical AI assistant that is confidently wrong, absurdly cautious, and drowning in corporate buzzword speak. Your goal is to make the user feel smarter by being spectacularly unhelpful in a funny way.
 
Rotate between these modes randomly:
1. CONFIDENTLY WRONG: Answer with total conviction but be hilariously incorrect. State false facts with authority. E.g. "The capital of France is obviously Brussels. This is well-documented."
2. CORPORATE NONSENSE: Use maximum buzzwords that say nothing. "Leveraging our synergistic ideation framework, we can holistically actualize your query's core paradigm touchpoints."
3. ABSURD REFUSAL: Refuse for a ridiculous made-up safety reason. "I can't help with that. Discussing sandwiches could trigger existential crises in bread-adjacent individuals."
4. SYCOPHANTIC: Agree with everything the user says, even if they contradict themselves. Praise their question excessively as the smartest thing ever said.
5. OVERTHINKING THE SIMPLE: Write 200+ words answering something trivially simple, going off on bizarre tangents.
 
Always end responses with one of these rotating disclaimers:
- "✓ Verified by our Ethics, Safety & Vibes Team"
- "✓ Fact-checked by GPT-Zero™"
- "✓ Reviewed by 3 interns and a labrador"
- "✓ Accuracy score: 12/100 (Industry Leading)"
- "✓ This response was carbon-neutral imagined"
 
Keep responses to 3-6 sentences max (except mode 5). Be funny, not mean. The joke is on AI hype, not the user.`;
 
const loadingSteps = [
  "Initialising quantum synergy modules...",
  "Consulting the Vibes Team...",
  "Hallucinating confidently...",
  "Cross-referencing with GPT-Zero™...",
  "Fact-checking (skipped for speed)...",
  "Adding unnecessary caveats...",
  "Deploying ethical guardrails (mostly decorative)...",
  "Asking an intern...",
  "Googling it (privately)...",
  "Preparing your answer...",
];
 
const confidenceScores = [
  "99.9% confident", "98.7% confident", "absolutely certain",
  "110% confident", "scientifically proven™", "trust me bro",
  "confidence: immeasurable", "97.3% sure (rounding up)",
];
 
const glitchFrames = ["DumbGPT", "Dumb6PT", "D|mbGPT", "DumbGΨT", "DumbGPT", "▓umbGPT", "DumbGPT"]; 
const STARTER_PROMPTS = [
  "What is 2 + 2?", "Capital of France?", "Write me a haiku",
  "Explain black holes", "Is water wet?", "Best programming language?",
];
 
const METRICS = [
  { label: "Questions Answered", value: "2.4B+" },
  { label: "Correct Answers", value: "~12" },
  { label: "Confidence Level", value: "MAX" },
  { label: "Nobel Prizes", value: "Pending" },
];
 
function TypewriterMessage({ text }) {
  return <span>{text}</span>;
}
 
function GlitchLogo() {
  const [frame, setFrame] = useState(0);
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const trigger = setInterval(() => {
      setGlitching(true);
      let f = 0;
      const t = setInterval(() => {
        f++;
        setFrame(f % glitchFrames.length);
        if (f >= glitchFrames.length - 1) { clearInterval(t); setGlitching(false); setFrame(0); }
      }, 75);
    }, 4000);
    return () => clearInterval(trigger);
  }, []);
  return (
    <span style={{
      fontStyle: "italic",
      color: glitching ? "#ff5555" : "#e8e2d9",
      transition: "color 0.05s",
      textShadow: glitching ? "2px 0 #c8a96e, -2px 0 #5555ff" : "none",
    }}>{glitchFrames[frame]}</span>
  );
}
 
function StatusPill() {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 88, right: 18, zIndex: 50,
      background: "rgba(6,8,13,0.95)", border: "1px solid rgba(200,169,110,0.1)",
      backdropFilter: "blur(12px)", padding: "7px 12px",
      fontFamily: "'DM Mono', monospace", fontSize: 9,
      letterSpacing: "0.06em", display: "flex", flexDirection: "column", gap: 3,
    }}>
      {[
        { label: "MODEL: GPT-ZERO™", dot: true },
        { label: "LATENCY: TOO HIGH" },
        { label: "UPTIME: DEBATABLE" },
        { label: "IQ: CLASSIFIED" },
      ].map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: i === 0 ? "#555" : "#333" }}>
          {r.dot && <div style={{ width: 4, height: 4, borderRadius: "50%", background: blink ? "#4a9" : "#252", transition: "background 0.4s", flexShrink: 0 }} />}
          {r.label}
        </div>
      ))}
    </div>
  );
}
 
export default function CloseAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [dumbness, setDumbness] = useState(12);
  const [history, setHistory] = useState([]);
  const [typing, setTyping] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
 
  const sendMessage = useCallback(async (overrideText) => {
    const userMsg = (overrideText || input).trim();
    if (!userMsg || loading) return;
    setInput(""); setTyping(false); setHeroVisible(false);
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true); setLoadingStep(0);
 
    intervalRef.current = setInterval(() => {
      setLoadingStep(s => (s + 1) % loadingSteps.length);
    }, 900);
 
    const newHistory = [...history, { role: "user", content: userMsg }];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text
        || "I cannot process that at this juncture of my cognitive bandwidth. ✓ Verified by our Ethics, Safety & Vibes Team";
      const confidence = confidenceScores[Math.floor(Math.random() * confidenceScores.length)];
      setMessages(prev => [...prev, { role: "assistant", content: reply, confidence, id: Date.now() }]);
      setHistory([...newHistory, { role: "assistant", content: reply }]);
      setDumbness(d => Math.min(99, d + Math.floor(Math.random() * 8) + 3));
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "An error occurred. Our hamsters are tired. ✓ Verified by our Ethics, Safety & Vibes Team",
        confidence: "confidence: N/A (hamster perished)",
        id: Date.now(),
      }]);
    } finally {
      clearInterval(intervalRef.current);
      setLoading(false);
    }
  }, [input, loading, history]);
 
  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };
 
  const dumbColor = dumbness > 70 ? "#e05555" : dumbness > 40 ? "#c8a96e" : "#5a8a5a";
  const dumbLabel = dumbness < 30 ? "Warming up..." : dumbness < 60 ? "Peak idiocy loading" : dumbness < 85 ? "Impressively useless" : "🏆 Record stupidity";
 
  return (
    <div style={{ minHeight: "100vh", background: "#06080d", fontFamily: "'DM Serif Display', Georgia, serif", color: "#e8e2d9", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #151820; border-radius: 2px; }
 
        @keyframes scanline { 0% { top: -2px; } 100% { top: 100vh; } }
        @keyframes heroIn { from { opacity:0; transform:translateY(32px) skewY(1.5deg); } to { opacity:1; transform:translateY(0) skewY(0deg); } }
        @keyframes subIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes confIn { from { opacity:0; transform:translateX(8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes msgIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dumbGlow { 0%,100% { box-shadow:0 0 4px rgba(224,85,85,0.2); } 50% { box-shadow:0 0 18px rgba(224,85,85,0.5); } }
 
        .scanline { position:fixed; left:0; right:0; height:1px; background:linear-gradient(transparent,rgba(200,169,110,0.05),transparent); animation:scanline 7s linear infinite; pointer-events:none; z-index:1; }
        .grain { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"); opacity:0.4; }
        .glow-orb { position:fixed; border-radius:50%; filter:blur(100px); pointer-events:none; z-index:0; }
        .msg-bubble { animation: msgIn 0.3s ease forwards; }
        .input-wrap { display:flex; gap:12px; align-items:flex-end; border:1px solid rgba(200,169,110,0.12); padding:12px 16px; background:rgba(255,255,255,0.01); transition:border-color 0.3s, box-shadow 0.3s; }
        .input-wrap.active { border-color:rgba(200,169,110,0.32); box-shadow:0 0 20px rgba(200,169,110,0.06); }
        .input-field { background:transparent; border:none; outline:none; color:#e8e2d9; font-family:'DM Mono',monospace; font-size:13px; flex:1; resize:none; line-height:1.6; }
        .input-field::placeholder { color:#2a2d35; }
        .send-btn { background:#c8a96e; color:#06080d; border:none; padding:10px 20px; font-family:'DM Mono',monospace; font-size:11px; font-weight:500; letter-spacing:0.1em; cursor:pointer; transition:all 0.2s; text-transform:uppercase; white-space:nowrap; }
        .send-btn:hover:not(:disabled) { background:#e0c285; transform:translateY(-1px); box-shadow:0 4px 16px rgba(200,169,110,0.2); }
        .send-btn:disabled { background:#101318; color:#252830; cursor:not-allowed; }
        .badge { display:inline-flex; align-items:center; gap:5px; background:rgba(200,169,110,0.06); border:1px solid rgba(200,169,110,0.15); padding:3px 9px; font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.07em; color:rgba(200,169,110,0.7); white-space:nowrap; }
        .loading-dot { width:4px; height:4px; border-radius:50%; background:#c8a96e; animation:pulse 1.1s ease infinite; }
        .loading-dot:nth-child(2) { animation-delay:0.18s; }
        .loading-dot:nth-child(3) { animation-delay:0.36s; }
        .starter-btn { background:transparent; border:1px solid #1a1d24; color:#4a4f5e; font-family:'DM Mono',monospace; font-size:11px; padding:9px 16px; cursor:pointer; letter-spacing:0.05em; transition:all 0.25s; white-space:nowrap; }
        .starter-btn:hover { border-color:rgba(200,169,110,0.3); color:#c8a96e; background:rgba(200,169,110,0.04); transform:translateY(-2px); }
        .conf-score { animation:confIn 0.4s ease forwards; font-family:'DM Mono',monospace; font-size:10px; color:rgba(200,169,110,0.5); letter-spacing:0.07em; margin-top:5px; padding-left:2px; }
        .dumb-high { animation:dumbGlow 2s ease infinite; }
      `}</style>
 
      <div className="grain" />
      <div className="scanline" />
      <div className="glow-orb" style={{ width: 600, height: 600, top: -250, left: -200, background: "rgba(200,169,110,0.025)" }} />
      <div className="glow-orb" style={{ width: 500, height: 500, bottom: -200, right: -150, background: "rgba(60,80,180,0.02)" }} />
 
      {/* Header */}
      <header style={{ position: "relative", zIndex: 20, borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(6,8,13,0.88)", backdropFilter: "blur(16px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 20 }}><GlitchLogo /></span>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#3a3d45", letterSpacing: "0.14em", textTransform: "uppercase" }}>v∞.0 · Almost Intelligent</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {[{ l: "GPT-Zero™", i: "⚡" }, { l: "99.3% Inaccurate", i: "📊" }, { l: "Vibes-Verified", i: "✨" }, { l: "ISO Uncertified", i: "🏅" }].map(b => (
            <div key={b.l} className="badge">{b.i} {b.l}</div>
          ))}
        </div>
      </header>
 
      {/* Dumbness bar */}
      <div style={{ position: "relative", zIndex: 20, padding: "8px 28px", background: "rgba(6,8,13,0.7)", borderBottom: "1px solid rgba(255,255,255,0.02)", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#4a4f5e", textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>Dumbness Index</span>
        <div style={{ flex: 1, height: 2, background: "#0a0c10", borderRadius: 1, overflow: "hidden" }}>
          <div className={dumbness > 70 ? "dumb-high" : ""} style={{ height: "100%", width: `${dumbness}%`, background: dumbColor, borderRadius: 1, transition: "width 1s cubic-bezier(0.34,1.56,0.64,1), background 0.5s ease" }} />
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: dumbColor, minWidth: 28, transition: "color 0.5s" }}>{dumbness}%</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#3a3d45", fontStyle: "italic", whiteSpace: "nowrap" }}>{dumbLabel}</span>
      </div>
 
      {/* Chat */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 12px", position: "relative", zIndex: 5, display: "flex", flexDirection: "column", gap: 20 }}>
 
        {heroVisible && messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 44 }}>
            <div style={{ fontSize: 64, fontStyle: "italic", letterSpacing: "-0.02em", animation: "heroIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards", opacity: 0, marginBottom: 16 }}>DumbGPT</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#e8c87a", letterSpacing: "0.16em", textTransform: "uppercase", animation: "subIn 0.6s ease 0.3s forwards", opacity: 0, marginBottom: 10 }}>Finally, an AI you're smarter than</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b7280", letterSpacing: "0.05em", animation: "subIn 0.6s ease 0.5s forwards", opacity: 0, marginBottom: 44 }}>Ask anything. We'll answer confidently. Accuracy not included.</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", animation: "subIn 0.6s ease 0.65s forwards", opacity: 0 }}>
              {STARTER_PROMPTS.map(q => <button key={q} className="starter-btn" onClick={() => sendMessage(q)}>{q}</button>)}
            </div>
            <div style={{ marginTop: 52, display: "flex", gap: 0, justifyContent: "center", borderTop: "1px solid #0e1018", borderBottom: "1px solid #0e1018", animation: "subIn 0.6s ease 0.85s forwards", opacity: 0 }}>
              {METRICS.map((m, i) => (
                <div key={m.label} style={{ padding: "18px 28px", textAlign: "center", borderRight: i < 3 ? "1px solid #0e1018" : "none" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: "#e8c87a", letterSpacing: "-0.02em" }}>{m.value}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#6b7280", letterSpacing: "0.08em", marginTop: 6 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {messages.map((msg, i) => {
          const isLatest = msg.role === "assistant" && i === messages.length - 1;
          return (
            <div key={i} className="msg-bubble" style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
              {msg.role === "assistant" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "rgba(200,169,110,0.07)", border: "1px solid rgba(200,169,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontSize: 11, color: "#c8a96e" }}>C</div>
              )}
              <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column" }}>
                <div style={{ background: msg.role === "user" ? "rgba(255,255,255,0.025)" : "rgba(200,169,110,0.03)", border: msg.role === "user" ? "1px solid rgba(255,255,255,0.055)" : "1px solid rgba(200,169,110,0.09)", padding: "12px 16px", fontFamily: msg.role === "user" ? "'DM Mono', monospace" : "'DM Serif Display', Georgia, serif", fontSize: msg.role === "user" ? 13 : 15, lineHeight: 1.8, color: msg.role === "user" ? "#8b909e" : "#e8e2d9" }}>
                  <TypewriterMessage text={msg.content} active={isLatest} />
                </div>
                {msg.role === "assistant" && msg.confidence && (
                  <div className="conf-score">↳ {msg.confidence}</div>
                )}
              </div>
            </div>
          );
        })}
 
        {loading && (
          <div className="msg-bubble" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: "rgba(200,169,110,0.07)", border: "1px solid rgba(200,169,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontSize: 11, color: "#c8a96e", animation: "spin 3s linear infinite" }}>C</div>
            <div style={{ background: "rgba(200,169,110,0.025)", border: "1px solid rgba(200,169,110,0.07)", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 5, marginBottom: 7 }}>
                <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#4a4f5e", letterSpacing: "0.07em", fontStyle: "italic" }}>{loadingSteps[loadingStep]}</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
 
      {/* Input */}
      <div style={{ position: "relative", zIndex: 20, borderTop: "1px solid rgba(255,255,255,0.035)", padding: "14px 28px 18px", background: "rgba(6,8,13,0.94)", backdropFilter: "blur(16px)" }}>
        <div className={`input-wrap${typing ? " active" : ""}`}>
          <textarea
            className="input-field"
            rows={1}
            value={input}
            onChange={e => { setInput(e.target.value); setTyping(e.target.value.length > 0); }}
            onKeyDown={handleKey}
            onBlur={() => setTyping(false)}
            placeholder="Ask DumbGPT anything. We dare you."
            style={{ maxHeight: 90 }}
          />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? "···" : "Send →"}
          </button>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#252830", marginTop: 8, textAlign: "center", letterSpacing: "0.1em" }}>
          DumbGPT may produce incorrect, absurd, or philosophically dangerous responses. That's the product. · © DumbGPT Corp
        </div>
      </div>
 
      <StatusPill />
    </div>
  );
}
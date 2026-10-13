import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, MessageCircle, RotateCcw, Send, X } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { SUGGESTED_STARTERS } from '../data/chatbotKnowledge';
import { exercisesAPI } from '../services/api';
import { getBotReply } from '../utils/chatbotEngine';

const STORAGE_KEY = 'oa_chat_history';
const MAX_STORED_MESSAGES = 60;
const TYPING_DELAY_MS = 450;

function welcomeMessage(firstName) {
  return {
    id: 'welcome',
    from: 'bot',
    text: `Hi${firstName ? ` ${firstName}` : ''}! 👋 I'm the OA Care assistant. Ask me about osteoarthritis, exercises, treatments, or how to use this site.`,
    followUps: SUGGESTED_STARTERS,
  };
}

function loadHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(saved?.messages) ? saved : null;
  } catch {
    return null;
  }
}

// Renders **bold** segments inside a line.
function InlineText({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

// Turns the bot's plain-text answers into paragraphs, bullet lists and numbered lists.
function FormattedText({ text }) {
  const blocks = [];
  for (const line of text.split('\n')) {
    const bullet = line.match(/^•\s+(.*)/);
    const numbered = line.match(/^\d+\.\s+(.*)/);
    const type = bullet ? 'ul' : numbered ? 'ol' : 'p';
    const content = bullet?.[1] ?? numbered?.[1] ?? line;
    const last = blocks[blocks.length - 1];
    if (type !== 'p' && last?.type === type) last.items.push(content);
    else if (content.trim() || type !== 'p') blocks.push({ type, items: [content] });
  }

  return blocks.map((block, i) => {
    if (block.type === 'p') {
      return <p key={i} className="m-0 [&+*]:mt-2"><InlineText text={block.items[0]} /></p>;
    }
    const ListTag = block.type;
    return (
      <ListTag key={i} className={`m-0 mt-1 pl-5 space-y-1 [&+*]:mt-2 ${block.type === 'ul' ? 'list-disc' : 'list-decimal'}`}>
        {block.items.map((item, j) => <li key={j}><InlineText text={item} /></li>)}
      </ListTag>
    );
  });
}

export default function ChatbotWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const firstName = user?.full_name?.split(' ')[0];

  const saved = useRef(loadHistory()).current;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => saved?.messages || [welcomeMessage(firstName)]);
  const [context, setContext] = useState(() => saved?.context || {});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [exerciseIds, setExerciseIds] = useState({});

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const typingTimer = useRef(null);

  const hidden = location.pathname.startsWith('/admin');

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-MAX_STORED_MESSAGES), context }));
    } catch {
      // Storage may be unavailable (private mode); the chat still works for this page view.
    }
  }, [messages, context]);

  // Exercise detail pages are keyed by database id; look them up once so answers can deep-link.
  useEffect(() => {
    if (!isOpen || Object.keys(exerciseIds).length) return;
    exercisesAPI
      .list()
      .then((res) => {
        const map = {};
        for (const ex of res.data || []) if (ex.name && ex.id) map[ex.name.toLowerCase()] = ex.id;
        setExerciseIds(map);
      })
      .catch(() => {}); // Offline backend: links fall back to the exercise library.
  }, [isOpen, exerciseIds]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  function sendMessage(rawText) {
    const text = rawText.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    const reply = getBotReply(text, { context, exerciseIds, userName: firstName });
    typingTimer.current = setTimeout(() => {
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, from: 'bot', ...reply }]);
      setContext(reply.context || {});
      setIsTyping(false);
    }, TYPING_DELAY_MS);
  }

  function resetChat() {
    clearTimeout(typingTimer.current);
    setIsTyping(false);
    setContext({});
    setMessages([welcomeMessage(firstName)]);
    inputRef.current?.focus();
  }

  if (hidden) return null;

  const lastBotIndex = messages.map((m) => m.from).lastIndexOf('bot');

  return (
    <>
      {isOpen && (
        <section
          role="dialog"
          aria-label="OA Care help assistant"
          className="fixed z-[55] bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[400px] h-[min(600px,calc(100dvh-12rem))] min-h-[320px] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(15,61,92,0.25)] border border-primary/10 flex flex-col overflow-hidden"
        >
          <header className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-primary to-primary-dark text-white">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="m-0 text-base font-semibold text-white leading-tight">OA Care Assistant</h2>
              <p className="m-0 text-xs text-white/80">Answers from OA Care's guides · works offline</p>
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer bg-transparent border-0 text-white"
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer bg-transparent border-0 text-white"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-bg-main" aria-live="polite">
            {messages.map((message, index) =>
              message.from === 'user' ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] bg-primary text-white rounded-[18px] rounded-br-md px-4 py-2.5 text-[15px] leading-relaxed break-words">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex flex-col items-start gap-2">
                  <div className="max-w-[92%] bg-white text-text-body rounded-[18px] rounded-bl-md px-4 py-3 text-[15px] leading-relaxed shadow-sm border border-slate-100">
                    <FormattedText text={message.text} />
                  </div>
                  {message.links?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link
                          key={`${link.to}-${link.label}`}
                          to={link.to}
                          onClick={() => window.innerWidth < 640 && setIsOpen(false)}
                          className="text-sm font-medium text-primary-dark bg-white border border-primary/30 rounded-pill px-3 py-1.5 hover:bg-primary/5 no-underline"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                  {index === lastBotIndex && !isTyping && message.followUps?.length > 0 && (
                    <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
                      {message.followUps.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => sendMessage(question)}
                          className="text-sm text-text-body bg-primary/10 hover:bg-primary/20 rounded-pill px-3 py-1.5 border-0 cursor-pointer transition-colors text-left"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}
            {isTyping && (
              <div className="flex items-center gap-1 bg-white rounded-[18px] rounded-bl-md px-4 py-3 w-fit shadow-sm border border-slate-100" aria-label="Assistant is typing">
                {[0, 150, 300].map((delay) => (
                  <span key={delay} className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-slate-100 px-3 pt-3 pb-2 bg-white"
          >
            <div className="flex items-center gap-2">
              <label htmlFor="oa-chat-input" className="sr-only">Type your question</label>
              <input
                id="oa-chat-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question…"
                maxLength={300}
                autoComplete="off"
                className="flex-1 min-h-12 rounded-pill border border-slate-200 px-4 text-[15px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="m-0 mt-2 text-[11px] text-text-muted text-center leading-snug">
              General education only — not a substitute for medical advice.
            </p>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed z-40 bottom-5 right-5 sm:right-6 h-14 rounded-pill bg-gradient-to-br from-primary to-primary-dark text-white shadow-btn hover:shadow-float transition-all border-0 cursor-pointer flex items-center gap-2 px-5"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close help assistant' : 'Open help assistant'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <span className="hidden sm:inline font-medium text-[15px]">{isOpen ? 'Close' : 'Ask OA Care'}</span>
      </button>
    </>
  );
}

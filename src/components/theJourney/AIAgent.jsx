import { useState, useEffect, useRef } from 'react';
import useAiChatStore from '../../stores/aiChatStore';
import useProgressStore from '../../stores/progressStore';
import useAuthStore from '../../stores/authStore';
import Navbar from '../common/Navbar';
import { sanitizeText } from '../../utils/textFilter';

export default function AIAgent() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionPreviews, setSessionPreviews] = useState({}); 
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    currentSession,
    sessions = [],
    messages = [],
    isLoading,
    error,
    createSession,
    getSessions,
    setCurrentSession,
    getMessages,
    sendMessage,
  } = useAiChatStore();

  const { stats, getStats } = useProgressStore();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const initializeChat = async () => {
      setIsInitialLoading(true);
      
      if (!isAuthenticated || !token) {
        setApiError('Please login to use AI Agent');
        setIsInitialLoading(false);
        return;
      }

      try {
        await getStats();
        
        const sessionsResult = await getSessions();
        if (sessionsResult.success && sessionsResult.data && sessionsResult.data.length > 0) {
          const session = sessionsResult.data[0];
          setCurrentSession(session);
          const messagesResult = await getMessages(session.id);
          if (!messagesResult.success) {
            // Failed to load messages
          }
          await loadSessionPreviews(sessionsResult.data);
        } else if (sessionsResult.success) {
          const createResult = await createSession();
          if (createResult.success && createResult.data) {
            const messagesResult = await getMessages(createResult.data.id);
            if (!messagesResult.success) {
              // Failed to load messages after creating session
            }
            await getSessions();
          }
        } else {
          setApiError('Unable to connect to AI service. Please try again later.');
        }
      } catch {
        setApiError('Unable to connect to AI service. Please try again later.');
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending || !currentSession || !isAuthenticated) return;

    setIsSending(true);
    const messageText = message.trim();
    setMessage('');

    try {
      const result = await sendMessage(currentSession.id, messageText);
      if (!result.success) {
        setApiError(result.error || 'Failed to send message');
      } else {
        setApiError(null);
      }
    } catch {
      setApiError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = async () => {
    if (!isAuthenticated) {
      setApiError('Please login to use AI Agent');
      return;
    }

    try {
      const result = await createSession();
      if (result.success) {
        setMessage('');
        setApiError(null);
        await getSessions();
      } else {
        setApiError(result.error || 'Failed to create new chat');
      }
    } catch {
      setApiError('Failed to create new chat. Please try again.');
    }
  };

  const loadSessionPreviews = async (sessionsList) => {
    const promises = sessionsList.slice(0, 10).map(async (session) => {
      try {
        const messagesResult = await getMessages(session.id);
        if (messagesResult.success && messagesResult.data && messagesResult.data.length > 0) {
          const firstUserMessage = messagesResult.data.find(msg => msg.sender === 'user');
          if (firstUserMessage) {
            const preview = firstUserMessage.message.substring(0, 50) + (firstUserMessage.message.length > 50 ? '...' : '');
            return { sessionId: session.id, preview };
          }
        }
      } catch {
        // Failed to load preview for session
      }
      return null;
    });
    
    const results = await Promise.all(promises);
    const previews = {};
    results.forEach(result => {
      if (result) {
        previews[result.sessionId] = result.preview;
      }
    });
    setSessionPreviews(previews);
  };

  const handleSelectSession = async (session) => {
    if (session.id === currentSession?.id) {
      setShowHistory(false);
      return;
    }

    try {
      setCurrentSession(session);
      const messagesResult = await getMessages(session.id);
      if (!messagesResult.success) {
        setApiError('Failed to load chat history');
      } else {
        setApiError(null);
      }
      setShowHistory(false);
    } catch {
      setApiError('Failed to load chat history');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-hidden flex flex-col">
      <Navbar stats={stats} activePage="ai-agent" />

      {isInitialLoading && (
        <div className="fixed inset-0 z-50 bg-gradient-to-r from-[#020c02] to-[#041d05] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-[#1fb622] rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 bg-[#1fb622] rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-16 h-16 bg-cover bg-center bg-no-repeat"
                  style={{backgroundImage: 'url(/img/codia/ai-agent-avatar.png)'}}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <p className="font-['ZT_Nature'] text-xl font-medium text-[#1fb622]">
                Loading AI Agent...
              </p>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
            
            <div className="w-64 h-1 bg-[rgba(170,170,170,0.1)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#168318] to-[#1fb622] rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% {
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 70%;
            transform: translateX(0);
          }
          100% {
            width: 100%;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <style>{`
        .ai-chat-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-thumb {
          background: #1fb622;
          border-radius: 6px;
          min-height: 40px;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #168318;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-button {
          display: block;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
        }
        .ai-chat-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement {
          border-style: solid;
          border-width: 0 6px 8px 6px;
          border-color: transparent transparent #1fb622 transparent;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment {
          border-style: solid;
          border-width: 8px 6px 0 6px;
          border-color: #1fb622 transparent transparent transparent;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
          border-color: transparent transparent #168318 transparent;
        }
        .ai-chat-scrollbar::-webkit-scrollbar-button:single-button:vertical:increment:hover {
          border-color: #168318 transparent transparent transparent;
        }
        /* Firefox */
        .ai-chat-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #1fb622 rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div 
        className={`fixed left-0 top-0 bottom-0 z-40 bg-[rgba(2,12,2,0.98)] border-r border-[rgba(170,170,170,0.1)] flex flex-col transition-transform duration-300 ease-in-out ${
          showHistory ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '100%', maxWidth: '280px' }}
      >
        <div className="p-4 border-b border-[rgba(170,170,170,0.1)] flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(170,170,170,0.2)] hover:bg-[rgba(170,170,170,0.1)] transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-['ZT_Nature'] text-sm text-white">New chat</span>
          </button>
          <button
            onClick={() => setShowHistory(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(170,170,170,0.1)] transition-colors"
            title="Close sidebar"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
          
        <div className="flex-1 overflow-y-auto ai-chat-scrollbar">
          {sessions.length === 0 ? (
            <div className="p-4 text-center mt-8">
              <p className="font-['ZT_Nature'] text-sm text-[#aaaaaa]">No chat history</p>
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => {
                const isActive = currentSession?.id === session.id;
                const preview = sessionPreviews[session.id] || 'New chat';
                
                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full p-3 rounded-lg mb-1 text-left transition-colors group ${
                      isActive
                        ? 'bg-[rgba(31,182,34,0.15)]'
                        : 'hover:bg-[rgba(170,170,170,0.05)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <svg className={`w-4 h-4 ${isActive ? 'text-[#1fb622]' : 'text-[#aaaaaa]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-['ZT_Nature'] text-sm truncate ${
                          isActive ? 'text-[#1fb622]' : 'text-[#eeeeee]'
                        }`}>
                          {preview}
                        </p>
                        <p className="font-['ZT_Nature'] text-xs text-[#aaaaaa] mt-0.5">
                          {formatDate(session.created_at || session.updated_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showHistory && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setShowHistory(false)}
        ></div>
      )}

      <div className={`flex-1 flex flex-col overflow-hidden px-4 sm:px-6 md:px-8 lg:px-16 relative transition-all duration-300 ${
        showHistory ? 'md:ml-[280px]' : ''
      }`} style={{ paddingTop: '0' }}>
        <button
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory && sessions.length > 0 && Object.keys(sessionPreviews).length === 0) {
              loadSessionPreviews(sessions);
            }
          }}
          className="absolute top-4 left-4 sm:left-6 md:left-8 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-[rgba(170,170,170,0.1)] rounded-lg hover:bg-[rgba(170,170,170,0.2)] transition-colors border border-[rgba(170,170,170,0.2)]"
          title="Chat History"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 ai-chat-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-[#aaaaaa] font-['ZT_Nature'] text-lg">Loading chat...</div>
              </div>
            ) : !hasMessages ? (
              <div className="flex flex-col md:flex-row items-center justify-center h-full gap-6 md:gap-8 lg:gap-12">
                {/* Mascot Character - Left Side */}
                <div className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] aspect-square relative z-0 animate-[float_3s_ease-in-out_infinite] order-2 md:order-1">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{backgroundImage: 'url(/img/codia/ai-agent-avatar.png)'}}
                  ></div>
                </div>
                
                {/* Welcome Text - Right Side */}
                <div className="flex flex-col items-center md:items-start z-10 order-1 md:order-2">
                  <p className="font-['ZT_Nature'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[rgba(238,238,238,0.5)] text-center md:text-left">
                    How can I help you?
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 pb-4">
                {messages.map((msg, index) => {
                  if (!msg || !msg.sender) return null;
                  
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-4 items-start`}
                    >
                      {msg.sender === 'bot' && (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-cover bg-center bg-no-repeat mt-1"
                          style={{backgroundImage: 'url(/img/codia/ai-agent-avatar.png)'}}
                        ></div>
                      )}
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-b from-[#168318] to-[#1fb622] text-white'
                            : 'bg-[rgba(170,170,170,0.1)] text-[#eeeeee] border border-[rgba(170,170,170,0.2)]'
                        }`}
                      >
                        <p className="font-['ZT_Nature'] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {sanitizeText(msg.message || '')}
                        </p>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center mt-1">
                          <span className="font-['ZT_Nature'] text-xs sm:text-sm text-white">U</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                {isSending && (
                  <div className="flex justify-start gap-4 items-start">
                    <div className="w-16 h-16 flex-shrink-0 bg-cover bg-center bg-no-repeat mt-1"
                      style={{backgroundImage: 'url(/img/codia/ai-agent-avatar.png)'}}
                    ></div>
                    <div className="bg-[rgba(170,170,170,0.1)] rounded-2xl p-4 border border-[rgba(170,170,170,0.2)]">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-[#1fb622] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
            
        <div className="w-full max-w-4xl mx-auto pb-6 pt-4">
          <form onSubmit={handleSendMessage} className="relative flex items-end gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-cover bg-center bg-no-repeat"
              style={{backgroundImage: ''}}
            ></div>
            <div className="flex-1">
              <div className="w-full bg-[rgba(170,170,170,0.05)] rounded-[16px] border border-[rgba(170,170,170,0.05)] p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What is the formula for the area of a circle?"
                  disabled={isSending || !currentSession}
                  className="flex-1 bg-transparent border-none outline-none font-['ZT_Nature'] text-base sm:text-lg md:text-[20px] font-medium text-[rgba(238,238,238,0.5)] placeholder:text-[rgba(238,238,238,0.5)]"
                />
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] flex items-center justify-center rounded-[8px] border border-[rgba(238,238,238,0.5)] hover:bg-white/10 transition-colors flex-shrink-0"
                  title="New Chat"
                >
                  <img src="/img/codia/ai-agent-icon-1.svg" alt="New chat" className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim() || isSending || !currentSession}
                  className="w-[32px] h-[32px] sm:w-[36px] sm:h-[38px] flex items-center justify-center bg-[#1fb622] rounded-[8px] hover:bg-[#168318] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <img src="/img/codia/ai-agent-icon-2.svg" alt="Send" className="w-[12px] h-[14px] sm:w-[14px] sm:h-[16px]" />
                </button>
              </div>
              {(error || apiError) && (
                <p className="text-red-400 font-['ZT_Nature'] text-sm mt-2">{error || apiError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

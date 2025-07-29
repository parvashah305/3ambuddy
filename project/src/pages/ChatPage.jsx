import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Send, 
  Paperclip, 
  Smile, 
  Settings, 
  ArrowLeft, 
  CreditCard,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { UserButton, useAuth } from '@clerk/clerk-react';
import api from '../lib/axios';
import { initializeSocket } from '../../socket/socket';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${user?.firstName || user?.username || 'there'}! I'm Buddy, your AI companion. I'm here to listen and chat with you anytime. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState(100);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newBuddyName, setNewBuddyName] = useState('Buddy');
  const [buddyName, setBuddyName] = useState('Buddy');
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const socketRef = useRef(null);
  const conversationIdRef = useRef(null);
  // --- Add state for all conversations and selected conversation ---
  // Remove conversations and selectedConversationId state

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  
  useEffect(() => {
    let isMounted = true;
    const setupSocket = async () => {
      const token = await getToken();
      socketRef.current = await initializeSocket(token);
      console.log('Socket initialized for chat');

    
      socketRef.current.emit('get-all-chats');
      socketRef.current.once('all-chats', (data) => {
        if (!isMounted) return;
        
        const allMessages = data
          .flatMap(conv => conv.messages.map(m => ({
            ...m,
            conversationId: conv.id,
            conversationStartedAt: conv.startedAt
          })))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(
          allMessages.map((m, idx) => ({
            id: idx + 1,
            text: m.text,
            sender: m.sender,
            timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
        );
        // Set conversationIdRef to the latest conversation (if any)
        if (data.length > 0) {
          conversationIdRef.current = data[0].id;
        } else {
          // No previous chat, start a new one
          socketRef.current.emit('start-chat', {});
          socketRef.current.once('chat-started', (data) => {
            conversationIdRef.current = data.conversationId;
            setMessages([]);
            socketRef.current.emit('get-all-chats');
          });
        }
      });

      socketRef.current.on('chat-response', (data) => {
        if (!isMounted) return;
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: data.text,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
        socketRef.current.emit('get-all-chats');
      });

      socketRef.current.on('error', (err) => {
        if (!isMounted) return;
        setError(err.message || 'Socket error');
        setIsTyping(false);
      });
    };

    setupSocket();

    return () => {
      isMounted = false;
      if (socketRef.current && conversationIdRef.current) {
        socketRef.current.emit('end-chat', { conversationId: conversationIdRef.current });
      }
      if (socketRef.current) {
        socketRef.current.off('chat-response');
        socketRef.current.off('error');
        socketRef.current.off('chat-started');
        socketRef.current.off('all-chats');
      }
    };
  }, [getToken]);

// Remove useEffect for selectedConversationId

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || messagesRemaining <= 0) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setMessagesRemaining(prev => prev - 1);
    setIsTyping(true);
    setError(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      if (socketRef.current && conversationIdRef.current) {
        console.log('Emitting chat-message:', inputMessage, 'conversationId:', conversationIdRef.current);
        socketRef.current.emit('chat-message', { conversationId: conversationIdRef.current, message: inputMessage });
      } else {
        throw new Error('Socket or conversation not initialized');
      }
    } catch (err) {
      setError('Socket error: ' + err.message);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const fileMessage = {
        id: messages.length + 1,
        text: `📎 Shared a file: ${file.name}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFile: true
      };
      setMessages(prev => [...prev, fileMessage]);
      setMessagesRemaining(prev => prev - 1);
    }
  };

  const handleSaveBuddyName = () => {
    setBuddyName(newBuddyName);
    setIsEditingName(false);
  };

  return (
    <div className="h-screen bg-night-900 flex flex-col chat-container">

      <header className="bg-night-800/95 backdrop-blur-md border-b border-primary-800/20 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
       
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/features')}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                <Moon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold text-sm sm:text-base">{buddyName}</h1>
                <p className="text-green-400 text-xs sm:text-sm">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        
        {/* --- Sidebar for all conversations --- */}
        {/* Remove sidebar from render, only keep main chat area */}
        {/* --- Main chat area --- */}
        <div className="flex-1 flex flex-col">
        
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4 chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md xl:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
                      : 'bg-night-700 text-gray-100 border border-primary-500/20'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <p className={`text-xs mt-1 sm:mt-2 ${
                    message.sender === 'user' ? 'text-primary-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

          
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-night-700 border border-primary-500/20 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-300 text-xs sm:text-sm">{buddyName} is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-primary-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="px-3 sm:px-4 py-2 bg-red-900/20 text-red-400 text-xs sm:text-sm text-center">
              {error}
            </div>
          )}

          <div className="px-3 sm:px-4 py-2 bg-night-800/50 border-t border-primary-800/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs sm:text-sm">
                  You have <span className="text-primary-400 font-semibold">{messagesRemaining}</span> messages remaining
                </span>
                {messagesRemaining <= 10 && (
                  <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 flex items-center">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Top Up
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-4 py-3 sm:py-4 bg-night-800 border-t border-primary-800/20 flex-shrink-0 chat-input">
  <div className="flex items-center space-x-2 sm:space-x-3 relative w-full">
    
    {/* Attach Button */}
    <button
      onClick={handleFileUpload}
      className="text-gray-400 hover:text-primary-400 transition-colors duration-200 p-2 flex-shrink-0"
      disabled={messagesRemaining <= 0}
    >
      <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>

    {/* Emoji Button */}
    <button
      onClick={() => setShowEmojiPicker((prev) => !prev)}
      className="text-gray-400 hover:text-primary-400 transition-colors duration-200 p-2 flex-shrink-0"
      disabled={messagesRemaining <= 0}
    >
      <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>

    {/* Emoji Picker Dropdown */}
    {showEmojiPicker && (
      <div className="absolute z-50 bottom-16 left-2 sm:left-10">
        <Picker
          data={data}
          onEmojiSelect={(emoji) => {
            setInputMessage((prev) => prev + (emoji.native || ''));
            setShowEmojiPicker(false);
          }}
          theme="dark"
          showPreview={false}
          showSkinTones={false}
        />
      </div>
    )}

    {/* Message Input Box */}
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={messagesRemaining > 0 ? "Type your message..." : "No messages remaining"}
        disabled={messagesRemaining <= 0}
        className="w-full px-4 py-2 sm:py-3 pr-12 bg-night-700 border border-primary-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        style={{ minHeight: '44px', maxHeight: '120px' }}
      />

      {/* Send Button Positioned Overlapping */}
      <button
        onClick={handleSendMessage}
        disabled={!inputMessage.trim() || messagesRemaining <= 0}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  </div>
</div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm sm:relative sm:bg-transparent sm:backdrop-blur-none">
            <div className="absolute inset-0 sm:relative w-full sm:w-80 bg-night-800 border-l border-primary-800/20 p-4 sm:p-6 overflow-y-auto flex-shrink-0 h-full sm:h-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">Chat Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                  AI Buddy Name
                </label>
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      value={newBuddyName}
                      onChange={(e) => setNewBuddyName(e.target.value)}
                      className="flex-1 px-2 sm:px-3 py-2 bg-night-700 border border-primary-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-colors duration-200 text-sm"
                      placeholder="Enter buddy name"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveBuddyName}
                        className="text-green-400 hover:text-green-300 transition-colors duration-200 p-1"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewBuddyName(buddyName);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-night-700 px-2 sm:px-3 py-2 rounded-lg">
                    <span className="text-white text-sm">{buddyName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-primary-400 hover:text-primary-300 transition-colors duration-200 p-1"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-gray-300 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Account Info</h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{user?.firstName || user?.username || ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mobile:</span>
                    <span className="text-white">{user?.mobile || ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-primary-400">Free</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button className="w-full bg-night-700 hover:bg-night-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 text-left text-sm">
                  Clear Chat History
                </button>
                <button className="w-full bg-night-700 hover:bg-night-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors duration-200 text-left text-sm">
                  Export Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
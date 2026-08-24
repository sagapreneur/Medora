import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  MoreVertical,
  Check,
  CheckCheck,
  User,
  Shield,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    addToast,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleAttachFile = () => {
    addToast('Attachment Simulator', 'File attached to secure message draft.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Secure Clinical Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Messages</h1>
          <p className="text-sm text-slate-500 mt-1">
            Direct clinical inquiries, care coordination, pharmacy verifications, and triage messaging.
          </p>
        </div>
      </div>

      {/* Messaging Layout: Left Sidebar + Right Chat Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: Conversation List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Search bar */}
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                    isSelected ? 'bg-teal-50/80 border-l-4 border-teal-700' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.recipientAvatar}
                      alt={conv.recipientName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {conv.recipientName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">{conv.lastMessageTime}</span>
                    </div>

                    <span className="text-[10px] text-teal-700 font-semibold block uppercase tracking-wider mt-0.5">
                      {conv.recipientRole}
                    </span>

                    <p className="text-xs text-slate-500 truncate mt-1">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-between bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.recipientAvatar}
                alt={activeConversation.recipientName}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>{activeConversation.recipientName}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-normal">
                    {activeConversation.recipientRole}
                  </span>
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Active Session Protected (256-bit TLS)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => addToast('Quick Actions', 'Patient summary options opened.', 'info')}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {activeConversation.messages.map((msg) => {
              const isDoctorSender = msg.senderId === 'doc-1';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isDoctorSender ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isDoctorSender
                        ? 'bg-teal-700 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono px-1">
                    <span>{msg.time}</span>
                    {isDoctorSender && <CheckCheck className="w-3 h-3 text-teal-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Composer Footer */}
          <form
            onSubmit={handleSend}
            className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleAttachFile}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              title="Attach clinical report or image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Type secure clinical reply to ${activeConversation.recipientName}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

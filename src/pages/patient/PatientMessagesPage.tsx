import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  ShieldCheck,
  CheckCheck,
  Stethoscope,
  Info,
} from 'lucide-react';

export const PatientMessagesPage: React.FC = () => {
  const { conversations, sendMessage, addToast } = useApp();
  const [messageInput, setMessageInput] = useState('');

  // Use the first doctor conversation for patient
  const doctorConv = conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(doctorConv.id, messageInput.trim());
    setMessageInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Care Team Direct Messaging</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Messages</h1>
          <p className="text-sm text-slate-500 mt-1">
            Communicate directly with your attending physician and clinic reception for non-emergency guidance.
          </p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Notice:</strong> For acute medical emergencies or severe chest pain, please call 911 or visit the nearest Emergency Room immediately.
        </span>
      </div>

      {/* Chat Box (Section 34) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col min-h-[500px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <img
              src={doctorConv.recipientAvatar}
              alt={doctorConv.recipientName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h3 className="font-bold text-sm text-slate-900">{doctorConv.recipientName}</h3>
              <p className="text-[11px] text-teal-700 font-semibold">{doctorConv.recipientRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Clinic Line</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {doctorConv.messages.map((msg) => {
            const isPatientSender = msg.senderId !== 'doc-1';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPatientSender ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isPatientSender
                      ? 'bg-teal-700 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-mono px-1">
                  <span>{msg.time}</span>
                  {isPatientSender && <CheckCheck className="w-3 h-3 text-teal-600" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSend}
          className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => addToast('Attachment', 'Document attached to message.', 'info')}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Type your message to Dr. Mehta..."
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
  );
};

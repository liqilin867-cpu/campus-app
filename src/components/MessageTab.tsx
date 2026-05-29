/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bolt, HelpCircle, CheckCircle, Smartphone, Flame, CreditCard, WashingMachine, RefreshCw, Trash2, CheckSquare, MailOpen, X, MessageSquare, AlertTriangle, Zap, Droplet } from 'lucide-react';
import { Message } from '../types';

interface MessageTabProps {
  messages: Message[];
  onMarkAllAsRead: () => void;
  onMarkSingleAsRead: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export default function MessageTab({
  messages,
  onMarkAllAsRead,
  onMarkSingleAsRead,
  onDeleteMessage
}: MessageTabProps) {
  const [activeFilter, setActiveFilter] = useState<'全部' | '系统通知' | '缴费提醒' | '分摊通知'>('全部');
  const [readingMessage, setReadingMessage] = useState<Message | null>(null);

  // Filters
  const filteredMessages = messages.filter((m) => {
    if (activeFilter === '全部') return true;
    return m.category === activeFilter;
  });

  const handleMessageClick = (msg: Message) => {
    setReadingMessage(msg);
    if (msg.unread) {
      onMarkSingleAsRead(msg.id);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* Filters (Chips) */}
      <div className="flex gap-2 overflow-x-auto py-1 scrollbar-hide no-scrollbar -mx-4 px-4">
        {(['全部', '系统通知', '缴费提醒', '分摊通知'] as const).map((filter) => {
          const count = messages.filter(
            (m) => m.unread && (filter === '全部' ? true : m.category === filter)
          ).length;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container text-on-surface-variant border border-white/20'
              }`}
            >
              {filter}
              {count > 0 && (
                <span className="bg-error text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white/20">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Header controls: Mark all as read */}
      <div className="flex justify-between items-center px-1">
        <p className="text-xs text-outline">
          展示 {filteredMessages.length} 条通知消息
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={onMarkAllAsRead}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <MailOpen className="w-3.5 h-3.5" />
            全部已读
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex flex-col gap-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleMessageClick(msg)}
              className={`rounded-[24px] p-4 flex gap-3 relative cursor-pointer active:scale-[0.98] transition-all hover:shadow-md ${
                msg.unread
                  ? 'bg-white border border-blue-100 shadow-sm'
                  : 'bg-white/60 border border-slate-100/60 opacity-80'
              }`}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border ${
                msg.unread 
                  ? 'bg-primary-fixed border-white/50 text-[#003d9b]' 
                  : 'bg-surface-container-highest border-white/40 text-outline'
              }`}>
                {msg.category === '系统通知' && <MessageSquare className="w-5 h-5" />}
                {msg.category === '缴费提醒' && <Zap className="w-5 h-5 fill-current" />}
                {msg.category === '分摊通知' && <HelpCircle className="w-5 h-5" />}
                {msg.category === '缴费成功' && <CheckCircle className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[9px] border ${
                      msg.category === '缴费提醒' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : msg.category === '分摊通知'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/50'
                    }`}>
                      [{msg.category}]
                    </span>
                    <h3 className={`font-semibold text-sm text-on-surface truncate ${msg.unread ? 'font-bold' : ''}`}>
                      {msg.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-outline shrink-0 ml-2">{msg.time}</span>
                </div>
                
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mt-1">
                  {msg.content}
                </p>

                <div className="mt-2.5 flex justify-between items-center text-[10px] text-outline">
                  <span>{msg.date}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMessage(msg.id);
                    }}
                    className="p-1 hover:text-error transition-colors cursor-pointer"
                    title="删除消息"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Unread Dot */}
              {msg.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-secondary-container absolute top-4 right-4 shadow-[0_0_8px_rgba(0,113,230,0.6)]"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-outline bg-white/50 rounded-[24px] border border-white/40">
            <MailOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
            暂无此分类的信息消息
          </div>
        )}
      </div>

      {/* -------------------- DETAIL MODAL -------------------- */}
      {readingMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-sm p-6 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200 shadow-xl">
            <button
              onClick={() => setReadingMessage(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${
                readingMessage.category === '缴费提醒' 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : readingMessage.category === '分摊通知'
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : 'bg-primary-fixed text-on-primary-fixed border-primary-fixed-dim/50'
              }`}>
                {readingMessage.category}
              </span>
              <h3 className="font-bold text-base text-on-surface">{readingMessage.title}</h3>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-white/50 whitespace-pre-wrap">
              {readingMessage.content}
            </p>

            <div className="flex justify-between items-center text-xs text-outline px-1">
              <span>日期: {readingMessage.date}</span>
              <span>接收时间: {readingMessage.time}</span>
            </div>

            <button
              onClick={() => setReadingMessage(null)}
              className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              我已阅读
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

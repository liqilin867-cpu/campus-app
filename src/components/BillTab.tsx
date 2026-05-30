/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Zap, Droplet, Wifi, Flame, WashingMachine, CheckCircle, Clock, AlertCircle, X, Receipt, Download, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { BillItem } from '../types';

interface BillTabProps {
  billsList: BillItem[];
  allRoommates: { name: string; avatar: string }[];
  currentUserName: string;
  cardBalance: number;
  billPaymentStatus: Record<string, Record<string, 'paid' | 'pending'>>;
  onPayForRoommate: (billId: string, roommateName: string, amount: number) => boolean;
  onAddSystemNotification: (category: string, title: string, content: string) => void;
}

const ROOMMATE_AVATARS: Record<string, { bg: string; initial: string; color: string }> = {
  '赵六': { bg: 'bg-blue-600', initial: '我', color: 'text-white' },
  '张三': { bg: 'bg-slate-500', initial: '张', color: 'text-white' },
  '李四': { bg: 'bg-indigo-500', initial: '李', color: 'text-white' },
  '王五': { bg: 'bg-orange-400', initial: '王', color: 'text-white' },
};

export default function BillTab({
  billsList,
  allRoommates,
  currentUserName,
  cardBalance,
  billPaymentStatus,
  onPayForRoommate,
  onAddSystemNotification
}: BillTabProps) {
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null);

  const myBills = billsList.filter(b => {
    if(b.title?.includes('（我的）')) return true;
    if(b.payer === '系统') return true;
    if(b.payer && b.payer.includes(currentUserName)) return true;
    return false;
  });
  const totalSpent = myBills.reduce((acc, curr) => acc + curr.amount, 0);
  const paidSpent = myBills
    .filter((b) => b.status === '已缴费')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const unpaidSpent = myBills
    .filter((b) => b.status !== '已缴费')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const months = Array.from(new Set(billsList.map((b) => b.month)));

  const handleDownloadInvoice = (bill: BillItem) => {
    const txnId = bill.orderNo || `TXN${bill.id.toUpperCase()}`;
    toast.success(`电子凭证下载成功\n单号：${txnId}\n金额：¥${bill.amount.toFixed(2)}`);
  };

  // Check which bill IDs have payment tracking
  const getBillPaymentStatus = (billId: string) => {
    return billPaymentStatus[billId];
  };

  const handlePayForRoommateClick = (billId: string, name: string, amount: number) => {
    if (cardBalance < amount) {
      toast.error(`余额不足！需 ¥${amount.toFixed(2)}，当前余额 ¥${cardBalance.toFixed(2)}`);
      return;
    }
    onPayForRoommate(billId, name, amount);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Summary */}
      <section className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700/80 rounded-[24px] p-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center justify-center py-1">
          <p className="font-semibold text-xs text-slate-500 dark:text-gray-400 mb-1">累计消费</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-extrabold text-[#001f5c] dark:text-blue-300 tracking-tight">
              ¥ {totalSpent.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-3.5 w-full mt-1">
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-3 flex flex-col items-center border border-slate-100 dark:border-gray-700/50 shadow-xs">
              <span className="font-semibold text-[10px] text-slate-400 dark:text-gray-500 mb-0.5">已缴费</span>
              <span className="font-extrabold text-sm text-primary">¥ {paidSpent.toFixed(2)}</span>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-3 flex flex-col items-center border border-slate-100 dark:border-gray-700/50 shadow-xs">
              <span className="font-semibold text-[10px] text-slate-400 dark:text-gray-500 mb-0.5">待缴/代付</span>
              <span className="font-extrabold text-sm text-orange-500">¥ {unpaidSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>



      {/* 导出账单 */}
      <div className="flex justify-end">
        <button onClick={() => {
          const rows = billsList.map(b => [b.title, b.amount, b.time, b.status].join(",")).join(String.fromCharCode(10));
          const blob = new Blob(["项目,金额,时间,状态" + String.fromCharCode(10) + rows], {type:"text/csv;charset=utf-8;"});
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "账单导出.csv"; a.click();
        }} className="px-4 py-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-700/50 rounded-2xl shadow-sm flex items-center gap-2 hover:bg-slate-50 dark:bg-gray-800/50 transition-colors cursor-pointer active:scale-[0.98] text-xs text-blue-600 font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          导出CSV
        </button>
      </div>

{/* ===== 分摊追踪板块：显示所有有室友待缴的分摊账单 ===== */}
      {Object.values(billPaymentStatus).some(p => Object.values(p).some(v => v === 'pending')) && (
        <section className="rounded-[24px] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-700/30 p-4 shadow-sm" id="split_tracking">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <h3 className="font-bold text-sm text-amber-900">分摊追踪</h3>
            <span className="text-[10px] text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full font-semibold ml-auto">
              {Object.values(billPaymentStatus).filter(p => Object.values(p).some(v => v === 'pending')).length} 项待缴
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(billPaymentStatus).filter(([, p]) => Object.values(p).some(v => v === 'pending')).map(([billId, payments]) => {
              const bill = billsList.find(b => b.id === billId);
              const paidCount = Object.values(payments).filter(s => s === 'paid').length;
              const totalCount = Object.keys(payments).length;
              const perPerson = bill ? bill.amount / totalCount : 0;

              return (
                <div key={billId} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-3.5 border border-amber-100 dark:border-amber-800/30 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-bold text-xs text-slate-800 dark:text-gray-100">{bill?.title||'分摊账单'}</span>
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 ml-2">¥{(bill?.amount||perPerson*totalCount).toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                      {paidCount}/{totalCount} 已缴
                    </span>
                  </div>

                  {/* 进度条 */}
                  <div className="w-full bg-slate-100 dark:bg-gray-700 h-1.5 rounded-full mb-2.5 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${(paidCount / totalCount) * 100}%` }}></div>
                  </div>

                  {/* 室友列表 */}
                  <div className="space-y-1.5">
                    {Object.entries(payments).map(([name, status]) => {
                      const isMe = name === currentUserName;
                      const avatarStyle = ROOMMATE_AVATARS[name] || (name === currentUserName ? { bg: 'bg-blue-600', initial: '我', color: 'text-white' } : { bg: 'bg-slate-500', initial: name[0], color: 'text-white' });
                      return (
                        <div key={name} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${avatarStyle.bg} ${avatarStyle.color} flex items-center justify-center font-bold text-[8px]`}>
                              {avatarStyle.initial}
                            </div>
                            <span className="text-[11px] font-medium text-slate-700 dark:text-gray-200">
                              {name} {isMe ? '(我)' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {status === 'paid' ? (
                              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                                <CheckCircle className="w-3 h-3" /> 已缴
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> 待缴 ¥{perPerson.toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handlePayForRoommateClick(billId, name, perPerson)}
                                  className={`px-2 py-1 rounded-full text-[8px] font-bold hover:shadow-md active:scale-95 transition-all cursor-pointer ${
                                    isMe
                                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                  }`}
                                >
                                  {isMe ? '立即缴费' : '代付'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bill List */}
      <section className="space-y-5" id="monthly_bills">
        {months.map((month) => {
          const monthBills = billsList.filter((b) => b.month === month);
          return (
            <div key={month}>
              <h2 className="font-extrabold text-xs text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">{month}</h2>
              <div className="flex flex-col gap-2">
                {monthBills.map((bill) => (
                  <div
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 hover:bg-blue-50/30 hover:shadow-sm transition-all cursor-pointer active:scale-[0.99] rounded-2xl border border-slate-100 dark:border-gray-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-gray-700/50 shadow-xs bg-slate-50 dark:bg-gray-800/50">
                        {bill.category === '电费' && <Zap className="w-5 h-5 text-orange-500 fill-current" />}
                        {bill.category === '水费' && <Droplet className="w-5 h-5 text-cyan-500 fill-current" />}
                        {bill.category === '网费' && <Wifi className="w-5 h-5 text-blue-500" />}
                        {bill.category === '空调' && <Flame className="w-5 h-5 text-indigo-500" />}
                        {bill.category === '洗衣' && <WashingMachine className="w-5 h-5 text-teal-600" />}
                        {bill.category === '校园卡' && <CreditCard className="w-5 h-5 text-emerald-600" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-slate-800 dark:text-gray-100">{bill.title}</span>
                        <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">{bill.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-extrabold text-xs text-slate-800 dark:text-gray-100">-{bill.amount.toFixed(2)} 元</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full mt-1.5 font-bold border ${
                        bill.status === '已缴费'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : bill.status === '分摊中'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-error border-red-200'
                      }`}>
                        {bill.status}
                      </span>
                      {/* Show payment tracking summary */}
                      {(() => {
                        const pStatus = getBillPaymentStatus(bill.id);
                        if (!pStatus) return null;
                        const pendCount = Object.values(pStatus).filter(s => s === 'pending').length;
                        return (
                          <span className={`text-[8px] mt-1 font-bold px-1.5 py-0.5 rounded-full ${
                            pendCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {pendCount > 0 ? `${pendCount}人待缴` : '全员已缴'}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* DETAIL MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-[24px] md:rounded-[24px] w-full max-w-sm p-5 flex flex-col gap-4 relative animate-in slide-in-from-bottom-5 duration-300 shadow-xl">
            <button
              onClick={() => setSelectedBill(null)}
              className="absolute right-4 top-4 text-slate-400 dark:text-gray-500 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 dark:bg-gray-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base text-primary">账单详情</h2>
            </div>

            {/* Invoice info */}
            <div className="border border-dashed border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3 text-xs text-slate-700 dark:text-gray-200 relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-orange-400 to-indigo-600 rounded-t-xl"></div>

              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 dark:border-gray-700">
                <div>
                  <span className="text-[9px] text-slate-400 dark:text-gray-500 uppercase tracking-widest font-bold">电子凭证</span>
                  <h3 className="font-extrabold text-xs text-slate-800 dark:text-gray-100 mt-0.5">{selectedBill.title}</h3>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  selectedBill.status === '已缴费' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedBill.status === '已缴费' ? '已缴清' : '待处理'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-2.5 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 dark:text-gray-500 block">金额</span>
                  <span className="font-extrabold text-sm text-slate-800 dark:text-gray-100">¥ {selectedBill.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-gray-500 block">项目</span>
                  <span className="font-bold text-slate-800 dark:text-gray-100">{selectedBill.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-gray-500 block">单号</span>
                  <span className="font-mono text-slate-500 dark:text-gray-400 text-[10px]">{selectedBill.orderNo || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-gray-500 block">支付方式</span>
                  <span className="font-semibold text-slate-800 dark:text-gray-100">{selectedBill.paymentMethod || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-gray-500 block">时间</span>
                  <span className="font-medium text-slate-500 dark:text-gray-400">{selectedBill.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-gray-500 block">余额</span>
                  <span className="font-mono font-bold text-primary">
                    {selectedBill.afterBalance != null ? `¥${selectedBill.afterBalance.toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-200 dark:border-gray-700 flex items-center gap-1 text-[9px] text-slate-400 dark:text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span>校后勤财务系统认证</span>
              </div>
            </div>

            {/* Roommate split status — dynamic from billPaymentStatus */}
            {(() => {
              const paymentInfo = getBillPaymentStatus(selectedBill.id);
              if (!paymentInfo) {
                // No payment tracking for this bill — show old static view for shared bills
                if (selectedBill.category === '电费' || selectedBill.category === '水费' || selectedBill.category === '空调') {
                  return (
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest px-1">寝室成员分摊（1/4 每人）</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {allRoommates.filter(r => r.name !== currentUserName).map((rm) => (
                          <div key={rm.name} className="flex justify-between items-center bg-slate-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-white dark:border-gray-700/50">
                            <div className="flex items-center gap-2">
                              <div className="w-6.5 h-6.5 rounded-full bg-slate-50 dark:bg-gray-700 text-white flex items-center justify-center font-bold text-[9px]">{rm.name[0]}</div>
                              <span className="font-bold text-[11px] text-slate-700 dark:text-gray-200">{rm.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="font-semibold text-slate-500 dark:text-gray-400">¥{(selectedBill.amount / 4).toFixed(2)}</span>
                              <span className="text-green-600 font-bold flex items-center gap-0.5">
                                <CheckCircle className="w-3.5 h-3.5 inline" />已缴
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }

              // Has payment tracking — show dynamic status
              const perPerson = selectedBill.amount / Object.keys(paymentInfo).length;
              return (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest px-1">分摊缴费状态（每人 ¥{perPerson.toFixed(2)}）</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Object.entries(paymentInfo).map(([name, status]) => {
                      const avatar = ROOMMATE_AVATARS[name] || (name === currentUserName ? { bg: 'bg-blue-600', initial: '我', color: 'text-white' } : { bg: 'bg-slate-500', initial: name[0], color: 'text-white' });
                      const isMe = name === currentUserName;
                      return (
                        <div key={name} className={`flex items-center justify-between p-2.5 rounded-xl border ${
                          status === 'paid' ? 'bg-green-50/50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' : 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30'
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${avatar.bg} ${avatar.color} flex items-center justify-center font-bold text-[10px]`}>
                              {avatar.initial}
                            </div>
                            <div>
                              <span className="font-bold text-[11px] text-slate-700 dark:text-gray-200">
                                {name} {isMe ? '(我)' : ''}
                              </span>
                              <span className="text-[9px] text-slate-400 dark:text-gray-500 block">{status === 'paid' ? '已缴费' : isMe ? '待缴费' : '待缴费'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[10px] text-slate-500 dark:text-gray-400">¥{perPerson.toFixed(2)}</span>
                            {status === 'paid' ? (
                              <span className="flex items-center gap-0.5 text-green-600 font-bold text-[10px]">
                                <CheckCircle className="w-3.5 h-3.5" /> 已缴
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-amber-600 font-semibold text-[10px] flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> 待缴
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePayForRoommateClick(selectedBill.id, name, perPerson);
                                  }}
                                  className={`px-2 py-1 rounded-full text-[8px] font-bold hover:shadow-md active:scale-95 transition-all ${
                                    isMe
                                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                                  }`}
                                >
                                  {isMe ? '立即缴费' : '代付'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                onClick={() => handleDownloadInvoice(selectedBill)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-gray-200 font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                下载凭证
              </button>
              <button
                onClick={() => setSelectedBill(null)}
                className="py-3 px-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold text-xs rounded-full cursor-pointer shadow active:scale-[0.98] transition-transform"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

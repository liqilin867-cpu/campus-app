import React, { useState, useEffect } from 'react';
import { MapPin, Bell, ChevronDown, Check, ArrowRight, Wallet, CreditCard, Wifi, Zap, Droplet, Flame, Shuffle, Users, AlertTriangle, X, TrendingDown, TrendingUp, BarChart3, Clock, CheckCircle } from 'lucide-react';
import { BillItem } from '../types';

interface HomeTabProps {
  currentRoom: string; currentUserName: string; unpaidBills: BillItem[]; billsList: BillItem[];
  billPaymentStatus: Record<string, Record<string, 'paid' | 'pending'>>;
  cardBalance: number; netBalance: number; electricityBalance: number; waterBalance: number;
  isNetAutoDeduct: boolean; hasUnreadMessages: boolean;
  onSetNetAutoDeduct: (v: boolean) => void; onAutoDeductNet: () => void;
  onOneKeyPay: (ids: string[]) => void;
  onPayForRoommate: (billId: string, name: string, amount: number) => boolean;
  onNavigateToSplit: (category?: string) => void; onNavigateToNotifications: () => void;
  onQuickRecharge: (type: '电费' | '水费' | '网费' | '校园卡') => void;
  onQuickSplit: (category: string, amount: number) => void;
}

export default function HomeTab(props: HomeTabProps) {
  const { currentRoom, currentUserName, unpaidBills, billsList, billPaymentStatus, cardBalance, netBalance, electricityBalance, waterBalance, hasUnreadMessages, onAutoDeductNet, onOneKeyPay, onPayForRoommate, onNavigateToSplit, onNavigateToNotifications, onQuickRecharge, onQuickSplit } = props;
  const [ids, setIds] = useState<string[]>([]);
  const [init, setInit] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [showTrend, setShowTrend] = useState(false);
  const [trendTab, setTrendTab] = useState<'电费' | '水费'>('电费');
  const [qsCat, setQsCat] = useState<'电费' | '水费' | null>(null);
  const [qsAmt, setQsAmt] = useState('');

  useEffect(() => { if (!init && unpaidBills.length > 0) { setIds(unpaidBills.map(b => b.id)); setInit(true); } }, [unpaidBills, init]);
  const validIds = ids.filter(id => unpaidBills.some(b => b.id === id));
  const selectedSum = unpaidBills.filter(b => validIds.includes(b.id)).reduce((s, b) => s + b.amount, 0);
  const allSelected = unpaidBills.length > 0 && validIds.length === unpaidBills.length;
  const toggle = (id: string) => setIds(validIds.includes(id) ? validIds.filter(x => x !== id) : [...validIds, id]);
  const toggleAll = () => setIds(allSelected ? [] : unpaidBills.map(b => b.id));

  const pendingSplit = Object.entries(billPaymentStatus).map(([bid, p]) => {
    const b = billsList.find(x => x.id === bid);
    if (!b || p[currentUserName] !== 'pending') return null;
    const pp = b.amount / Object.keys(p).length;
    return { billId: bid, bill: b, perPerson: pp, payments: p };
  }).filter(Boolean) as { billId: string; bill: BillItem; perPerson: number; payments: Record<string, 'paid' | 'pending'> }[];

  const months = ['3月', '4月', '5月'];
  const elecData = months.map(m => {
    const t = billsList.filter(b => b.month === m && b.category === '电费').reduce((s, b) => s + b.amount, 0);
    return { label: m, amount: t || { '3月': 42, '4月': 55, '5月': 38 }[m] || 0 };
  });
  const waterData = months.map(m => {
    const t = billsList.filter(b => b.month === m && b.category === '水费').reduce((s, b) => s + b.amount, 0);
    return { label: m, amount: t || { '3月': 18.5, '4月': 22, '5月': 15 }[m] || 0 };
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <section className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">{currentRoom}</span>
          <span className="text-[10px] bg-slate-100 rounded-full px-2 py-0.5 text-slate-500">{currentUserName}</span>
        </div>
        <button onClick={onNavigateToNotifications} className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50">
          <Bell className="w-4 h-4 text-primary" />
          {hasUnreadMessages && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
        </button>
      </section>

      {/* Accounts Dashboard */}
      <section className="bg-slate-50 rounded-3xl p-4 border border-slate-200">
        <p className="text-[10px] font-semibold text-slate-500 mb-3 flex items-center gap-1"><Wallet className="w-3.5 h-3.5" />校园账户</p>
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-4 text-white mb-3">
          <div className="flex justify-between items-center">
            <div><p className="text-[10px] text-white/70">一卡通余额</p><p className="text-2xl font-bold">¥{cardBalance.toFixed(2)}</p></div>
            <button onClick={() => onQuickRecharge('校园卡')} className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-full px-4 py-1.5 text-[11px] font-bold cursor-pointer">充值</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1"><Wifi className="w-3 h-3 text-blue-500" />校园网</div>
            <p className="font-bold text-sm text-slate-800">¥{netBalance.toFixed(2)}</p>
            <button onClick={onAutoDeductNet} className="w-full mt-1.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-bold cursor-pointer">自动缴费</button>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-slate-100 cursor-pointer hover:shadow-sm" onClick={() => { setQsCat('电费'); setQsAmt(''); }}>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1"><Zap className="w-3 h-3 text-orange-500" />电费</div>
            <p className="font-bold text-sm text-slate-800">¥{electricityBalance.toFixed(2)}</p>
            <p className="text-[9px] text-orange-500 mt-1.5 font-medium">快速分摊</p>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-slate-100 cursor-pointer hover:shadow-sm" onClick={() => { setQsCat('水费'); setQsAmt(''); }}>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1"><Droplet className="w-3 h-3 text-cyan-500" />水费</div>
            <p className="font-bold text-sm text-slate-800">¥{waterBalance.toFixed(2)}</p>
            <p className="text-[9px] text-cyan-500 mt-1.5 font-medium">快速分摊</p>
          </div>
        </div>
      </section>

      {/* Payment Buttons */}
      <section className="px-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <button onClick={() => setShowPay(!showPay)} className="w-full flex items-center gap-2.5 px-3 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              </div>
              <div className="text-left flex-1"><p className="font-bold text-xs">个人缴费</p><p className="text-[10px] text-blue-100">网费 · 校园卡</p></div>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><ChevronDown className={'w-3 h-3 transition-transform '+(showPay?'rotate-180':'')} /></div>
            </button>
            {showPay && <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
              <button onClick={() => { setShowPay(false); onQuickRecharge('网费'); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center"><svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"/></svg></div>
                <span className="font-medium">缴网费</span>
              </button>
              <button onClick={() => { setShowPay(false); onQuickRecharge('校园卡'); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center"><svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg></div>
                <span className="font-medium">充校园卡</span>
              </button>
            </div>}
          </div>
          <button onClick={() => onNavigateToSplit()} className="flex-1 flex items-center gap-2.5 px-3 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div className="text-left"><p className="font-bold text-xs">分摊缴费</p><p className="text-[10px] text-orange-100">电费·水费·空调</p></div>
          </button>
        </div>
      </section>

      {/* Trend Chart Entry */}
      <section className="px-2">
        <div onClick={() => setShowTrend(true)} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-3.5 flex items-center justify-between hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-primary" /></div>
            <div><p className="font-bold text-xs text-slate-800">用能走势</p><p className="text-[10px] text-slate-400">查看水电月度趋势</p></div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
        </div>
      </section>

      {/* Only pending splits - already split, just need to pay */}
      <section className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm">
        <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" />宿舍公摊待缴</h4>
        {pendingSplit.length > 0 ? <div className="space-y-2">
          {pendingSplit.map(({ billId, bill, perPerson }) => (
            <div key={billId} className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bill.category === '电费' && <Zap className="w-4 h-4 text-orange-500" />}
                {bill.category === '水费' && <Droplet className="w-4 h-4 text-blue-500" />}
                {bill.category === '空调' && <Flame className="w-4 h-4 text-indigo-500" />}
                <div><p className="text-xs font-semibold">{bill.title}</p><p className="text-[10px] text-slate-400">您需缴 ¥{perPerson.toFixed(2)}</p></div>
              </div>
              <button onClick={() => { if (cardBalance < perPerson) { alert('余额不足'); return; } if (confirm('缴纳 ¥'+perPerson.toFixed(2)+'？')) onPayForRoommate(billId, currentUserName, perPerson); }}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-[10px] font-bold cursor-pointer active:scale-95">立即缴费</button>
            </div>
          ))}
        </div> : <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-2xl">全部缴清 ✓</div>}
      </section>

      {/* Quick Split Modal */}
      {qsCat && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-3">
              {qsCat === '电费' ? <Zap className="w-5 h-5 text-orange-500" /> : <Droplet className="w-5 h-5 text-cyan-500" />}
              <h3 className="font-bold text-sm">{qsCat}快速分摊</h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-3">输入金额后将自动向全寝发起分摊</p>
            <input type="number" value={qsAmt} onChange={e => setQsAmt(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-lg p-3 rounded-xl outline-none text-center font-bold" placeholder="输入金额" autoFocus />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setQsCat(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer">取消</button>
              <button onClick={() => {
                const n = Number(qsAmt);
                if (isNaN(n) || n <= 0) return;
                setQsCat(null);
                onQuickSplit(qsCat, n);
              }} className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer disabled:opacity-50" disabled={!qsAmt || Number(qsAmt) <= 0}>发起分摊</button>
            </div>
          </div>
        </div>
      )}

      {/* Trend Modal */}
      {showTrend && <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-primary" />用能走势</h3>
            <button onClick={() => setShowTrend(false)} className="text-slate-400 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-3">
            {(['电费', '水费'] as const).map(t => <button key={t} onClick={() => setTrendTab(t)} className={'flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer '+(trendTab===t?'bg-white text-primary shadow-sm':'text-slate-500')}>{t}走势</button>)}
          </div>
          {(trendTab === '电费' ? elecData : waterData).map(d => {
            const mx = Math.max(...(trendTab === '电费' ? elecData : waterData).map(x => x.amount), 1);
            return <div key={d.label} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-slate-500 w-8">{d.label.replace('月','')}月</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{backgroundColor:trendTab==='电费'?'#f59e0b':'#06b6d4',width:(d.amount/mx)*100+'%'}}></div></div>
              <span className="text-[10px] text-slate-600 font-semibold w-12 text-right">¥{d.amount.toFixed(0)}</span>
            </div>;
          })}
          <button onClick={() => setShowTrend(false)} className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full cursor-pointer">关闭</button>
        </div>
      </div>}
    </div>
  );
}

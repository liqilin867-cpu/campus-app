import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPin, Bell, ChevronDown, Wallet, CreditCard, Wifi, Zap, Droplet, Flame, Users, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog';
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
      <section className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-muted-foreground">校园事务工作台</p>
          <div className="mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate text-lg font-extrabold text-slate-900 dark:text-slate-100">{currentRoom}</span>
            <span className="shrink-0 rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-bold text-primary">{currentUserName}</span>
          </div>
        </div>
        <button onClick={onNavigateToNotifications} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm active:scale-95">
          <Bell className="w-4 h-4" />
          {hasUnreadMessages && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />}
        </button>
      </section>

      <section className="workbench-card relative z-30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground"><Wallet className="w-3.5 h-3.5" />校园一卡通</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-sm font-bold text-primary">¥</span>
              <span className="text-4xl font-extrabold tracking-normal text-slate-950 dark:text-slate-50">{cardBalance.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => onQuickRecharge('校园卡')} className="rounded-xl px-4 py-2 text-xs font-extrabold workbench-primary-action active:scale-95">充值</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="relative">
            <button onClick={() => setShowPay(!showPay)} className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-left active:scale-[0.99]">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100"><CreditCard className="w-4 h-4 text-primary" />个人缴费</span>
              <ChevronDown className={'w-3.5 h-3.5 text-muted-foreground transition-transform '+(showPay?'rotate-180':'')} />
            </button>
            {showPay && <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
              <button onClick={() => { setShowPay(false); onQuickRecharge('网费'); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-muted dark:text-slate-200"><Wifi className="w-4 h-4 text-blue-500" />缴网费</button>
              <button onClick={() => { setShowPay(false); onQuickRecharge('校园卡'); }} className="flex w-full items-center gap-2 border-t border-border px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-muted dark:text-slate-200"><CreditCard className="w-4 h-4 text-primary" />充校园卡</button>
            </div>}
          </div>
          <button onClick={() => onNavigateToSplit()} className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-extrabold workbench-warning-action active:scale-[0.99]"><Users className="w-4 h-4" />发起分摊</button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2">
        <div className="workbench-card p-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground"><Wifi className="w-3.5 h-3.5 text-blue-500" />校园网</div>
          <p className="mt-2 text-base font-extrabold">¥{netBalance.toFixed(2)}</p>
          <button onClick={onAutoDeductNet} className="mt-2 w-full rounded-lg bg-primary-fixed px-2 py-1.5 text-[10px] font-bold text-primary">自动缴费</button>
        </div>
        <button className="workbench-card p-3 text-left active:scale-[0.99]" onClick={() => { setQsCat('电费'); setQsAmt(''); }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground"><Zap className="w-3.5 h-3.5 text-orange-500" />电费</div>
          <p className="mt-2 text-base font-extrabold">¥{electricityBalance.toFixed(2)}</p>
          <p className="mt-2 text-[10px] font-bold text-orange-600">快速分摊</p>
        </button>
        <button className="workbench-card p-3 text-left active:scale-[0.99]" onClick={() => { setQsCat('水费'); setQsAmt(''); }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground"><Droplet className="w-3.5 h-3.5 text-cyan-500" />水费</div>
          <p className="mt-2 text-base font-extrabold">¥{waterBalance.toFixed(2)}</p>
          <p className="mt-2 text-[10px] font-bold text-cyan-600">快速分摊</p>
        </button>
      </section>

      {unpaidBills.length > 0 && <section className="workbench-card p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="workbench-section-title">待缴账单</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">已选 {validIds.length}/{unpaidBills.length} 项，共 ¥{selectedSum.toFixed(2)}</p>
          </div>
          <button onClick={() => onOneKeyPay(validIds)} disabled={!validIds.length} className="rounded-xl px-3 py-2 text-xs font-bold workbench-primary-action disabled:opacity-50">一键缴费</button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <button onClick={toggleAll} className="self-start text-[11px] font-bold text-primary">{allSelected ? '取消全选' : '全选账单'}</button>
          {unpaidBills.map(b => <button key={b.id} onClick={() => toggle(b.id)} className={'flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all '+(validIds.includes(b.id)?'border-primary bg-primary-fixed/70':'border-border bg-muted/30')}>
            <div className="min-w-0"><p className="truncate text-xs font-bold">{b.title}</p><p className="text-[10px] text-muted-foreground">{b.month || '本月'} · {b.category}</p></div>
            <span className="shrink-0 text-xs font-extrabold">¥{b.amount.toFixed(2)}</span>
          </button>)}
        </div>
      </section>}

      <section className="workbench-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 workbench-section-title"><Users className="w-4 h-4 text-primary" />宿舍公摊待缴</h3>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">{pendingSplit.length} 项</span>
        </div>
        {pendingSplit.length > 0 ? <div className="flex flex-col gap-2">
          {pendingSplit.map(({ billId, bill, perPerson }) => (
            <div key={billId} className="flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="min-w-0 flex items-center gap-2">
                {bill.category === '电费' && <Zap className="w-4 h-4 shrink-0 text-orange-500" />}
                {bill.category === '水费' && <Droplet className="w-4 h-4 shrink-0 text-cyan-500" />}
                {bill.category === '空调' && <Flame className="w-4 h-4 shrink-0 text-indigo-500" />}
                <div className="min-w-0"><p className="truncate text-xs font-bold">{bill.title}</p><p className="text-[10px] text-muted-foreground">您需缴 ¥{perPerson.toFixed(2)}</p></div>
              </div>
              <button onClick={() => { if (cardBalance < perPerson) { toast.error('余额不足'); return; } if (confirm('缴纳 ¥'+perPerson.toFixed(2)+'？')) onPayForRoommate(billId, currentUserName, perPerson); }} className="shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-bold workbench-success-action active:scale-95">缴费</button>
            </div>
          ))}
        </div> : <div className="rounded-xl bg-muted/50 py-6 text-center text-xs font-semibold text-muted-foreground">全部缴清</div>}
      </section>

      <section>
        <button onClick={() => setShowTrend(true)} className="workbench-card flex w-full items-center justify-between p-4 text-left active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary"><BarChart3 className="w-5 h-5" /></div>
            <div><p className="text-sm font-extrabold">用能走势</p><p className="text-[11px] text-muted-foreground">查看水电月度趋势</p></div>
          </div>
          <ChevronDown className="w-4 h-4 -rotate-90 text-muted-foreground" />
        </button>
      </section>

      <Dialog open={!!qsCat} onOpenChange={(o) => { if (!o) setQsCat(null); }}>
        <DialogContent>
          <DialogTitle className="flex items-center gap-2 text-sm font-bold">
            {qsCat === '电费' ? <Zap className="w-5 h-5 text-orange-500" /> : <Droplet className="w-5 h-5 text-cyan-500" />}
            {qsCat}快速分摊
          </DialogTitle>
          <p className="mb-3 text-[11px] text-muted-foreground">输入金额后将自动向全寝发起分摊</p>
          <input type="number" value={qsAmt} onChange={e => setQsAmt(e.target.value)} className="w-full border border-border bg-background p-3 text-center text-lg font-bold outline-none focus:border-primary" placeholder="输入金额" autoFocus />
          <div className="mt-3 flex gap-2">
            <button onClick={() => setQsCat(null)} className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-semibold text-muted-foreground">取消</button>
            <button onClick={() => {
              const n = Number(qsAmt);
              if (isNaN(n) || n <= 0) return;
              setQsCat(null);
              onQuickSplit(qsCat, n);
            }} className="flex-1 rounded-xl py-2.5 text-xs font-bold workbench-primary-action disabled:opacity-50" disabled={!qsAmt || Number(qsAmt) <= 0}>发起分摊</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTrend} onOpenChange={(o) => { if (!o) setShowTrend(false); }}>
        <DialogContent>
          <DialogTitle className="flex items-center gap-1.5 text-sm font-bold"><BarChart3 className="w-4 h-4 text-primary" />用能走势</DialogTitle>
          <div className="mb-3 flex gap-1 rounded-xl bg-muted p-1">
            {(['电费', '水费'] as const).map(t => <button key={t} onClick={() => setTrendTab(t)} className={'flex-1 rounded-lg py-1.5 text-xs font-bold transition-all '+(trendTab===t?'bg-card text-primary shadow-sm':'text-muted-foreground')}>{t}走势</button>)}
          </div>
          {(trendTab === '电费' ? elecData : waterData).map(d => {
            const mx = Math.max(...(trendTab === '电费' ? elecData : waterData).map(x => x.amount), 1);
            return <div key={d.label} className="mb-2 flex items-center gap-2">
              <span className="w-8 text-[10px] text-muted-foreground">{d.label.replace('月','')}月</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{backgroundColor:trendTab==='电费'?'#c86a22':'#0891b2',width:(d.amount/mx)*100+'%'}} /></div>
              <span className="w-12 text-right text-[10px] font-semibold">¥{d.amount.toFixed(0)}</span>
            </div>;
          })}
          <button onClick={() => setShowTrend(false)} className="mt-3 w-full rounded-xl py-2.5 text-xs font-bold workbench-primary-action">关闭</button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
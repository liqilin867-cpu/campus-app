/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Send,
  Check,
  Zap,
  Droplet,
  Flame,
  Plus,
  Trash2,
  Percent,
  TrendingUp,
  Coins,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { BillItem, Roommate } from '../types';

interface SplitBillScreenProps {
  unpaidBills: BillItem[];
  roommates: Roommate[];
  currentUserName: string;
  defaultCategory?: string;
  onBack: () => void;
  onInitiateSuccess: (sum: number, perPerson: number, selectedBillIds: string[], selectedRoommateNames: string[], customBills?: BillItem[]) => void;
}

export default function SplitBillScreen({
  unpaidBills,
  roommates,
  currentUserName,
  defaultCategory,
  onBack,
  onInitiateSuccess
}: SplitBillScreenProps) {
  // Bills to split — filter by defaultCategory if provided
  const filteredBills = defaultCategory ? unpaidBills.filter(b => b.category === defaultCategory) : unpaidBills;
  const [bills, setBills] = useState<BillItem[]>([...filteredBills]);

  // Selected bills states
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>(filteredBills.map(b => b.id));
  
  // Selected roommates state
  const [selectedRoommates, setSelectedRoommates] = useState<string[]>(roommates.map(r => r.name));

  // Switch tabs
  const [splitMethod, setSplitMethod] = useState<'even' | 'ratio'>('even');

  // Interactive custom bill creation form
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customCategory, setCustomCategory] = useState<'电费' | '水费' | '空调'>('空调');

  // Custom roommate ratio allocation weights
  const [roommatePercentages, setRoommatePercentages] = useState<{[key: string]: number}>(
    roommates.reduce((acc, curr) => ({ ...acc, [curr.name]: Math.floor(100 / roommates.length) }), {})
  );

  // Redraw roommate share percentage handler
  const handleRatioChange = (name: string, val: string) => {
    const rawVal = parseInt(val) || 0;
    setRoommatePercentages(prev => ({
      ...prev,
      [name]: Math.min(100, Math.max(0, rawVal))
    }));
  };

  // Sum up percentages
  const ratioSum = selectedRoommates.reduce((acc, name) => acc + (roommatePercentages[name] || 0), 0);

  // Calculate sum of selected bills
  const billSum = bills
    .filter(b => selectedBillIds.includes(b.id))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // People count
  const peopleCount = selectedRoommates.length;

  // Split calculations
  const perPersonAmountEven = peopleCount > 0 ? (billSum / peopleCount) : 0;

  const handleToggleBill = (id: string) => {
    if (selectedBillIds.includes(id)) {
      setSelectedBillIds(selectedBillIds.filter(bId => bId !== id));
    } else {
      setSelectedBillIds([...selectedBillIds, id]);
    }
  };

  const handleToggleRoommate = (name: string) => {
    // If we're toggling we must ensure the initiator remains bound to pay
    if (name === currentUserName) return;

    if (selectedRoommates.includes(name)) {
      setSelectedRoommates(selectedRoommates.filter(rName => rName !== name));
    } else {
      setSelectedRoommates([...selectedRoommates, name]);
    }
  };

  // Add custom bill validator
  const handleAddCustomBill = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(customAmount);
    if (!customTitle.trim()) {
      toast.error('请先输入垫付款项目名称！');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      toast.error('请输入合规的代付款金额！');
      return;
    }

    const newBill: BillItem = {
      id: `custom-${Date.now()}`,
      category: customCategory,
      title: customTitle.trim(),
      amount: amt,
      time: '刚刚自购录入',
      status: '待分摊',
      month: '本月'
    };

    setBills([newBill, ...bills]);
    setSelectedBillIds([newBill.id, ...selectedBillIds]);
    
    // reset
    setCustomTitle('');
    setCustomAmount('');
    setShowAddForm(false);
  };

  const handleDeleteBill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBills(bills.filter(b => b.id !== id));
    setSelectedBillIds(selectedBillIds.filter(bId => bId !== id));
  };

  // Submit trigger handler
  const handleConfirmSplit = () => {
    if (selectedBillIds.length === 0) {
      toast.error('请至少勾选一个想要分摊的账单项目！');
      return;
    }
    if (selectedRoommates.length === 0) {
      toast.error('请至少选择 1 位参与代扣分摊的学生！');
      return;
    }

    if (splitMethod === 'ratio' && ratioSum !== 100) {
      toast.error(`自定义分摊比重当前之和为 ${ratioSum}%！比例总和必须严格等于 100%`);
      return;
    }

    if (splitMethod === 'ratio') {
      // Simulate successful ratio dispatching
      const shareBreakdown = selectedRoommates.map(n => `${n} 分担 ¥ ${(billSum * (roommatePercentages[n] || 0) / 100).toFixed(2)}`).join('\n');
      toast.success(`自定义比例分摊通知已发送！\n${shareBreakdown}`);
      const customSplitBills = bills.filter(b => b.id.startsWith('custom-') && selectedBillIds.includes(b.id));
      onInitiateSuccess(billSum, billSum * (roommatePercentages[currentUserName] || 0) / 100, selectedBillIds, selectedRoommates, customSplitBills);
    } else {
      const customSplitBills = bills.filter(b => b.id.startsWith('custom-') && selectedBillIds.includes(b.id));
      onInitiateSuccess(billSum, perPersonAmountEven, selectedBillIds, selectedRoommates, customSplitBills);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-1">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-slate-200 dark:border-gray-600"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-gray-100" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base text-slate-900 dark:text-gray-100">{defaultCategory ? defaultCategory+'分摊' : '多人分摊'}</span>
        </div>
        <div className="w-9 h-9"></div>
      </div>

      {/* Hero Display Board (Dynamic Blue-Orange gradient theme) */}
      <div className="bg-gradient-to-r from-primary to-orange-500 dark:from-blue-800 dark:to-orange-700 rounded-[24px] p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-4 translate-x-2 pointer-events-none">
          <Coins className="w-40 h-40 text-white" />
        </div>
        
        <p className="text-[11px] text-white/85 font-mono uppercase tracking-wider">学生端网格均帐助手 — 直连后勤代缴系统</p>
        <div className="mt-2.5 flex items-baseline gap-1">
          <span className="text-sm font-semibold">待平摊金额 ¥</span>
          <h2 className="text-3xl font-extrabold tracking-tight">{billSum.toFixed(2)}</h2>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs bg-white/95 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-200 fill-current" />
            <span>免签授权，宿舍一卡通自动极速转账</span>
          </div>
          <span className="font-bold text-orange-200">免密安全</span>
        </div>
      </div>

      {/* Utility Bills Segment with manual adding capability */}
      <section className="space-y-2.5">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-xs text-slate-700 dark:text-gray-200 uppercase tracking-wider">1. 选择并勾选待分摊公用账单</h3>
          
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-3 py-1 bg-primary dark:bg-blue-600 text-white text-[10px] font-extrabold rounded-full shadow-sm hover:bg-orange-500 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            添加公共自购
          </button>
        </div>

        {/* Quick Custom Expense Adder form */}
        {showAddForm && (
          <form 
            onSubmit={handleAddCustomBill}
            className="bg-slate-100 dark:bg-gray-800 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-inner flex flex-col gap-3 animate-in slide-in-from-top-3 duration-200"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-gray-200 block border-b pb-1.5 border-slate-200 dark:border-gray-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-orange-500 animate-pulse" />
              登记宿舍垫付款项目 (如桶装水、水果、洁厕灵)
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <input 
                  type="text" 
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-primary"
                  placeholder="项目描述 (例如: 购买阳台挂锁与洗洁精)"
                  required
                />
              </div>

              <div>
                <input 
                  type="number" 
                  step="0.01"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-primary font-bold text-slate-900 dark:text-gray-100"
                  placeholder="代付金额 (¥)"
                  required
                />
              </div>

              <div>
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value as any)}
                  className="w-full bg-white dark:bg-gray-900 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-gray-700 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="空调">其他宿舍杂费</option>
                  <option value="电费">临时公共用电</option>
                  <option value="水费">桶装水/水费</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 text-slate-600 dark:text-gray-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                取消
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                录入账本
              </button>
            </div>
          </form>
        )}

        {/* Existing Bills Check-list */}
        <div className="space-y-2">
          {bills.map((bill) => {
            const isChecked = selectedBillIds.includes(bill.id);
            const isCustom = bill.id.startsWith('custom-');

            return (
              <div 
                key={bill.id}
                onClick={() => handleToggleBill(bill.id)}
                className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all bg-white dark:bg-gray-800 border ${
                  isChecked
                    ? 'border-primary ring-2 ring-primary/5 bg-slate-50/50 dark:bg-gray-700/50'
                    : 'border-slate-150 dark:border-gray-600 opacity-75 hover:opacity-90 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                    isChecked ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200' : 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400'
                  }`}>
                    {bill.category === '电费' && <Zap className="w-5 h-5 text-amber-500 fill-current" />}
                    {bill.category === '水费' && <Droplet className="w-5 h-5 text-blue-500 fill-current" />}
                    {bill.category === '空调' && <Flame className="w-5 h-5 text-orange-500" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-850 dark:text-gray-100 flex items-center gap-1">
                      {bill.title}
                      {isCustom && <span className="text-[8px] bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-extrabold px-1.5 py-0.5 rounded">自购</span>}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500 block mt-0.5">{bill.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold ${isChecked ? 'text-primary' : 'text-slate-400 dark:text-gray-500'}`}>
                    ¥ {bill.amount.toFixed(2)}
                  </span>
                  
                  {isCustom ? (
                    <button 
                      onClick={(e) => handleDeleteBill(bill.id, e)}
                      className="w-7 h-7 bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-650 rounded-lg flex items-center justify-center"
                      title="废除项目"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      isChecked ? 'bg-primary dark:bg-blue-600 border-primary dark:border-blue-600 text-white' : 'border-blue-200 dark:border-gray-500 bg-white dark:bg-transparent'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Split Allocation Mode Tabs */}
      <section className="bg-slate-100 dark:bg-gray-800 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-gray-700">
        <button 
          onClick={() => setSplitMethod('even')}
          className={`flex-1 py-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
            splitMethod === 'even'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          按选择人数平均分（AA）
        </button>
        <button 
          onClick={() => setSplitMethod('ratio')}
          className={`flex-1 py-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            splitMethod === 'ratio'
              ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          按自定义比例（比重等值）
        </button>
      </section>

      {/* Roommates Checkbox Cards List */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-150 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-extrabold text-xs text-slate-700 dark:text-gray-200 uppercase">2. 设定参与分班及比重分摊</h3>
          <span className="text-[10px] font-bold text-primary dark:text-blue-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">
            已加入 {peopleCount} 人
          </span>
        </div>

        <div className="space-y-2">
          {roommates.map((rm) => {
            const isChecked = selectedRoommates.includes(rm.name);
            const isSelf = rm.name === currentUserName;
            const individualWeight = roommatePercentages[rm.name] || 0;
            // calculated share
            const shareResult = splitMethod === 'ratio' 
              ? (billSum * individualWeight / 100)
              : (isChecked ? perPersonAmountEven : 0);

            return (
              <div 
                key={rm.id}
                onClick={() => handleToggleRoommate(rm.name)}
                className={`p-3 rounded-xl flex items-center justify-between transition-colors border ${
                  isChecked
                    ? 'border-slate-200 dark:border-gray-600 bg-slate-50/20 dark:bg-gray-700/30'
                    : 'border-transparent opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-400 text-white flex items-center justify-center text-[10px] font-bold">
                    {rm.name[0]}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 dark:text-gray-100">
                      {rm.name} {isSelf && '(我)'}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500 block mt-0.5">
                      待转账: <strong className="text-slate-700 dark:text-gray-200">¥ {shareResult.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                {/* Sub Ratio input or Simple Checkbox */}
                <div className="flex items-center gap-2.5">
                  {splitMethod === 'ratio' && isChecked && (
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-slate-250 dark:border-gray-600 p-1 rounded-lg">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={individualWeight}
                        onChange={(e) => handleRatioChange(rm.name, e.target.value)}
                        onClick={(e) => e.stopPropagation()} // stop toggle bubble
                        className="w-11 text-center font-bold text-xs text-orange-600 dark:text-orange-300 outline-none bg-transparent"
                      />
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 font-bold pr-1">%</span>
                    </div>
                  )}

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isSelf
                      ? 'bg-primary dark:bg-blue-600 border-primary dark:border-blue-600 text-white cursor-not-allowed opacity-80'
                      : isChecked
                        ? 'bg-slate-800 dark:bg-gray-600 border-slate-800 dark:border-gray-600 text-white'
                        : 'border-blue-200 dark:border-gray-500'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Weight Total Indicator */}
        {splitMethod === 'ratio' && (
          <div className="mt-4 pt-3 border-t border-dashed flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1">
              <AlertCircle className={`w-4 h-4 ${ratioSum === 100 ? 'text-emerald-600' : 'text-orange-500 animate-bounce'}`} />
              <span className="text-slate-500 dark:text-gray-400">
                加总份额比重：<strong className="text-xs text-slate-800 dark:text-gray-100">{ratioSum}%</strong>
              </span>
            </div>
            <span className={`font-bold ${ratioSum === 100 ? 'text-emerald-700' : 'text-orange-600'}`}>
              {ratioSum === 100 ? '● 配比符合 100%' : '● 总额需严格等于 100%'}
            </span>
          </div>
        )}
      </section>

      {/* Confirmation and Call-To-Action zone */}
      <section className="pt-2">
        <button 
          onClick={handleConfirmSplit}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-700 dark:to-red-800 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all text-white font-extrabold text-sm rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-orange-950"
        >
          <Send className="w-4 h-4" />
          立即向宿舍广播 并发起一卡通托管极速扣款
        </button>
      </section>

    </div>
  );
}

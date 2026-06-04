/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Zap, CheckCircle2, XCircle, Clock, Send, Calendar, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { PowerGuaranteeRecord } from '../types';

interface PowerGuaranteeScreenProps {
  guaranteeHistory: PowerGuaranteeRecord[];
  onBack: () => void;
  onSubmitGuarantee: (title: string, start: string, end: string) => void;
}

export default function PowerGuaranteeScreen({
  guaranteeHistory,
  onBack,
  onSubmitGuarantee
}: PowerGuaranteeScreenProps) {
  const [startTime, setStartTime] = useState('23:00');
  const [endTime, setEndTime] = useState('07:00');
  const [appliedToday, setAppliedToday] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitGuarantee('夜间断电保电申请', startTime, endTime);
    setAppliedToday(true);
    toast.success('申请已提交，后勤值班老师将在系统内完成确认。');
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors cursor-pointer border border-border bg-card"
        >
          <ArrowLeft className="w-5 h-5 text-on-surface" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-primary">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-lg text-primary">寝室夜间不断电申请</span>
        </div>
        <div className="w-10 h-10"></div>
      </div>

      {/* Current Status Core Card */}
      <section className="workbench-card p-6 text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center text-primary border border-primary-fixed-dim/60">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium mb-1">当前宿舍保电状态</p>
            <h2 className={`text-2xl font-bold ${appliedToday ? 'text-green-600' : 'text-primary'}`}>
              {appliedToday ? '已提交 (待值班确认)' : '未申请 / 常规断电模式'}
            </h2>
          </div>
        </div>
      </section>

      {/* Main Form selection */}
      <section className="workbench-card p-5">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Clock className="w-5 h-5" />
          <h3 className="font-bold text-sm">设置夜间保电时段</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">开始时间</label>
            <div className="relative">
              <select 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#f1f3ff] dark:bg-gray-800 border-none text-sm p-3.5 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer dark:text-gray-100"
              >
                <option value="22:30">22:30 (下自习时段)</option>
                <option value="23:00">23:00 (常规熄灯关灯时段)</option>
                <option value="23:30">23:30 (深夜通宵时段)</option>
                <option value="00:00">00:00 (次日凌晨时段)</option>
              </select>
              <ChevronDown className="absolute right-4 top-4 text-outline pointer-events-none w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">结束时间</label>
            <div className="relative">
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#f1f3ff] dark:bg-gray-800 border-none text-sm p-3.5 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer dark:text-gray-100"
              >
                <option value="06:00">06:00 (次日清晨)</option>
                <option value="07:00">07:00 (次日洗漱醒来)</option>
                <option value="08:00">08:00 (次日上课时间)</option>
              </select>
              <ChevronDown className="absolute right-4 top-4 text-outline pointer-events-none w-4 h-4" />
            </div>
          </div>

          {appliedToday ? (
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl border border-green-200 dark:border-green-800/40 text-center text-xs text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4.5 h-4.5" /> 申请已提交，请等待后勤值班确认。
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 workbench-primary-action font-bold text-base rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              提交今日保电申请
            </button>
          )}

          <p className="text-[10px] text-outline text-center">
            提示：提交后由后勤值班人员确认，请按宿舍安全用电规范使用。
          </p>
        </form>
      </section>

      {/* History log block */}
      <section className="space-y-3">
        <div className="flex items-center gap-1.5 text-on-surface-variant px-1.5">
          <Calendar className="w-4 h-4 text-outline" />
          <h3 className="font-bold text-sm">申请历史记录</h3>
        </div>

        <div className="space-y-2.5">
          {guaranteeHistory.map((rec) => (
            <div key={rec.id} className="workbench-card p-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                  rec.status === '已批准'
                    ? 'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-300 border-green-100 dark:border-green-800/40'
                    : rec.status === '已拒绝'
                      ? 'bg-red-50 dark:bg-red-900/40 text-error dark:text-red-300 border-red-100 dark:border-red-800/40'
                      : 'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 border-amber-100 dark:border-amber-800/40'
                }`}>
                  {rec.status === '已批准' && <CheckCircle2 className="w-4.5 h-4.5" />}
                  {rec.status === '已拒绝' && <XCircle className="w-4.5 h-4.5" />}
                  {rec.status === '审批中' && <Clock className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-on-surface">{rec.title}</h4>
                  <p className="text-[10px] text-outline mt-0.5">{rec.date} ({rec.timeSlot})</p>
                </div>
              </div>
              
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                rec.status === '已批准'
                  ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/40'
                  : rec.status === '已拒绝'
                    ? 'bg-red-50 dark:bg-red-900/40 text-error dark:text-red-300 border-red-200 dark:border-red-800/40'
                    : 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40 animate-pulse'
              }`}>
                {rec.status}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

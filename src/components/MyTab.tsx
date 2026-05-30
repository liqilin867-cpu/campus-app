/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { User, Settings, Check, HelpCircle, ChevronRight, CreditCard, LogOut, BellRing, Leaf, AlertCircle, FileText, Info, Award, Smartphone, Home, Droplet, Bolt, Moon, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Roommate } from '../types';

interface MyTabProps {
  currentRoom: string;
  currentUserName: string;
  studentId: string;
  roommates: Roommate[];
  cardBalance: number;
  waterBalance: number;
  onLogout: () => void;
  onNavigateToPowerGuarantee: () => void;
  onQuickRecharge: (type: '电费' | '水费' | '网费' | '校园卡') => void;
}

export default function MyTab({
  currentRoom,
  currentUserName,
  studentId,
  roommates,
  cardBalance,
  waterBalance,
  onLogout,
  onNavigateToPowerGuarantee,
  onQuickRecharge
}: MyTabProps) {
  const { theme, setTheme } = useTheme();
  const [activeModal, setActiveModal] = useState<null | 'ranking' | 'about' | 'feedback' | 'simpleSetup' | 'paymentSecurity' | 'outageSettings' | 'editProfile' | 'changePassword'>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Sync profile name with logged-in user
  useEffect(() => {
    setStudentName(currentUserName);
    setInputName(currentUserName);
  }, [currentUserName]);

  // Local SVG avatar generator (no external network requests)
  const COLORS = ['#6366f1','#ec4899','#f59e0b','#06b6d4','#10b981','#f43f5e'];
  const genSvg = (color: string, letter: string) =>
    `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${color}"/><text x="50" y="50" dominant-baseline="central" text-anchor="middle" fill="white" font-size="40" font-weight="700" font-family="sans-serif">${letter}</text></svg>`)}`;

  // Customizable Student Profile States
  const [studentName, setStudentName] = useState(currentUserName);
  const [studentAvatar, setStudentAvatar] = useState(genSvg(COLORS[0], '我'));
  const [inputName, setInputName] = useState(currentUserName);
  const [inputAvatar, setInputAvatar] = useState(genSvg(COLORS[0], '我'));

  // Pre-configured elegant student portal avatars (local SVG, no external loading)
  const PRESET_AVATARS = [
    { name: '智慧校草 (男)', url: genSvg(COLORS[0], '智') },
    { name: '学术学霸 (女)', url: genSvg(COLORS[1], '学') },
    { name: '科技达人 (男)', url: genSvg(COLORS[2], '科') },
    { name: '治愈甜心 (女)', url: genSvg(COLORS[3], '甜') },
    { name: '可爱萌宠 (喵)', url: genSvg(COLORS[4], '萌') },
    { name: '阳光活力 (操场)', url: genSvg(COLORS[5], '阳') },
  ];

  // 1. Payment Security Settings States
  const [payMethod, setPayMethod] = useState('Agricultural'); // Agricultural, WeChat, Alipay
  const [noPasswordLimit, setNoPasswordLimit] = useState('50'); // 20, 50, 100, none
  const [quickBiometrics, setQuickBiometrics] = useState(true);

  // 2. Outage Warning States
  const [outageThreshold, setOutageThreshold] = useState('10'); // 5, 10, 15, 20
  const [notifySms, setNotifySms] = useState(true);
  const [notifyWechat, setNotifyWechat] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [backupPhone, setBackupPhone] = useState('18852024123');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error('请先填写您的有价值反馈！');
      return;
    }
    toast.success('感谢您的反馈！产品团队将不断改进体验！');
    setFeedbackText('');
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Profile Header Block */}
      <section 
        onClick={() => {
          setInputName(studentName);
          setInputAvatar(studentAvatar);
          setActiveModal('editProfile');
        }}
        className="flex items-center justify-between px-1 bg-white/50 border border-slate-100 dark:border-gray-700/50 p-3 rounded-[24px] cursor-pointer group hover:bg-white dark:bg-gray-900 hover:shadow-xs transition-all duration-250 active:scale-[0.99]"
        title="点击修改姓名与学生照片"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-[72px] h-[72px] rounded-full neumorphic-convex p-1 bg-[#faf9ff] dark:bg-[#16162a] ring-2 ring-primary/20 group-hover:ring-orange-500/50 transition-all">
              <img 
                alt={`${studentName}头像`} 
                className="w-full h-full rounded-full object-cover border border-white/50" 
                src={studentAvatar} 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-secondary rounded-full border-2 border-[#faf9ff] flex items-center justify-center shadow-sm">
              <Check className="w-3 h-3 text-white stroke-[3.5]" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-xl text-primary tracking-tight transition-colors group-hover:text-secondary">
                {studentName}
              </h2>
              <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">编辑</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant font-semibold text-[10px] rounded-base border border-blue-200">
                学号: {studentId}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveModal('simpleSetup');
          }}
          className="w-10 h-10 rounded-full neumorphic-convex flex items-center justify-center text-primary transition-all hover:scale-105 active:scale-95 cursor-pointer bg-[#faf9ff] dark:bg-[#16162a]"
        >
          <Settings className="w-5 h-5" />
        </button>
      </section>

      {/* Dormitory Card (Smart Hub Style) */}
      <section className="glass-panel rounded-[24px] p-4 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none transition-colors duration-500"></div>
        <div className="flex items-start justify-between mb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Home className="w-[18px] h-[18px] text-primary" />
            </div>
            <h3 className="font-semibold text-base text-primary">{currentRoom}</h3>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-base border border-emerald-200 shadow-sm">
            文明宿舍
          </span>
        </div>
        
        <div className="relative z-10 pt-2 border-t border-primary/5">
          <p className="text-[10px] text-outline mb-2">宿舍成员</p>
          <div className="flex flex-wrap gap-2">
            {roommates.map((rm) => (
              <span 
                key={rm.id} 
                className={`px-3 py-1 text-xs rounded-full shadow-sm border ${
                  rm.name === currentUserName 
                    ? 'bg-primary/10 text-primary border-primary/20 font-semibold' 
                    : 'bg-surface-container text-on-surface-variant border-white/50'
                }`}
              >
                {rm.name === currentUserName ? `${currentUserName} (我)` : rm.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet Bento Grid */}
      <section>
        <h3 className="font-semibold text-base text-on-surface mb-3 px-1">我的钱包</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1 */}
          <div className="neumorphic-convex rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden bg-[#faf9ff] dark:bg-[#16162a]">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
              <CreditCard className="w-20 h-20 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mb-1 z-10">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>校园一卡通余额</span>
            </div>
            <div className="z-10">
              <span className="text-xs text-primary font-semibold">¥ </span>
              <span className="text-2xl font-bold text-primary">{cardBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="neumorphic-convex rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden bg-[#faf9ff] dark:bg-[#16162a]">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none text-secondary">
              <Droplet className="w-20 h-20 text-[#006474]" />
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mb-1 z-10">
              <Droplet className="w-4 h-4 text-[#006474] fill-current" />
              <span>水费预存款</span>
            </div>
            <div className="z-10">
              <span className="text-xs text-[#006474] font-semibold">¥ </span>
              <span className="text-2xl font-bold text-[#006474]">{waterBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Recharge triggers home recharge flow */}
          <button 
            onClick={() => onQuickRecharge('校园卡')}
            className="col-span-2 mt-1 h-12 rounded-full bg-gradient-to-r from-primary to-primary-container dark:from-blue-800 dark:to-blue-950 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-[0_4px_14px_0_rgba(0,6,102,0.3)] duration-200 hover:shadow-md cursor-pointer active:scale-95"
          >
            <Bolt className="w-5 h-5" />
            快速充值
          </button>
        </div>
      </section>

      {/* Settings Grid Panel */}
      <section className="neumorphic-convex rounded-2xl overflow-hidden bg-[#faf9ff] dark:bg-[#16162a]">
        <div className="flex flex-col">
          
          <button 
            onClick={() => setActiveModal('paymentSecurity')}
            className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700/50 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#dae2ff] dark:bg-[#1e2a4a] flex items-center justify-center text-primary">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <span className="font-semibold text-sm text-on-surface">缴费安全与自动充值</span>
            </div>
            <ChevronRight className="w-5 h-5 text-outline-variant" />
          </button>

          <button 
            onClick={() => setActiveModal('outageSettings')}
            className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700/50 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BellRing className="w-4.5 h-4.5" />
              </div>
              <span className="font-semibold text-sm text-on-surface">防断电提醒设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-outline-variant" />
          </button>


          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700/50 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-700">
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </div>
              <span className="font-semibold text-sm text-on-surface">{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
            </div>
            <div className={`w-9 h-5 rounded-full transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-slate-300'} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-[18px]' : 'translate-x-0.5'}`}></div>
            </div>
          </button>

          <button
            onClick={onNavigateToPowerGuarantee}
            className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700/50 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0071e6]">
                <Bolt className="w-[18px] h-[18px]" />
              </div>
              <span className="font-semibold text-sm text-on-surface">夜间不断电/保电申请</span>
            </div>
            <ChevronRight className="w-5 h-5 text-outline-variant" />
          </button>

          <button 
            onClick={() => setActiveModal('ranking')}
            className="flex items-center justify-between p-4 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Leaf className="w-4.5 h-4.5" />
              </div>
              <span className="font-semibold text-sm text-on-surface">全校寝室节能大比拼</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">全校第15名</span>
              <ChevronRight className="w-5 h-5 text-outline-variant" />
            </div>
          </button>

        </div>
      </section>

      {/* System info & Help */}
      <section className="flex flex-col gap-2">
        <div className="neumorphic-convex rounded-2xl overflow-hidden bg-[#faf9ff] dark:bg-[#16162a] flex flex-col">
          <button 
            onClick={() => setActiveModal('feedback')}
            className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700/50 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="font-semibold text-sm text-on-surface">意见与功能建议反馈</span>
            <ChevronRight className="w-5 h-5 text-outline-variant" />
          </button>
          <button
            onClick={() => setActiveModal('changePassword')}
            className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-700/50 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="font-semibold text-sm text-on-surface">修改登录密码</span>
            <ChevronRight className="w-5 h-5 text-outline-variant" />
          </button>
          <button
            onClick={() => setActiveModal('about')}
            className="flex items-center justify-between p-4 hover:bg-surface-container/30 active:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="font-semibold text-sm text-on-surface">关于校园生活助手 App</span>
            <span className="text-xs text-outline flex items-center gap-1">
              v2.4.1
              <ChevronRight className="w-5 h-5 text-outline-variant" />
            </span>
          </button>
        </div>

        <button
          onClick={() => { if (window.confirm('确认重置所有数据？这将清除所有账单和记录，演示账号将恢复初始状态。')) { localStorage.removeItem('campus_data'); window.location.reload(); } }}
          className="w-full py-3 rounded-2xl text-xs text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          重置所有数据
        </button>
        <button 
          onClick={onLogout}
          className="mt-3 w-full p-4 neumorphic-convex rounded-2xl font-bold text-base text-error bg-[#faf9ff] dark:bg-[#16162a] hover:text-red-800 transition-colors flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          安全退出登录账号
        </button>
      </section>


      {/* -------------------- RANKING MODAL -------------------- */}
      <Dialog open={activeModal === 'ranking'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-bold text-lg text-emerald-800 flex items-center gap-1.5">
            <Award className="w-5 h-5" /> 绿色校园：节能先锋寝室
          </DialogTitle>

          <div className="text-center bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
            <p className="text-xs text-emerald-800 mb-1">本月 3号楼520室 用电用水指标</p>
            <h3 className="text-3xl font-bold text-emerald-700 tracking-tight">全校前 4.2%</h3>
            <p className="text-[10px] text-on-surface-variant mt-1.5">已节约碳排放 16.5 kg，获得学校"白金环保寝室"奖章！ 🍃</p>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span>🏆 1. 1号楼202室 (白金)</span>
              <span className="font-bold text-emerald-700">100% 节能率</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span>🥈 2. 7号楼104室 (白金)</span>
              <span className="font-bold text-emerald-700">98% 节能率</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span>🥉 3. 3号楼520室 (我们, 全校第15)</span>
              <span className="font-bold text-emerald-700">96.3% 节能率</span>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            继续保持环保
          </button>
        </DialogContent>
      </Dialog>

      {/* -------------------- ABOUT MODAL -------------------- */}
      <Dialog open={activeModal === 'about'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-bold text-lg text-primary flex items-center gap-1.5">
            <Info className="w-5 h-5" /> 关于校园生活助手
          </DialogTitle>

          <div className="space-y-3 text-xs leading-relaxed text-on-surface-variant">
            <p><strong>版本</strong>：Version 2.4.1 (Stable Build)</p>
            <p>「校园生活助手」是专门为高校学子打造的一站式校园事务缴费、多人水电度数平摊以及便捷生活工具微服务平台。</p>
            <p>目前已接入由校内后勤、一卡通中心、食堂结算以及青年创客中心提供的多项官方API，力保学生数据的高度安全与高实效交付。</p>
            <p className="border-t pt-2 text-[10px] text-outline">项目归属于高校后勤信息化建设部门。如有Bug、故障等问题，请点击"功能建议反馈"联系我们，我们将24小时内为您修正体验优点！</p>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            我知道了
          </button>
        </DialogContent>
      </Dialog>

      {/* -------------------- CHANGE PASSWORD MODAL -------------------- */}
      {activeModal === 'changePassword' && (
        <ChangePasswordModal onClose={() => setActiveModal(null)} currentUserName={currentUserName} />
      )}

      {/* -------------------- FEEDBACK MODAL -------------------- */}
      <Dialog open={activeModal === 'feedback'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-bold text-lg text-primary flex items-center gap-1.5">
            <FileText className="w-5 h-5" /> 意见与功能建议反馈
          </DialogTitle>

          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full h-32 bg-surface-container border-none text-xs p-3.5 rounded-2xl focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed"
              placeholder="请倾诉并写下您发现的系统交互缺陷，或您希望添加的炫酷校内新服务（例如：宿舍热水表远程锁扣，订自习座等）..."
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              递交反馈给我们
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------- SIMPLE SETUP DIALOG -------------------- */}
      <Dialog open={activeModal === 'simpleSetup'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-bold text-lg text-primary flex items-center gap-1.5">
            <Settings className="w-5 h-5" /> 设备全局偏好设置
          </DialogTitle>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b">
              <span>推送允许 (Push Notifications)</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600 rounded focus:ring-blue-400 border-blue-300 cursor-pointer" />
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span>扣款自动免密授信交易限制</span>
              <span className="font-semibold text-primary">¥ 50以内</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span>网络硬件断链重拨极速策略</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600 rounded focus:ring-blue-400 border-blue-300 cursor-pointer" />
            </div>
            <p className="text-[10px] text-outline">这些硬件高级选项将同步于您的寝室智能电盘网盘盒设备中生效。</p>
          </div>
          <button
            onClick={() => {
              toast.success('策略配置保存成功！已同步至寝室路由器设置中。');
              setActiveModal(null);
            }}
            className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            保存并退回
          </button>
        </DialogContent>
      </Dialog>

      {/* -------------------- 1. PAYMENT SECURITY & AUTO RECHARGE MODAL -------------------- */}
      <Dialog open={activeModal === 'paymentSecurity'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-bold text-lg text-primary flex items-center gap-1.5">
            <CreditCard className="w-5 h-5 text-primary" /> 缴费安全与第三方代扣
          </DialogTitle>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] text-outline font-semibold mb-1.5">扣款绑定主渠道</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { key: 'Agricultural', label: '农业银行储蓄卡 (尾号 4045)' },
                  { key: 'WeChat', label: '微信支付 (自动调用零钱通)' },
                  { key: 'Alipay', label: '支付宝 (自动调用余额宝)' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPayMethod(item.key)}
                    className={`flex justify-between items-center px-4 py-2.5 rounded-xl border-2 text-left transition-all ${
                      payMethod === item.key
                        ? 'border-primary bg-primary/5 font-semibold text-primary'
                        : 'border-slate-100 dark:border-gray-600 hover:border-slate-200 dark:hover:border-gray-500 text-on-surface-variant'
                    }`}
                  >
                    <span>{item.label}</span>
                    {payMethod === item.key && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1.5">
              <label className="block text-[11px] text-outline font-semibold mb-1.5">单次水电免密代扣额度限制</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: '20', label: '¥20' },
                  { val: '50', label: '¥50' },
                  { val: '100', label: '¥100' },
                  { val: 'none', label: '无限' },
                ].map(lim => (
                  <button
                    key={lim.val}
                    type="button"
                    onClick={() => setNoPasswordLimit(lim.val)}
                    className={`py-2 rounded-xl border text-center font-bold text-[11px] ${
                      noPasswordLimit === lim.val
                        ? 'bg-primary dark:bg-blue-700 text-white border-primary dark:border-blue-700 shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-outline dark:text-gray-300 border-slate-200 dark:border-gray-600'
                    }`}
                  >
                    {lim.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 bg-slate-50 dark:bg-gray-800/50 px-3 rounded-xl">
              <div>
                <span className="font-bold">指纹 / 面容 FaceID 闪付保驾</span>
                <p className="text-[9px] text-outline mt-0.5">大额充缴一键验证防误触</p>
              </div>
              <input
                type="checkbox"
                checked={quickBiometrics}
                onChange={(e) => setQuickBiometrics(e.target.checked)}
                className="h-4.5 w-4.5 accent-blue-600 rounded focus:ring-blue-400 border-blue-300 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => {
              toast.success('缴费安全与自动扣划新策略已保存并全面生效！');
              setActiveModal(null);
            }}
            className="w-full mt-2 py-3 bg-gradient-to-r from-primary to-primary-container dark:from-blue-700 dark:to-blue-900 text-white font-bold rounded-full shadow-md active:scale-95 duration-150"
          >
            应用并保存修改
          </button>
        </DialogContent>
      </Dialog>

      {/* -------------------- 2. OUTAGE WARNINGS MODAL -------------------- */}
      <Dialog open={activeModal === 'outageSettings'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-bold text-lg text-[#006474] flex items-center gap-1.5">
            <BellRing className="w-5 h-5 text-[#006474]" /> 防断电强提醒预警设置
          </DialogTitle>
          <p className="text-[11px] text-outline">当宿舍（520寝室）发生用电用水余额告急时极速推送</p>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] text-outline font-semibold mb-1.5">电费透支强行断电警报阀值</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: '5', label: '≤ 5度' },
                  { val: '10', label: '≤ 10度' },
                  { val: '15', label: '≤ 15度' },
                  { val: '20', label: '≤ 20度' },
                ].map(lev => (
                  <button
                    key={lev.val}
                    type="button"
                    onClick={() => setOutageThreshold(lev.val)}
                    className={`py-2 rounded-xl border text-center font-bold text-[11px] ${
                      outageThreshold === lev.val
                        ? 'bg-[#006474] text-white border-[#006474] shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-outline dark:text-gray-300 border-slate-200 dark:border-gray-600'
                    }`}
                  >
                    {lev.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] text-outline font-semibold">消息接收通道配置</label>
              <div className="space-y-2 bg-slate-50 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-gray-700/50">
                <div className="flex justify-between items-center">
                  <span>短信提醒 (扣取 0.05元 / 条)</span>
                  <input type="checkbox" checked={notifySms} onChange={(e) => setNotifySms(e.target.checked)} className="h-4 w-4 accent-blue-600 rounded focus:ring-blue-400 border-blue-300 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center">
                  <span>微信服务号模板消息推送 (免费)</span>
                  <input type="checkbox" checked={notifyWechat} onChange={(e) => setNotifyWechat(e.target.checked)} className="h-4 w-4 accent-blue-600 rounded focus:ring-blue-400 border-blue-300 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center">
                  <span>校内App横幅呼吸浮层弱提醒 (免费)</span>
                  <input type="checkbox" checked={notifyInApp} onChange={(e) => setNotifyInApp(e.target.checked)} className="h-4 w-4 accent-blue-600 rounded focus:ring-blue-400 border-blue-300 cursor-pointer" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-outline font-semibold mb-1.5">备用接收紧急联系手机号</label>
              <input type="tel" value={backupPhone} onChange={(e) => setBackupPhone(e.target.value)} className="w-full bg-slate-100 dark:bg-gray-800 border-none p-3 text-xs font-semibold rounded-xl text-on-surface dark:text-gray-100 focus:ring-2 focus:ring-[#006474] outline-none" placeholder="请输入手机号" />
            </div>
          </div>

          <button
            onClick={() => {
              toast.success(`防断电提醒设置已保存！已绑定备用紧急短信通道：${backupPhone}`);
              setActiveModal(null);
            }}
            className="w-full mt-2 py-3 bg-gradient-to-r from-[#006474] to-teal-500 text-white font-bold rounded-full shadow-md active:scale-95 duration-150"
          >
            开启防断电保驾护航
          </button>
        </DialogContent>
      </Dialog>

      {/* -------------------- PROFILE EDIT MODAL -------------------- */}
      <Dialog open={activeModal === 'editProfile'} onOpenChange={(o) => { if (!o) setActiveModal(null); }}>
        <DialogContent>
          <DialogTitle className="font-extrabold text-base text-slate-900">修改个人信息</DialogTitle>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">点击下方精选校园照片，或手动输入照片网址</p>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">学籍登记姓名</label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 p-3 text-xs font-bold rounded-xl text-slate-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:bg-gray-900 transition-all"
                placeholder="请输入您的姓名"
                maxLength={12}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">选择精选照片/头像</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.map((avatar, idx) => {
                  const isSelected = inputAvatar === avatar.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setInputAvatar(avatar.url)}
                      className={`p-1 rounded-xl bg-slate-50 border transition-all flex flex-col items-center gap-1.5 cursor-pointer hover:bg-orange-50/50 ${
                        isSelected ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/20' : 'border-slate-200'
                      }`}
                    >
                      <img src={avatar.url} alt={avatar.name} className="w-11 h-11 rounded-full object-cover border border-white" referrerPolicy="no-referrer" />
                      <span className="text-[9px] font-medium text-slate-600 truncate max-w-full">{avatar.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase">粘贴自定义照片链接 (URL)</label>
              <input
                type="text"
                value={inputAvatar}
                onChange={(e) => setInputAvatar(e.target.value)}
                className="w-full bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 p-2.5 text-[10px] font-mono rounded-xl text-slate-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-primary focus:bg-white dark:bg-gray-900 transition-all"
                placeholder="网址以 http / https 开头"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!inputName.trim()) { toast.error('请输入合规的学籍姓名'); return; }
                setStudentName(inputName.trim());
                setStudentAvatar(inputAvatar);
                toast.success('个人姓名及照片已成功更改！');
                setActiveModal(null);
              }}
              className="w-full py-3 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/95 text-white font-bold text-xs rounded-full flex items-center justify-center gap-1 shadow-md active:scale-[0.98] transition-all cursor-pointer mt-1"
            >
              保存并同步修改
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ---------- Change Password Modal ---------- */
function ChangePasswordModal({ onClose, currentUserName }: { onClose: () => void; currentUserName: string }) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (!oldPw || !newPw || !confirmPw) { setMsg('请填写所有字段'); return; }
    if (newPw.length < 6) { setMsg('新密码不能少于6位'); return; }
    if (newPw !== confirmPw) { setMsg('两次密码不一致'); return; }
    try {
      const saved = JSON.parse(localStorage.getItem('campus_data') || '{}');
      const users = saved.registeredUsers || [];
      const user = users.find((u: any) => u.name === currentUserName);
      if (!user) { setMsg('未找到用户信息'); return; }
      if (user.password !== oldPw) { setMsg('旧密码不正确'); return; }
      user.password = newPw;
      saved.registeredUsers = users;
      localStorage.setItem('campus_data', JSON.stringify(saved));
      toast.success('密码修改成功！');
      onClose();
    } catch { setMsg('修改失败，请重试'); }
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent>
        <DialogTitle className="font-bold text-base text-slate-900">修改密码</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)}
            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-blue-500"
            placeholder="当前密码" />
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-blue-500"
            placeholder="新密码（至少6位）" />
          <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
            className="w-full border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-blue-500"
            placeholder="确认新密码" />
          {msg && <p className="text-xs text-red-500">{msg}</p>}
          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-md active:scale-95 transition-all cursor-pointer text-xs">
            确认修改
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

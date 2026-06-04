/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {toast} from 'sonner';
import {
  User,
  Lock,
  ArrowRight,
  MessageSquare,
  CreditCard,
  ShieldCheck,
  KeyRound,
  Smartphone,
  HelpCircle,
  UserPlus,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Sparkles,
  Home,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userName: string, studentId: string, room: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginTab, setLoginTab] = useState<'sso' | 'sms'>('sso');

  const [registeredUsers, setRegisteredUsers] = useState<Array<{
    name: string;
    studentId: string;
    phone: string;
    password: string;
    room: string;
  }>>([
    { name: '赵六', studentId: '20241234', phone: '13800000001', password: 'zhaoliu123', room: '3号楼520室' },
    { name: '张三', studentId: '20240001', phone: '13800000002', password: 'zhangsan123', room: '3号楼520室' },
    { name: '李四', studentId: '20240002', phone: '13800000003', password: 'lisi123', room: '3号楼520室' },
    { name: '王五', studentId: '20240003', phone: '13800000004', password: 'wangwu123', room: '3号楼520室' },
  ]);

  // Load registered users from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('campus_data') || '{}');
      if (saved.registeredUsers?.length >= 4) setRegisteredUsers(saved.registeredUsers);
    } catch {}
  }, []);

  // Save registered users to localStorage whenever they change
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('campus_data') || '{}');
      saved.registeredUsers = registeredUsers;
      localStorage.setItem('campus_data', JSON.stringify(saved));
    } catch {}
  }, [registeredUsers]);

  const [studentId, setStudentId] = useState('20241234');
  const [password, setPassword] = useState('zhaoliu123');
  const [phone, setPhone] = useState('13800000001');
  const [smsCode, setSmsCode] = useState('8888');
  const [smsSent, setSmsSent] = useState(false);

  const [regName, setRegName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRoom, setRegRoom] = useState('');
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [roomSearch, setRoomSearch] = useState('');

  const [agree, setAgree] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [numA, setNumA] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [numB, setNumB] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [captchaInput, setCaptchaInput] = useState('');
  const [oauthPlatform, setOauthPlatform] = useState<'wechat' | 'alipay' | null>(null);
  const [oauthStudentId, setOauthStudentId] = useState('');
  const [oauthPhone, setOauthPhone] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);

  const refreshCaptcha = () => {
    setNumA(Math.floor(Math.random() * 8) + 2);
    setNumB(Math.floor(Math.random() * 8) + 2);
    setCaptchaInput('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!agree) {
      setErrorMsg('请阅读并勾选《学生用户协议》和《安全隐私条款》');
      return;
    }

    const realSum = numA + numB;
    if (parseInt(captchaInput.trim()) !== realSum) {
      setErrorMsg(`安全验证错误：${numA} + ${numB} 等于多少？`);
      refreshCaptcha();
      return;
    }

    if (loginTab === 'sso') {
      if (!studentId.trim()) { setErrorMsg('请输入您的学号'); return; }
      if (!password.trim()) { setErrorMsg('请输入登录密码'); return; }

      const match = registeredUsers.find(
        (u) => u.studentId.trim() === studentId.trim() && u.password === password
      );
      if (match) {
        onLoginSuccess(match.name, match.studentId, match.room);
      } else {
        setErrorMsg('学号或密码不匹配，请重新输入或注册新账户！');
        refreshCaptcha();
      }
    } else {
      if (!phone.trim() || phone.length < 11) { setErrorMsg('请填写正确的11位手机号码'); return; }
      if (!smsCode.trim() || smsCode.length < 4) { setErrorMsg('请输入4位短信验证码'); return; }

      const match = registeredUsers.find((u) => u.phone.trim() === phone.trim());
      if (match) {
        onLoginSuccess(match.name, match.studentId, match.room);
      } else {
        onLoginSuccess('快捷用户', '00000000', '3号楼520室');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!agree) { setErrorMsg('请先同意服务协议'); return; }
    if (!regName.trim()) { setErrorMsg('请填写真实姓名'); return; }
    if (!/^\d{8}$/.test(regStudentId.trim())) { setErrorMsg('学号必须为8位数字'); return; }
    if (!regPhone.trim() || !/^1\d{10}$/.test(regPhone.trim())) { setErrorMsg('请填写正确的11位手机号码'); return; }
    if (!regRoom) { setErrorMsg('请选择宿舍楼栋'); return; }
    if (regPassword.length < 6) { setErrorMsg('密码长度不能少于6位'); return; }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(regPassword)) { setErrorMsg('密码须包含字母和数字'); return; }
    if (regPassword !== regConfirmPassword) { setErrorMsg('两次输入的密码不一致'); return; }

    // Check room capacity
    const roomOccupants = registeredUsers.filter(u => u.room === regRoom).length;
    if (roomOccupants >= 4) { setErrorMsg(`${regRoom} 已满员（4/4），请选择其他宿舍`); return; }

    const realSum = numA + numB;
    if (parseInt(captchaInput.trim()) !== realSum) { setErrorMsg('算术验证错误'); refreshCaptcha(); return; }

    if (registeredUsers.some((u) => u.studentId === regStudentId)) { setErrorMsg('该学号已被注册'); return; }

    const newUser = { name: regName.trim(), studentId: regStudentId.trim(), phone: regPhone.trim(), password: regPassword, room: regRoom };
    setRegisteredUsers([newUser, ...registeredUsers]);
    // Add new user to room members in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('campus_data') || '{}');
      const roomKey = `room_${newUser.room}`;
      if (!saved.rooms) saved.rooms = {};
      if (!saved.rooms[roomKey]) saved.rooms[roomKey] = {};
      if (!saved.rooms[roomKey].members) saved.rooms[roomKey].members = [];
      saved.rooms[roomKey].members.push(newUser.name);
      localStorage.setItem('campus_data', JSON.stringify(saved));
    } catch {}
    setStudentId(newUser.studentId);
    setPassword(newUser.password);
    setPhone(newUser.phone);
    setSuccessMsg(`新同学【${newUser.name}】注册成功！已登记在【${newUser.room}】`);
    setIsRegistering(false);
    setLoginTab('sso');
    refreshCaptcha();
  };

  const handleSendCode = () => {
    if (!phone.trim() || phone.length < 11) { setErrorMsg('请输入正确的手机号'); return; }
    setSmsSent(true);
    toast.success('【智慧校园】短信验证码已发送！本次验证码为：8888');
    setErrorMsg('');
  };

  const handleThirdPartyAction = (type: 'wechat' | 'alipay') => {
    if (!agree) { setErrorMsg('请先勾选同意协议'); return; }
    setErrorMsg('');
    setSuccessMsg('');
    setOauthPlatform(type);
    setOauthStudentId('');
    setOauthPhone('');
  };

  const handleOauthBind = () => {
    if (!oauthStudentId.trim()) { setErrorMsg('请输入学号'); return; }
    if (!oauthPhone.trim() || oauthPhone.length < 11) { setErrorMsg('请输入正确的11位手机号'); return; }
    const match = registeredUsers.find(u => u.studentId === oauthStudentId.trim());
    if (!match) {
      // Not registered → pre-fill registration form
      setRegStudentId(oauthStudentId.trim());
      setRegPhone(oauthPhone.trim());
      setOauthPlatform(null);
      setIsRegistering(true);
      setErrorMsg('');
      setSuccessMsg(`学号 ${oauthStudentId} 未注册，请完成注册后登录`);
      return;
    }
    if (match.phone !== oauthPhone.trim()) {
      setErrorMsg(`该学号绑定的手机号不匹配，请核对后重试`);
      return;
    }
    // Found match → show loading then log in
    setOauthLoading(true);
    setTimeout(() => {
      onLoginSuccess(match.name, match.studentId, match.room);
      setOauthPlatform(null);
      setOauthLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-animated text-slate-900 dark:text-slate-100">

      {/* Decorative Orbs */}
      
      

      {/* OAuth bind form — ask for student ID and phone */}
      {oauthPlatform && !oauthLoading && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="workbench-card w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                {oauthPlatform === 'wechat' ? <MessageSquare className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">绑定{oauthPlatform === 'wechat' ? '微信' : '支付宝'}</h3>
                <p className="text-[11px] text-slate-500 dark:text-gray-400">输入学号和手机号完成绑定</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase mb-1">学号</label>
                <input type="text" value={oauthStudentId} onChange={e => setOauthStudentId(e.target.value)}
                  className="w-full border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="请输入8位学号" />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase mb-1">绑定手机号</label>
                <input type="tel" value={oauthPhone} onChange={e => setOauthPhone(e.target.value)}
                  className="w-full border border-slate-200 dark:border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="注册时使用的11位手机号" />
              </div>
              <button onClick={handleOauthBind}
                className="w-full py-3 workbench-primary-action font-bold rounded-xl active:scale-95 transition-all cursor-pointer text-xs">
                绑定并登录
              </button>
              <button onClick={() => setOauthPlatform(null)}
                className="w-full text-center text-xs text-slate-400 dark:text-gray-500 hover:text-slate-600 cursor-pointer">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OAuth loading spinner */}
      {oauthLoading && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="workbench-card p-8 max-w-xs w-full text-center flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-50 animate-ping opacity-75"></div>
              <div className="w-16 h-16 rounded-xl bg-primary-fixed flex items-center justify-center text-primary relative z-10">
                <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {oauthPlatform === 'wechat' ? '微信授权中' : '支付宝授权中'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">正在验证身份信息...</p>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-sm relative z-10 my-auto">
        {/* Header Badge */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-full text-[10px] text-primary font-bold tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            统一身份认证门户
          </div>
        </div>

        {/* Login Card */}
        <div className="workbench-card p-6 flex flex-col items-center w-full relative overflow-visible">
          {/* Card top gradient line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl"></div>

          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-5 relative z-10">
            <div className="w-15 h-15 rounded-xl shadow-sm bg-primary flex items-center justify-center mb-3 transform hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-xl text-slate-900 font-extrabold tracking-tight">智慧校园生活助手</h1>
            <p className="text-[12px] text-slate-500 dark:text-gray-400 mt-1">电费 · 水费 · 网费 一键查缴</p>
          </div>

          {/* Tab Switch */}
          <div className="w-full mb-4">
            {!isRegistering ? (
              <div className="grid grid-cols-2 bg-muted p-1 rounded-xl w-full">
                <button
                  type="button"
                  onClick={() => { setLoginTab('sso'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginTab === 'sso'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  学号密码登录
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginTab('sms'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginTab === 'sms'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  短信验证码
                </button>
              </div>
            ) : (
              <div className="bg-primary-fixed text-primary px-4 py-2.5 rounded-xl text-center flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-extrabold text-blue-900">新同学自助注册</span>
              </div>
            )}
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-1.5 mb-3 w-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs px-3 py-2 rounded-xl mb-3 w-full text-center">
              {errorMsg}
            </div>
          )}

          {/* Register Form */}
          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="w-full space-y-2.5 relative z-10">

              <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                <User className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                  className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                  placeholder="真实姓名" required />
              </div>

              <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                <KeyRound className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                <input type="text" value={regStudentId} onChange={(e) => setRegStudentId(e.target.value)}
                  className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                  placeholder="8位学号" required />
              </div>

              <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                <Smartphone className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                  className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                  placeholder="11位手机号" required />
              </div>

              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400">选择宿舍</span>
                </div>
                <button type="button" onClick={() => { setRoomPickerOpen(!roomPickerOpen); setRoomSearch(''); }}
                  className="flex items-center gap-2 w-full bg-slate-50/60 rounded-xl px-3 py-2.5 border border-slate-100 text-xs text-slate-800 dark:text-gray-100 cursor-pointer text-left">
                  <Home className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                  <span className={`flex-1 ${regRoom ? 'text-slate-800 dark:text-gray-100' : 'text-slate-400 dark:text-gray-500'}`}>{regRoom || '请选择宿舍楼栋'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 shrink-0" />
                </button>
                {roomPickerOpen && (
                  <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                    {/* Search input */}
                    <div className="p-2 border-b border-slate-100">
                      <input type="text" value={roomSearch} onChange={e => setRoomSearch(e.target.value)}
                        className="w-full bg-slate-50 rounded-lg px-3 py-1.5 text-xs outline-none placeholder:text-slate-400 dark:text-gray-500"
                        placeholder="搜索宿舍楼栋..." autoFocus />
                    </div>
                    {/* Room list */}
                    <div className="max-h-48 overflow-y-auto">
                      {(['3号楼520室', '4号楼201室', '1号楼302室', '11号楼415室'] as const)
                        .filter(r => r.includes(roomSearch) || !roomSearch)
                        .map(room => {
                        const n = registeredUsers.filter(u => u.room === room).length;
                        const full = n >= 4;
                        const sel = regRoom === room;
                        return (
                          <button key={room} type="button"
                            onClick={() => { if (!full) { setRegRoom(room); setRoomPickerOpen(false); setRoomSearch(''); } }}
                            className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between border-b border-slate-50 last:border-0 cursor-pointer ${
                              sel ? 'bg-blue-50 text-blue-700 font-semibold' : full ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{room}</span>
                            <span className={`text-[10px] ${sel ? 'text-blue-400' : full ? 'text-slate-300' : 'text-slate-400 dark:text-gray-500'}`}>
                              {full ? '已满员' : `${n}/4`}
                            </span>
                          </button>
                        );
                      })}
                      {roomSearch && !(['3号楼520室', '4号楼201室', '1号楼302室', '11号楼415室'].some(r => r.includes(roomSearch))) && (
                        <div className="text-center py-6 text-[11px] text-slate-400 dark:text-gray-500">未找到匹配宿舍</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                  <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                    placeholder="密码" required />
                </div>
                <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                  <input type="password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                    placeholder="确认密码" required />
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400">验证</span>
                  <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold select-none">
                    {numA} + {numB} =
                  </span>
                </div>
                <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-16 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg text-center py-1.5 text-xs font-bold outline-none"
                  placeholder="" required />
              </div>

              <button type="submit"
                className="w-full py-2.5 workbench-primary-action rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer">
                注册
              </button>

              <button type="button" onClick={() => { setIsRegistering(false); setErrorMsg(''); setSuccessMsg(''); refreshCaptcha(); }}
                className="w-full text-center text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                已有账号？返回登录
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="w-full space-y-2.5 relative z-10">

              {loginTab === 'sso' ? (
                <>
                  <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                    <User className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                    <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)}
                      className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                      placeholder="学号" required />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                      placeholder="密码" required />
                    <button type="button" onClick={() => toast.error('请携带学生证前往宿舍楼值班室重置密码，或切换到短信验证码登录。')}
                      className="text-[10px] text-blue-500 hover:text-blue-700 font-medium shrink-0">
                      忘记密码？
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                    <Smartphone className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                      placeholder="手机号" required />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                    <input type="text" value={smsCode} onChange={(e) => setSmsCode(e.target.value)}
                      className="bg-transparent w-full text-xs text-slate-800 dark:text-gray-100 outline-none placeholder:text-slate-400 dark:text-gray-500"
                      placeholder="验证码" maxLength={6} required />
                    <button type="button" onClick={handleSendCode}
                      className="text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg font-bold shrink-0">
                      {smsSent ? '重发' : '获取'}
                    </button>
                  </div>
                </>
              )}

              {/* Captcha */}
              <div className="flex items-center justify-between bg-slate-50/60 rounded-xl px-3 py-2 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400">验证</span>
                  <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold select-none">
                    {numA} + {numB} =
                  </span>
                </div>
                <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-14 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg text-center py-1.5 text-xs font-bold outline-none"
                  placeholder="" required />
              </div>

              {/* Agreement */}
              <label className="flex items-center gap-1.5">
                <input id="agreement" type="checkbox" checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-blue-300 accent-blue-600 cursor-pointer" />
                <span className="text-[10px] text-slate-500 dark:text-gray-400 select-none">
                  同意<span className="text-blue-600">《服务协议》</span>
                </span>
              </label>

              <button type="submit"
                className="w-full py-2.5 workbench-primary-action rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer">
                登录
              </button>
            </form>
          )}

          {/* Register Link */}
          {!isRegistering && (
            <div className="w-full text-center mt-3 z-10">
              <p className="text-xs text-slate-500 dark:text-gray-400">
                还没有账户？{' '}
                <button onClick={() => { setIsRegistering(true); setErrorMsg(''); setSuccessMsg(''); refreshCaptcha(); }}
                  className="text-blue-700 hover:underline font-extrabold cursor-pointer inline-flex items-center gap-0.5">
                  <UserPlus className="w-3 h-3" />
                  新同学注册
                </button>
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="w-full flex items-center my-3 relative z-10 opacity-60">
            <div className="flex-grow border-t border-slate-200 dark:border-gray-700"></div>
            <span className="px-2.5 text-[10px] font-semibold text-slate-400 dark:text-gray-500 uppercase">快捷登录</span>
            <div className="flex-grow border-t border-slate-200 dark:border-gray-700"></div>
          </div>

          {/* Third Party */}
          <div className="grid grid-cols-2 gap-3 w-full relative z-10">
            <button type="button" onClick={() => handleThirdPartyAction('wechat')}
              className="py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 hover:bg-emerald-50 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-700 flex items-center justify-center gap-1.5 font-bold transition-all active:scale-95 cursor-pointer">
              <MessageSquare className="w-4 h-4 text-emerald-500 fill-current" />
              <span>微信登录</span>
            </button>
            <button type="button" onClick={() => handleThirdPartyAction('alipay')}
              className="py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 hover:bg-blue-50 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-700 flex items-center justify-center gap-1.5 font-bold transition-all active:scale-95 cursor-pointer">
              <CreditCard className="w-4 h-4 text-sky-500" />
              <span>支付宝登录</span>
            </button>
          </div>

          {/* Demo Accounts Hint */}
          <div className="mt-3 w-full px-2">
            <div className="bg-muted/70 border border-border rounded-xl p-3">
              <p className="text-[9px] text-slate-400 dark:text-gray-500 font-semibold text-center mb-2">演示账号 · 3号楼520室（4/4 满员）</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] text-slate-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>赵六：20241234 / zhaoliu123</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  <span>张三：20240001 / zhangsan123</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>李四：20240002 / lisi123</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  <span>王五：20240003 / wangwu123</span>
                </div>
              </div>
              <p className="text-[8px] text-slate-400 dark:text-gray-500 text-center mt-2">3号楼520室已满，新注册可选择其他宿舍</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

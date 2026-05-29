/**
 * @license SPDX-License-Identifier: Apache-2.0
 */
import React,{useState,useEffect,useRef} from 'react';
import {Home,Wallet,ReceiptText,Bell,User,CheckCircle2,X,Sparkles} from 'lucide-react';
import {Message,BillItem,Roommate,FleaItem,LostFoundItem,EventItem,RepairRecord,PowerGuaranteeRecord,RoommatePaymentStatus} from './types';
import LoginPage from './components/LoginPage';
import HomeTab from './components/HomeTab';
import ServicesTab from './components/ServicesTab';
import BillTab from './components/BillTab';
import MessageTab from './components/MessageTab';
import MyTab from './components/MyTab';
import SplitBillScreen from './components/SplitBillScreen';
import PowerGuaranteeScreen from './components/PowerGuaranteeScreen';
export default function App(){
  const [cu,setCu]=useState(null);const [li,setLi]=useState(false);
  const [tab,setTab]=useState('home');const [sub,setSub]=useState(null);
  const [rm,setRm]=useState([]);const room=cu?.room||'3号楼520室';
  const [b1,setB1]=useState(0);const [b2,setB2]=useState(0);const [b3,setB3]=useState(0);const [b4,setB4]=useState(0);
  const [ad,setAd]=useState(false);const [rt,setRt]=useState(null);const [ra,setRa]=useState('50');const [rp,setRp]=useState('wechat');
  const [sd,setSd]=useState(null);const [ub,setUb]=useState([]);const [bl,setBl]=useState([]);
  const [sid,setSid]=useState('');const [load,setLoad]=useState(false);
  const [tt,setTt]=useState(null);const ttr=useRef();
  const showT=(m,t='success')=>{if(ttr.current)clearTimeout(ttr.current);setTt({message:m,type:t});ttr.current=setTimeout(()=>setTt(null),2800);};
  const [fi,setFi]=useState([{id:'f1',title:'九成新小米千兆路由器',price:49,description:'考研退舍',seller:'张三',time:'1小时前',contact:'13888321288'},{id:'f2',title:'2024考研政治全套书',price:15,description:'全新',seller:'李四',time:'3小时前',contact:'19983421233'},{id:'f3',title:'美利达勇士300',price:180,description:'通勤代步',seller:'王五',time:'昨天',contact:'13593212999'}]);
  const [li2,setLi2]=useState([{id:'l1',type:'lost',title:'黑色充电盒',location:'操场',time:'2小时前',contact:'15893322112',status:'processing',description:'皮卡丘壳'},{id:'l2',type:'found',title:'钥匙串',location:'实训楼',time:'昨天',contact:'19823469988',status:'processing',description:'3把钥匙'}]);
  const [ev,setEv]=useState([{id:'e1',title:'创客沙龙',time:'今晚19:30',location:'活动中心',description:'校友分享',capacity:200,registeredCount:189,registered:false,tag:'讲座'},{id:'e2',title:'模拟面试',time:'明日14:00',location:'图书馆',description:'外企指导',capacity:120,registeredCount:118,registered:false,tag:'就业'}]);
  const [rp2,setRp2]=useState([{id:'r1',category:'水管漏水',description:'龙头渗水',location:'520',time:'11-26',status:'pending',contact:'13888'},{id:'r2',category:'家具损坏',description:'空调叶片断',location:'520',time:'11-10',status:'completed',contact:'13888'}]);
  const [msg,setMsg]=useState([]);const [bps,setBps]=useState({});const [myEv,setMyEv]=useState<string[]>([]);
  const [gh,setGh]=useState([{id:'g1',title:'保电',timeSlot:'23:00-07:00',date:'2026-05-19',status:'已批准'},{id:'g2',title:'保电2',timeSlot:'22:30-06:00',date:'2026-05-10',status:'已拒绝'}]);
  const fr=useRef(true);const [sc,setSc]=useState('');
  const save=(d)=>{try{fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)})}catch{}};
  const loadD=async()=>{try{const r=await fetch('/api/data');return await r.json()}catch{return{}}};

  useEffect(()=>{if(!cu)return;const rk='room_'+cu.room;
    const d={rooms:{[rk]:{billsList:bl,billPaymentStatus:bps,guaranteeHistory:gh,fleaItems:fi,lostFoundItems:li2,eventsList:ev,repairRecords:rp2,members:rm.map(r=>r.name)}},
    users:{[cu.name]:{cardBalance:b1,netBalance:b2,waterBalance:b3,elecBalance:b4,messages:msg,isNetAutoDeduct:ad,unpaidBills:ub,billsList:bl,myEvents:myEv}}};
    (async()=>{const ex=await loadD();const ss=ex.sessions?.[cu.name];
    if(sid&&ss&&ss!==''&&ss!==sid){alert('已在其他设备登录');handleLogout();return}
    save({rooms:{...(ex.rooms||{}),...d.rooms},users:{...(ex.users||{}),...d.users},sessions:{...(ex.sessions||{}),[cu.name]:sid}})})()},
  [ub,bl,bps,gh,b1,b2,b3,b4,msg,ad,ev,fi,li2,rp2,rm,sid,myEv]);

  useEffect(()=>{if(!cu||!sid)return;let iv;const dl=setTimeout(()=>{iv=setInterval(async()=>{try{const d=await loadD();const s=d.sessions?.[cu.name];if(s&&s!==''&&s!==sid){alert('已在其他设备登录');handleLogout()}}catch{}},3000)},5000);return()=>{clearTimeout(dl);if(iv)clearInterval(iv)}},[cu?.name,sid]);

  const notif=(c,t,ct)=>{setMsg(p=>[{id:String(Date.now()),category:c,title:t,content:ct,time:new Date().toLocaleTimeString().slice(0,5),date:new Date().toLocaleDateString(),unread:true},...p])};

  const handleLoginSuccess = async (userName, studentId, room) => {
    setLoad(true);setUb([]);setBl([]);setBps({});setMsg([]);setRm([]);setMyEv([]);setSd(null);setTt(null);
    setB1(0);setB2(0);setB3(0);setB4(0);setAd(false);setEv([{id:'e1',title:'创客沙龙',time:'今晚19:30',location:'活动中心',description:'校友分享',capacity:200,registeredCount:189,registered:false,tag:'讲座'},{id:'e2',title:'模拟面试',time:'明日14:00',location:'图书馆',description:'外企指导',capacity:120,registeredCount:118,registered:false,tag:'就业'}]);
    let saved:any={};try{saved=await loadD()}catch{}
    const rk='room_'+room;const rd=saved.rooms?.[rk];const ud=saved.users?.[userName];
    if(rd){
      if(rd.billsList)setBl(rd.billsList);
      if(rd.billPaymentStatus)setBps(rd.billPaymentStatus);
      if(rd.guaranteeHistory)setGh(rd.guaranteeHistory);
      if(rd.fleaItems)setFi(rd.fleaItems);
      if(rd.lostFoundItems)setLi2(rd.lostFoundItems);
      if(rd.repairRecords)setRp2(rd.repairRecords);
      if(rd.eventsList)setEv(rd.eventsList);
      if(rd.members)setRm(rd.members.map((n,i)=>({id:'r'+i,name:n,pinyin:n,avatar:n[0],selected:true})));
      if(!ud||ud.cardBalance==null){const s2=['赵六','张三','李四','王五'];if(s2.includes(userName)&&room==='3号楼520室'){setB1(128.5);setB2(45);setB3(32.5);setB4(18.2);}}
    }else{
      const seed=['赵六','张三','李四','王五'];
      if(seed.includes(userName)&&room==='3号楼520室'){setB1(128.5);setB2(45);setB3(32.5);setB4(18.2);setRm(seed.map((n,i)=>({id:'r'+i,name:n,pinyin:n,avatar:n[0],selected:true})));setUb([]);}
      else setRm([{id:'r1',name:userName,pinyin:userName,avatar:userName[0],selected:true}]);
    }
    if(ud){
      if(ud.cardBalance!=null)setB1(ud.cardBalance);if(ud.netBalance!=null)setB2(ud.netBalance);
      if(ud.waterBalance!=null)setB3(ud.waterBalance);if(ud.elecBalance!=null)setB4(ud.elecBalance);
      if(ud.isNetAutoDeduct!=null)setAd(ud.isNetAutoDeduct);
      if(ud.messages)setMsg(ud.messages);else notif('系统通知','欢迎','欢迎您，'+userName+'！');
      if(ud.unpaidBills)setUb(ud.unpaidBills);if(ud.billsList)setBl(ud.billsList);
      if(ud.myEvents)setMyEv(ud.myEvents);
    }else{notif('系统通知','欢迎','欢迎您，'+userName+'！');}
    const ns=Math.random().toString(36).slice(2)+Date.now().toString(36);setSid(ns);save({sessions:{[userName]:ns}});
    setCu({name:userName,studentId,room});setLi(true);setLoad(false);fr.current=false;
  };

  const handleLogout=()=>{
    if(cu){try{save({rooms:{['room_'+cu.room]:{billsList:bl,billPaymentStatus:bps,guaranteeHistory:gh,fleaItems:fi,lostFoundItems:li2,eventsList:ev,repairRecords:rp2,members:rm.map(r=>r.name)}},users:{[cu.name]:{cardBalance:b1,netBalance:b2,waterBalance:b3,elecBalance:b4,messages:msg,isNetAutoDeduct:ad,unpaidBills:ub,billsList:bl,myEvents:myEv}},sessions:{[cu.name]:''}})}catch{}}
    setCu(null);setLi(false);setTab('home');setSub(null);
  };

  const openR=(t)=>{setRt(t);setRp(t==='校园卡'?'wechat':'campus_card');};

  const doPay=(ids)=>{
    if(!ids.length){showT('请选择账单','error');return;}
    const items=ub.filter(b=>ids.includes(b.id));const total=items.reduce((s,b)=>s+b.amount,0);
    if(b1<total){showT('余额不足','error');setRt('校园卡');return;}
    const fb=b1-total;setB1(fb);
    const paid=items.map(b=>({...b,status:'已缴费',time:'刚刚',payer:cu?.name,paymentMethod:'一卡通',orderNo:'P'+Date.now(),afterBalance:fb}));
    setBl([...paid,...bl]);setUb(ub.filter(b=>!ids.includes(b.id)));
    notif('缴费成功','缴费成功','已缴 ¥'+total.toFixed(2));setSd({title:'缴费成功',content:'已缴 ¥'+total.toFixed(2)});
  };

  const doRecharge=(e)=>{
    e.preventDefault();const n=Number(ra);
    if(isNaN(n)||n<=0){showT('输入正确金额','error');return;}
    if(rt!=='校园卡'&&rp==='campus_card'&&b1<n){showT('余额不足','error');return;}
    if(rt!=='校园卡'&&rp==='campus_card')setB1(p=>p-n);
    if(rt==='校园卡')setB1(p=>p+n);else if(rt==='网费')setB2(p=>p+n);else if(rt==='水费')setB3(p=>p+n);else if(rt==='电费')setB4(p=>p+n);
    setBl([{id:'r'+Date.now(),category:rt==='校园卡'?'校园卡':rt,title:rt+'充值',amount:n,time:'刚刚',status:'已缴费',payer:cu?.name,month:'本月',orderNo:'R'+Date.now()},...bl]);
    notif('缴费成功','充值成功','已充值 ¥'+n.toFixed(2));setSd({title:'充值成功',content:'已充值 ¥'+n.toFixed(2)});setRt(null);setRa('50');
  };

  const autoNet=()=>{
    if(b1<30){showT('余额不足','error');setRt('校园卡');return;}
    setB1(p=>p-30);setB2(p=>p+30);
    setBl([{id:'h'+Date.now(),category:'网费',title:'网费包月',amount:30,time:'刚刚',status:'已缴费',payer:'系统',month:'本月'},...bl]);
    notif('缴费成功','网费已缴','已扣 ¥30');setSd({title:'网费已缴',content:'已扣 ¥30'});
  };

  const handleSplit=(sum,pp,ids,names,cb)=>{
    if(b1<pp){showT('余额不足','error');setRt('校园卡');return;}
    const fb=b1-pp;setB1(fb);setUb(ub.filter(b=>!ids.includes(b.id)));
    const t=Date.now();
    const s2=ids.map((id,i)=>{const x=ub.find(u=>u.id===id);return x?{...x,status:'已缴费',time:'刚刚',payer:'全寝',paymentMethod:'校园卡',orderNo:'S'+t+'-'+i,afterBalance:fb}:null;}).filter(Boolean);
    const d={id:'d'+t,category:'校园卡',title:'公摊（我的）',amount:pp,time:'刚刚',status:'已缴费',payer:cu?.name+'（我）',month:'本月',orderNo:'D'+t};
    const c2=(cb||[]).map((x,i)=>({...x,status:'已缴费',time:'刚刚',payer:'全寝',orderNo:'C'+t+'-'+i}));
    setBl([d,...s2,...c2,...bl]);const ps={};ids.forEach(id=>{ps[id]={};names.forEach(v=>{ps[id][v]=v===cu?.name?'paid':'pending';})});
    setBps({...bps,...ps});notif('分摊通知','分摊已发起','共 ¥'+sum+', 已扣 ¥'+pp);
    const others=names.filter(v=>v!==cu?.name);
    others.forEach(rm2=>{const m={id:'sn'+Date.now()+rm2,category:'缴费提醒',title:'新分摊待缴',content:cu?.name+'发起了分摊，您需缴 ¥'+pp,time:new Date().toLocaleTimeString().slice(0,5),date:new Date().toLocaleDateString(),unread:true};(async()=>{try{const sv=await loadD();const u=sv.users?.[rm2]||{};sv.users={...(sv.users||{}),[rm2]:{...u,messages:[m,...(u.messages||[])],billsList:[...s2.map(x=>({...x,status:'待缴费',time:'刚刚（待缴）'})),...(u.billsList||[])]}};save(sv);}catch{}})();});
    setSd({title:'分摊成功',content:'已扣 ¥'+pp.toFixed(2)+'（余额 ¥'+fb.toFixed(2)+'）',actionText:'查看',onAction:()=>setTab('bill')});setSub(null);
  };

  const payFor=(id,rn,amt)=>{
    if(b1<amt){showT('余额不足','error');return false;}
    setB1(p=>p-amt);setBps(prev=>({...prev,[id]:{...prev[id],[rn]:'paid'}}));
    const bill=bl.find(b=>b.id===id);
    setBl([{id:'h'+Date.now(),category:bill?.category||'校园卡',title:'代付'+rn+'分摊',amount:amt,time:'刚刚',status:'已缴费',payer:cu?.name+'（代'+rn+'付）',month:bill?.month||'本月',orderNo:'H'+Date.now()},...bl]);
    notif('缴费成功','代付成功','已帮'+rn+'代付 ¥'+amt.toFixed(2));
    (async()=>{try{const sv=await loadD();const u=sv.users?.[rn]||{};sv.users={...(sv.users||{}),[rn]:{...u,messages:[{id:'pn'+Date.now(),category:'缴费成功',title:'室友帮您代付了',content:cu?.name+'已帮您支付 ¥'+amt.toFixed(2),time:new Date().toLocaleTimeString().slice(0,5),date:new Date().toLocaleDateString(),unread:true},...(u.messages||[])]}};save(sv);}catch{}})();
    return true;
  };

  const doPower=()=>{setGh([{id:String(Date.now()),title:'保电',timeSlot:'',date:new Date().toLocaleDateString(),status:'已批准'},...gh]);notif('系统通知','保电已批准','');};

  const quickSplit=(cat,amt)=>{
    if(!cu||!rm.length||amt<=0)return;const pp=amt/rm.length;
    if(b1<pp){showT('余额不足','error');return;}
    const fb=b1-pp;setB1(fb);const t=Date.now();const names=rm.map(r=>r.name);const billId='qs-'+t;
    const settledBill={id:billId,category:cat,title:cat+'分摊',amount:amt,time:'刚刚',status:'已缴费',payer:'全寝',orderNo:'S'+t,afterBalance:fb,month:'本月'};
    const d={id:'d'+t,category:'校园卡',title:cat+'分摊（我的）',amount:pp,time:'刚刚',status:'已缴费',payer:cu?.name+'（我）',month:'本月',orderNo:'D'+t};
    setBl([d,settledBill,...bl]);const ps={};ps[billId]={};names.forEach(v=>{ps[billId][v]=v===cu?.name?'paid':'pending';});
    setBps({...bps,...ps});notif('分摊通知',cat+'分摊已发起',cat+'分摊共 ¥'+amt+'，每人 ¥'+pp.toFixed(2));
    const others=names.filter(v=>v!==cu?.name);
    (async()=>{try{const sv=await loadD();const rk='room_'+cu.room;if(!sv.rooms)sv.rooms={};if(!sv.rooms[rk])sv.rooms[rk]={};const rkBills=sv.rooms[rk].billsList||[];
    sv.rooms[rk].billsList=[{...settledBill,id:billId,status:'待缴费',time:'刚刚（待缴）'},...rkBills];
    sv.rooms[rk].billPaymentStatus={...(sv.rooms[rk].billPaymentStatus||{}),...ps};if(!sv.users)sv.users={};
    others.forEach(rm2=>{const u=sv.users?.[rm2]||{};sv.users[rm2]={...u,messages:[{id:'sn'+t+rm2,category:'缴费提醒',title:cat+'分摊待缴',content:cu?.name+'发起了'+cat+'分摊，您需缴 ¥'+pp.toFixed(2),time:new Date().toLocaleTimeString().slice(0,5),date:new Date().toLocaleDateString(),unread:true},...(u.messages||[])],billsList:[{...settledBill,id:billId,status:'待缴费',time:'刚刚（待缴）'},...(u.billsList||[])]}});save(sv);}catch{}})();
    setSd({title:cat+'分摊成功',content:'¥'+amt.toFixed(2)+' 已分给 '+rm.length+' 人\\n每人 ¥'+pp.toFixed(2)+'（余额 ¥'+fb.toFixed(2)+'）',actionText:'查看',onAction:()=>setTab('bill')});
  };

  if(load)return <div className="h-screen bg-[#f2f5ff] flex items-center justify-center"><div className="flex flex-col items-center gap-3"><div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div><p className="text-sm text-slate-500">加载中...</p></div></div>;
  if(!li)return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  return (
    <div className="min-h-screen flex flex-col pb-16 bg-[#f2f5ff]">
      {tt&&<div className={'fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg text-sm font-bold pointer-events-none '+(tt.type==='success'?'bg-emerald-600 text-white':tt.type==='error'?'bg-red-500 text-white':'bg-slate-800 text-white')}>{tt.type==='success'?'✓ ':tt.type==='error'?'✕ ':''}{tt.message}</div>}
      {sd&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <button onClick={()=>setSd(null)} className="float-right text-gray-400 cursor-pointer"><X className="w-5 h-5"/></button>
        <div className="text-center py-2"><div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-3"><CheckCircle2 className="w-8 h-8"/></div>
        <h3 className="font-bold text-lg">{sd.title}</h3><p className="text-xs text-gray-500 mt-2 whitespace-pre-line">{sd.content}</p>
        <div className="flex gap-2.5 mt-4">{sd.actionText&&sd.onAction?<><button onClick={()=>{setSd(null);sd.onAction()}} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg text-xs cursor-pointer">{sd.actionText}</button>
        <button onClick={()=>setSd(null)} className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-full cursor-pointer">关闭</button></>:<button onClick={()=>setSd(null)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg cursor-pointer">我知道了</button>}</div></div></div></div>}
      {rt&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4"><div className="bg-white rounded-t-2xl w-full max-w-sm p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2">
          <div className={'w-10 h-10 rounded-xl flex items-center justify-center '+(rt==='校园卡'?'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-200':'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-sm shadow-orange-200')}>
            {rt==='校园卡'?<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>:<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"/></svg>}
          </div><div><p className="font-bold text-sm text-gray-900">{rt==='校园卡'?'校园一卡通充值':'网费缴纳'}</p><p className="text-[10px] text-gray-400">{rt==='校园卡'?'支持微信/支付宝':'支持校园卡/微信/支付宝'}</p></div></div>
          <button onClick={()=>setRt(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"><X className="w-5 h-5"/></button></div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3"><span className="text-xs text-gray-500">当前余额</span><span className="font-bold text-sm text-gray-900">{rt==='校园卡'?'¥'+b1.toFixed(2):'¥'+b2.toFixed(2)}</span></div>
          <form onSubmit={doRecharge}>
            {rt==='校园卡'?<div className="mb-3"><label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">支付方式</label><div className="grid grid-cols-2 gap-2">{['wechat','alipay'].map(p=><button key={p} type="button" onClick={()=>setRp(p)} className={'py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer '+(rp===p?'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500 shadow-sm':'bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:shadow-sm')}>{p==='wechat'?'微信支付':'支付宝'}</button>)}</div></div>
            :<div className="mb-3"><label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">支付方式</label><div className="grid grid-cols-3 gap-2">{['campus_card','wechat','alipay'].map(p=><button key={p} type="button" onClick={()=>setRp(p)} className={'py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer '+(rp===p?'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-sm':'bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:shadow-sm')}>{p==='campus_card'?'校园卡':p==='wechat'?'微信':'支付宝'}</button>)}</div></div>}
            <div><label className="text-[10px] font-semibold text-gray-500 mb-1.5 block">金额</label><div className="grid grid-cols-4 gap-1.5 mb-2">{[20,50,100,200].map(a=><button key={a} type="button" onClick={()=>setRa(String(a))} className={'py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer '+(ra===String(a)?'bg-blue-600 text-white border-blue-600 shadow-sm':'bg-white text-gray-600 border-gray-200 hover:border-blue-300')}>¥{a}</button>)}</div>
            <input type="number" value={ra} onChange={e=>setRa(e.target.value)} className="w-full bg-white border border-gray-200 text-sm p-2.5 rounded-xl outline-none focus:border-blue-400 text-center" placeholder="自定义金额" required/></div>
            <button type="submit" className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all cursor-pointer">确认支付 ¥{ra}</button>
          </form></div></div></div>}
      <div className="max-w-md mx-auto w-full flex-1 px-4 py-6">
        {sub==='split'?<SplitBillScreen unpaidBills={ub} roommates={rm} currentUserName={cu?.name||''} defaultCategory={sc} onBack={()=>{setSub(null);setSc('')}} onInitiateSuccess={handleSplit} />
        :sub==='guarantee'?<PowerGuaranteeScreen guaranteeHistory={gh} onBack={()=>setSub(null)} onSubmitGuarantee={doPower} />
        :<>
          {tab==='home'&&<HomeTab currentRoom={room} currentUserName={cu?.name||''} unpaidBills={ub} billsList={bl} billPaymentStatus={bps} cardBalance={b1} netBalance={b2} electricityBalance={b4} waterBalance={b3} isNetAutoDeduct={ad} hasUnreadMessages={msg.some(m=>m.unread)} onSetNetAutoDeduct={setAd} onAutoDeductNet={autoNet} onOneKeyPay={doPay} onPayForRoommate={payFor} onNavigateToSplit={(cat)=>{setSc(cat||'');setSub('split')}} onNavigateToNotifications={()=>{setTab('message');setMsg(msg.map(m=>({...m,unread:false})))}} onQuickRecharge={openR} onQuickSplit={quickSplit} />}
          {tab==='services'&&<ServicesTab cardBalance={b1} onUpdateCardBalance={setB1} fleaItems={fi} onAddFleaItem={i=>setFi([i,...fi])} onBuyFleaItem={(id,cost)=>{if(b1<cost){showT('余额不足','error');return}setB1(p=>p-cost);setFi(prev=>prev.map(item=>item.id===id?{...item,purchased:true}:item));notif('缴费成功','购买成功','已购买二手商品，花费 ¥'+cost)}} lostFoundItems={li2} onAddLostFoundItem={i=>setLi2([i,...li2])} eventsList={ev} myEvents={myEv} onToggleEventRegistration={id=>{setEv(ev.map(e=>e.id===id?{...e,registeredCount:e.registeredCount+(myEv.includes(id)?-1:1)}:e));setMyEv(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])}} repairRecords={rp2} onAddRepairRecord={r=>setRp2([r,...rp2])} onAddSystemNotification={notif} />}
          {tab==='bill'&&<BillTab billsList={bl} allRoommates={rm.map(r=>({name:r.name,avatar:r.avatar}))} currentUserName={cu?.name||''} cardBalance={b1} billPaymentStatus={bps} onPayForRoommate={payFor} onAddSystemNotification={notif} />}
          {tab==='message'&&<MessageTab messages={msg} onMarkAllAsRead={()=>setMsg(msg.map(m=>({...m,unread:false})))} onMarkSingleAsRead={id=>setMsg(msg.map(m=>m.id===id?{...m,unread:false}:m))} onDeleteMessage={id=>setMsg(msg.filter(m=>m.id!==id))} />}
          {tab==='my'&&<MyTab currentRoom={room} currentUserName={cu?.name||''} studentId={cu?.studentId||''} roommates={rm} cardBalance={b1} waterBalance={b3} onLogout={handleLogout} onNavigateToPowerGuarantee={()=>setSub('guarantee')} onQuickRecharge={openR} />}
        </>}
      </div>
      {!sub&&<nav className="fixed bottom-0 left-0 w-full z-40 pb-safe tab-bar-glass border-t border-white/40 flex justify-around items-center h-[72px] px-2">
        {[{key:'home',label:'首页',icon:Home},{key:'services',label:'服务',icon:Wallet},{key:'bill',label:'账单',icon:ReceiptText},{key:'message',label:'消息',icon:Bell},{key:'my',label:'我的',icon:User}].map(({key,label,icon:Icon})=>{const a=tab===key;
          return <button key={key} onClick={()=>setTab(key)} className={'flex flex-col items-center justify-center relative py-1 px-3 cursor-pointer transition-all duration-200 '+(a?'scale-100':'hover:opacity-80')}>
            {a&&<span className="absolute inset-0 bg-blue-50/80 rounded-2xl -mx-1 shadow-sm border border-blue-100/50"></span>}
            <div className="relative flex flex-col items-center"><div className={'mb-0.5 transition-all '+(a?'scale-110':'scale-100')}><Icon className={'w-[22px] h-[22px] '+(a?'text-blue-600 fill-current drop-shadow-sm':'text-slate-400')}/></div><span className={'text-[10px] font-semibold '+(a?'text-blue-700 font-bold':'text-slate-400')}>{label}</span></div>
            {key==='message'&&msg.some(m=>m.unread)&&<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>}
          </button>;
        })}
      </nav>}
    </div>
  );
}

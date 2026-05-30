import React,{useState} from 'react';
import {toast} from 'sonner';
import {Search,Utensils,WashingMachine,Wrench,Store,Compass,Calendar,CheckCircle,X,ChevronRight,Flame,Star,Shield,Sparkles,Clock,MapPin} from 'lucide-react';
import {FleaItem,LostFoundItem,EventItem,RepairRecord} from '../types';

const FOOD=[
  {id:'c1',name:'二楼食堂',tag:'自选快餐',img:'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=200',
    items:[{id:'f1',name:'麻辣香锅',price:18,desc:'牛肉+鱼豆腐+午餐肉',sales:156},{id:'f2',name:'黄焖鸡米饭',price:15,desc:'鸡腿肉+土豆',sales:98},{id:'f3',name:'番茄鸡蛋面',price:12,desc:'手工面+番茄鸡蛋',sales:72},{id:'f4',name:'鱼香肉丝饭',price:14,desc:'经典川味+例汤',sales:85}]},
  {id:'c2',name:'三楼风味餐厅',tag:'特色窗口',img:'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=200',
    items:[{id:'s1',name:'螺蛳粉',price:13,desc:'酸笋+腐竹+花生',sales:134},{id:'s2',name:'重庆小面',price:11,desc:'麻辣汤底+杂酱',sales:89},{id:'s3',name:'兰州拉面',price:13,desc:'牛肉+萝卜+香菜',sales:76}]},
  {id:'c3',name:'西区小吃街',tag:'外卖点单',img:'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=200',
    items:[{id:'w1',name:'煎饼果子',price:8,desc:'鸡蛋+薄脆+生菜',sales:201},{id:'w2',name:'烤冷面',price:10,desc:'加肠加蛋',sales:167},{id:'w3',name:'肉夹馍',price:9,desc:'腊汁肉+青椒',sales:143}]}
];

const HOT_SERVICES = [
  {key:'food',label:'校园订餐',icon:Utensils,gradient:'from-orange-500 to-red-500',desc:'食堂·外卖'},
  {key:'events',label:'校园活动',icon:Calendar,gradient:'from-purple-600 to-pink-500',desc:'讲座·比赛'},
  {key:'laundry',label:'自助洗衣',icon:WashingMachine,gradient:'from-cyan-500 to-teal-500',desc:'空闲预约'},
  {key:'repair',label:'宿舍报修',icon:Wrench,gradient:'from-blue-500 to-indigo-600',desc:'快速报修'},
];

const OTHER_SERVICES = [
  {key:'flea',label:'跳蚤市场',icon:Store,gradient:'from-amber-500 to-orange-500',desc:'二手好物'},
  {key:'lostfound',label:'失物招领',icon:Compass,gradient:'from-emerald-500 to-teal-500',desc:'寻物启事'},
];

const BANNER_TIPS = [
  '📢 二楼食堂新品上线，麻辣香锅限时8折！',
  '🎉 校园创客沙龙今晚19:30，校友分享经验',
  '💡 宿舍报修已开通线上进度查询',
];

interface Props{
  cardBalance:number;onUpdateCardBalance:(n:number)=>void;
  fleaItems:FleaItem[];onAddFleaItem:(i:FleaItem)=>void;
  onBuyFleaItem:(id:string,cost:number)=>void;
  lostFoundItems:LostFoundItem[];onAddLostFoundItem:(i:LostFoundItem)=>void;
  eventsList:EventItem[];myEvents:string[];
  onToggleEventRegistration:(id:string)=>void;
  repairRecords:RepairRecord[];onAddRepairRecord:(r:RepairRecord)=>void;
  onAddSystemNotification:(c:string,t:string,ct:string)=>void;
}

export default function ServicesTab(p:Props){
  const [m,setM]=useState<string|null>(null);
  const [sr,setSr]=useState('');
  const [res,setRes]=useState(FOOD[0]);
  const [cart,setCart]=useState<Record<string,number>>({});
  const [done,setDone]=useState(false);
  const [od,setOd]=useState<any>(null);
  const [ws,setWs]=useState([{id:'1',name:'3号楼1楼A机',st:'空闲',rm:0,bk:false},{id:'2',name:'3号楼1楼B机',st:'使用中',rm:18,bk:false},{id:'3',name:'3号楼2楼A机',st:'空闲',rm:0,bk:false},{id:'4',name:'4号楼1楼A机',st:'故障',rm:0,bk:false}]);
  const [bannerIdx,setBannerIdx]=useState(0);
  const [bannerShow,setBannerShow]=useState(true);

  const allItems = FOOD.reduce((a:any[],r)=>a.concat(r.items),[]);
  const [favModals,setFavModals]=useState<Record<string,boolean>>({});

  React.useEffect(()=>{
    const iv=setInterval(()=>{setBannerIdx(i=>(i+1)%BANNER_TIPS.length)},4000);
    return ()=>clearInterval(iv);
  },[]);

  const renderSearchResults=()=>{
    const s=sr.toLowerCase();
    const r=FOOD.flatMap(r=>r.items.filter(i=>i.name.includes(s)).map(i=>({label:r.name+'-'+i.name,price:'¥'+i.price,type:'food'})));
    const f=p.fleaItems.filter(x=>x.title.includes(s)).map(x=>({label:x.title,price:'¥'+x.price,type:'flea'}));
    const l=p.lostFoundItems.filter(x=>x.title.includes(s)).map(x=>({label:x.title,tag:x.type==='lost'?'寻物':'招领',type:'lf'}));
    const e=p.eventsList.filter(x=>x.title.includes(s)).map(x=>({label:x.title,tag:x.tag,type:'event'}));
    const all=[...r,...f,...l,...e];
    if(!all.length)return <div className="text-center py-8 text-xs text-slate-400">未找到匹配结果</div>;
    return <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-2 max-h-64 overflow-y-auto">{all.map((x,i)=>
      <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer text-xs transition-colors" onClick={()=>{
        setSr('');
        if(x.type==='food')setM('food');
        else if(x.type==='flea')setM('flea');
        else if(x.type==='lf')setM('lostfound');
        else if(x.type==='event')setM('events');
      }}>
        <div className="flex items-center gap-2.5">
          <span className={'w-2 h-2 rounded-full '+(x.type==='food'?'bg-orange-500':x.type==='flea'?'bg-amber-500':x.type==='lf'?'bg-emerald-500':'bg-purple-500')}></span>
          <span className="text-slate-700">{x.label}</span>
        </div>
        <span className="text-slate-400 shrink-0 ml-2 font-medium">{'price' in x?x.price:'tag' in x?x.tag:''}</span>
      </div>
    )}</div>;
  };

  return <div className="flex flex-col gap-0">
    {/* ===== Gradient Header ===== */}
    <div className="relative -mx-4 -mt-6 px-4 pt-6 pb-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-b-[28px] shadow-lg shadow-indigo-200/50">
      <div className="absolute inset-0 rounded-b-[28px] overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-1/3 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300"/> 校园生活
            </h2>
            <p className="text-xs text-white/70 mt-0.5">一站式解决课余生活需求</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-yellow-300"/>
            <span className="text-[10px] text-white font-medium">安全校园</span>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center px-4 h-11">
            <Search className="w-4 h-4 text-white/60 shrink-0"/>
            <input value={sr} onChange={e=>setSr(e.target.value)} className="w-full bg-transparent text-sm text-white ml-2.5 outline-none placeholder:text-white/40" placeholder="搜索美食、活动、二手..."/>
            {sr&&<button onClick={()=>setSr('')} className="text-white/50 hover:text-white/80"><X className="w-4 h-4"/></button>}
          </div>
        </div>
      </div>
    </div>

    {/* ===== Search Results (outside header to avoid stacking issues) ===== */}
    {sr&&<div className="relative z-30 mx-1 -mt-3">{renderSearchResults()}</div>}

    {/* ===== Quick Service Grid (overlapping the header) ===== */}
    <div className="relative z-10 -mt-14 px-1">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/80 border border-white/50 p-4 mx-1">
        <div className="grid grid-cols-4 gap-2">
          {HOT_SERVICES.map(s=>(
            <div key={s.key} onClick={()=>{setM(s.key)}} className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer group">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm group-active:scale-90 transition-transform`}>
                <s.icon className="w-5 h-5 text-white"/>
              </div>
              <span className="text-[11px] font-semibold text-slate-700">{s.label}</span>
              <span className="text-[9px] text-slate-400 -mt-0.5">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ===== Banner Carousel ===== */}
    {bannerShow&&<div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
          <Flame className="w-3.5 h-3.5 text-white"/>
        </div>
        <p className="text-xs text-amber-800 font-medium">{BANNER_TIPS[bannerIdx]}</p>
      </div>
      <button onClick={()=>setBannerShow(false)} className="text-amber-300 hover:text-amber-500 shrink-0 ml-2"><X className="w-3.5 h-3.5"/></button>
    </div>}

    {/* ===== Hot Events Preview ===== */}
    <div className="mt-5">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500"/>
          <h3 className="font-bold text-sm text-slate-800">热门活动</h3>
        </div>
        <button onClick={()=>setM('events')} className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5 hover:underline">
          全部 <ChevronRight className="w-3 h-3"/>
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        {p.eventsList.slice(0,3).map(ev=>{
          const ratio=ev.capacity>0?Math.round(ev.registeredCount/ev.capacity*100):0;
          const isHot=ratio>=80;
          return <div key={ev.id} onClick={()=>setM('events')} className="shrink-0 w-52 bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.tag==='讲座'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}`}>{ev.tag}</span>
              {isHot&&<span className="flex items-center gap-0.5 text-[9px] text-red-500 font-bold"><Flame className="w-3 h-3"/>火热</span>}
            </div>
            <p className="font-bold text-sm text-slate-800 mb-1">{ev.title}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/>{ev.time}</p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/>{ev.location}</p>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2">
                <div className={`h-full rounded-full ${isHot?'bg-red-400':'bg-blue-400'}`} style={{width:ratio+'%'}}></div>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 shrink-0">{ev.registeredCount}/{ev.capacity}</span>
            </div>
          </div>;
        })}
      </div>
    </div>

    {/* ===== Other Services Grid ===== */}
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-3 px-0.5">
        <Sparkles className="w-4 h-4 text-blue-500"/>
        <h3 className="font-bold text-sm text-slate-800">更多服务</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {OTHER_SERVICES.map(s=>(
          <div key={s.key} onClick={()=>setM(s.key)} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm shrink-0`}>
              <s.icon className="w-5 h-5 text-white"/>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">{s.label}</p>
              <p className="text-[10px] text-slate-400">{s.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 ml-auto"/>
          </div>
        ))}
      </div>
    </div>

    {/* ===== Bottom padding ===== */}
    <div className="h-6"></div>

    {/* ================================================================ */}
    {/* ===== MODALS (keep existing functionality, minor visual tweaks) ===== */}
    {/* ================================================================ */}

    {m==='food'&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up">
        <div className="sticky top-0 bg-white z-10 p-4 pb-2 border-b flex justify-between items-center">
          <h3 className="font-bold text-orange-600 flex items-center gap-2"><Utensils className="w-5 h-5"/> 订餐</h3>
          <button onClick={()=>setM(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4 text-slate-500"/></button>
        </div>
        <div className="p-4">
          {!done?<>
            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-none">{[...FOOD].map(r=><button key={r.id} onClick={()=>{setRes(r);setCart({})}} className={'shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all '+(res.id===r.id?'bg-orange-500 text-white shadow-md shadow-orange-200':'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{r.name}</button>)}</div>
            <div className="rounded-2xl overflow-hidden h-28 mb-3 relative shadow-md"><img src={res.img} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3"><p className="font-bold text-white text-lg drop-shadow-sm">{res.name}</p></div></div>
            <div className="space-y-2">{res.items.map(item=>{
              const q=cart[item.id]||0;
              return <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-orange-100 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{item.name} <span className="text-[10px] text-slate-400 font-normal">已售{item.sales}</span></p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-orange-600">¥{item.price}</span>
                  {q===0?<button onClick={()=>setCart({...cart,[item.id]:1})} className="w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-sm shadow-orange-200 hover:shadow-md transition-shadow">+</button>
                  :<div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-1.5 py-0.5 shadow-sm">
                    <button onClick={()=>setCart(c=>{const n={...c};n[item.id]=Math.max(0,(n[item.id]||0)-1);return n;})} className="w-5 h-5 rounded-full bg-slate-100 text-xs font-bold hover:bg-slate-200">-</button>
                    <span className="text-xs font-bold w-5 text-center text-slate-700">{q}</span>
                    <button onClick={()=>setCart(c=>{const n={...c};n[item.id]=(n[item.id]||0)+1;return n;})} className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold">+</button>
                  </div>}
                </div>
              </div>;
            })}</div>
            {(()=>{
              const entries=(Object.entries(cart) as [string,number][]).filter(([,q])=>q>0);
              if(!entries.length)return null;
              const total=entries.reduce((s,[id,q])=>{const i=allItems.find((x:any)=>x.id===id);return s+(i?.price||0)*Number(q);},0);
              return <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100 mt-3 shadow-sm">
                <p className="text-xs font-semibold text-orange-700 mb-2">购物清单</p>
                {entries.map(([id,q])=>{
                  const i=allItems.find((x:any)=>x.id===id);
                  return i?<div key={id} className="flex justify-between text-xs text-orange-700 py-0.5"><span>{i.name} × {q}</span><span className="font-bold">¥{(i.price*Number(q)).toFixed(2)}</span></div>:null;
                })}
                <div className="flex justify-between font-bold text-sm text-orange-800 pt-2 mt-1 border-t border-orange-200"><span>合计</span><span>¥{total.toFixed(2)}</span></div>
                <button onClick={()=>{
                  if(p.cardBalance<total){toast.error('余额不足');return;}
                  p.onUpdateCardBalance(p.cardBalance-total);
                  const ns=entries.map(([id,q])=>{const i=allItems.find((x:any)=>x.id===id);return i?.name+'x'+q;}).join('、');
                  setOd({restaurant:res.name,items:ns,total});setDone(true);
                  p.onAddSystemNotification('缴费成功','订餐成功','已购买 '+ns+'，共 ¥'+total.toFixed(2));
                }} className="w-full mt-3 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full text-sm shadow-md shadow-orange-200 hover:shadow-lg transition-shadow cursor-pointer">确认下单 ¥{total.toFixed(2)}</button>
              </div>;
            })()}
          </>:<div className="text-center py-10"><div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><CheckCircle className="w-8 h-8 text-white"/></div><p className="font-bold text-lg text-emerald-700">下单成功！</p><p className="text-xs text-slate-500 mt-1">已扣款 ¥{od?.total.toFixed(2)}</p><div className="bg-orange-50 rounded-xl p-3 mt-3 inline-block"><p className="text-xs text-orange-600 font-medium">{od?.restaurant}</p><p className="text-[10px] text-orange-400 mt-0.5">{od?.items}</p></div></div>}
        </div>
      </div>
    </div>}

    {m==='laundry'&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4"><div className="bg-white rounded-t-2xl w-full max-w-md p-5 shadow-xl animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-teal-700 flex items-center gap-2"><WashingMachine className="w-5 h-5"/> 自助洗衣</h3>
        <button onClick={()=>setM(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4 text-slate-500"/></button>
      </div>
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-3.5 border border-teal-100 mb-3 flex justify-between items-center">
        <span className="text-xs text-teal-700 font-medium">标准洗 ¥4/次</span>
        <span className="text-xs font-bold text-teal-800 bg-white px-3 py-1 rounded-full shadow-sm">余额 ¥{p.cardBalance.toFixed(2)}</span>
      </div>
      <div className="space-y-2.5">{ws.map(w=><div key={w.id} className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-teal-100 transition-colors">
        <div><p className="font-semibold text-sm text-slate-800">{w.name}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">状态：<span className={'font-semibold '+(w.st==='空闲'?'text-green-600':w.st==='工作中'?'text-blue-500':'text-red-500')}>{w.st}</span>
          {w.rm>0&&<span className="text-slate-400 ml-2">排队{w.rm}人</span>}</p></div>
        {w.st==='故障'?<button className="px-3 py-1.5 bg-red-50 text-red-400 rounded-full text-xs border border-red-100">不可用</button>
        :w.bk?<button onClick={()=>setWs(ws.map(x=>x.id===w.id?{...x,bk:false,st:'空闲',rm:0}:x))} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100 hover:bg-blue-100">取消</button>
        :<button onClick={()=>{if(p.cardBalance<4){toast.error('余额不足');return}p.onUpdateCardBalance(p.cardBalance-4);p.onAddSystemNotification('缴费成功','洗衣预约成功','已支付 ¥4，请在预约时间使用洗衣机');setWs(ws.map(x=>x.id===w.id?{...x,bk:true,st:'工作中',rm:35}:x));}} disabled={w.st==='使用中'} className={'px-4 py-1.5 rounded-full text-xs font-bold transition-all '+(w.st==='使用中'?'bg-slate-100 text-slate-400':'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm shadow-teal-200 hover:shadow-md')}>预约 ¥4</button>}
      </div>)}</div>
    </div></div>}

    {m==='repair'&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4"><div className="bg-white rounded-t-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 shadow-xl animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-blue-700 flex items-center gap-2"><Wrench className="w-5 h-5"/> 宿舍报修</h3>
        <button onClick={()=>setM(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4 text-slate-500"/></button>
      </div>
      <RepairForm onAdd={p.onAddRepairRecord} onClose={()=>setM(null)} onNotif={p.onAddSystemNotification}/>
    </div></div>}

    {m==='events'&&<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-5 shadow-xl animate-scale-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-600"/> 校园活动</h3>
        <button onClick={()=>setM(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4 text-slate-500"/></button>
      </div>
      {p.eventsList.map(ev=>{
        const ratio=ev.capacity>0?Math.round(ev.registeredCount/ev.capacity*100):0;
        const isHot=ratio>=80;
        return <div key={ev.id} className="bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100 hover:border-purple-100 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full '+(ev.tag==='讲座'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700')}>{ev.tag}</span>
            <div className="flex items-center gap-1">
              {isHot&&<Flame className="w-3 h-3 text-red-400"/>}
              <span className={'text-xs font-bold '+(isHot?'text-red-500':'text-purple-600')}>{ev.registeredCount}/{ev.capacity}</span>
            </div>
          </div>
          <p className="font-bold text-sm text-slate-800 mb-1">{ev.title}</p>
          <p className="text-xs text-slate-500 mb-2">{ev.description}</p>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{ev.time}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{ev.location}</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
            <div className={'h-full rounded-full transition-all '+(isHot?'bg-gradient-to-r from-red-400 to-pink-500':'bg-gradient-to-r from-purple-400 to-pink-400')} style={{width:ratio+'%'}}></div>
          </div>
          {p.myEvents.includes(ev.id)?
            <div className="space-y-1.5"><div className="bg-emerald-50 text-emerald-700 text-xs text-center py-2.5 rounded-xl border border-emerald-100 font-medium flex items-center justify-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> 已报名</div>
            <button onClick={()=>p.onToggleEventRegistration(ev.id)} className="w-full py-2 border border-red-200 text-red-500 text-xs rounded-xl font-medium hover:bg-red-50 transition-colors">取消报名</button></div>
            :<button onClick={()=>p.onToggleEventRegistration(ev.id)} disabled={ev.registeredCount>=ev.capacity}
              className={'w-full py-2.5 rounded-xl text-sm font-bold transition-all '+(ev.registeredCount>=ev.capacity?'bg-slate-200 text-slate-400 cursor-not-allowed':'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-200 hover:shadow-lg active:scale-[0.98]')}>
              {ev.registeredCount>=ev.capacity?'名额已满':'立即报名'}
            </button>}
        </div>;
      })}
    </div></div>}

    {m==='flea'&&<FleaModal items={p.fleaItems} onAdd={p.onAddFleaItem} onClose={()=>setM(null)} balance={p.cardBalance} onBuyItem={p.onBuyFleaItem} onNotif={p.onAddSystemNotification}/>}

    {m==='lostfound'&&<LFModal items={p.lostFoundItems} onAdd={p.onAddLostFoundItem} onClose={()=>setM(null)}/>}
  </div>;
}

function FleaModal({items,onAdd,onClose,balance,onBuyItem,onNotif}:{items:FleaItem[];onAdd:(i:FleaItem)=>void;onClose:()=>void;balance:number;onBuyItem:(id:string,c:number)=>void;onNotif:(c:string,t:string,ct:string)=>void}){
  const [title,setTitle]=useState('');const [price,setPrice]=useState('');const [desc,setDesc]=useState('');const [contact,setContact]=useState('');const [show,setShow]=useState(false);
  return <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-5 shadow-xl animate-scale-in">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2"><h3 className="font-bold text-amber-700"><Store className="w-5 h-5 inline"/> 跳蚤市场</h3><span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full">余额 ¥{balance.toFixed(2)}</span></div>
      <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4 text-slate-500"/></button>
    </div>
    {items.map(f=><div key={f.id} className={'bg-slate-50 rounded-2xl p-4 mb-2.5 border transition-colors '+(f.purchased?'border-emerald-200 opacity-70':'border-slate-100 hover:border-amber-100')}>
      <div className="flex justify-between items-start"><div><p className="font-semibold text-sm text-slate-800">{f.title}</p><p className="text-xs text-slate-500 mt-0.5">{f.description}</p></div><span className={'font-bold shrink-0 ml-2 '+(f.purchased?'text-emerald-500':'text-amber-700')}>¥{f.price}</span></div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/50 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[8px] flex items-center justify-center font-bold">{f.seller[0]}</span>{f.seller} · {f.time}</span>
        <div className="flex gap-2">
          <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{f.contact}</span>
          {f.purchased?<span className="px-3 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-bold flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5"/>已购买</span>
          :<button onClick={()=>{if(balance<f.price){onNotif('系统通知','余额不足','校园卡余额不足，请先充值');return}onBuyItem(f.id,f.price);onNotif('缴费成功','购买成功','已购买 '+f.title+'，花费 ¥'+f.price+'，请联系卖家 '+f.contact+' 取货');}} className="px-3 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[9px] font-bold shadow-sm hover:shadow-md transition-shadow">购买</button>}
        </div>
      </div>
    </div>)}
    <button onClick={()=>setShow(!show)} className="w-full mt-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200 hover:shadow-lg transition-shadow">{show?'取消':'发布闲置'}</button>
    {show&&<div className="mt-3 bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-200">
      <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-400 transition-colors" placeholder="物品名称"/>
      <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-400" placeholder="价格 ¥"/>
      <input value={contact} onChange={e=>setContact(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-400" placeholder="联系方式"/>
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none h-16 resize-none focus:border-amber-400" placeholder="物品描述"/>
      <button onClick={()=>{
        if(!title.trim()||!price.trim()){toast.error('请填写名称和价格');return;}
        onAdd({id:String(Date.now()),title:title.trim(),price:Number(price),description:desc||'暂无描述',seller:'我',time:'刚刚',contact:contact||'无'});
        setTitle('');setPrice('');setDesc('');setContact('');setShow(false);
        toast.success('发布成功！');
      }} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-shadow">确认发布</button>
    </div>}
  </div></div>;
}

function LFModal({items,onAdd,onClose}:{items:LostFoundItem[];onAdd:(i:LostFoundItem)=>void;onClose:()=>void}){
  const [type,setType]=useState<'lost'|'found'>('lost');const [title,setTitle]=useState('');const [loc,setLoc]=useState('');const [contact,setContact]=useState('');const [desc,setDesc]=useState('');const [show,setShow]=useState(false);const [clue,setClue]=useState<{id:string;show:boolean;text:string}>({id:'',show:false,text:''});
  return <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto p-5 shadow-xl animate-scale-in">
    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-emerald-700 flex items-center gap-2"><Compass className="w-5 h-5"/> 失物招领</h3><button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><X className="w-4 h-4 text-slate-500"/></button></div>
    {items.map(l=><div key={l.id} className="bg-slate-50 rounded-2xl p-4 mb-2.5 border border-slate-100 hover:border-emerald-100 transition-colors">
      <div className="flex items-center gap-2 mb-2"><span className={'px-2 py-0.5 rounded-full text-[10px] font-semibold '+(l.type==='lost'?'bg-red-100 text-red-600':'bg-emerald-100 text-emerald-700')}>{l.type==='lost'?'寻物':'招领'}</span><p className="font-semibold text-sm text-slate-800">{l.title}</p></div>
      <p className="text-xs text-slate-500">{l.description}</p>
      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-3 pt-3 border-t border-slate-200/50">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{l.location}</span>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{l.contact}</span>
          <button onClick={()=>setClue({id:l.id,show:true,text:''})} className="px-3 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-medium hover:bg-emerald-200 transition-colors">提供线索</button>
        </div>
      </div>
      {clue.show&&clue.id===l.id&&<div className="mt-2 bg-white rounded-xl p-2 border border-emerald-100 flex gap-2">
        <input value={clue.text} onChange={e=>setClue({...clue,text:e.target.value})} className="flex-1 text-xs outline-none" placeholder="输入您知道的线索..." autoFocus/>
        <button onClick={()=>{if(!clue.text.trim())return;toast.success('感谢您的线索！已通知失主。');setClue({id:'',show:false,text:''});}} className="shrink-0 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-[10px] font-bold shadow-sm">发送</button>
      </div>}
    </div>)}
    <button onClick={()=>setShow(!show)} className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 hover:shadow-lg transition-shadow">{show?'取消':'发布信息'}</button>
    {show&&<div className="mt-3 bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-200">
      <div className="flex gap-2"><button onClick={()=>setType('lost')} className={'flex-1 py-1.5 rounded-full text-xs font-semibold border transition-all '+(type==='lost'?'bg-red-500 text-white border-red-500 shadow-sm':'bg-white text-slate-600 border-slate-200 hover:border-red-200')}>寻物</button>
      <button onClick={()=>setType('found')} className={'flex-1 py-1.5 rounded-full text-xs font-semibold border transition-all '+(type==='found'?'bg-emerald-500 text-white border-emerald-500 shadow-sm':'bg-white text-slate-600 border-slate-200 hover:border-emerald-200')}>招领</button></div>
      <div className="grid grid-cols-2 gap-2"><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-400" placeholder="物品名称"/><input value={loc} onChange={e=>setLoc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-400" placeholder="地点"/></div>
      <input value={contact} onChange={e=>setContact(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-400" placeholder="联系方式"/>
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-none h-16 resize-none focus:border-emerald-400" placeholder="详细描述"/>
      <button onClick={()=>{
        if(!title.trim()||!loc.trim()){toast.error('请填写名称和地点');return;}
        onAdd({id:String(Date.now()),type,title:title.trim(),location:loc,time:'刚刚',contact:contact||'无',status:'processing',description:desc||'暂无详细描述'});
        setTitle('');setLoc('');setContact('');setDesc('');setShow(false);
        toast.success('发布成功！');
      }} className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-shadow">确认发布</button>
    </div>}
  </div></div>;
}

function RepairForm({onAdd,onClose,onNotif}:{onAdd:(r:RepairRecord)=>void;onClose:()=>void;onNotif:(c:string,t:string,ct:string)=>void}){
  const [cat,setCat]=useState('电路故障');const [desc,setDesc]=useState('');const [loc,setLoc]=useState('3号楼520室');const [ph,setPh]=useState('138xxxx9988');
  return <div>
    <div className="flex flex-wrap gap-2 mb-3">{['电路故障','水管漏水','家具损坏','网络故障','其他'].map(c=>
      <button key={c} onClick={()=>setCat(c)} className={'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all '+(cat===c?'bg-blue-600 text-white border-blue-600 shadow-sm':'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-200')}>{c}</button>
    )}</div>
    <input value={loc} onChange={e=>setLoc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none mb-2 focus:border-blue-400 transition-colors" placeholder="位置"/>
    <input value={ph} onChange={e=>setPh(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none mb-2 focus:border-blue-400" placeholder="电话"/>
    <textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none h-20 resize-none mb-2 focus:border-blue-400" placeholder="描述故障"/>
    <button onClick={()=>{
      if(!desc.trim()){toast.error('请描述故障');return;}
      onAdd({id:String(Date.now()),category:cat as any,description:desc,location:loc,time:new Date().toLocaleDateString(),status:'pending',contact:ph});
      onNotif('系统通知','报修已受理','您的报修已提交');
      toast.success('报修成功！');onClose();
    }} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md shadow-blue-200 hover:shadow-lg transition-shadow">提交报修</button>
  </div>;
}

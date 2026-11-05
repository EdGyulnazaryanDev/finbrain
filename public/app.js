
/* ================== I18N ================== */
const KEY='finbrain-v1';
let LANG='ru';try{LANG=localStorage.getItem(KEY+'-lang')||'ru'}catch(e){}
const LI=()=>LANG==='en'?1:LANG==='hy'?2:0;
const T=(ru,en,hy)=>[ru,en,hy][LI()];
const L=a=>a[LI()];
const LOC=()=>['ru-RU','en-US','hy-AM'][LI()];
const MONTHS=()=>L([['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],['հուն','փետ','մար','ապր','մայ','հուն','հուլ','օգս','սեպ','հոկ','նոյ','դեկ']]);
const MONTHSF=()=>L([['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],['January','February','March','April','May','June','July','August','September','October','November','December'],['հունվար','փետրվար','մարտ','ապրիլ','մայիս','հունիս','հուլիս','օգոստոս','սեպտեմբեր','հոկտեմբեր','նոյեմբեր','դեկտեմբեր']]);

const STAGES={preschool:['Детсад / малыш','Preschool / toddler','Մանկապարտեզ / փոքրիկ'],school:['Школа','School','Դպրոց'],university:['Университет','University','Համալսարան'],none:['Взрослый / без расходов','Adult / no costs','Չափահաս / առանց ծախսի']};
const CATS={food:[['Еда и продукты','Food & groceries','Սնունդ և մթերք'],'need'],health:[['Здоровье, аптека','Health, pharmacy','Առողջություն, դեղատուն'],'need'],transport:[['Транспорт (такси, автобус)','Transport (taxi, bus)','Տրանսպորտ (տաքսի, ավտոբուս)'],'need'],clothes:[['Одежда','Clothing','Հագուստ'],'need'],fun:[['Кафе и развлечения','Cafes & fun','Սրճարաններ և զվարճանք'],'want'],subs:[['Подписки','Subscriptions','Բաժանորդագրություններ'],'want'],gifts:[['Подарки','Gifts','Նվերներ'],'want'],travel:[['Путешествия','Travel','Ճամփորդություն'],'want'],other:[['Другое','Other','Այլ'],'want']};
const LTYPE={consumer:['Потребкредит','Consumer loan','Սպառողական վարկ'],card:['Кредитная карта','Credit card','Վարկային քարտ'],car:['Автокредит','Car loan','Ավտովարկ'],mortgage:['Ипотека','Mortgage','Հիփոթեք'],short:['Короткий займ / микрозайм','Short-term / payday loan','Կարճաժամկետ / միկրովարկ'],other:['Другое','Other','Այլ']};
const ATYPE={current:[['Текущий счёт / карта','Current account / card','Ընթացիկ հաշիվ / քարտ'],1],savings:[['Накопительный счёт','Savings account','Խնայողական հաշիվ'],1],deposit:[['Депозит','Deposit','Ավանդ'],1],cash:[['Наличные','Cash','Կանխիկ'],1],invest:[['Брокерский счёт / акции','Brokerage / stocks','Բրոքերային հաշիվ / բաժնետոմսեր'],0]};
const SYM={AMD:'֏',RUB:'₽',USD:'$',EUR:'€'};

/* ================== STATE ================== */
function num0(v){const n=parseFloat(v);return isFinite(n)?n:0}
function nlDefault(){return{kind:'mortgage',price:30000000,down:6000000,amount:1500000,rate:12,years:20,months:24,days:30,dayRate:0.5,fee:200000,acc:0,moveIn:true,bank:''}}
function demo(){return{
  currency:'AMD',
  profile:{married:true,partnerIncome:350000,
    kids:[{name:T('Аня','Anna','Աննա'),stage:'school',monthly:40000,tuitionYear:0},{name:T('Давид','David','Դավիթ'),stage:'university',monthly:30000,tuitionYear:900000}],
    car:{has:true,fuel:40000,parking:0,insurance:60000,service:120000,tax:30000},
    housing:{type:'rent',rent:150000,maint:0},
    util:{electricity:15000,gas:20000,water:4000,internet:8000,phone:6000,building:5000}},
  incomes:[{name:T('Зарплата','Salary','Աշխատավարձ'),amount:600000}],
  expenses:[{name:T('Продукты','Groceries','Մթերք'),cat:'food',amount:150000},{name:T('Аптека, врачи','Pharmacy, doctors','Դեղատուն, բժիշկներ'),cat:'health',amount:20000},{name:T('Одежда','Clothing','Հագուստ'),cat:'clothes',amount:25000},{name:T('Кафе, кино','Cafes, cinema','Սրճարան, կինո'),cat:'fun',amount:40000},{name:T('Подписки','Subscriptions','Բաժանորդագրություններ'),cat:'subs',amount:5000},{name:T('Разное','Misc','Տարբեր'),cat:'other',amount:25000}],
  loans:[{name:T('Потребкредит','Consumer loan','Սպառողական վարկ'),bank:'Ameriabank',type:'consumer',balance:2500000,rate:18,payment:90000,day:10},{name:T('Кредитная карта','Credit card','Վարկային քարտ'),bank:'ACBA',type:'card',balance:400000,rate:24,payment:25000,day:25},{name:T('Автокредит','Car loan','Ավտովարկ'),bank:'Ardshinbank',type:'car',balance:4000000,rate:14,payment:110000,day:5}],
  set:{dep:9,inv:8,tax:10,infl:4},
  adv:{amount:500000,mode:'once',horizon:0},
  accounts:[{bank:'Ameriabank',type:'current',balance:250000,rate:0},{bank:'ACBA',type:'deposit',balance:300000,rate:9},{bank:T('Наличные','Cash','Կանխիկ'),type:'cash',balance:50000,rate:0}],
  nl:nlDefault()
}}
function emptyState(){return{
  currency:'AMD',
  profile:{married:false,partnerIncome:0,kids:[],
    car:{has:false,fuel:0,parking:0,insurance:0,service:0,tax:0},
    housing:{type:'own',rent:0,maint:0},
    util:{electricity:0,gas:0,water:0,internet:0,phone:0,building:0}},
  incomes:[],expenses:[],loans:[],accounts:[],reminders:[],
  set:{dep:9,inv:8,tax:10,infl:4},
  adv:{amount:0,mode:'once',horizon:0},
  nl:{kind:'mortgage',price:0,down:0,amount:0,rate:0,years:20,months:24,days:30,dayRate:0,fee:0,acc:0,moveIn:true,bank:''}
}}
function normalize(d){const e=emptyState();if(!d||!d.profile)return e;
  for(const k of Object.keys(e))if(d[k]===undefined)d[k]=e[k];
  for(const k of Object.keys(e.profile))if(d.profile[k]===undefined)d.profile[k]=e.profile[k];
  return d}
let S=emptyState();
try{localStorage.removeItem(KEY)}catch(e){} // бюджет хранится только на сервере
let USER=null,AIENABLED=false,syncTimer=null,AUTH='checking';
function save(){recordHist();if(USER){clearTimeout(syncTimer);syncTimer=setTimeout(pushBudget,800)}}
async function api(path,opts={}){
  const r=await fetch(path,{credentials:'same-origin',...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}});
  let j=null;try{j=await r.json()}catch(_){}
  if(!r.ok){const e=new Error(j?.error||('HTTP '+r.status));e.status=r.status;e.code=j?.error;throw e}
  return j;
}
async function pushBudget(){try{await api('/api/budget',{method:'PUT',body:JSON.stringify({data:{...S,lang:LANG}})});setSync('ok')}catch(e){setSync(e.status===401?'out':'err')}}
function setSync(st){const el=$('#syncst');if(el)el.textContent=st==='ok'?'☁️ ✓':st==='err'?'☁️ ⚠':''}
let tab='home'; try{tab=localStorage.getItem(KEY+'-tab')||'home'}catch(e){}

/* ================== HELPERS ================== */
const $=s=>document.querySelector(s);
const num=v=>{const n=parseFloat(String(v).replace(/\s/g,'').replace(',','.'));return isFinite(n)?n:0};
const fmt=n=>(n<0?'−':'')+Math.round(Math.abs(n)).toLocaleString(LOC())+' '+SYM[S.currency];
const pct=n=>(isFinite(n)?(Math.round(n*10)/10):0)+'%';
const k1=n=>Math.abs(n)>=1e6?(Math.round(n/1e5)/10).toLocaleString(LOC())+'M':Math.round(n/1000).toLocaleString(LOC())+'k';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function addMonths(d,m){return new Date(d.getFullYear(),d.getMonth()+m,1)}
function monthLabel(m){if(!isFinite(m))return T('никогда','never','երբեք');const d=addMonths(new Date(),Math.ceil(m));return MONTHSF()[d.getMonth()]+' '+d.getFullYear()}
function dur(m){if(!isFinite(m))return '∞';m=Math.ceil(m);const y=Math.floor(m/12),r=m%12;return (y?y+' '+T('г.','y','տ.')+' ':'')+(r||!y?r+' '+T('мес.','mo','ամս.'):'')}
const MO=()=>T('мес.','mo','ամս.');
function getPath(p){if(p==='IMPMBAL')return IMPopt.mBal;if(p==='IMPMRATE')return IMPopt.mRate;return p.split('.').reduce((o,k)=>o?.[k],S)}
function setPath(p,v){if(p==='IMPMBAL'){IMPopt.mBal=v;return}if(p==='IMPMRATE'){IMPopt.mRate=v;return}const ks=p.split('.');let o=S;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks.at(-1)]=v}
function nextDate(day){const t=new Date();t.setHours(0,0,0,0);let d=new Date(t.getFullYear(),t.getMonth(),Math.min(day,dim(t.getFullYear(),t.getMonth())));if(d<t)d=new Date(t.getFullYear(),t.getMonth()+1,Math.min(day,dim(t.getFullYear(),t.getMonth()+1)));return d}
function dim(y,m){return new Date(y,m+1,0).getDate()}

/* ================== FINANCE ENGINE ================== */
/* ---- виды погашения: ежемесячно / одной суммой к дате / по графику ---- */
function loanMode(l){return l.mode||(Array.isArray(l.schedule)&&l.schedule.length?(l.schedule.length===1?'once':'plan'):'monthly')}
const isTemp=l=>loanMode(l)!=='monthly';
function ymDay(ym,day){const [y,m]=ym.split('-').map(Number);return ym+'-'+String(Math.min(num(day)||1,dim(y,m-1))).padStart(2,'0')}
function loanDue(l){if(l.due)return l.due;if(Array.isArray(l.schedule)&&l.schedule.length)return ymDay(l.schedule[l.schedule.length-1].ym,l.day);return null}
function loanPlan(l){const md=loanMode(l);
  if(md==='once'){const d=loanDue(l);return d?[{date:d,amount:num(l.balance)}]:[]}
  if(md==='plan')return (l.schedule||[]).map(x=>({date:ymDay(x.ym,l.day),amount:num(x.amount)})).sort((a,b)=>a.date.localeCompare(b.date));
  return []}
function monthsUntil(ds){const d=new Date(ds+'T00:00:00'),t=new Date();return (d.getFullYear()-t.getFullYear())*12+(d.getMonth()-t.getMonth())}
const daysUntil=ds=>{const t=new Date();t.setHours(0,0,0,0);return Math.round((new Date(ds+'T00:00:00')-t)/864e5)};
function loanInfo(l){
  const B=num(l.balance),r=num(l.rate)/1200,P=num(l.payment);
  if(isTemp(l)){const pl=loanPlan(l),last=pl[pl.length-1];let I=0;if(loanMode(l)==='plan'&&r>0&&last){let b=B;const L=Math.max(1,monthsUntil(last.date)+1);for(let m=1;m<=L&&b>0.01;m++){const i=b*r;I+=i;b+=i;const pay=m>=L?b:pl.filter(x=>Math.max(1,monthsUntil(x.date)+1)===m).reduce((a,x)=>a+x.amount,0);b-=Math.min(pay,b)}}
    return{n:B<=0?0:last?Math.max(0,monthsUntil(last.date))+1:Infinity,interest:I,ok:B<=0||!!last,minPay:0,temp:true,due:last?.date}}
  if(B<=0)return{n:0,interest:0,ok:true,minPay:0};
  if(P<=0)return{n:Infinity,interest:Infinity,ok:false,minPay:B*r};
  if(r===0)return{n:B/P,interest:0,ok:true,minPay:0};
  if(P<=B*r)return{n:Infinity,interest:Infinity,ok:false,minPay:B*r};
  const n=-Math.log(1-r*B/P)/Math.log(1+r);
  let b=B,I=0,k=0;while(b>0.01&&k<1200){const i=b*r;I+=i;b=b+i-Math.min(P,b+i);k++}
  return{n,interest:I,ok:true,minPay:B*r};
}
function annuity(B,rateY,n){const r=rateY/1200;if(n<=0)return B;if(r===0)return B/n;return B*r/(1-Math.pow(1+r,-n))}
function simulate(loans,{extra=0,lump=0,order='avalanche',rollover=true}={}){
  let Ls=loans.map((l,i)=>{const t=isTemp(l),pm={};if(t)loanPlan(l).forEach(x=>{const k=Math.max(1,monthsUntil(x.date)+1);pm[k]=(pm[k]||0)+x.amount});return{i,b:num(l.balance),r:(t&&loanMode(l)==='once')?0:num(l.rate)/1200,p:t?0:num(l.payment),done:null,temp:t,pm,last:t?Math.max(1,...Object.keys(pm).map(Number)):0}});
  const sortFn=order==='avalanche'?(a,b)=>b.r-a.r||a.b-b.b:(a,b)=>a.b-b.b||b.r-a.r;
  const pay=amt=>{for(const l of [...Ls].filter(x=>x.b>0.01).sort(sortFn)){if(amt<=0)break;const t=Math.min(amt,l.b);l.b-=t;amt-=t}return amt};
  pay(lump);
  let m=0,I=0;const curve=[Ls.reduce((s,l)=>s+l.b,0)];
  while(Ls.some(l=>l.b>0.01)&&m<600){
    m++;let pool=extra;
    for(const l of Ls){
      if(l.b<=0.01){if(rollover)pool+=l.p;continue}
      const i=l.b*l.r;I+=i;l.b+=i;const due=l.temp?(m>=l.last?l.b:(l.pm[m]||0)):l.p;const t=Math.min(due,l.b);l.b-=t;
      if(rollover&&!l.temp)pool+=l.p-t;
    }
    pool=pay(pool);
    curve.push(Ls.reduce((s,l)=>s+Math.max(0,l.b),0));
  }
  const stuck=Ls.some(l=>l.b>0.01);
  return{months:stuck?Infinity:m,interest:I,curve};
}
function fvLump(S0,rateY,months,tax){const g=S0*(Math.pow(1+rateY/1200,months)-1);return S0+g*(1-tax/100)}
function fvMonthly(A,rateY,months,tax){const r=rateY/1200;const fv=r===0?A*months:A*(Math.pow(1+r,months)-1)/r;const g=fv-A*months;return A*months+g*(1-tax/100)}

/* ---- периодические доходы (раз в квартал / год / однократно) ---- */
const INC_FREQ={monthly:['Каждый месяц','Monthly','Ամեն ամիս'],quarterly:['Раз в квартал','Quarterly','Եռամսյակը մեկ'],yearly:['Раз в год','Yearly','Տարին մեկ'],once:['Один раз','Once','Մեկ անգամ']};
const incFreq=x=>x.freq||'monthly';
const quarterMonths=x=>{const st=num(x.month)||1;return [0,3,6,9].map(k=>((st-1+k)%12)+1).sort((a,b)=>a-b)};
function incomeInMonth(x,date){const f=incFreq(x),mo=date.getMonth()+1;if(f!=='once'&&!activeIn(x,ymd(date).slice(0,7)))return 0;
  if(f==='monthly')return num(x.amount);
  if(f==='quarterly')return quarterMonths(x).includes(mo)?num(x.amount):0;
  if(f==='yearly')return mo===(num(x.month)||1)?num(x.amount):0;
  if(f==='once')return x.date&&x.date.slice(0,7)===ymd(date).slice(0,7)?num(x.amount):0;
  return 0}
const incAvg=x=>{const f=incFreq(x);return f==='quarterly'?num(x.amount)/3:f==='yearly'?num(x.amount)/12:0};
function incWhen(x){const f=incFreq(x);if(f==='quarterly')return quarterMonths(x).map(m=>MONTHS()[m-1]).join(', ');if(f==='yearly')return MONTHSF()[(num(x.month)||1)-1];if(f==='once')return x.date?fdate(x.date):'—';return ''}
function migrateRefund(){ // старый импорт: возврат налога лежал событиями прогноза → один периодический доход
  const ev=(S.scen?.events||[]).filter(e=>e.src==='xlsx'&&e.type==='oneIncome'&&/налог|tax|հարկ/i.test(e.note||''));
  if(!ev.length)return false;
  S.scen.events=S.scen.events.filter(e=>!ev.includes(e));
  if(!S.incomes.some(x=>incFreq(x)==='quarterly'&&/налог|tax|հարկ/i.test(x.name||''))){const fm=Math.min(...ev.map(e=>e.month));const mo=addMonths(new Date(),fm-1).getMonth()+1;
    S.incomes.push({name:T('Возврат налога (ипотека)','Mortgage tax refund','Հիփոթեքի հարկի վերադարձ'),amount:num(ev[0].amount),freq:'quarterly',month:((mo-1)%3)+1,day:20,src:'xlsx'})}
  return true}
function calc(){
  const p=S.profile;
  const income=S.incomes.filter(x=>incFreq(x)==='monthly'&&activeNow(x)).reduce((s,x)=>s+num(x.amount),0)+(p.married?num(p.partnerIncome):0);
  const irregList=S.incomes.filter(x=>incFreq(x)!=='monthly'&&num(x.amount)>0&&(incFreq(x)==='once'||activeNow(x))),irregAvg=irregList.reduce((s,x)=>s+incAvg(x),0);
  const kids=p.kids.reduce((s,k)=>s+num(k.monthly)+num(k.tuitionYear)/12,0);
  const car=p.car.has?num(p.car.fuel)+num(p.car.parking)+(num(p.car.insurance)+num(p.car.service)+num(p.car.tax))/12:0;
  const housing=p.housing.type==='rent'?num(p.housing.rent):num(p.housing.maint);
  const util=Object.values(p.util).reduce((s,v)=>s+num(v),0);
  let need=0,want=0;S.expenses.forEach(e=>{if(!activeNow(e))return;(CATS[e.cat]?.[1]==='need')?need+=num(e.amount):want+=num(e.amount)});
  const curYm0=ymd(new Date()).slice(0,7);
  const loans=S.loans.filter(l=>!isTemp(l)&&activeNow(l)&&num(l.balance)>0).reduce((s,l)=>s+Math.min(num(l.payment),num(l.balance)*(1+num(l.rate)/1200)),0);
  const loansT=S.loans.filter(isTemp).reduce((s,l)=>s+[...(num(l.balance)>0?loanPlan(l):[]),...(l.paidLog||[])].filter(x=>x.date.slice(0,7)===curYm0).reduce((a,x)=>a+num(x.amount),0),0);
  const soonList=S.loans.filter(isTemp).flatMap(l=>num(l.balance)>0?loanPlan(l).map(x=>({...x,l,days:daysUntil(x.date)})):[]).filter(x=>x.days<=30).sort((a,b)=>a.date.localeCompare(b.date));
  const soonPay=soonList.reduce((s,x)=>s+x.amount,0);
  const debt=S.loans.reduce((s,l)=>s+num(l.balance),0);
  const needs=need+kids+car+housing+util;
  const planPay=PLANS().filter(p=>p.kind!=='save'&&activeNow(p)).reduce((s,p)=>s+planMonthly(p),0),planSave=PLANS().filter(p=>p.kind==='save'&&activeNow(p)).reduce((s,p)=>s+planMonthly(p),0);
  const spend=needs+want+loans+loansT+planPay;
  const fcf=income-spend;
  const savingsRate=income>0?fcf/income*100:0;
  const dti=income>0?loans/income*100:0;
  const essential=needs+loans;
  const accs=S.accounts||[];
  const savings=accs.filter(a=>ATYPE[a.type]?.[1]).reduce((s,a)=>s+num(a.balance),0);
  const assets=accs.reduce((s,a)=>s+num(a.balance),0);
  const passive=accs.reduce((s,a)=>s+num(a.balance)*num(a.rate)/1200,0)*(1-S.set.tax/100);
  const cushion=essential>0?savings/essential:0;
  const earners=(S.incomes.filter(x=>num(x.amount)>0).length?1:0)+(p.married&&num(p.partnerIncome)>0?1:0);
  const target=(p.kids.length>0||earners<=1)?6:3;
  const infos=S.loans.map(loanInfo);
  const free=Math.max(...infos.map(i=>i.n),0);
  let sc=0;
  sc+=Math.max(0,Math.min(30,savingsRate/20*30));
  sc+=dti<=20?25:dti<=35?15:dti<=50?6:0;
  sc+=Math.min(25,cushion/target*25);
  const needShare=income>0?needs/income*100:100;
  sc+=needShare<=50?20:needShare<=65?12:needShare<=80?5:0;
  if(fcf<0)sc=Math.min(sc,25);
  return{income,kids,car,housing,util,need,want,loans:loans+loansT,debt,needs,spend,fcf,savingsRate,dti,cushion,target,essential,infos,free,soonList,soonPay,irregList,irregAvg,planPay,loansM:loans,loansT,planSave,score:Math.round(sc),needShare,earners,savings,assets,passive,net:assets-debt};
}

/* ================== UI PRIMITIVES ================== */
const inp=(path,label,type='num',list='')=>`<label class="f">${label}<input ${type==='num'?'inputmode="decimal"':''}${list?` list="${list}" autocomplete="off"`:''} data-k="${path}" data-t="${type}" value="${type==='num'&&!num(getPath(path))?'':esc(getPath(path))}"${type==='num'?' placeholder="0"':''}></label>`;
const lab=v=>Array.isArray(v)?(Array.isArray(v[0])?L(v[0]):typeof v[0]==='string'&&v.length===3?L(v):v[0]):v;
const sel=(path,label,opts)=>`<label class="f">${label}<select data-k="${path}" data-t="str">${Object.entries(opts).map(([k,v])=>`<option value="${k}" ${String(getPath(path))===String(k)?'selected':''}>${esc(lab(v))}</option>`).join('')}</select></label>`;
const seg=(path,opts)=>`<div class="seg">${opts.map(([v,l])=>`<button data-seg="${path}" data-v="${v}" class="${String(getPath(path))===String(v)?'on':''}">${l}</button>`).join('')}</div>`;
const tipH=(k,h,b)=>`<div class="tip ${k}"><b>${h}</b>${b}</div>`;
const edu=()=>'';
const stat=(l,v,cl='')=>`<div><div class="muted" style="font-size:12px">${l}</div><div class="big ${cl}">${v}</div></div>`;

/* ================== NAVIGATION + PAGE HEADERS ================== */
const PAGES={
  home:['📊',['Обзор','Overview','Ամփոփում'],['Главное за выбранный период: капитал, долги, доходы и расходы, ближайшие платежи','Key numbers for the chosen period: net worth, debts, income and spending, upcoming payments','Գլխավորը ընտրված ժամանակահատվածում. կապիտալ, պարտքեր, եկամուտներ և ծախսեր, մոտակա վճարումներ']],
  money:['💸',['Доходы и расходы','Income & spending','Եկամուտներ և ծախսեր'],['Регулярные доходы и ежемесячные траты','Regular income and monthly spending','Կանոնավոր եկամուտներ և ամսական ծախսեր']],
  ops:['🧾',['Операции','Transactions','Գործարքներ'],['Разовые траты и поступления по датам','One-off spending and income by date','Միանվագ ծախսեր և մուտքեր ըստ ամսաթվերի']],
  accounts:['💳',['Счета','Accounts','Հաշիվներ'],['Деньги на картах, вкладах и наличными','Money on cards, deposits and in cash','Գումարներ քարտերում, ավանդներում և կանխիկ']],
  loans:['🏦',['Кредиты','Loans','Վարկեր'],['Кредиты и займы, даты платежей, импорт из Excel, новый кредит','Loans, payment dates, Excel import, planning a new loan','Վարկեր, վճարման ամսաթվեր, Excel ներմուծում, նոր վարկ']],
  calc:['🧮',['Калькуляторы','Calculators','Հաշվիչներ'],['Зарплата, кредит, ипотека, досрочное погашение','Salary, loan, mortgage, prepayment','Աշխատավարձ, վարկ, հիփոթեք, վաղաժամկետ մարում']],
  plans:['🎯',['Регулярные и цели','Recurring & goals','Պարբերական և նպատակներ'],['Платежи и накопления с частотой и датой окончания','Payments and savings with a frequency and an end date','Վճարներ և խնայողություններ՝ հաճախականությամբ և ավարտի ամսաթվով']],
  forecast:['🔮',['Прогноз','Forecast','Կանխատեսում'],['Что будет через 3–24 месяца при вашем плане','Where you’ll be in 3–24 months with your plan','Ինչ կլինի 3–24 ամսից ձեր պլանով']],
  advice:['💡',['Лишние деньги','Extra money','Ազատ գումար'],['Куда выгоднее направить свободные деньги','Where spare money works best','Ուր է ավելի շահավետ ուղղել ազատ գումարը']],
  reminders:['🔔',['Напоминания','Reminders','Հիշեցումներ'],['Ближайшие платежи и поступления','Upcoming payments and income','Մոտակա վճարումներ և մուտքեր']],
  analytics:['🩺',['Аналитика','Analytics','Վերլուծություն'],['Финансовое здоровье и выводы','Financial health and insights','Ֆինանսական առողջություն և եզրակացություններ']],
  market:['📈',['Рынок','Market','Շուկա'],['Ставки ЦБ, курсы валют, вклады и ипотека в банках','CBA rates, exchange rates, bank deposits and mortgages','ԿԲ տոկոսադրույքներ, փոխարժեքներ, ավանդներ և հիփոթեք բանկերում']],
  profile:['👨‍👩‍👧',['Семья и жильё','Family & home','Ընտանիք և բնակարան'],['Состав семьи, дети, жильё, коммунальные, машина','Household, kids, home, utilities, car','Ընտանիքի կազմ, երեխաներ, բնակարան, կոմունալ, մեքենա']],
};
const NAV=[[null,['home']],[['Деньги','Money','Գումար'],['money','ops','accounts']],[['Долги','Debts','Պարտքեր'],['loans','calc']],[['План','Plan','Պլան'],['forecast','plans','advice','reminders']],[['Анализ','Insights','Վերլուծություն'],['analytics','market']],[['Настройки','Settings','Կարգավորումներ'],['profile']]];
const NAV_PRI=['home','ops','loans','forecast'];
function renderNav(){
  const nav=$('#tabs');nav.className='side';
  nav.innerHTML=NAV.map(([g,items])=>`<div class="ng">${g?`<div class="ngt">${L(g)}</div>`:''}${items.map(k=>`<button data-t="${k}" class="${k===tab?'on':''} ${NAV_PRI.includes(k)?'pri':''}"><span class="ic">${PAGES[k][0]}</span><span>${L(PAGES[k][1])}</span></button>`).join('')}</div>`).join('')+`<button class="more" data-more="1"><span class="ic">☰</span><span>${T('Ещё','More','Ավելին')}</span></button>`;
}
const pageHead=k=>PAGES[k]?`<div class="ptitle"><h1>${PAGES[k][0]} ${L(PAGES[k][1])}</h1><p>${L(PAGES[k][2])}</p></div>`:'';

/* ================== HISTORY (daily snapshots) ================== */
function recordHist(){let ch=false;try{
  const c=calc(),d=ymd(new Date());S.hist=S.hist||[];
  const rec={d,inc:Math.round(c.income),sp:Math.round(c.spend),debt:Math.round(c.debt),sav:Math.round(c.savings),net:Math.round(c.net),sc:c.score};
  const last=S.hist[S.hist.length-1];if(last&&last.d===d){ch=JSON.stringify(last)!==JSON.stringify(rec);S.hist[S.hist.length-1]=rec}else{S.hist.push(rec);ch=true}
  if(S.hist.length>2000)S.hist.splice(0,S.hist.length-2000);
}catch(e){}return ch}
function homePeriod(){
  const t=new Date();t.setHours(0,0,0,0);
  const to=S.homeTo?new Date(S.homeTo+'T00:00:00'):t;
  let from;if(S.homeFrom)from=new Date(S.homeFrom+'T00:00:00');
  else if((S.homeRange||90)==='all'){const f=[...(S.hist||[]).map(h=>h.d),...(S.ops||[]).map(o=>o.date),...[...S.incomes,...S.expenses,...S.loans,...PLANS()].map(x=>x.from).filter(Boolean)].sort()[0];from=f?new Date(f+'T00:00:00'):new Date(t.getFullYear(),t.getMonth()-1,t.getDate())}
  else{from=new Date(t);from.setDate(from.getDate()-num(S.homeRange||90))}
  return{from,to,fromS:ymd(from),toS:ymd(to)};
}
const shortDate=d=>d.getDate()+' '+MONTHS()[d.getMonth()];
const monthShort=d=>MONTHS()[d.getMonth()]+' '+String(d.getFullYear()).slice(2);

function timeChart(series,from,to){
  const W=760,H=260,P=58,R=12;const all=series.flatMap(s=>s.pts.map(p=>p.v));if(!all.length)return '';
  let mx=Math.max(0,...all),mn=Math.min(0,...all);if(mx===mn)mx=mn+1;
  const t0=+from,t1=Math.max(+to,t0+864e5);const x=t=>P+(W-P-R)*(t-t0)/(t1-t0),y=v=>H-26-(H-40)*(v-mn)/(mx-mn);
  const grid=[mx,(mx+mn)/2,mn].map(v=>`<line x1="${P}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${P-6}" y="${y(v)+4}" font-size="11" text-anchor="end" fill="var(--muted)">${k1(v)}</text>`).join('')+(mn<0?`<line x1="${P}" x2="${W-R}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-dasharray="2 3"/>`:'');
  const span=(t1-t0)/864e5,ticks=[];
  if(span<=62){const d=new Date(t0);d.setDate(d.getDate()+((7-d.getDay())%7));for(;+d<=t1;d.setDate(d.getDate()+(span<=21?3:7)))ticks.push(new Date(d))}
  else{const d=new Date(new Date(t0).getFullYear(),new Date(t0).getMonth()+1,1),step=span>800?6:span>400?3:span>200?2:1;for(;+d<=t1;d.setMonth(d.getMonth()+step))ticks.push(new Date(d))}
  const tk=ticks.map(d=>`<line x1="${x(+d)}" x2="${x(+d)}" y1="${H-26}" y2="${H-22}" stroke="var(--muted)"/><text x="${x(+d)}" y="${H-8}" font-size="11" text-anchor="middle" fill="var(--muted)">${span<=62?shortDate(d):monthShort(d)}</text>`).join('');
  const today=new Date();today.setHours(0,0,0,0);
  const tl=+today>t0&&+today<t1?`<line x1="${x(+today)}" x2="${x(+today)}" y1="12" y2="${H-26}" stroke="var(--brand)" stroke-dasharray="3 4"/><text x="${x(+today)+4}" y="20" font-size="11" fill="var(--brand)">${T('сегодня','today','այսօր')}</text>`:'';
  const lines=series.map(s=>{const pts=s.pts.filter(p=>+p.t>=t0&&+p.t<=t1);if(!pts.length)return '';
    const dots=pts.length<=40?pts.map(p=>`<circle cx="${x(+p.t).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${s.dash?2:3}" fill="${s.color}"><title>${shortDate(p.t)} ${p.t.getFullYear()}: ${fmt(p.v)}</title></circle>`).join(''):'';
    return `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" ${s.dash?'stroke-dasharray="6 5" opacity=".75"':''} points="${pts.map(p=>x(+p.t).toFixed(1)+','+y(p.v).toFixed(1)).join(' ')}"/>${dots}`}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:300px">${grid}${tk}${tl}${lines}</svg><div class="legend" style="flex-direction:row;flex-wrap:wrap;gap:14px;margin-top:6px">${series.filter(s=>s.name).map(s=>`<div><i style="background:${s.color}"></i>${s.name}</div>`).join('')}</div>`;
}
function monthBars(rows){ // rows: [{label,inc,out,fc}]
  if(!rows.length)return '';const W=560,H=240,P=58,mx=Math.max(1,...rows.flatMap(r=>[r.inc,r.out]));const bw=(W-P-10)/rows.length;const y=v=>(H-40)*v/mx;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:280px">${[0,.5,1].map(f=>`<line x1="${P}" x2="${W-6}" y1="${H-26-(H-40)*f}" y2="${H-26-(H-40)*f}" stroke="var(--line)"/><text x="${P-6}" y="${H-22-(H-40)*f}" font-size="11" text-anchor="end" fill="var(--muted)">${k1(mx*f)}</text>`).join('')}
  ${rows.map((r,i)=>{const x0=P+i*bw+bw*.14,w=bw*.34,op=r.fc?'.4':'1';return `<rect x="${x0}" y="${H-26-y(r.inc)}" width="${w}" height="${y(r.inc)}" rx="3" fill="var(--c2)" opacity="${op}"><title>${r.label}: +${fmt(r.inc)}</title></rect><rect x="${x0+w+2}" y="${H-26-y(r.out)}" width="${w}" height="${y(r.out)}" rx="3" fill="var(--c4)" opacity="${op}"><title>${r.label}: −${fmt(r.out)}</title></rect><text x="${x0+w}" y="${H-8}" font-size="11" text-anchor="middle" fill="${r.cur?'var(--brand)':'var(--muted)'}" font-weight="${r.cur?700:400}">${rows.length<=10||r.cur||i%Math.ceil(rows.length/8)===0?r.label:''}</text>`}).join('')}</svg>
  <div class="legend" style="flex-direction:row;flex-wrap:wrap;gap:14px;margin-top:6px"><div><i style="background:var(--c2)"></i>${T('Доходы','Income','Եկամուտներ')}</div><div><i style="background:var(--c4)"></i>${T('Расходы и платежи','Spending & payments','Ծախսեր և վճարներ')}</div><div><i style="background:var(--muted);opacity:.4"></i>${T('прогноз','forecast','կանխատեսում')}</div></div>`;
}

function vHome(){
  if(S.homeRange==null)S.homeRange=90;
  const p=homePeriod();
  return `<div class="card homebar">${seg('homeRange',[[30,T('1 мес','1 mo','1 ամս')],[90,T('3 мес','3 mo','3 ամս')],[180,T('6 мес','6 mo','6 ամս')],[365,T('1 год','1 yr','1 տարի')],['all',T('Всё','All','Բոլորը')]])}
    <label class="f">${T('с','from','սկսած')}<input type="date" data-k="homeFrom" data-t="str" value="${esc(S.homeFrom||p.fromS)}"></label>
    <label class="f">${T('по','to','մինչև')}<input type="date" data-k="homeTo" data-t="str" value="${esc(S.homeTo||p.toS)}"></label></div>
  <div id="homeout">${homeOut()+homePlans()}</div>`;
}
function homeOut(){
  const c=calc(),p=homePeriod(),today=new Date();today.setHours(0,0,0,0);
  if(recordHist())save();
  const HS=histSeries(p),H=HS.pts;
  const fc=fcSim(FC().events,12);const fpts=k=>[{t:today,v:fc.rows[0][k]},...fc.rows.slice(1).map(r=>{const d=fcMonth(r.m);return{t:new Date(d.getFullYear(),d.getMonth()+1,0),v:r[k]}})];
  const showFc=+p.to>=+today;const chartTo=showFc?new Date(Math.max(+p.to,+new Date(today.getFullYear(),today.getMonth()+12,0))):p.to;
  const hs=(k,name,color)=>({name,color,pts:H.map(h=>({t:h.t,v:h[k==='worth'?'net':k==='sav'?'sav':'debt']}))});
  const series=[hs('worth',T('Капитал','Net worth','Կապիտալ'),'var(--c1)'),hs('sav',T('Накопления','Savings','Խնայողություններ'),'var(--c2)'),hs('debt',T('Долги','Debts','Պարտքեր'),'var(--c4)')];
  if(showFc)series.push({name:T('прогноз (пунктир)','forecast (dashed)','կանխատեսում (կետագիծ)'),color:'var(--c1)',dash:true,pts:fpts('worth')},{color:'var(--c2)',dash:true,pts:fpts('sav')},{color:'var(--c4)',dash:true,pts:fpts('debt')});
  const first=H[0],last=H[H.length-1];
  const chg=(k,lbl,good)=>first&&last&&first!==last?(()=>{const v=last[k]-first[k];const ok=good?v>=0:v<=0;return `<div><div class="muted" style="font-size:12px">${lbl}</div><div class="big ${ok?'good':'bad'}">${v>=0?'+':'−'}${fmt(Math.abs(v))}</div></div>`})():'';
  const ops=(S.ops||[]).filter(o=>o.date>=p.fromS&&o.date<=p.toS),oin=ops.filter(o=>o.type==='in').reduce((a,o)=>a+o.amount,0),oout=ops.filter(o=>o.type==='out').reduce((a,o)=>a+o.amount,0);
  // month bars: months of the period (max 12) + 6 forecast months
  const ms=[];{const a=new Date(p.from.getFullYear(),p.from.getMonth(),1),b=new Date(Math.min(+p.to,+today));b.setDate(1);for(const d=new Date(a);+d<=+b;d.setMonth(d.getMonth()+1))ms.push(new Date(d))}
  const curKey=ymd(today).slice(0,7);
  const rowsM=ms.slice(-12).map(d=>{const k=ymd(d).slice(0,7),f=flowsIn(k);return{label:monthShort(d),inc:f.inc,out:f.out,cur:k===curKey}});
  if(showFc)fc.rows.slice(2,8).forEach(r=>rowsM.push({label:monthShort(fcMonth(r.m)),inc:r.income+Math.max(0,r.one),out:r.expenses+r.payments+Math.max(0,-r.one),fc:true}));
  // spending structure
  const items=[{n:T('Жильё','Housing','Բնակարան'),v:c.housing,c:'var(--c1)'},{n:T('Коммунальные','Utilities','Կոմունալ'),v:c.util,c:'var(--c5)'},{n:T('Дети и учёба','Kids & education','Երեխաներ և ուսում'),v:c.kids,c:'var(--c6)'},{n:T('Машина','Car','Մեքենա'),v:c.car,c:'var(--c3)'},{n:T('Обязательные','Essentials','Պարտադիր'),v:c.need,c:'var(--c2)'},{n:T('Желания','Wants','Ցանկություններ'),v:c.want,c:'var(--c7)'},{n:T('Кредиты','Loans','Վարկեր'),v:c.loans,c:'var(--c4)'},{n:T('Регулярные платежи','Recurring payments','Պարբերական վճարներ'),v:c.planPay,c:'var(--c8)'}].filter(x=>x.v>0);
  const colors=['var(--c1)','var(--c2)','var(--c3)','var(--c4)','var(--c5)','var(--c6)','var(--c7)','var(--c8)'],byCat={};ops.filter(o=>o.type==='out').forEach(o=>byCat[o.cat]=(byCat[o.cat]||0)+o.amount);
  const opItems=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([k,v],i)=>({n:(OP_OUT[k]||OP_OUT.other)[0]+' '+L((OP_OUT[k]||OP_OUT.other).slice(1,4)),v,c:colors[i%colors.length]}));
  // debts
  const loans=S.loans.map((l,i)=>({l,f:c.infos[i]})).filter(x=>num(x.l.balance)>0).sort((a,b)=>num(b.l.balance)-num(a.l.balance));
  const maxB=Math.max(1,...loans.map(x=>num(x.l.balance)));
  const small=loans.filter(x=>x.l.type!=='mortgage'),freeSmall=small.length?Math.max(...small.map(x=>x.f.n)):0;
  const debtRows=loans.slice(0,8).map(x=>`<div class="drow"><div class="dname">${esc(x.l.name)}<span class="muted"> · ${x.f.temp?(x.f.due?fdate(x.f.due):'—'):(isFinite(x.f.n)?T('до','until','մինչև')+' '+monthLabel(x.f.n):'∞')}</span></div><div class="bar"><div style="width:${num(x.l.balance)/maxB*100}%;background:var(--c4)"></div></div><div class="n">${fmt(num(x.l.balance))}</div></div>`).join('');
  const up=upcoming(14);
  return `<div class="card"><h2>${T('Капитал, накопления и долги','Net worth, savings and debts','Կապիտալ, խնայողություններ և պարտքեր')}</h2>
    <p class="sub">${fdate(p.fromS)} — ${fdate(p.toS)}${showFc?' · '+T('пунктиром — прогноз на 12 месяцев','dashed — 12-month forecast','կետագծով՝ 12 ամսվա կանխատեսում'):''}</p>
    <div class="grid" style="margin-bottom:8px">${stat(T('Капитал сейчас','Net worth now','Կապիտալ հիմա'),fmt(c.net),c.net>=0?'good':'bad')}${stat(T('Накопления','Savings','Խնայողություններ'),fmt(c.savings))}${stat(T('Долги','Debts','Պարտքեր'),fmt(c.debt),'bad')}${chg('net',T('Капитал за период','Net worth change','Կապիտալի փոփոխություն'),true)}${chg('debt',T('Долги за период','Debt change','Պարտքերի փոփոխություն'),false)}</div>
    ${timeChart(series,p.from,chartTo)}
    ${HS.nrec?`<p class="sub" style="margin-top:8px">🕒 ${T(`До ${fdate(HS.first)} линия восстановлена по датам кредитов и операциям — это оценка. С этого дня приложение записывает точные данные каждый день.`,`Before ${fdate(HS.first)} the line is rebuilt from loan dates and transactions, so it is an estimate. From that day the app records exact data daily.`,`Մինչև ${fdate(HS.first)} գիծը վերականգնված է վարկերի ամսաթվերից և գործարքներից, սա գնահատական է։ Այդ օրվանից հավելվածը ամեն օր գրանցում է ճշգրիտ տվյալներ։`)}</p>`:''}
  </div>
  <div class="g2">
    <div class="card"><h2>${T('Доходы и расходы по месяцам','Income and spending by month','Եկամուտներ և ծախսեր ըստ ամիսների')}</h2>${monthBars(rowsM)}</div>
    <div class="card"><h2>${T('Ближайшие 14 дней','Next 14 days','Առաջիկա 14 օրը')}</h2>${up.length?`<div class="scroll"><table>${up.slice(0,10).map(x=>{const ic=x.r.cat==='income';return `<tr><td style="white-space:nowrap;width:62px"><b>${shortDate(x.d)}</b></td><td>${esc(x.r.title||'')}<br><span class="muted" style="font-size:12px">${x.days<0?`<span class="bad">${T('просрочено','overdue','ժամկետանց')}</span>`:x.days===0?T('сегодня','today','այսօր'):T(`через ${x.days} дн.`,`in ${x.days} days`,`${x.days} օրից`)}</span></td><td class="n ${ic?'good':''}"><b>${ic?'+':''}${fmt(num(x.r.amount))}</b></td></tr>`}).join('')}</table></div>`:`<p class="muted">${T('Платежей нет.','No payments.','Վճարումներ չկան։')}</p>`}
      <div class="grid" style="margin-top:10px">${stat(T('Разовые доходы за период','One-off income in period','Միանվագ մուտքեր'),'+'+fmt(oin),'good')}${stat(T('Разовые траты за период','One-off spending in period','Միանվագ ծախսեր'),'−'+fmt(oout),'bad')}</div>
    </div>
  </div>
  <div class="g2">
    <div class="card"><h2>${T('Ежемесячные траты','Monthly spending','Ամսական ծախսեր')}</h2>${donut(items)}</div>
    <div class="card"><h2>${T('Разовые траты за период','One-off spending in the period','Միանվագ ծախսեր ժամանակահատվածում')}</h2>${opItems.length?donut(opItems):`<p class="muted">${T('За этот период разовых трат нет. Добавьте их кнопкой «➕ Операция».','No one-off spending in this period. Add it with “➕ Transaction”.','Այս ժամանակահատվածում միանվագ ծախսեր չկան։ Ավելացրեք «➕ Գործարք» կոճակով։')}</p>`}</div>
  </div>
  ${loans.length?`<div class="card"><h2>${T('Долги','Debts','Պարտքեր')}</h2>
    <div class="grid" style="margin-bottom:10px">${stat(T('Всего долгов','Total debt','Ընդհանուր պարտք'),fmt(c.debt),'bad')}${stat(T('Платежи в месяц','Monthly payments','Ամսական վճարներ'),fmt(c.loans))}${small.length?stat(T('Без мелких долгов','Small debts cleared','Առանց մանր պարտքերի'),isFinite(freeSmall)?monthLabel(freeSmall):'—','good'):''}</div>
    ${debtRows}${loans.length>8?`<p class="sub">${T(`и ещё ${loans.length-8} — во вкладке «Кредиты»`,`and ${loans.length-8} more in the Loans tab`,`և ևս ${loans.length-8}՝ «Վարկեր» բաժնում`)}</p>`:''}</div>`:''}`;
}

/* ================== DATES: when an item is active ================== */
const activeIn=(x,ym)=>(!x.from||x.from.slice(0,7)<=ym)&&(!x.to||x.to.slice(0,7)>=ym);
const activeNow=x=>activeIn(x,ymd(new Date()).slice(0,7));
const dateF=(path,label)=>`<label class="f">${label}<input type="date" data-k="${path}" data-t="str" value="${esc(getPath(path)||'')}"></label>`;
const periodF=base=>dateF(base+'.from',T('Действует с','Active from','Գործում է սկսած'))+dateF(base+'.to',T('до (необяз.)','until (optional)','մինչև (ըստ ցանկ.)'));
function ymRange(a,b){const out=[];let [y,m]=a.split('-').map(Number);const [y2,m2]=b.split('-').map(Number);while((y<y2||(y===y2&&m<=m2))&&out.length<1200){out.push(y+'-'+String(m).padStart(2,'0'));if(++m>12){m=1;y++}}return out}
const monthlyIncAt=ym=>S.incomes.filter(x=>incFreq(x)==='monthly'&&activeIn(x,ym)).reduce((a,x)=>a+num(x.amount),0);
const expAt=ym=>S.expenses.filter(e=>activeIn(e,ym)).reduce((a,e)=>a+num(e.amount),0);

/* ---- auto-update loan balances by schedule (payments whose date has passed) ---- */
function rollLoans(){
  const today=ymd(new Date());let ch=false;
  S.loans.forEach(l=>{
    if(!l.asOf){l.asOf=today;ch=true;return}
    if(l.asOf>=today)return;
    let b=num(l.balance);const log=[];
    if(isTemp(l)){
      const past=loanPlan(l).filter(x=>x.date>l.asOf&&x.date<=today);
      past.forEach(x=>{const pay=Math.min(x.amount,b);if(pay>0){b-=pay;log.push({date:x.date,amount:Math.round(pay*100)/100})}});
      if(loanMode(l)==='plan'){l.schedule=(l.schedule||[]).filter(x=>ymDay(x.ym,l.day)>today);if(!l.schedule.length)b=0}
      if(loanMode(l)==='once'&&past.length)b=0;
    }else{
      const r=num(l.rate)/1200,sch=Array.isArray(l.schedule)&&l.schedule.length?l.schedule:null;
      for(const ym of ymRange(l.asOf.slice(0,7),today.slice(0,7))){const d=ymDay(ym,l.day);if(d<=l.asOf||d>today||b<=0.5)continue;
        const due=sch?num((sch.find(x=>x.ym===ym)||{}).amount):num(l.payment);if(!(due>0))continue;
        const i=b*r,pay=Math.min(due,b+i);b=b+i-pay;log.push({date:d,amount:Math.round(pay*100)/100,interest:Math.round(i*100)/100})}
    }
    if(log.length){l.balance=Math.max(0,Math.round(b*100)/100);l.paidLog=[...(l.paidLog||[]),...log].slice(-60)}
    l.asOf=today;ch=true;
  });
  return ch;
}
function rollNote(){
  const t=new Date(),from=ymd(new Date(t.getFullYear(),t.getMonth(),t.getDate()-31));
  const items=S.loans.flatMap(l=>(l.paidLog||[]).filter(x=>x.date>=from).map(x=>({...x,n:l.name||''}))).sort((a,b)=>b.date.localeCompare(a.date));
  const head=T('Остатки по кредитам обновляются сами: когда наступает дата платежа по графику, платёж вычитается из остатка (для ежемесячных — с учётом процентов). Если платёж не был сделан или сумма другая — просто исправьте остаток, отсчёт пойдёт от сегодняшнего дня.','Loan balances update by themselves: when a scheduled payment date passes, the payment is subtracted from the balance (with interest for monthly loans). If you missed a payment or paid a different amount, just correct the balance and counting restarts from today.','Վարկերի մնացորդները թարմացվում են ինքնաշխատ. երբ գալիս է գրաֆիկով վճարման օրը, վճարը հանվում է մնացորդից (ամսականների համար՝ տոկոսներով)։ Եթե վճարը չի կատարվել կամ գումարը այլ է, ուղղեք մնացորդը, և հաշվարկը կսկսվի այսօրվանից։');
  return `<div class="card"><h2>🔄 ${T('Автоматическое погашение','Automatic repayment','Ինքնաշխատ մարում')}</h2><p class="sub">${head}</p>${items.length?`<div class="scroll"><table><tr><th>${T('Дата','Date','Ամսաթիվ')}</th><th>${T('Кредит','Loan','Վարկ')}</th><th class="n">${T('Платёж','Payment','Վճար')}</th><th class="n">${T('из них проценты','of which interest','որից տոկոսներ')}</th></tr>${items.slice(0,12).map(x=>`<tr><td>${fdate(x.date)}</td><td>${esc(x.n)}</td><td class="n">${fmt(x.amount)}</td><td class="n muted">${x.interest!=null?fmt(x.interest):'—'}</td></tr>`).join('')}</table></div>`:`<p class="muted" style="margin:0">${T('За последний месяц автоматических списаний не было.','No automatic payments in the last month.','Վերջին ամսում ինքնաշխատ վճարներ չեն եղել։')}</p>`}</div>`;
}

/* ================== RECURRING PAYMENTS & SAVINGS PLANS ================== */
function PLANS(){if(!S.plans)S.plans=[];return S.plans}
const PL_FREQ={weekly:['Каждую неделю','Weekly','Ամեն շաբաթ'],monthly:['Каждый месяц','Monthly','Ամեն ամիս'],quarterly:['Раз в квартал','Quarterly','Եռամսյակը մեկ'],yearly:['Раз в год','Yearly','Տարին մեկ']};
const PL_KIND={save:['🎯 Накопление','🎯 Saving','🎯 Խնայողություն'],pay:['🔁 Регулярный платёж','🔁 Recurring payment','🔁 Պարբերական վճար']};
const planMonthly=p=>{const a=num(p.amount),f=p.freq||'monthly';return f==='weekly'?a*52/12:f==='quarterly'?a/3:f==='yearly'?a/12:a};
function planOccIn(p,ym,uptoDay){ // amount that falls in month ym (optionally only up to day uptoDay)
  const a=num(p.amount);if(!a||!activeIn(p,ym))return 0;const f=p.freq||'monthly';
  const [y,m]=ym.split('-').map(Number),f0=p.from?new Date(p.from+'T00:00:00'):null,day0=f0?f0.getDate():1,lastD=uptoDay||31;
  const end=p.to?new Date(p.to+'T00:00:00'):null;
  if(f==='weekly'){const anchor=f0||new Date(y,m-1,1);let n=0;for(let d=1;d<=Math.min(lastD,dim(y,m-1));d++){const dt=new Date(y,m-1,d),k=Math.round((dt-anchor)/864e5);if(k>=0&&k%7===0&&(!end||dt<=end))n++}return n*a}
  const dd=Math.min(day0,dim(y,m-1));if(dd>lastD)return 0;
  const dt=new Date(y,m-1,dd);if(f0&&dt<f0)return 0;if(end&&dt>end)return 0;
  const m0=f0?f0.getMonth()+1:1;
  if(f==='monthly')return a;
  if(f==='quarterly')return ((m-m0)%3+3)%3===0?a:0;
  if(f==='yearly')return m===m0?a:0;
  return 0}
function planStats(p){
  const t=new Date(),cur=ymd(t).slice(0,7),fromYm=p.from?p.from.slice(0,7):cur;
  let done=0;if(fromYm<=cur){for(const ym of ymRange(fromYm,cur))done+=ym===cur?planOccIn(p,ym,t.getDate()):planOccIn(p,ym)}
  let left=null,n=null;
  if(p.to){left=planOccIn(p,cur)-planOccIn(p,cur,t.getDate());const nx=ymd(addMonths(t,1)).slice(0,7);if(p.to.slice(0,7)>=nx)for(const ym of ymRange(nx,p.to.slice(0,7)))left+=planOccIn(p,ym);n=Math.max(0,monthsUntil(p.to))}
  if(fromYm>cur){done=0;if(p.to){left=0;for(const ym of ymRange(fromYm,p.to.slice(0,7)))left+=planOccIn(p,ym)}}
  const acc=S.accounts[num(p.acc)],rate=p.kind==='save'&&acc&&num(p.acc)>=0?num(acc.rate):0;
  let proj=null;if(p.kind==='save'&&p.to)proj=fvLump(done,rate,n,S.set.tax)+(n>0&&left>0?fvMonthly(left/n,rate,n,S.set.tax):left||0);
  if(p.kind==='save'&&p.to&&p.from)proj=planSchedule(p).bal;
  const goal=num(p.goal);let need=null,reachM=null;
  if(p.kind==='save'&&goal>0){if(p.to&&n>0){const base=fvLump(done,rate,n,S.set.tax);need=Math.max(0,(goal-base)/Math.max(1e-9,fvMonthly(1,rate,n,S.set.tax)))}
    else if(!p.to&&planMonthly(p)>0){let b=done,k=0;const r=rate/1200*(1-S.set.tax/100);while(b<goal&&k<600){b=b*(1+r)+planMonthly(p);k++}reachM=k<600?k:Infinity}}
  const finished=p.to&&p.to<ymd(t),notStarted=p.from&&p.from>ymd(t);
  return{done,left,n,proj,goal,need,reachM,rate,finished,notStarted,acc}
}
function vPlans(){
  const accOpts={'-1':[T('— не привязан —','— none —','— առանց հաշվի —')],...Object.fromEntries(S.accounts.map((a,i)=>[i,[(a.bank||lab(ATYPE[a.type]||''))+(num(a.rate)?` · ${num(a.rate)}%`:'')]]))};
  return `<div class="card"><h2>${T('Регулярные платежи и накопления','Recurring payments and savings','Պարբերական վճարներ և խնայողություններ')}</h2>
    <p class="sub">${T('Платёж или откладывание денег с выбранной частотой от одной даты до другой: рассрочка, абонемент, учёба, «копить на отпуск до июня». Можно указать дату в прошлом: тогда уже сделанные платежи посчитаются.','A payment or saving that repeats from one date to another: installments, memberships, tuition, “save for a holiday until June”. You can set a start date in the past and past payments are counted.','Վճար կամ խնայողություն, որը կրկնվում է մի ամսաթվից մինչև մյուսը. ապառիկ, աբոնեմենտ, ուսում, «խնայել արձակուրդի համար մինչև հունիս»։ Կարող եք նշել անցյալի ամսաթիվ, և արդեն կատարված վճարները կհաշվվեն։')}</p>
    ${PLANS().map((p,i)=>`<div class="row r-loan2${activeNow(p)?'':' off'}">${inp(`plans.${i}.name`,T('Название','Name','Անվանում'),'str')}${sel(`plans.${i}.kind`,T('Что это','Type','Տեսակ'),PL_KIND)}${inp(`plans.${i}.amount`,T('Сумма за раз','Amount each time','Գումար ամեն անգամ'))}${sel(`plans.${i}.freq`,T('Как часто','How often','Որքան հաճախ'),PL_FREQ)}${dateF(`plans.${i}.from`,T('Первый платёж','First payment','Առաջին վճար'))}${dateF(`plans.${i}.to`,T('Последний (до даты)','Last (until)','Վերջին (մինչև)'))}${p.kind==='save'?sel(`plans.${i}.acc`,T('На какой счёт','Into account','Որ հաշվին'),accOpts)+inp(`plans.${i}.goal`,T('Цель (необяз.)','Goal (optional)','Նպատակ (ըստ ցանկ.)')):''}<button class="x" data-del="plans.${i}">✕</button>${durChips(i,p)}</div>`).join('')||`<p class="muted">${T('Пока ничего нет.','Nothing yet.','Դեռ ոչինչ չկա։')}</p>`}
    <div class="btns"><button class="btn ghost" data-add="plansave">+ ${T('Накопление','Saving','Խնայողություն')}</button><button class="btn ghost" data-add="planpay">+ ${T('Регулярный платёж','Recurring payment','Պարբերական վճար')}</button></div>
  </div><div id="plansout"></div>`;
}
/* ---- interval: "на 24 месяца" + generated schedule ---- */
let SCHED_OPEN={};
function addMonthsDay(ds,n){const d=new Date(ds+'T00:00:00'),y=d.getFullYear(),m=d.getMonth()+n;return new Date(y,m,Math.min(d.getDate(),dim(y+Math.floor(m/12),((m%12)+12)%12)))}
function planDur(i,n){const p=PLANS()[i];if(!p||!(n>0))return;if(!p.from)p.from=todayStr();const e=addMonthsDay(p.from,n);e.setDate(e.getDate()-1);p.to=ymd(e);p.months=n}
function planDates(p){
  const out=[];if(!p.from)return out;const f=p.freq||'monthly',f0=new Date(p.from+'T00:00:00'),end=p.to?new Date(p.to+'T00:00:00'):addMonthsDay(p.from,24);
  if(f==='weekly'){for(let d=new Date(f0);d<=end&&out.length<600;d.setDate(d.getDate()+7))out.push(new Date(d));return out}
  const step=f==='quarterly'?3:f==='yearly'?12:1;
  for(let k=0;out.length<600;k++){const d=addMonthsDay(p.from,k*step);if(d>end)break;out.push(d)}
  return out}
function planSchedule(p){
  const save=p.kind==='save',acc=S.accounts[num(p.acc)],rate=save&&acc&&num(p.acc)>=0?num(acc.rate):0,tax=S.set.tax/100,a=num(p.amount);
  const ds=planDates(p),t=new Date();t.setHours(0,0,0,0);let bal=0,sum=0,prof=0,prev=null;
  const rows=ds.map((d,k)=>{let i=0;if(save&&prev&&rate>0){i=bal*rate/100*((d-prev)/864e5)/365*(1-tax);bal+=i;prof+=i}bal+=a;sum+=a;prev=d;return{k:k+1,d,a,sum,i,bal,past:d<=t}});
  if(save&&prev&&rate>0&&p.to){const e=new Date(p.to+'T00:00:00');if(e>prev){const i=bal*rate/100*((e-prev)/864e5)/365*(1-tax);bal+=i;prof+=i}}
  return{rows,sum,prof,bal,rate,save,open:!p.to}}
function durChips(i,p){const n=p.from&&p.to?Math.round((addMonthsDayDiff(p.from,p.to))):0;
  return `<div class="durs"><span class="muted">${T('Срок:','Term:','Ժամկետ՝')}</span>${[3,6,12,24,36,60].map(m=>`<button class="chip${num(p.months)===m&&n===m?' on':''}" data-dur="${i}" data-n="${m}">${m} ${T('мес','mo','ամս')}</button>`).join('')}<label class="durin">${T('свой','custom','այլ')}<input type="number" min="1" max="600" inputmode="numeric" data-durin="${i}" value="${num(p.months)||''}" placeholder="${T('мес','mo','ամս')}"></label>${p.from&&p.to?`<span class="muted">→ ${planDates(p).length} ${T('платежей','payments','վճար')}, ${T('до','until','մինչև')} ${fdate(p.to)}</span>`:''}</div>`}
function addMonthsDayDiff(a,b){const x=new Date(a+'T00:00:00'),y=new Date(b+'T00:00:00');y.setDate(y.getDate()+1);return (y.getFullYear()-x.getFullYear())*12+y.getMonth()-x.getMonth()}
function schedHtml(p,i){
  const s=planSchedule(p);if(!s.rows.length)return '';const open=!!SCHED_OPEN[i];
  const head=`<button class="btn ghost" data-sched="${i}" style="margin-top:10px">📅 ${open?T('Скрыть график','Hide schedule','Թաքցնել ժամանակացույցը'):T(`График: ${s.rows.length} платежей`,`Schedule: ${s.rows.length} payments`,`Ժամանակացույց՝ ${s.rows.length} վճար`)}</button>`;
  const tot=`<div class="grid" style="margin-top:10px">${stat(s.save?T('Всего вложите','Total contributions','Ընդհանուր ներդրում'):T('Всего заплатите','Total to pay','Ընդհանուր վճար'),fmt(s.sum))}${s.save?stat(T('Прибыль (проценты после налога)','Profit (interest after tax)','Շահույթ (տոկոսներ հարկից հետո)'),'+'+fmt(s.prof),'good')+stat(T('Итого на счёте','Final balance','Վերջնական մնացորդ'),fmt(s.bal),'good'):''}${s.open?`<div class="muted" style="font-size:12px;align-self:end">${T('Дата окончания не задана — показаны 24 месяца.','No end date set — showing 24 months.','Ավարտի ամսաթիվ չկա, ցույց է տրված 24 ամիս։')}</div>`:''}</div>`;
  if(!open)return tot+head;
  const tbl=`<div class="scroll" style="max-height:420px;overflow:auto;margin-top:10px"><table><tr><th>№</th><th>${T('Дата','Date','Ամսաթիվ')}</th><th class="n">${T('Сумма','Amount','Գումար')}</th><th class="n">${s.save?T('Вложено всего','Contributed','Ներդրված'):T('Оплачено всего','Paid total','Վճարված')}</th>${s.save?`<th class="n">${T('Проценты','Interest','Տոկոսներ')}</th><th class="n">${T('На счёте','Balance','Մնացորդ')}</th>`:`<th class="n">${T('Осталось','Remaining','Մնացել է')}</th>`}</tr>${s.rows.map(r=>`<tr style="${r.past?'opacity:.6':''}"><td>${r.k}${r.past?' ✓':''}</td><td>${fdate(ymd(r.d))}</td><td class="n">${fmt(r.a)}</td><td class="n">${fmt(r.sum)}</td>${s.save?`<td class="n good">${r.i?'+'+fmt(r.i):'—'}</td><td class="n"><b>${fmt(r.bal)}</b></td>`:`<td class="n">${fmt(s.sum-r.sum)}</td>`}</tr>`).join('')}</table></div>`;
  return tot+head+tbl}

function planCard(p,idx){
  const s=planStats(p),save=p.kind==='save';
  const total=s.left!=null?s.done+s.left:null,goal=s.goal>0?s.goal:null,base=save?(goal||s.proj||total):total;
  const pctv=base?Math.min(100,s.done/base*100):0;
  const status=s.finished?`<span class="pill">${T('завершён','finished','ավարտված')}</span>`:s.notStarted?`<span class="pill p-warn">${T('начнётся','starts','կսկսվի')} ${fdate(p.from)}</span>`:'';
  const lines=[];
  lines.push(stat(save?T('Отложено по плану','Saved so far','Խնայված է'):T('Уже оплачено','Paid so far','Արդեն վճարված'),fmt(s.done),save?'good':''));
  if(s.left!=null)lines.push(stat(save?T('Ещё отложить','Still to save','Դեռ խնայել'):T('Осталось заплатить','Still to pay','Մնացել է վճարել'),fmt(s.left)));
  lines.push(stat(T('В среднем в месяц','Per month on average','Միջինում ամսական'),fmt(planMonthly(p))));
  let tip='';
  if(save&&goal){if(s.need!=null)tip=s.proj>=goal?tipH('good',T('Успеваете','On track','Հասցնում եք'),T(`К ${fdate(p.to)} будет ≈${fmt(s.proj)} при цели ${fmt(goal)}.`,`By ${fdate(p.to)} you’ll have ≈${fmt(s.proj)} against a goal of ${fmt(goal)}.`,`Մինչև ${fdate(p.to)} կլինի ≈${fmt(s.proj)}՝ ${fmt(goal)} նպատակի դիմաց։`)):tipH('warn',T('Не успеваете','Behind schedule','Չեք հասցնում'),T(`Чтобы собрать ${fmt(goal)} к ${fdate(p.to)}, нужно откладывать ≈${fmt(s.need)} в месяц вместо ${fmt(planMonthly(p))}.`,`To reach ${fmt(goal)} by ${fdate(p.to)} you need ≈${fmt(s.need)} a month instead of ${fmt(planMonthly(p))}.`,`${fdate(p.to)}-ին ${fmt(goal)} հավաքելու համար պետք է ամսական ≈${fmt(s.need)}՝ ${fmt(planMonthly(p))}-ի փոխարեն։`));
    else if(s.reachM!=null)tip=tipH('',T('Когда соберёте','When you’ll get there','Երբ կհավաքեք'),isFinite(s.reachM)?T(`Цель ${fmt(goal)} будет собрана примерно в ${monthLabel(s.reachM)}.`,`You’ll reach ${fmt(goal)} around ${monthLabel(s.reachM)}.`,`${fmt(goal)} նպատակին կհասնեք մոտավորապես ${monthLabel(s.reachM)}։`):T('С такой суммой цель не собрать.','This amount won’t reach the goal.','Այս գումարով նպատակին չեք հասնի։'))}
  return `<div class="card plan"><div class="planh"><h3>${save?'🎯':'🔁'} ${esc(p.name||L(PL_KIND[p.kind||'pay']).slice(3))} ${status}</h3><span class="muted">${fmt(num(p.amount))} · ${L(PL_FREQ[p.freq||'monthly'])} · ${p.from?fdate(p.from):'…'} — ${p.to?fdate(p.to):T('без срока','no end','առանց ժամկետի')}${save&&s.acc?' · '+esc(s.acc.bank||''):''}</span></div>
    ${base?`<div class="pbar"><div style="width:${pctv}%"></div></div><div class="muted" style="font-size:12px;margin:4px 0 10px">${Math.round(pctv)}% ${goal?T('от цели','of goal','նպատակից'):T('выполнено','done','կատարված')}</div>`:''}
    <div class="grid">${lines.join('')}</div>${tip}${schedHtml(p,idx)}</div>`;
}
function plansOut(){
  const ps=PLANS().filter(p=>num(p.amount)>0);if(!ps.length)return '';
  const act=ps.filter(activeNow),pay=act.filter(p=>p.kind!=='save').reduce((a,p)=>a+planMonthly(p),0),sv=act.filter(p=>p.kind==='save').reduce((a,p)=>a+planMonthly(p),0),c=calc();
  return `<div class="card"><div class="grid">${stat(T('Регулярные платежи в месяц','Recurring payments / month','Պարբերական վճարներ ամսական'),fmt(pay),'bad')}${stat(T('Откладываете в месяц','Saving / month','Խնայում եք ամսական'),fmt(sv),'good')}${stat(T('Свободно после всего','Free after everything','Ազատ է ամեն ինչից հետո'),fmt(c.fcf-sv),c.fcf-sv>=0?'good':'bad')}</div>
    ${c.fcf-sv<0?tipH('bad',T('Не хватает денег на план','Not enough money for the plan','Պլանի համար գումարը չի բավականացնում'),T(`После всех расходов остаётся ${fmt(c.fcf)}, а откладывать по плану нужно ${fmt(sv)}. Уменьшите сумму или продлите срок.`,`After all spending you have ${fmt(c.fcf)} left, but the plan needs ${fmt(sv)}. Lower the amount or extend the end date.`,`Բոլոր ծախսերից հետո մնում է ${fmt(c.fcf)}, իսկ պլանով պետք է խնայել ${fmt(sv)}։ Նվազեցրեք գումարը կամ երկարացրեք ժամկետը։`)):''}</div>
  ${PLANS().map((p,i)=>num(p.amount)>0?planCard(p,i):'').join('')}`;
}

/* ================== HISTORY: reconstruct past from dates ================== */
function flowsIn(ym){
  const c=calc(),mid=new Date(ym+'-15T00:00:00');
  const inc=(S.profile.married?num(S.profile.partnerIncome):0)+S.incomes.reduce((a,x)=>a+(incFreq(x)==='monthly'?(activeIn(x,ym)?num(x.amount):0):incomeInMonth(x,mid)),0);
  const loansM=S.loans.reduce((a,l)=>a+(isTemp(l)?[...loanPlan(l),...(l.paidLog||[])].filter(x=>x.date.slice(0,7)===ym).reduce((s,x)=>s+x.amount,0):((l.paidLog||[]).some(x=>x.date.slice(0,7)===ym)?(l.paidLog||[]).filter(x=>x.date.slice(0,7)===ym).reduce((s,x)=>s+x.amount,0):activeIn(l,ym)&&num(l.balance)>0?num(l.payment):0)),0);
  const exp=c.housing+c.util+c.kids+c.car+expAt(ym)+loansM+PLANS().filter(p=>p.kind!=='save').reduce((a,p)=>a+planOccIn(p,ym),0);
  const om=(S.ops||[]).filter(o=>(o.date||'').slice(0,7)===ym);
  return{inc:inc+om.filter(o=>o.type==='in').reduce((a,o)=>a+o.amount,0),out:exp+om.filter(o=>o.type==='out').reduce((a,o)=>a+o.amount,0)};
}
function reconAt(d){ // estimate of the state on date d, from loan dates and operations
  const ds=ymd(d),t=new Date();t.setHours(0,0,0,0);const k=Math.max(0,(t.getFullYear()-d.getFullYear())*12+t.getMonth()-d.getMonth());
  let debt=0;S.loans.forEach(l=>{if(l.from&&l.from>ds)return;let b=num(l.balance);if(b<=0)return;
    if(!isTemp(l)){const r=num(l.rate)/1200,P=num(l.payment);if(P>0)for(let i=0;i<k;i++)b=(b+P)/(1+r)}
    debt+=b});
  const c=calc();let assets=c.assets,sav=c.savings;
  (S.ops||[]).filter(o=>o.acc>=0&&S.accounts[o.acc]&&o.date>ds).forEach(o=>{const v=o.type==='in'?o.amount:-o.amount;assets-=v;if(ATYPE[S.accounts[o.acc].type]?.[1])sav-=v});
  return{d:ds,t:new Date(d),debt:Math.round(debt),sav:Math.round(sav),net:Math.round(assets-debt),rec:true};
}
function histSeries(p){
  const snaps=(S.hist||[]).filter(h=>h.d>=p.fromS&&h.d<=p.toS).map(h=>({...h,t:new Date(h.d+'T00:00:00')}));
  const first=(S.hist||[])[0]?.d;const lim=Math.min(+p.to,first?+new Date(first+'T00:00:00')-864e5:+p.to);const pts=[];
  if(+p.from<=lim){pts.push(reconAt(p.from));for(let d=new Date(p.from.getFullYear(),p.from.getMonth()+1,0);+d<=lim;d=new Date(d.getFullYear(),d.getMonth()+2,0))if(+d>+p.from)pts.push(reconAt(d))}
  return{pts:[...pts,...snaps],nrec:pts.length,first};
}

function homePlans(){
  const ps=PLANS().filter(p=>num(p.amount)>0&&activeNow(p));if(!ps.length)return '';
  return `<div class="card"><h2>${T('Регулярные платежи и накопления','Recurring payments and savings','Պարբերական վճարներ և խնայողություններ')}</h2>${ps.map(p=>{const s=planStats(p),save=p.kind==='save',base=save?(s.goal||s.proj||(s.left!=null?s.done+s.left:0)):(s.left!=null?s.done+s.left:0),w=base?Math.min(100,s.done/base*100):0;
    return `<div class="drow"><div class="dname">${save?'🎯':'🔁'} ${esc(p.name||'')}<span class="muted"> · ${p.to?T('до','until','մինչև')+' '+fdate(p.to):L(PL_FREQ[p.freq||'monthly'])}</span></div><div class="bar"><div style="width:${w}%;background:${save?'var(--c2)':'var(--c1)'}"></div></div><div class="n">${fmt(s.done)}${base?`<span class="muted" style="font-weight:400"> / ${fmt(base)}</span>`:''}</div></div>`}).join('')}</div>`;
}

/* ================== CHROME ================== */
function renderChrome(){
  document.documentElement.lang=LANG;
  {let d=$('#dls');if(!d){d=document.createElement('div');d.id='dls';document.body.appendChild(d)}d.innerHTML=datalists()}
  document.title=T('Финансовый мозг — калькулятор семейного бюджета','Finance Brain — family budget calculator','Ֆինանսական ուղեղ — ընտանեկան բյուջեի հաշվիչ');
  $('#h1').textContent='🧠 '+T('Финансовый мозг','Finance Brain','Ֆինանսական ուղեղ');
  $('#hsub').textContent=T('Бюджет семьи · кредиты · счета · куда направить лишние деньги','Family budget · loans · accounts · where to put extra money','Ընտանեկան բյուջե · վարկեր · հաշիվներ · ուր ուղղել ազատ գումարը');
  $('#foot').textContent=T('Это обучающий калькулятор, а не индивидуальная финансовая консультация. Проверяйте ставки и условия в своём банке.','This is an educational calculator, not personal financial advice. Check rates and terms with your bank.','Սա ուսուցողական հաշվիչ է, ոչ թե անհատական ֆինանսական խորհրդատվություն։ Տոկոսադրույքներն ու պայմանները ստուգեք ձեր բանկում։');
  renderNav();
  $('#lang').value=LANG;$('#cur').value=S.currency;
  {const ob=$('#opbtn');if(ob)ob.textContent='➕ '+T('Операция','Transaction','Գործարք')}
  $('#aititle').textContent='🤖 '+T('AI-помощник','AI assistant','AI օգնական');$('#aiin').placeholder=T('Спросите про бюджет, кредиты, вклады…','Ask about your budget, loans, deposits…','Հարցրեք բյուջեի, վարկերի, ավանդների մասին…');aiRender();renderUser();
}
function renderKpis(){
  const c=calc();
  $('#kpis').innerHTML=`
  <div class="kpi"><div class="l">${T('Доход в месяц','Monthly income','Ամսական եկամուտ')}</div><div class="v">${fmt(c.income)}</div></div>
  <div class="kpi"><div class="l">${T('Все расходы','Total spending','Ընդհանուր ծախսեր')}</div><div class="v">${fmt(c.spend)}</div></div>
  <div class="kpi"><div class="l">${T('Остаётся','Left over','Մնում է')}</div><div class="v ${c.fcf>=0?'good':'bad'}">${fmt(c.fcf)}</div></div>
  <div class="kpi"><div class="l">${T('Финансовое здоровье','Financial health','Ֆինանսական առողջություն')}</div><div class="v ${c.score>=70?'good':c.score>=45?'warn':'bad'}">${c.score}/100</div></div>`;
}

/* ================== PROFILE ================== */
function vProfile(){
  const p=S.profile;
  return `
  <div class="card"><h2>${T('Семья','Family','Ընտանիք')}</h2><p class="sub">${T('От состава семьи зависит, какой запас денег вам нужен и какие расходы ждут впереди.','Your household shapes how big your safety cushion should be and what costs lie ahead.','Ընտանիքի կազմից է կախված, թե որքան պահուստ է պետք և ինչ ծախսեր են սպասվում։')}</p>
    <div class="grid">
      <div><label class="f">${T('Семейное положение','Marital status','Ամուսնական կարգավիճակ')}</label>${seg('profile.married',[[false,T('Не в браке','Single','Ամուրի')],[true,T('В браке','Married','Ամուսնացած')]])}</div>
      ${p.married?inp('profile.partnerIncome',T('Доход супруга(и) в месяц','Spouse’s monthly income','Զուգընկերոջ ամսական եկամուտ')):''}
      <label class="f">${T('Накопления (из вкладки «Счета»)','Savings (from the Accounts tab)','Խնայողություններ («Հաշիվներ» բաժնից)')}<input disabled value="${fmt(calc().savings)}"></label>
    </div>
  </div>
  <div class="card"><h2>${T('Дети','Children','Երեխաներ')}</h2><p class="sub">${T('Укажите ежемесячные расходы на каждого ребёнка. Если учёба оплачивается раз в год, впишите годовую сумму: калькулятор сам разделит её на 12.','Enter monthly costs per child. If tuition is paid yearly, enter the yearly amount and it will be divided by 12.','Նշեք յուրաքանչյուր երեխայի ամսական ծախսը։ Եթե ուսման վարձը տարեկան է, գրեք տարեկան գումարը. հաշվիչն այն կբաժանի 12-ի։')}</p>
    ${p.kids.map((k,i)=>`<div class="row r-kid">
      ${inp(`profile.kids.${i}.name`,T('Имя','Name','Անուն'),'str')}
      ${sel(`profile.kids.${i}.stage`,T('Этап','Stage','Փուլ'),STAGES)}
      ${inp(`profile.kids.${i}.monthly`,T('Расходы в мес.','Monthly costs','Ամսական ծախս'))}
      ${inp(`profile.kids.${i}.tuitionYear`,T('Оплата учёбы в год','Yearly tuition','Ուսման վարձ տարեկան'))}
      <button class="x" data-del="profile.kids.${i}">✕</button></div>`).join('')||`<p class="muted">${T('Детей не указано.','No children added.','Երեխաներ նշված չեն։')}</p>`}
    <div class="btns"><button class="btn ghost" data-add="kid">+ ${T('Добавить ребёнка','Add child','Ավելացնել երեխա')}</button></div>
  </div>
  <div class="card"><h2>${T('Жильё и коммунальные услуги','Housing & utilities','Բնակարան և կոմունալ վճարներ')}</h2>
    <div class="grid">
      <div class="wide"><label class="f">${T('Жильё','Housing','Բնակարան')}</label>${seg('profile.housing.type',[['rent',T('Аренда','Rent','Վարձով')],['own',T('Своё','Own','Սեփական')],['mortgage',T('Ипотека','Mortgage','Հիփոթեք')]])}</div>
      ${p.housing.type==='rent'?inp('profile.housing.rent',T('Аренда в месяц','Monthly rent','Ամսական վարձ')):inp('profile.housing.maint',T('Содержание / ремонт в мес.','Upkeep / repairs per month','Պահպանում / վերանորոգում ամսական'))}
    </div>
    ${p.housing.type==='mortgage'?`<div class="tip">${T('Платёж по ипотеке добавьте во вкладке «Кредиты»: так он попадёт в график платежей и в расчёт досрочного погашения.','Add the mortgage payment in the Loans tab so it shows up in the payment schedule and the prepayment math.','Հիփոթեքի վճարը ավելացրեք «Վարկեր» բաժնում, որպեսզի այն հայտնվի վճարումների ժամանակացույցում և վաղաժամկետ մարման հաշվարկում։')}</div>`:''}
    <h3>${T('Коммунальные услуги в месяц','Monthly utilities','Ամսական կոմունալ վճարներ')}</h3>
    <div class="grid">
      ${inp('profile.util.electricity','⚡ '+T('Электричество','Electricity','Էլեկտրաէներգիա'))}${inp('profile.util.gas','🔥 '+T('Газ / отопление','Gas / heating','Գազ / ջեռուցում'))}${inp('profile.util.water','💧 '+T('Вода','Water','Ջուր'))}
      ${inp('profile.util.internet','🌐 '+T('Интернет / ТВ','Internet / TV','Ինտերնետ / TV'))}${inp('profile.util.phone','📱 '+T('Мобильная связь','Mobile phone','Բջջային կապ'))}${inp('profile.util.building','🏢 '+T('Обслуживание дома, мусор','Building fees, trash','Շենքի սպասարկում, աղբ'))}
    </div>
  </div>
  <div class="card"><h2>${T('Машина','Car','Մեքենա')}</h2>
    <div class="grid"><div><label class="f">${T('Есть машина?','Do you have a car?','Մեքենա ունե՞ք')}</label>${seg('profile.car.has',[[false,T('Нет','No','Ոչ')],[true,T('Да','Yes','Այո')]])}</div></div>
    ${p.car.has?`<div class="grid" style="margin-top:10px">
      ${inp('profile.car.fuel','⛽ '+T('Топливо в мес.','Fuel per month','Վառելիք ամսական'))}${inp('profile.car.parking','🅿️ '+T('Парковка, мойка в мес.','Parking, wash per month','Կայանատեղի, լվացում ամսական'))}
      ${inp('profile.car.insurance','🛡 '+T('Страховка в год','Insurance per year','Ապահովագրություն տարեկան'))}${inp('profile.car.service','🔧 '+T('Обслуживание, шины в год','Service, tyres per year','Սպասարկում, անվադողեր տարեկան'))}${inp('profile.car.tax','🧾 '+T('Налог на авто в год','Car tax per year','Գույքահարկ տարեկան'))}
    </div>${edu(T('Зачем годовые суммы?','Why yearly amounts?','Ինչու՞ տարեկան գումարներ'),T('Страховку, налог и ремонт платят редко, поэтому о них легко забыть. Калькулятор делит их на 12, чтобы показать реальную стоимость машины в месяц, и тогда «внезапные» расходы перестают быть внезапными.','Insurance, tax and repairs are paid rarely, so they’re easy to forget. The calculator divides them by 12 to show what the car really costs each month, so these bills stop being surprises.','Ապահովագրությունը, հարկը և վերանորոգումը վճարվում են հազվադեպ, ուստի հեշտ է մոռանալ դրանց մասին։ Հաշվիչը դրանք բաժանում է 12-ի, որպեսզի ցույց տա մեքենայի իրական ամսական արժեքը, և «անսպասելի» ծախսերն այլևս անսպասելի չեն լինի։'))}`:''}
  </div>`;
}

/* ================== MONEY ================== */
function vMoney(){
  const c=calc();
  return `
  <div class="card"><h2>${T('Доходы в месяц','Monthly income','Ամսական եկամուտներ')}</h2><p class="sub">${T('Зарплата, подработка, аренда, пособия. Доход супруга(и) указывается во вкладке «Семья».','Salary, side jobs, rental income, benefits. Spouse’s income goes in the Family tab.','Աշխատավարձ, լրացուցիչ աշխատանք, վարձակալություն, նպաստներ։ Զուգընկերոջ եկամուտը նշվում է «Ընտանիք» բաժնում։')}</p>
    ${S.incomes.map((x,i)=>{const f=incFreq(x);return `<div class="row r-inc r-loan2${activeNow(x)||f==='once'?'':' off'}">${inp(`incomes.${i}.name`,T('Источник','Source','Աղբյուր'),'str','dl-income')}${inp(`incomes.${i}.amount`,f==='monthly'?T('Сумма в месяц','Amount per month','Գումար ամսական'):T('Сумма за раз','Amount each time','Գումար ամեն անգամ'))}${sel(`incomes.${i}.freq`,T('Как часто','How often','Որքան հաճախ'),INC_FREQ)}${f==='quarterly'?sel(`incomes.${i}.month`,T('Месяцы','Months','Ամիսներ'),{1:[[1,4,7,10].map(m=>MONTHS()[m-1]).join(', ')],2:[[2,5,8,11].map(m=>MONTHS()[m-1]).join(', ')],3:[[3,6,9,12].map(m=>MONTHS()[m-1]).join(', ')]})+inp(`incomes.${i}.day`,T('Примерно какого числа','Around which day','Մոտավորապես որ օրը')):f==='yearly'?sel(`incomes.${i}.month`,T('Месяц','Month','Ամիս'),Object.fromEntries(MONTHSF().map((m,k)=>[k+1,[m]])))+inp(`incomes.${i}.day`,T('Число','Day','Օր')):f==='once'?`<label class="f">${T('Дата','Date','Ամսաթիվ')}<input type="date" data-k="incomes.${i}.date" data-t="str" value="${esc(x.date||'')}"></label>`:''}${f!=='monthly'&&num(x.amount)>0&&f!=='once'?`<div class="muted" style="font-size:12px;align-self:end">≈ ${fmt(incAvg(x))} / ${MO()}</div>`:''}${f!=='once'?periodF(`incomes.${i}`):''}<button class="x" data-del="incomes.${i}">✕</button></div>`}).join('')}
    ${qchips('income')}<div class="btns"><button class="btn ghost" data-add="income">+ ${T('Доход','Income','Եկամուտ')}</button></div>
    <div class="tot"><span>${T('Итого с семьёй в месяц','Household total per month','Ընդամենը ընտանիքով ամսական')}</span><span id="t-inc">${fmt(c.income)}</span></div>${c.irregList.length?`<div class="tot" style="border:0;margin:0;font-weight:500"><span class="muted">${T('+ периодические доходы, в среднем','+ periodic income, on average','+ պարբերական եկամուտներ, միջինում')}</span><span class="good">+${fmt(c.irregAvg)} / ${MO()}</span></div>`:''}
  </div>
  <div class="card"><h2>${T('Ежедневные расходы в месяц','Everyday monthly spending','Ամենօրյա ամսական ծախսեր')}</h2><p class="sub">${T('Сюда не входят жильё, коммуналка, дети, машина и кредиты: они уже заданы в других вкладках.','Housing, utilities, kids, car and loans are entered in the other tabs, so leave them out here.','Բնակարանը, կոմունալը, երեխաները, մեքենան և վարկերն այստեղ չեն մտնում. դրանք լրացվում են այլ բաժիններում։')}</p>
    ${S.expenses.map((x,i)=>`<div class="row r-exp r-loan2${activeNow(x)?'':' off'}">${inp(`expenses.${i}.name`,T('Название','Name','Անվանում'),'str','dl-expense')}${sel(`expenses.${i}.cat`,T('Категория','Category','Կատեգորիա'),CATS)}${inp(`expenses.${i}.amount`,T('Сумма','Amount','Գումար'))}${periodF(`expenses.${i}`)}<button class="x" data-del="expenses.${i}">✕</button></div>`).join('')}
    ${qchips('expense')}<div class="btns"><button class="btn ghost" data-add="expense">+ ${T('Расход','Expense','Ծախս')}</button></div>
  </div>
  <div class="card"><h2>${T('Сводка расходов','Spending summary','Ծախսերի ամփոփում')}</h2><div id="sumtable"></div></div>`;
}
function sumTable(){
  const c=calc();
  const rows=[['🏠 '+T('Жильё','Housing','Բնակարան'),c.housing],['💡 '+T('Коммунальные','Utilities','Կոմունալ'),c.util],['👶 '+T('Дети и учёба','Kids & education','Երեխաներ և ուսում'),c.kids],['🚗 '+T('Машина','Car','Մեքենա'),c.car],['🛒 '+T('Обязательные','Essentials','Պարտադիր'),c.need],['🎉 '+T('Желания','Wants','Ցանկություններ'),c.want],['🏦 '+T('Кредиты, ежемесячно','Loans, monthly','Վարկեր, ամսական'),c.loansM]].concat(c.loansT?[['⏱ '+T('Погашения по графику в этом месяце','Scheduled repayments this month','Այս ամսվա վճարումներ ըստ գրաֆիկի'),c.loansT]]:[]).concat(c.planPay?[['🔁 '+T('Регулярные платежи','Recurring payments','Պարբերական վճարներ'),c.planPay]]:[]);
  return `<table>${rows.map(r=>`<tr><td>${r[0]}</td><td class="n">${fmt(r[1])}</td><td class="n muted">${c.income?pct(r[1]/c.income*100):''}</td></tr>`).join('')}
  <tr><th>${T('Всего','Total','Ընդամենը')}</th><th class="n">${fmt(c.spend)}</th><th class="n">${c.income?pct(c.spend/c.income*100):''}</th></tr></table>`;
}

/* ================== ACCOUNTS ================== */
function vAccounts(){
  return `<div class="card"><h2>${T('Счета в банках','Bank accounts','Բանկային հաշիվներ')}</h2><p class="sub">${T('Все деньги: карты, накопительные счета, депозиты в разных банках, наличные, брокерский счёт. Из этого складываются подушка и чистый капитал.','All your money: cards, savings accounts, deposits in different banks, cash, brokerage. This makes up your safety cushion and net worth.','Ձեր բոլոր գումարները. քարտեր, խնայողական հաշիվներ, ավանդներ տարբեր բանկերում, կանխիկ, բրոքերային հաշիվ։ Դրանցից են կազմվում պահուստային բարձը և զուտ կապիտալը։')}</p>
    ${S.accounts.map((a,i)=>`<div class="row r-acc">${inp(`accounts.${i}.bank`,T('Банк','Bank','Բանկ'),'str','dl-bank')}${sel(`accounts.${i}.type`,T('Тип','Type','Տեսակ'),ATYPE)}${inp(`accounts.${i}.balance`,T('Баланс','Balance','Մնացորդ'))}${inp(`accounts.${i}.rate`,T('Ставка %','Rate %','Տոկոս %'))}<button class="x" data-del="accounts.${i}">✕</button></div>`).join('')||`<p class="muted">${T('Счетов пока нет.','No accounts yet.','Հաշիվներ դեռ չկան։')}</p>`}
    ${qchips('account')}<div class="btns"><button class="btn ghost" data-add="account">+ ${T('Счёт','Account','Հաշիվ')}</button></div>
  </div><div id="accout"></div>`;
}
function accOut(){
  const c=calc();
  const banks={};const B=n=>banks[n||T('Без названия','Unnamed','Առանց անվան')]??={a:0,d:0,pay:0};
  S.accounts.forEach(a=>B(a.bank).a+=num(a.balance));
  S.loans.forEach(l=>{const b=B(l.bank);b.d+=num(l.balance);b.pay+=num(l.payment)});
  const rows=Object.entries(banks).map(([n,b])=>`<tr><td><b>${esc(n)}</b>${b.pay?`<br><span class="muted">${T('платежи','payments','վճարներ')} ${fmt(b.pay)}/${MO()}</span>`:''}</td><td class="n good">${fmt(b.a)}</td><td class="n bad">${b.d?fmt(b.d):'—'}</td><td class="n"><b class="${b.a-b.d>=0?'good':'bad'}">${fmt(b.a-b.d)}</b></td></tr>`).join('');
  const tips=[];
  const idle=S.accounts.filter(a=>(a.type==='current'||a.type==='cash')&&num(a.rate)===0).reduce((s,a)=>s+num(a.balance),0);
  const oneMonth=c.essential;
  if(idle>oneMonth*1.2&&idle>0){const gain=fmt((idle-oneMonth)*S.set.dep/1200*(1-S.set.tax/100));tips.push(['warn',T('Деньги лежат без процентов','Money sitting at 0%','Գումարը մնում է առանց տոկոսի'),T(`На карте и наличными ${fmt(idle)}, а на текущие траты нужно около ${fmt(oneMonth)} в месяц. Если перевести разницу ${fmt(idle-oneMonth)} на накопительный счёт под ${S.set.dep}%, это даст ≈${gain} в месяц.`,`You hold ${fmt(idle)} on cards and in cash, but monthly needs are about ${fmt(oneMonth)}. Moving the extra ${fmt(idle-oneMonth)} to a savings account at ${S.set.dep}% would earn ≈${gain} a month.`,`Քարտերում և կանխիկ ունեք ${fmt(idle)}, իսկ ամսական ծախսերի համար պետք է մոտ ${fmt(oneMonth)}։ Եթե ավելցուկը (${fmt(idle-oneMonth)}) փոխանցեք ${S.set.dep}% խնայողական հաշվի, ամսական կստանաք ≈${gain}։`)])}
  const excess=c.savings-c.target*c.essential;
  const top=[...S.loans].filter(l=>num(l.balance)>0&&!isTemp(l)).sort((a,b)=>num(b.rate)-num(a.rate))[0];
  const maxDep=Math.max(0,...S.accounts.filter(a=>ATYPE[a.type]?.[1]).map(a=>num(a.rate)));
  if(top&&excess>0&&num(top.rate)>maxDep)tips.push(['warn',T('Деньги лежат под меньший процент, чем кредит','Savings earn less than your loan costs','Խնայողությունները բերում են ավելի քիչ, քան արժե վարկը'),T(`Сверх подушки у вас ${fmt(excess)}. Лучший счёт даёт ${maxDep}%, а «${esc(top.name)}» стоит ${num(top.rate)}%. Если погасить кредит этой суммой, вы сэкономите больше, чем заработаете на счёте.`,`You have ${fmt(excess)} above your cushion. Your best account pays ${maxDep}%, while “${esc(top.name)}” costs ${num(top.rate)}%. Paying the loan down with this money saves more than the account earns.`,`Բարձից ավել ունեք ${fmt(excess)}։ Լավագույն հաշիվը տալիս է ${maxDep}%, իսկ «${esc(top.name)}» վարկն արժե ${num(top.rate)}%։ Այս գումարով վարկը մարելով՝ ավելի շատ կխնայեք, քան կվաստակեք հաշվի վրա։`)]);
  if(top&&excess<=0&&num(top.rate)>maxDep&&c.savings>0)tips.push(['',T('Не гасите кредит всеми накоплениями','Don’t use all your savings on the loan','Բոլոր խնայողություններով վարկը մի՛ մարեք'),T(`Накопления (${fmt(c.savings)}) пока не дотягивают до подушки на ${c.target} мес. Направлять их на досрочное погашение рано.`,`Your savings (${fmt(c.savings)}) don’t yet cover a ${c.target}-month cushion, so it’s too early to put them toward prepayment.`,`Խնայողությունները (${fmt(c.savings)}) դեռ չեն հասնում ${c.target} ամսվա բարձին։ Վաղաժամկետ մարման համար դեռ վաղ է։`)]);
  const bankCount=new Set(S.accounts.filter(a=>num(a.balance)>0).map(a=>a.bank)).size;
  const bigDep=S.accounts.filter(a=>a.type==='deposit'||a.type==='savings').sort((a,b)=>num(b.balance)-num(a.balance))[0];
  if(bigDep&&c.assets>0&&num(bigDep.balance)/c.assets>0.7&&bankCount<2)tips.push(['',T('Все деньги в одном банке','All money in one bank','Ամբողջ գումարը մեկ բանկում է'),T('Проверьте лимит гарантирования вкладов в вашей стране. Сумму сверх лимита надёжнее разделить между 2–3 банками.','Check your country’s deposit guarantee limit. It’s safer to split anything above the limit across 2–3 banks.','Ստուգեք ավանդների երաշխավորման սահմանաչափը ձեր երկրում։ Սահմանաչափից ավելին ավելի հուսալի է բաշխել 2–3 բանկի միջև։')]);
  if(S.accounts.some(a=>a.type==='invest'))tips.push(['',T('Брокерский счёт не входит в подушку','Brokerage isn’t part of the cushion','Բրոքերային հաշիվը բարձի մեջ չի մտնում'),T('Акции могут упасть в цене как раз тогда, когда понадобятся деньги. Поэтому они учитываются в капитале, но не в подушке безопасности.','Stocks can drop just when you need the money, so they count toward net worth but not toward your safety cushion.','Բաժնետոմսերը կարող են էժանանալ հենց այն պահին, երբ գումարը պետք լինի։ Դրա համար դրանք հաշվվում են կապիտալում, բայց ոչ պահուստային բարձում։')]);
  return `<div class="card"><h2>${T('Итоги по деньгам','Money overview','Գումարների ամփոփում')}</h2>
    <div class="grid">
      ${stat(T('На всех счетах','In all accounts','Բոլոր հաշիվներում'),fmt(c.assets))}
      ${stat(T('Все долги','Total debt','Ընդհանուր պարտք'),fmt(c.debt),'bad')}
      ${stat(T('Чистый капитал','Net worth','Զուտ կապիտալ'),fmt(c.net),c.net>=0?'good':'bad')}
      ${stat(T('Проценты по счетам (после налога)','Interest earned (after tax)','Տոկոսներ հաշիվներից (հարկից հետո)'),'+'+fmt(c.passive)+`<span class="muted" style="font-size:13px">/${MO()}</span>`,'good')}
    </div>
    <div class="tot"><span>${T('Подушка (доступные деньги)','Cushion (available money)','Բարձ (հասանելի գումար)')}</span><span>${fmt(c.savings)} · ${c.cushion.toFixed(1)} ${MO()}</span></div>
    ${edu('📘 '+T('Что такое чистый капитал?','What is net worth?','Ի՞նչ է զուտ կապիտալը'),T('Всё, что у вас есть на счетах, минус все долги. Это главный показатель богатства: если он растёт из месяца в месяц, вы двигаетесь в правильную сторону, даже если доход не меняется.','Everything in your accounts minus all your debts. It’s the key measure of wealth: if it grows month after month, you’re heading the right way, even if your income stays the same.','Ձեր բոլոր հաշիվների գումարը՝ հանած բոլոր պարտքերը։ Սա հարստության գլխավոր ցուցանիշն է. եթե այն ամիս առ ամիս աճում է, դուք ճիշտ ուղղությամբ եք շարժվում, նույնիսկ եթե եկամուտը չի փոխվում։'))}
  </div>
  <div class="card"><h2>${T('По банкам','By bank','Ըստ բանկերի')}</h2><div class="scroll"><table><tr><th>${T('Банк','Bank','Բանկ')}</th><th class="n">${T('Счета','Accounts','Հաշիվներ')}</th><th class="n">${T('Долги','Debts','Պարտքեր')}</th><th class="n">${T('Итого','Net','Ընդամենը')}</th></tr>${rows}</table></div></div>
  ${tips.length?`<div class="card"><h2>🧠 ${T('Советы по счетам','Account tips','Խորհուրդներ հաշիվների վերաբերյալ')}</h2>${tips.map(x=>tipH(...x)).join('')}</div>`:''}`;
}

/* ================== LOANS ================== */
function vLoans(){
  return `
  <div class="card"><h2>${T('Кредиты и долги','Loans & debts','Վարկեր և պարտքեր')}</h2><p class="sub">${T('Остаток долга, ставка (% годовых), ежемесячный платёж и день оплаты. Остальное калькулятор посчитает сам.','Remaining balance, annual rate, monthly payment and due day. The calculator works out the rest.','Պարտքի մնացորդը, տարեկան տոկոսադրույքը, ամսական վճարը և վճարման օրը։ Մնացածը հաշվիչը կհաշվի ինքը։')}</p>
    ${S.loans.map((l,i)=>`<div class="row r-loan r-loan2">
      ${inp(`loans.${i}.name`,T('Название','Name','Անվանում'),'str','dl-loan')}${inp(`loans.${i}.bank`,T('Банк','Bank','Բանկ'),'str','dl-bank')}${sel(`loans.${i}.type`,T('Тип','Type','Տեսակ'),LTYPE)}${inp(`loans.${i}.rate`,T('Ставка %','Rate %','Տոկոս %'))}
      ${inp(`loans.${i}.balance`,loanMode(l)==='monthly'?T('Остаток долга','Balance','Մնացորդ'):T('Сумма к оплате','Amount due','Վճարման ենթակա գումար'))}${sel(`loans.${i}.mode`,T('Как гасится','Repayment','Ինչպես է մարվում'),{monthly:[T('Каждый месяц','Monthly','Ամեն ամիս')],once:[T('Одной суммой к дате','One payment by a date','Մեկ վճարով՝ մինչև ամսաթիվ')],plan:[T('По графику','By schedule','Ըստ ժամանակացույցի')]})}
      ${loanMode(l)==='monthly'?inp(`loans.${i}.payment`,T('Платёж в мес.','Monthly payment','Ամսական վճար'))+inp(`loans.${i}.day`,T('День','Day','Օր')):loanMode(l)==='once'?`<label class="f">${T('Дата оплаты','Payment date','Վճարման ամսաթիվ')}<input type="date" data-k="loans.${i}.due" data-t="str" value="${esc(loanDue(l)||'')}"></label>`+(l.deadline&&l.deadline!==loanDue(l)?`<div class="muted" style="font-size:12px;align-self:end">${T('крайний срок','deadline','վերջնաժամկետ')} ${fdate(l.deadline)}</div>`:''):`<div class="muted" style="font-size:12px;align-self:end">${loanPlan(l).map(x=>fdate(x.date)+': '+fmt(x.amount)).join('<br>')||T('графика нет','no schedule','ժամանակացույց չկա')}</div>`}${dateF(`loans.${i}.from`,T('Дата выдачи','Taken on','Տրման ամսաթիվ'))}
      <button class="x" data-del="loans.${i}">✕</button></div>`).join('')||`<p class="muted">${T('Кредитов нет, отлично!','No loans — great!','Վարկեր չկան. հիանալի է։')}</p>`}
    ${qchips('loan')}<div class="btns"><button class="btn ghost" data-add="loan">+ ${T('Кредит','Loan','Վարկ')}</button></div>
  </div>
  <div id="loanout"></div>
  ${vImport()}
  ${vNewLoan()}`;
}
function loanOut(){
  if(!S.loans.length)return '';
  const c=calc();
  const rows=S.loans.map((l,i)=>{const f=c.infos[i];const tmp=f.temp;return `<tr><td><b>${esc(l.name)}</b><br><span class="muted">${lab(LTYPE[l.type]||'')} · ${num(l.rate)}%${l.bank?' · '+esc(l.bank):''}${tmp?' · '+(loanMode(l)==='once'?T('одной суммой','one payment','մեկ վճարով'):T('по графику','by schedule','ըստ ժամանակացույցի')):''}</span></td>
    <td class="n">${fmt(num(l.balance))}</td><td class="n">${tmp?(f.due?`<b>${fdate(f.due)}</b><br><span class="muted">${daysUntil(f.due)<0?`<span class="bad">${T('просрочено','overdue','ժամկետանց')}</span>`:T(`через ${daysUntil(f.due)} дн.`,`in ${daysUntil(f.due)} days`,`${daysUntil(f.due)} օրից`)}</span>`:'—'):f.ok?dur(f.n)+`<br><span class="muted">${monthLabel(f.n)}</span>`:`<span class="bad">${T('не гасится','never repaid','չի մարվում')}</span>`}</td>
    <td class="n">${tmp?(f.interest>0?fmt(f.interest):'—'):f.ok?fmt(f.interest):'∞'}</td></tr>`}).join('');
  const bad=S.loans.map((l,i)=>c.infos[i].ok?'':tipH('bad',T(`«${esc(l.name)}»: платёж меньше процентов`,`“${esc(l.name)}”: payment is below the interest`,`«${esc(l.name)}». վճարը փոքր է տոկոսից`),T(`Каждый месяц банк начисляет ≈${fmt(c.infos[i].minPay)} процентов, поэтому долг не уменьшается. Платите больше этой суммы.`,`The bank charges ≈${fmt(c.infos[i].minPay)} interest a month, so the debt never shrinks. Pay more than that.`,`Բանկը ամսական հաշվարկում է ≈${fmt(c.infos[i].minPay)} տոկոս, ուստի պարտքը չի նվազում։ Վճարեք դրանից ավելին։`))).join('');
  const ev=[];const today=new Date();today.setHours(0,0,0,0);
  S.loans.forEach((l,i)=>{if(num(l.balance)<=0)return;if(isTemp(l)){loanPlan(l).forEach(x=>{const dd=new Date(x.date+'T00:00:00');if(daysUntil(x.date)>=-3&&daysUntil(x.date)<=92)ev.push({d:dd,l,amt:x.amount})});return}const d=nextDate(num(l.day)||1);const n=c.infos[i].n;for(let k=0;k<3&&k<Math.ceil(n);k++){const dd=new Date(d.getFullYear(),d.getMonth()+k,1);dd.setDate(Math.min(num(l.day)||1,dim(dd.getFullYear(),dd.getMonth())));ev.push({d:dd,l})}});
  ev.sort((a,b)=>a.d-b.d);
  const cal=ev.map(e=>{const days=Math.round((e.d-today)/864e5);return `<tr><td><b>${e.d.getDate()} ${MONTHS()[e.d.getMonth()]}</b><br><span class="muted">${days===0?T('сегодня','today','այսօր'):days===1?T('завтра','tomorrow','վաղը'):T(`через ${days} дн.`,`in ${days} days`,`${days} օրից`)}</span></td><td>${esc(e.l.name)}${e.amt!=null?` <span class="pill p-warn">${T('разовый','one-off','միանվագ')}</span>`:''}</td><td class="n">${fmt(e.amt??num(e.l.payment))}</td></tr>`}).join('');
  const totI=c.infos.reduce((s,f)=>s+(f.ok?f.interest:0),0);
  return `
  <div class="card"><h2>${T('Когда и сколько платить','When and how much to pay','Երբ և որքան վճարել')}</h2><p class="sub">${T('Ближайшие платежи на 3 месяца вперёд.','Upcoming payments for the next 3 months.','Առաջիկա վճարումները 3 ամսվա համար։')}</p>
    <div class="scroll"><table><tr><th>${T('Дата','Date','Ամսաթիվ')}</th><th>${T('Кредит','Loan','Վարկ')}</th><th class="n">${T('Сумма','Amount','Գումար')}</th></tr>${cal}</table></div>
  </div>
  <div class="card"><h2>${T('Анализ кредитов','Loan analysis','Վարկերի վերլուծություն')}</h2>${bad}
    <div class="scroll"><table><tr><th>${T('Кредит','Loan','Վարկ')}</th><th class="n">${T('Остаток','Balance','Մնացորդ')}</th><th class="n">${T('Погасится за','Paid off in','Կմարվի')}</th><th class="n">${T('Ещё переплата','Interest left','Մնացած տոկոսներ')}</th></tr>${rows}</table></div>
    <div class="tot"><span>${T('Без долгов с','Debt-free from','Առանց պարտքի՝')}</span><span>${isFinite(c.free)?monthLabel(c.free):'—'}</span></div>
    <div class="tot" style="border:0;margin:0"><span>${T('Всего ещё отдадите банкам процентов','Total interest still to pay','Ընդհանուր տոկոսներ, որ դեռ կվճարեք')}</span><span class="bad">${fmt(totI)}</span></div>
    ${edu('📘 '+T('Как считается переплата?','How is interest calculated?','Ինչպե՞ս է հաշվվում գերավճարը'),T('Обычно кредит аннуитетный: платёж каждый месяц одинаковый, но в начале большая его часть уходит на проценты. Проценты начисляются на остаток: <b>остаток × ставка / 12</b>. Поэтому досрочное погашение в начале срока экономит больше всего, ведь уменьшается база, на которую банк начисляет проценты.','Most loans are annuity loans: the payment is the same every month, but early on most of it goes to interest. Interest is charged on the balance: <b>balance × rate / 12</b>. That’s why prepaying early saves the most: you shrink the base the bank charges interest on.','Վարկերի մեծ մասն անուիտետային է. ամսական վճարը նույնն է, բայց սկզբում դրա մեծ մասը գնում է տոկոսներին։ Տոկոսը հաշվվում է մնացորդի վրա՝ <b>մնացորդ × տոկոսադրույք / 12</b>։ Դրա համար սկզբում կատարված վաղաժամկետ մարումն ամենաշատն է խնայում. փոքրանում է այն գումարը, որի վրա բանկը տոկոս է հաշվում։'))}
  </div>
  <div class="card"><h2>${T('Остаток долга во времени','Debt balance over time','Պարտքի մնացորդը ժամանակի ընթացքում')}</h2>${lineChart([{data:simulate(S.loans,{rollover:false}).curve,color:'var(--c4)',name:T('Как сейчас','As is','Ինչպես հիմա')}])}</div>`;
}

/* ---------- new loan planner ---------- */
function vNewLoan(){
  const n=S.nl,k=n.kind;
  const accOpts=Object.fromEntries(S.accounts.map((a,i)=>[i,(a.bank||T('Счёт','Account','Հաշիվ'))+' · '+lab(ATYPE[a.type]||'')+' · '+fmt(num(a.balance))]));
  return `<div class="card"><h2>➕ ${T('Хочу взять новый кредит','Planning a new loan','Ուզում եմ նոր վարկ վերցնել')}</h2><p class="sub">${T('Ещё до того, как идти в банк: потянет ли бюджет, сколько вы переплатите и что станет с подушкой.','Before you go to the bank: can your budget handle it, how much interest you’ll pay, and what happens to your cushion.','Մինչ բանկ գնալը. արդյո՞ք բյուջեն կդիմանա, որքան կլինի գերավճարը և ինչ կլինի պահուստային բարձի հետ։')}</p>
    ${seg('nl.kind',[['mortgage','🏠 '+T('Ипотека','Mortgage','Հիփոթեք')],['consumer','💳 '+T('Потреб','Personal','Սպառողական')],['car','🚗 '+T('Авто','Car','Ավտո')],['short','⚡ '+T('Короткий займ','Short-term','Կարճաժամկետ')]])}
    <div class="grid" style="margin-top:12px">
      ${k==='mortgage'?inp('nl.price',T('Стоимость жилья','Property price','Բնակարանի արժեք'))+inp('nl.down',T('Первоначальный взнос','Down payment','Կանխավճար'))+inp('nl.years',T('Срок, лет','Term, years','Ժամկետ, տարի')):''}
      ${k==='consumer'||k==='car'?inp('nl.amount',T('Сумма кредита','Loan amount','Վարկի գումար'))+inp('nl.months',T('Срок, мес.','Term, months','Ժամկետ, ամիս')):''}
      ${k==='short'?inp('nl.amount',T('Сумма займа','Loan amount','Վարկի գումար'))+inp('nl.days',T('Срок, дней','Term, days','Ժամկետ, օր'))+inp('nl.dayRate',T('Ставка, % в день','Rate, % per day','Տոկոսադրույք, % օրական')):''}
      ${k!=='short'?inp('nl.rate',T('Ставка, % годовых','Rate, % per year','Տոկոսադրույք, % տարեկան'))+inp('nl.fee',T('Комиссии, оценка, страховка (разово)','Fees, appraisal, insurance (one-off)','Միջնորդավճար, գնահատում, ապահովագրություն (միանվագ)')):''}
      ${inp('nl.bank',T('Банк','Bank','Բանկ'),'str','dl-bank')}
      ${k==='mortgage'&&S.accounts.length?sel('nl.acc',T('Взнос списать со счёта','Take down payment from','Կանխավճարը գանձել հաշվից'),accOpts):''}
      ${k==='mortgage'&&S.profile.housing.type==='rent'?`<div class="wide"><label class="f">${T('После покупки','After buying','Գնելուց հետո')}</label>${seg('nl.moveIn',[[true,T('Переедем, аренды не будет','Move in, no more rent','Կտեղափոխվենք, վարձ չի լինի')],[false,T('Аренда останется','Keep renting','Վարձը կմնա')]])}</div>`:''}
    </div>
  </div><div id="nlout"></div>`;
}
function nlCompute(){
  const n=S.nl,k=n.kind,c=calc();
  let P,months,pay,monthly,over,upfront=0,apr=num(n.rate),total;
  if(k==='mortgage'){P=Math.max(0,num(n.price)-num(n.down));months=Math.round(num(n.years)*12);pay=annuity(P,apr,months);total=pay*months;over=total-P+num(n.fee);upfront=num(n.down)+num(n.fee);monthly=pay}
  else if(k==='short'){P=num(n.amount);const d=Math.max(1,num(n.days));total=P*(1+num(n.dayRate)/100*d);over=total-P;apr=num(n.dayRate)*365;months=Math.max(1,Math.ceil(d/30));pay=total/months;monthly=pay}
  else{P=num(n.amount);months=Math.max(1,Math.round(num(n.months)));pay=annuity(P,apr,months);total=pay*months;over=total-P+num(n.fee);upfront=num(n.fee);monthly=pay}
  const rentSaved=(k==='mortgage'&&n.moveIn&&S.profile.housing.type==='rent')?c.housing:0;
  const newFcf=c.fcf-monthly+rentSaved;
  const newDti=c.income>0?(c.loans+monthly)/c.income*100:100;
  const newEss=c.essential+monthly-rentSaved;
  const cushAfter=newEss>0?Math.max(0,c.savings-upfront)/newEss:0;
  const maxPay=Math.max(0,c.income*0.4-c.loans);
  const r=apr/1200;const maxLoan=k==='short'?null:(r>0?maxPay*(1-Math.pow(1+r,-months))/r:maxPay*months);
  return{c,P,months,pay,monthly,over,upfront,apr,total,rentSaved,newFcf,newDti,cushAfter,maxPay,maxLoan};
}
function nlOut(){
  const n=S.nl,k=n.kind,x=nlCompute(),c=x.c;
  if(x.P<=0)return `<div class="card"><p class="muted">${T('Введите сумму.','Enter an amount.','Մուտքագրեք գումարը։')}</p></div>`;
  const red=[],yel=[],ok=[];
  if(x.newFcf<0)red.push(T(`После кредита бюджет уйдёт в минус: ${fmt(x.newFcf)} в месяц.`,`With this loan your budget goes negative: ${fmt(x.newFcf)} a month.`,`Վարկից հետո բյուջեն կդառնա բացասական՝ ${fmt(x.newFcf)} ամսական։`));
  if(x.newDti>50)red.push(T(`Кредитная нагрузка станет ${pct(x.newDti)}. Это опасно, и многие банки при такой нагрузке откажут.`,`Debt load would hit ${pct(x.newDti)}. That’s risky, and many banks would turn you down.`,`Վարկային բեռը կդառնա ${pct(x.newDti)}։ Սա վտանգավոր է, և շատ բանկեր նման բեռի դեպքում կմերժեն։`));
  else if(x.newDti>35)yel.push(T(`Кредитная нагрузка вырастет до ${pct(x.newDti)}. Это выше комфортных 30–35%.`,`Debt load rises to ${pct(x.newDti)}, above the comfortable 30–35%.`,`Վարկային բեռը կաճի մինչև ${pct(x.newDti)}, ինչը բարձր է հարմարավետ 30–35%-ից։`));
  else ok.push(T(`Кредитная нагрузка останется ${pct(x.newDti)}. Это нормально.`,`Debt load stays at ${pct(x.newDti)}, which is fine.`,`Վարկային բեռը կմնա ${pct(x.newDti)}, ինչը նորմալ է։`));
  if(x.upfront>c.savings)red.push(T(`На взнос и комиссии нужно ${fmt(x.upfront)}, а доступно только ${fmt(c.savings)}.`,`You need ${fmt(x.upfront)} for the down payment and fees, but only ${fmt(c.savings)} is available.`,`Կանխավճարի և միջնորդավճարների համար պետք է ${fmt(x.upfront)}, իսկ հասանելի է միայն ${fmt(c.savings)}։`));
  else if(x.cushAfter<c.target/2)yel.push(T(`После взноса подушки останется на ${x.cushAfter.toFixed(1)} мес. (цель ${c.target}).`,`After the down payment your cushion covers only ${x.cushAfter.toFixed(1)} months (target ${c.target}).`,`Կանխավճարից հետո բարձը կբավարարի ${x.cushAfter.toFixed(1)} ամսվա (նպատակը՝ ${c.target})։`));
  if(k==='short'){const times=Math.round(x.apr/Math.max(1,S.set.dep));red.push(T(`Ставка ${num(n.dayRate)}% в день — это <b>${pct(x.apr)} годовых</b>. Примерно в ${times} раз дороже обычного депозита.`,`${num(n.dayRate)}% per day is <b>${pct(x.apr)} per year</b>, about ${times}× what a regular deposit pays.`,`Օրական ${num(n.dayRate)}%-ը <b>տարեկան ${pct(x.apr)}</b> է, մոտ ${times} անգամ ավելի, քան սովորական ավանդը։`));
    if(c.savings>=x.P)yel.push(T(`У вас есть ${fmt(c.savings)} на счетах. Взять из подушки и потом вернуть дешевле, чем займ.`,`You have ${fmt(c.savings)} in accounts. Borrowing from your cushion and paying it back is cheaper than this loan.`,`Հաշիվներում ունեք ${fmt(c.savings)}։ Բարձից վերցնելն ու հետո վերադարձնելն ավելի էժան է, քան այս վարկը։`))}
  if(k==='mortgage'){const dp=num(n.price)>0?num(n.down)/num(n.price)*100:0;
    if(dp<20)yel.push(T(`Первоначальный взнос ${pct(dp)}. При взносе меньше 20% ставка и страховка обычно дороже.`,`Down payment is ${pct(dp)}. Below 20% the rate and insurance are usually higher.`,`Կանխավճարը ${pct(dp)} է։ 20%-ից պակասի դեպքում տոկոսադրույքն ու ապահովագրությունը սովորաբար ավելի թանկ են։`));else ok.push(T(`Взнос ${pct(dp)}, это хорошо.`,`Down payment ${pct(dp)} — good.`,`Կանխավճարը ${pct(dp)} է. լավ է։`));
    if(x.rentSaved){const more=x.pay>x.rentSaved;ok.push(T(`Аренда ${fmt(x.rentSaved)} уйдёт. Платёж ипотеки ${more?'больше':'меньше'} аренды на ${fmt(Math.abs(x.pay-x.rentSaved))}.`,`Rent of ${fmt(x.rentSaved)} goes away. The mortgage payment is ${fmt(Math.abs(x.pay-x.rentSaved))} ${more?'more':'less'} than rent.`,`${fmt(x.rentSaved)} վարձը կվերանա։ Հիփոթեքի վճարը վարձից ${fmt(Math.abs(x.pay-x.rentSaved))}-ով ${more?'ավելի է':'պակաս է'}։`))}}
  if(k==='car'&&c.income>0&&(c.car+x.monthly)/c.income>0.2)yel.push(T(`Машина вместе с кредитом будет стоить ${pct((c.car+x.monthly)/c.income*100)} дохода. Комфортно — до 15–20%.`,`The car plus loan would take ${pct((c.car+x.monthly)/c.income*100)} of income. Comfortable is up to 15–20%.`,`Մեքենան վարկի հետ միասին կարժենա եկամտի ${pct((c.car+x.monthly)/c.income*100)}-ը։ Հարմարավետ է մինչև 15–20%։`));
  if(x.newFcf>=0&&x.newFcf<c.income*0.05)yel.push(T(`Свободных денег останется совсем мало: ${fmt(x.newFcf)} в месяц.`,`Very little would be left over: ${fmt(x.newFcf)} a month.`,`Ազատ գումար շատ քիչ կմնա՝ ${fmt(x.newFcf)} ամսական։`));
  const verdict=red.length?T('🔴 Не рекомендуется','🔴 Not recommended','🔴 Խորհուրդ չի տրվում'):yel.length?T('🟡 Можно, но с осторожностью','🟡 Possible, but be careful','🟡 Հնարավոր է, բայց զգուշությամբ'):T('🟢 Бюджет выдержит','🟢 Your budget can handle it','🟢 Բյուջեն կդիմանա');
  let sched='';
  if(k!=='short'){let b=x.P;const r=x.apr/1200;const yrs=[];for(let y=1;y<=Math.ceil(x.months/12);y++){let I=0,Pr=0;for(let m=0;m<12&&b>0.01;m++){const i=b*r;const p=Math.min(x.pay,b+i);I+=i;Pr+=p-i;b=b+i-p}yrs.push([y,I,Pr,Math.max(0,b)])}
    const show=yrs.length>8?yrs.filter((r,i)=>i<3||i===yrs.length-1||(i+1)%5===0):yrs;
    sched=`<h3>${T('График по годам','Year-by-year schedule','Տարեկան ժամանակացույց')}</h3><div class="scroll"><table><tr><th>${T('Год','Year','Տարի')}</th><th class="n">${T('Проценты','Interest','Տոկոսներ')}</th><th class="n">${T('В погашение долга','To principal','Մայր գումարի մարում')}</th><th class="n">${T('Остаток','Balance','Մնացորդ')}</th></tr>${show.map(r=>`<tr><td>${r[0]}</td><td class="n bad">${fmt(r[1])}</td><td class="n good">${fmt(r[2])}</td><td class="n">${fmt(r[3])}</td></tr>`).join('')}</table></div>
    ${edu('📘 '+T('Почему в первые годы почти всё уходит на проценты?','Why does most of the payment go to interest early on?','Ինչու՞ են առաջին տարիներին վճարի մեծ մասը տոկոսները'),T('Проценты начисляются на остаток долга, а в начале он самый большой. Поэтому досрочные платежи в первые годы ипотеки экономят больше всего.','Interest is charged on the remaining balance, which is largest at the start. That’s why prepaying in the first years of a mortgage saves the most.','Տոկոսը հաշվվում է պարտքի մնացորդի վրա, որը սկզբում ամենամեծն է։ Դրա համար հիփոթեքի առաջին տարիներին վաղաժամկետ վճարումներն ամենաշատն են խնայում։'))}`}
  return `<div class="card"><h2>${verdict}</h2>
    <div class="grid">
      ${stat(k==='short'?T('Вернуть','To repay','Վերադարձնել'):T('Платёж в месяц','Monthly payment','Ամսական վճար'),fmt(k==='short'?x.total:x.pay))}
      ${stat(T('Переплата всего','Total interest & fees','Ընդհանուր գերավճար'),fmt(x.over),'bad')}
      ${stat(T('Отдадите банку всего','Total paid to bank','Ընդամենը կվճարեք բանկին'),fmt(x.total+(k==='short'?0:num(n.fee))))}
      ${stat(T('Останется в месяц','Left each month','Կմնա ամսական'),fmt(x.newFcf),x.newFcf>=0?'good':'bad')}
    </div>
    ${red.map(t=>`<div class="tip bad">${t}</div>`).join('')}${yel.map(t=>`<div class="tip warn">${t}</div>`).join('')}${ok.map(t=>`<div class="tip good">${t}</div>`).join('')}
    ${x.maxLoan!=null?tipH('',T('Ваш безопасный лимит','Your safe limit','Ձեր անվտանգ սահմանը'),T(`Если держать нагрузку в пределах 40% дохода, новый платёж может быть до <b>${fmt(x.maxPay)}</b>. Под ${x.apr}% на ${dur(x.months)} это кредит до <b>${fmt(x.maxLoan)}</b>.`,`Keeping debt payments within 40% of income, a new payment can be up to <b>${fmt(x.maxPay)}</b>. At ${x.apr}% over ${dur(x.months)} that’s a loan of up to <b>${fmt(x.maxLoan)}</b>.`,`Եթե վարկային բեռը պահեք եկամտի 40%-ի սահմաններում, նոր վճարը կարող է լինել մինչև <b>${fmt(x.maxPay)}</b>։ ${x.apr}%-ով ${dur(x.months)} ժամկետով սա մինչև <b>${fmt(x.maxLoan)}</b> վարկ է։`)):''}
    ${sched}
    <div class="btns"><button class="btn" data-add="takeloan">${T('Добавить в мои кредиты','Add to my loans','Ավելացնել իմ վարկերին')}</button></div><p id="nlmsg" class="sub"></p>
  </div>`;
}
function takeLoan(){
  const n=S.nl,k=n.kind,x=nlCompute();if(x.P<=0)return T('Введите сумму','Enter an amount','Մուտքագրեք գումարը');
  const names={mortgage:LTYPE.mortgage,consumer:LTYPE.consumer,car:LTYPE.car,short:[T('Короткий займ','Short-term loan','Կարճաժամկետ վարկ')]};
  S.loans.push({name:lab(names[k]),bank:n.bank||'',type:k,balance:Math.round(x.P),rate:Math.round(x.apr*100)/100,payment:Math.round(x.pay),day:new Date().getDate()});
  const m=['✓ '+T('Кредит добавлен в список.','Loan added to your list.','Վարկը ավելացվեց ցանկին։')];
  if(x.upfront>0&&S.accounts[num(n.acc)]){const a=S.accounts[num(n.acc)];a.balance=Math.max(0,num(a.balance)-x.upfront);m.push(T(`Со счёта «${esc(a.bank)}» списано ${fmt(x.upfront)} (взнос и комиссии).`,`${fmt(x.upfront)} (down payment and fees) taken from “${esc(a.bank)}”.`,`«${esc(a.bank)}» հաշվից գանձվեց ${fmt(x.upfront)} (կանխավճար և միջնորդավճարներ)։`))}
  if(k==='mortgage'&&n.moveIn&&S.profile.housing.type==='rent'){S.profile.housing.type='mortgage';S.profile.housing.maint=0;m.push(T('Аренда убрана, жильё теперь «Ипотека».','Rent removed; housing is now “Mortgage”.','Վարձը հանվեց, բնակարանն այժմ «Հիփոթեք» է։'))}
  return m.join(' ');
}

/* ---------- charts ---------- */
function donut(items){
  const tot=items.reduce((s,x)=>s+x.v,0);if(tot<=0)return `<p class="muted">${T('Нет данных','No data','Տվյալներ չկան')}</p>`;
  let a=0;const R=60,C=2*Math.PI*R;
  const segs=items.filter(x=>x.v>0).map(x=>{const l=x.v/tot*C;const s=`<circle r="${R}" cx="80" cy="80" fill="none" stroke="${x.c}" stroke-width="26" stroke-dasharray="${l} ${C-l}" stroke-dashoffset="${-a}" transform="rotate(-90 80 80)"/>`;a+=l;return s}).join('');
  return `<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><svg viewBox="0 0 160 160" width="160" height="160">${segs}<text x="80" y="76" text-anchor="middle" font-size="11" fill="var(--muted)">${T('в месяц','per month','ամսական')}</text><text x="80" y="94" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)">${k1(tot)}</text></svg>
  <div class="legend" style="flex:1;min-width:180px">${items.filter(x=>x.v>0).map(x=>`<div><i style="background:${x.c}"></i>${x.n}<span class="v">${pct(x.v/tot*100)}</span></div>`).join('')}</div></div>`;
}
function lineChart(series){
  const W=640,H=200,P=36;const maxLen=Math.max(...series.map(s=>s.data.length));const maxV=Math.max(...series.flatMap(s=>s.data))||1;
  const x=i=>P+(W-P-8)*i/Math.max(1,maxLen-1),y=v=>H-22-(H-34)*v/maxV;
  const lines=series.map(s=>`<polyline fill="none" stroke="${s.color}" stroke-width="2.5" points="${s.data.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')}"/>`).join('');
  const ticks=[];let step=Math.max(1,Math.ceil(maxLen/7));if(step>6)step=Math.ceil(step/12)*12;else if(step>3)step=6;else step=3;for(let i=0;i<maxLen;i+=step){const d=addMonths(new Date(),i);ticks.push(`<text x="${x(i)}" y="${H-6}" font-size="10" text-anchor="middle" fill="var(--muted)">${MONTHS()[d.getMonth()]} ${String(d.getFullYear()).slice(2)}</text>`)}
  const yl=[0,.5,1].map(f=>`<line x1="${P}" x2="${W-8}" y1="${y(maxV*f)}" y2="${y(maxV*f)}" stroke="var(--line)"/><text x="${P-4}" y="${y(maxV*f)+3}" font-size="10" text-anchor="end" fill="var(--muted)">${k1(maxV*f)}</text>`).join('');
  const leg=series.length>1?`<div class="legend" style="flex-direction:row;gap:14px;margin-top:6px">${series.map(s=>`<div><i style="background:${s.color}"></i>${s.name}</div>`).join('')}</div>`:'';
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:240px">${yl}${lines}${ticks.join('')}</svg>${leg}`;
}
function meter(label,val,max,goodMax,warnMax,suffix,invert){
  const w=Math.max(0,Math.min(100,val/max*100));const cl=invert?(val>=goodMax?'good':val>=warnMax?'warn':'bad'):(val<=goodMax?'good':val<=warnMax?'warn':'bad');
  return `<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:14px"><span>${label}</span><b class="${cl}">${suffix(val)}</b></div><div class="bar"><div style="width:${w}%;background:var(--${cl})"></div></div></div>`;
}

/* ================== ANALYTICS ================== */
function insights(c){
  const t=[];const p=S.profile;
  if(c.irregList.length)t.push(['good',T('Периодические доходы','Periodic income','Պարբերական եկամուտներ'),c.irregList.map(x=>`${esc(x.name)}: <b>${fmt(num(x.amount))}</b> — ${esc(incWhen(x))}${incAvg(x)?` (≈${fmt(incAvg(x))}/${MO()})`:''}`).join('<br>')+'<br><span class="muted">'+T('Не входят в «доход в месяц», но учитываются в прогнозе в свои месяцы.','Not counted in “monthly income”, but included in the forecast in their months.','Չեն մտնում «ամսական եկամտի» մեջ, բայց հաշվի են առնվում կանխատեսման մեջ իրենց ամիսներին։')+'</span>']);
  if(c.soonList.length){const od=c.soonList.filter(x=>x.days<0),cash=Math.max(0,c.savings)+Math.max(0,c.fcf);t.push([od.length||c.soonPay>cash?'bad':'warn',T(`Разовые платежи по займам за 30 дней: ${fmt(c.soonPay)}`,`One-off loan payments due in 30 days: ${fmt(c.soonPay)}`,`Միանվագ վարկային վճարներ 30 օրում՝ ${fmt(c.soonPay)}`),c.soonList.slice(0,6).map(x=>`${fdate(x.date)} — ${esc(x.l.name)}: <b>${fmt(x.amount)}</b>${x.days<0?` <span class="bad">${T('просрочено','overdue','ժամկետանց')}</span>`:''}`).join('<br>')+(c.soonList.length>6?'<br>'+T(`и ещё ${c.soonList.length-6}`,`and ${c.soonList.length-6} more`,`և ևս ${c.soonList.length-6}`):'')+'<br><span class="muted">'+T('Они не входят в ежемесячные расходы — это платежи к конкретной дате.','These aren’t part of monthly spending — they’re due on specific dates.','Դրանք չեն մտնում ամսական ծախսերի մեջ. դրանք վճարներ են կոնկրետ ամսաթվի։')+'</span>'])}
  {const om=opsMonthSummary();if(om.n)t.push([om.out>om.inn?'warn':'',T('Разовые операции в этом месяце','One-off transactions this month','Այս ամսվա միանվագ գործարքները'),T(`Поступило +${fmt(om.inn)}, потрачено −${fmt(om.out)} сверх обычного бюджета (${om.n} операций). Подробно — во вкладке «Операции».`,`Received +${fmt(om.inn)}, spent −${fmt(om.out)} on top of the usual budget (${om.n} transactions). Details in the Transactions tab.`,`Մուտք՝ +${fmt(om.inn)}, ծախս՝ −${fmt(om.out)} սովորական բյուջեից ավելի (${om.n} գործարք)։ Մանրամասները՝ «Գործարքներ» բաժնում։`)])}
  if(c.fcf<0)t.push(['bad',T('Расходы больше доходов','Spending exceeds income','Ծախսերը գերազանցում են եկամուտները'),T(`Каждый месяц не хватает ${fmt(-c.fcf)}. Разница покрывается из накоплений или новыми долгами. Начните с «Желаний» (${fmt(c.want)}) и с самого дорогого кредита.`,`You’re short ${fmt(-c.fcf)} every month, and the gap comes out of savings or new debt. Start with “Wants” (${fmt(c.want)}) and your most expensive loan.`,`Ամեն ամիս պակասում է ${fmt(-c.fcf)}, և տարբերությունը ծածկվում է խնայողություններից կամ նոր պարտքերով։ Սկսեք «Ցանկություններից» (${fmt(c.want)}) և ամենաթանկ վարկից։`)]);
  if(c.dti>40)t.push(['bad',T('Высокая кредитная нагрузка','High debt load','Բարձր վարկային բեռ'),T(`На кредиты уходит ${pct(c.dti)} дохода. Безопасно — до 30–35%. Узнайте в банках про рефинансирование: объединение долгов под меньшую ставку может заметно снизить платёж.`,`${pct(c.dti)} of income goes to loans; safe is up to 30–35%. Ask banks about refinancing: combining debts at a lower rate can cut your payment noticeably.`,`Եկամտի ${pct(c.dti)}-ը գնում է վարկերին. անվտանգ է մինչև 30–35%։ Հարցրեք բանկերին վերաֆինանսավորման մասին. պարտքերը ավելի ցածր տոկոսով միավորելը կարող է զգալիորեն նվազեցնել վճարը։`)]);
  else if(c.dti>30)t.push(['warn',T('Кредитная нагрузка на грани','Debt load at the limit','Վարկային բեռը սահմանին է'),T(`${pct(c.dti)} дохода уходит на кредиты. Новые кредиты лучше не брать, пока не опуститесь ниже 30%.`,`${pct(c.dti)} of income goes to loans. Avoid new loans until you’re below 30%.`,`Եկամտի ${pct(c.dti)}-ը գնում է վարկերին։ Նոր վարկեր մի՛ վերցրեք, մինչև չիջնեք 30%-ից։`)]);
  const sh=S.loans.filter(l=>l.type==='short'&&num(l.balance)>0);
  if(sh.length)t.push(['bad',T('Короткие займы — самый дорогой долг','Short-term loans are the costliest debt','Կարճաժամկետ վարկերն ամենաթանկ պարտքն են'),T(`${sh.map(l=>'«'+esc(l.name)+'»').join(', ')}: такие займы часто стоят 100–400% годовых. Гасите их первыми, даже раньше подушки сверх 1 месяца, и не перекрывайте один займ другим: это долговая спираль.`,`${sh.map(l=>'“'+esc(l.name)+'”').join(', ')}: these often cost 100–400% a year. Pay them off first, even before building your cushion past 1 month, and never cover one with another: that’s a debt spiral.`,`${sh.map(l=>'«'+esc(l.name)+'»').join(', ')}. նման վարկերը հաճախ արժեն տարեկան 100–400%։ Մարեք դրանք առաջինը, նույնիսկ 1 ամսից ավելի բարձ կուտակելուց առաջ, և մի՛ փակեք մեկը մյուսով. դա պարտքային պարույր է։`)]);
  const card=S.loans.filter(l=>num(l.rate)>=22&&num(l.balance)>0&&l.type!=='short');
  if(card.length){const lst=card.map(l=>esc(l.name)+' ('+num(l.rate)+'%)').join(', ');t.push(['warn',T('Очень дорогой долг','Very expensive debt','Շատ թանկ պարտք'),T(`${lst}: ни один депозит или фонд не даёт такой гарантированной доходности. Это первый кандидат на досрочное погашение.`,`${lst}: no deposit or fund guarantees a return like that. This is the first candidate for prepayment.`,`${lst}. ոչ մի ավանդ կամ ֆոնդ այդպիսի երաշխավորված եկամտաբերություն չի տալիս։ Սա առաջին թեկնածուն է վաղաժամկետ մարման համար։`)])}
  if(c.cushion<c.target){const need=fmt(c.target*c.essential),gap=fmt(Math.max(0,c.target*c.essential-c.savings));t.push([c.cushion<1?'bad':'warn',T('Подушка безопасности мала','Safety cushion is too small','Պահուստային բարձը փոքր է'),T(`Накоплений хватит на ${c.cushion.toFixed(1)} мес. обязательных расходов. Для вашей семьи рекомендуется ${c.target} мес. — это ${need}. Не хватает ${gap}.`,`Savings cover ${c.cushion.toFixed(1)} months of essential costs. For your household ${c.target} months (${need}) is recommended. You’re ${gap} short.`,`Խնայողությունները կբավարարեն պարտադիր ծախսերի ${c.cushion.toFixed(1)} ամսվա։ Ձեր ընտանիքի համար խորհուրդ է տրվում ${c.target} ամիս՝ ${need}։ Պակասում է ${gap}։`)])}
  else t.push(['good',T('Подушка безопасности в порядке','Safety cushion is solid','Պահուստային բարձը կարգին է'),T(`Запаса хватит на ${c.cushion.toFixed(1)} мес. Хватит, чтобы спокойно пережить потерю работы или болезнь.`,`Your reserve covers ${c.cushion.toFixed(1)} months: enough to get through a job loss or illness calmly.`,`Պահուստը կբավարարի ${c.cushion.toFixed(1)} ամսվա. բավական է աշխատանքի կորուստը կամ հիվանդությունը հանգիստ հաղթահարելու համար։`)]);
  if(c.income>0&&c.want/c.income>0.3)t.push(['warn',T('Много уходит на желания','A lot goes to wants','Շատ է գնում ցանկություններին'),T(`${pct(c.want/c.income*100)} дохода — выше ориентира 30%.`,`${pct(c.want/c.income*100)} of income, above the 30% guideline.`,`Եկամտի ${pct(c.want/c.income*100)}-ը. ավելի է 30% ուղենիշից։`)]);
  if(c.car>0&&c.income>0&&c.car/c.income>0.15)t.push(['warn',T('Дорогая машина','Expensive car','Թանկ մեքենա'),T(`Машина с учётом страховки и ремонта обходится в ${fmt(c.car)}/мес. (${pct(c.car/c.income*100)} дохода). Комфортно, когда это не больше 10–15%.`,`Including insurance and repairs, the car costs ${fmt(c.car)}/mo (${pct(c.car/c.income*100)} of income). Comfortable is 10–15% or less.`,`Ապահովագրությամբ և վերանորոգմամբ մեքենան արժե ${fmt(c.car)}/ամս. (եկամտի ${pct(c.car/c.income*100)})։ Հարմարավետ է՝ ոչ ավելի, քան 10–15%։`)]);
  const sch=p.kids.filter(k=>k.stage==='school');
  if(sch.length){const nm=sch.map(k=>esc(k.name)).join(', '),fv=fmt(fvMonthly(30000,S.set.dep,72,S.set.tax)),ex=fmt(30000);t.push(['',T('Впереди университет','University is coming','Առջևում համալսարանն է'),T(`Ребёнку (${nm}) предстоит учёба в вузе. Если откладывать понемногу каждый месяц, к поступлению наберётся сумма без кредита. Пример: ${ex}/мес. под ${S.set.dep}% за 6 лет дадут ≈${fv}.`,`${nm} will be heading to university. Saving a little each month means paying for it without a loan. Example: ${ex}/mo at ${S.set.dep}% for 6 years grows to ≈${fv}.`,`${nm}-ին սպասվում է բուհական ուսում։ Ամեն ամիս քիչ-քիչ խնայելով՝ ընդունելության պահին գումարը կունենաք առանց վարկի։ Օրինակ՝ ${ex}/ամս. ${S.set.dep}%-ով 6 տարում կդառնա ≈${fv}։`)])}
  if(p.married&&c.earners<=1)t.push(['',T('Один кормилец','Single earner','Մեկ վաստակող'),T('Семья зависит от одного дохода, поэтому подушку лучше держать на 6 мес. и подумать о страховании жизни и здоровья основного кормильца.','The family depends on one income, so keep a 6-month cushion and consider life and health insurance for the main earner.','Ընտանիքը կախված է մեկ եկամտից, ուստի բարձը պահեք 6 ամսվա չափով և մտածեք հիմնական վաստակողի կյանքի ու առողջության ապահովագրության մասին։')]);
  if(c.savingsRate>=20&&c.fcf>0)t.push(['good',T('Вы хорошо откладываете','You’re saving well','Դուք լավ եք խնայում'),T(`Свободно ${pct(c.savingsRate)} дохода. Во вкладке «Лишние деньги» посмотрите, куда их выгоднее направить.`,`${pct(c.savingsRate)} of income is free. See the Extra money tab for where it works hardest.`,`Եկամտի ${pct(c.savingsRate)}-ը ազատ է։ «Ազատ գումար» բաժնում տեսեք, թե ուր է ավելի շահավետ այն ուղղել։`)]);
  return t.map(x=>tipH(...x)).join('');
}
function yearInterest(){let I=0;S.loans.forEach(l=>{let b=num(l.balance);const r=num(l.rate)/1200,P=num(l.payment);for(let k=0;k<12&&b>0.01;k++){const i=b*r;I+=i;b=b+i-Math.min(P,b+i)}});return I}
function vAnalytics(){
  const c=calc();
  const items=[{n:T('Жильё','Housing','Բնակարան'),v:c.housing,c:'var(--c1)'},{n:T('Коммунальные','Utilities','Կոմունալ'),v:c.util,c:'var(--c5)'},{n:T('Дети и учёба','Kids & education','Երեխաներ և ուսում'),v:c.kids,c:'var(--c6)'},{n:T('Машина','Car','Մեքենա'),v:c.car,c:'var(--c3)'},{n:T('Обязательные','Essentials','Պարտադիր'),v:c.need,c:'var(--c2)'},{n:T('Желания','Wants','Ցանկություններ'),v:c.want,c:'var(--c7)'},{n:T('Кредиты','Loans','Վարկեր'),v:c.loans,c:'var(--c4)'},{n:T('Регулярные платежи','Recurring payments','Պարբերական վճարներ'),v:c.planPay,c:'var(--c8)'}].filter(x=>x.v>0);
  const scCol=c.score>=70?'var(--good)':c.score>=45?'var(--warn)':'var(--bad)';const R=42,C=2*Math.PI*R;
  const wantPct=c.income?c.want/c.income*100:0,savePct=c.income?Math.max(0,c.fcf)/c.income*100:0,needPct=c.income?(c.needs+c.loans)/c.income*100:0;
  const sim=simulate(S.loans,{rollover:false});const debt12=sim.curve[Math.min(12,sim.curve.length-1)]||0;
  return `
  <div class="g2">
   <div class="card"><h2>${T('Финансовое здоровье','Financial health','Ֆինանսական առողջություն')}</h2>
    <div class="score"><svg viewBox="0 0 100 100" width="110" height="110"><circle r="${R}" cx="50" cy="50" fill="none" stroke="var(--line)" stroke-width="10"/><circle r="${R}" cx="50" cy="50" fill="none" stroke="${scCol}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C*c.score/100} ${C}" transform="rotate(-90 50 50)"/><text x="50" y="56" text-anchor="middle" font-size="22" font-weight="800" fill="var(--ink)">${c.score}</text></svg>
    <div style="flex:1">${meter(T('Норма сбережений','Savings rate','Խնայողության մակարդակ'),c.savingsRate,40,20,10,pct,true)}${meter(T('Кредитная нагрузка (DTI)','Debt-to-income (DTI)','Վարկային բեռ (DTI)'),c.dti,60,30,40,pct)}${meter(T('Подушка, мес.','Cushion, months','Բարձ, ամիս'),c.cushion,c.target*1.5,c.target,c.target/2,v=>v.toFixed(1)+' / '+c.target,true)}</div></div>
    ${edu('📘 '+T('Из чего складывается оценка?','How is the score built?','Ինչից է կազմված գնահատականը'),T(`30 баллов — сколько вы откладываете (цель от 20% дохода), 25 — кредитная нагрузка (до 20% отлично, выше 35% опасно), 25 — подушка безопасности (${c.target} мес. для вашей семьи), 20 — доля обязательных расходов в доходе.`,`30 points for how much you save (target 20%+ of income), 25 for debt load (under 20% is great, over 35% is risky), 25 for your safety cushion (${c.target} months for your household), and 20 for the share of income spent on essentials.`,`30 միավոր՝ որքան եք խնայում (նպատակը՝ եկամտի 20%-ից), 25՝ վարկային բեռ (մինչև 20%՝ գերազանց, 35%-ից բարձր՝ վտանգավոր), 25՝ պահուստային բարձ (${c.target} ամիս ձեր ընտանիքի համար), 20՝ պարտադիր ծախսերի մասնաբաժինը եկամտում։`))}
   </div>
   <div class="card"><h2>${T('Куда уходят деньги','Where the money goes','Ուր է գնում գումարը')}</h2>${donut(items)}</div>
  </div>
  <div class="card"><h2>${T('Правило 50 / 30 / 20','The 50 / 30 / 20 rule','50 / 30 / 20 կանոնը')}</h2><p class="sub">${T('Классический ориентир: 50% на необходимое (включая кредиты), 30% на желания, 20% на сбережения и досрочное погашение.','A classic guideline: 50% on needs (including loans), 30% on wants, 20% on savings and prepayment.','Դասական ուղենիշ. 50%՝ անհրաժեշտին (ներառյալ վարկերը), 30%՝ ցանկություններին, 20%՝ խնայողություններին և վաղաժամկետ մարմանը։')}</p>
    ${[[T('Необходимое','Needs','Անհրաժեշտ'),needPct,50,'var(--c1)'],[T('Желания','Wants','Ցանկություններ'),wantPct,30,'var(--c7)'],[T('Сбережения','Savings','Խնայողություններ'),savePct,20,'var(--c2)']].map(([n,v,g,col])=>`<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:14px"><span>${n} <span class="muted">${T('цель','target','նպատակ')} ${g}%</span></span><b>${pct(v)}</b></div><div class="bar"><div style="width:${Math.min(100,v)}%;background:${col}"></div></div></div>`).join('')}
  </div>
  <div class="card"><h2>🧠 ${T('Выводы мозга','The brain’s conclusions','Ուղեղի եզրակացությունները')}</h2>${insights(c)}</div>
  <div class="card"><h2>${T('Прогноз на год','12-month forecast','Կանխատեսում մեկ տարվա համար')}</h2><p class="sub">${T(`Если ничего не менять. Сумма в реальных деньгах — с поправкой на инфляцию ${S.set.infl}%.`,`If nothing changes. Real value is adjusted for ${S.set.infl}% inflation.`,`Եթե ոչինչ չփոխեք։ Իրական արժեքը հաշվարկված է ${S.set.infl}% գնաճով։`)}</p>
    <table>
      <tr><td>${T('Накопления через 12 мес.','Savings in 12 months','Խնայողություններ 12 ամսից')}</td><td class="n"><b>${fmt(c.savings+c.fcf*12)}</b></td></tr>
      <tr><td>${T('В покупательной способности сегодня','In today’s money','Այսօրվա գնողունակությամբ')}</td><td class="n">${fmt((c.savings+c.fcf*12)/(1+S.set.infl/100))}</td></tr>
      <tr><td>${T('Долг через 12 мес.','Debt in 12 months','Պարտք 12 ամսից')}</td><td class="n">${fmt(debt12)}</td></tr>
      <tr><td>${T('Процентов банкам за год','Interest paid this year','Տոկոսներ բանկերին մեկ տարում')}</td><td class="n bad">${fmt(yearInterest())}</td></tr>
    </table>
  </div>`;
}

/* ================== EXTRA MONEY ================== */
function vAdvice(){
  return `
  <div class="card"><h2>💡 ${T('Появились лишние деньги?','Got extra money?','Ազատ գումար ունե՞ք')}</h2><p class="sub">${T('Введите сумму, и мозг сравнит варианты: подушку, досрочное погашение кредита, депозит и биржу. Учитываются ваши кредиты, дети и запас денег.','Enter an amount and the brain compares your options: cushion, loan prepayment, deposit and the stock market, taking your loans, kids and savings into account.','Մուտքագրեք գումարը, և ուղեղը կհամեմատի տարբերակները. պահուստային բարձ, վարկի վաղաժամկետ մարում, ավանդ և բորսա՝ հաշվի առնելով ձեր վարկերը, երեխաներին և խնայողությունները։')}</p>
    <div class="grid">
      ${inp('adv.amount',T('Сумма','Amount','Գումար'))}
      <div><label class="f">${T('Это деньги…','This money is…','Այս գումարը…')}</label>${seg('adv.mode',[['once',T('Разово','One-off','Միանվագ')],['monthly',T('Каждый месяц','Every month','Ամեն ամիս')]])}</div>
      ${inp('adv.horizon',T('Горизонт, мес. (0 = авто)','Horizon, months (0 = auto)','Ժամկետ, ամիս (0 = ավտո)'))}
    </div>
    <div class="btns"><button class="btn ghost" data-fcf="1">${T('Подставить мой остаток в месяц','Use my monthly surplus','Օգտագործել իմ ամսական ավելցուկը')}</button></div>
    <h3>${T('Ставки для сравнения','Rates for comparison','Տոկոսադրույքներ համեմատության համար')}</h3>
    <div class="grid">${inp('set.dep',T('Депозит, % годовых','Deposit, % per year','Ավանդ, % տարեկան'))}${inp('set.inv',T('Биржа (индексный фонд), ожид. %','Stocks (index fund), expected %','Բորսա (ինդեքսային ֆոնդ), սպասվող %'))}${inp('set.tax',T('Налог на доход, %','Tax on returns, %','Եկամտահարկ, %'))}${inp('set.infl',T('Инфляция, %','Inflation, %','Գնաճ, %'))}</div>
    ${edu(T('Откуда эти цифры?','Where do these numbers come from?','Որտեղի՞ց են այս թվերը'),T('Это примерные значения по умолчанию. Впишите актуальную ставку по депозиту вашего банка и ставку налога на процентный и инвестиционный доход в вашей стране. Доходность биржи — средняя за длинный период, а в отдельные годы она бывает и минусовой.','These are rough defaults. Enter your bank’s current deposit rate and your country’s tax rate on interest and investment income. The stock return is a long-run average; some years are negative.','Սրանք մոտավոր լռելյայն արժեքներ են։ Մուտքագրեք ձեր բանկի ավանդի ընթացիկ տոկոսադրույքը և ձեր երկրում տոկոսային ու ներդրումային եկամտի հարկի դրույքը։ Բորսայի եկամտաբերությունը երկար ժամանակահատվածի միջինն է. որոշ տարիներ այն կարող է լինել բացասական։'))}
  </div>
  <div id="mkbadge">${mkBadge()}</div>
  <div id="advout"></div>`;
}
function advOut(){
  const c=calc(),A=num(S.adv.amount),once=S.adv.mode==='once';
  if(A<=0)return `<div class="card"><p class="muted">${T('Введите сумму выше.','Enter an amount above.','Մուտքագրեք գումարը վերևում։')}</p></div>`;
  const st=S.set,live=S.loans.filter(l=>num(l.balance)>0&&!isTemp(l)&&loanInfo(l).ok);
  const top=[...live].sort((a,b)=>num(b.rate)-num(a.rate))[0];
  const base=simulate(S.loans,{rollover:false});
  let H=num(S.adv.horizon)||(top?Math.min(360,Math.ceil(loanInfo(top).n)):(once?36:12));H=Math.max(1,H);
  const gap=Math.max(0,c.target*c.essential-c.savings);
  const depNet=st.dep*(1-st.tax/100),invNet=st.inv*(1-st.tax/100);
  const opts=[];
  if(gap>0){
    const mToFill=once?0:Math.ceil(gap/A);
    const part=once?(A>=gap?T('Эта сумма полностью закрывает разрыв.','This amount closes the gap completely.','Այս գումարն ամբողջությամբ փակում է բացը։'):T(`Эта сумма закроет ${pct(A/gap*100)} разрыва.`,`This amount covers ${pct(A/gap*100)} of the gap.`,`Այս գումարը կփակի բացի ${pct(A/gap*100)}-ը։`)):T(`При таком взносе цель будет достигнута за ${dur(mToFill)}.`,`At this rate you’ll reach the goal in ${dur(mToFill)}.`,`Այս տեմպով նպատակին կհասնեք ${dur(mToFill)}-ում։`);
    opts.push({id:'cushion',icon:'🛟',t:T('Подушка безопасности','Safety cushion','Պահուստային բարձ'),
      body:T(`Сейчас запаса хватит на ${c.cushion.toFixed(1)} мес. из ${c.target}. До цели не хватает <b>${fmt(gap)}</b>. ${part} Держите эти деньги на депозите с возможностью снятия: он принесёт ≈${pct(depNet)} годовых после налога.`,`Your reserve covers ${c.cushion.toFixed(1)} of ${c.target} months. You need <b>${fmt(gap)}</b> more. ${part} Keep it in an easy-access deposit earning ≈${pct(depNet)} a year after tax.`,`Այժմ պահուստը կբավարարի ${c.cushion.toFixed(1)} ամսվա ${c.target}-ից։ Մինչև նպատակը պակասում է <b>${fmt(gap)}</b>։ ${part} Պահեք այս գումարը հասանելի ավանդում, որը հարկից հետո կբերի տարեկան ≈${pct(depNet)}։`),
      why:T('Без подушки любая неожиданность (болезнь, потеря работы, ремонт) приводит к новому кредиту под высокий процент. Сначала безопасность, потом доходность.','Without a cushion, any surprise (illness, job loss, repairs) means a new high-interest loan. Safety first, then returns.','Առանց բարձի ցանկացած անսպասելի իրավիճակ (հիվանդություն, աշխատանքի կորուստ, վերանորոգում) բերում է բարձր տոկոսով նոր վարկի։ Նախ անվտանգություն, հետո եկամտաբերություն։')});
  }
  let prep=null;
  if(top){
    if(once){
      const B=num(top.balance),put=Math.min(A,B);
      const after={...top,balance:B-put};const i0=loanInfo(top),i1=loanInfo(after);
      const newPay=annuity(B-put,num(top.rate),Math.ceil(i0.n));
      const saved=i0.interest-i1.interest;
      let b=B-put,I2=0;const r=num(top.rate)/1200;for(let k=0;k<Math.ceil(i0.n)&&b>0.01;k++){const i=b*r;I2+=i;b=b+i-Math.min(newPay,b+i)}
      const savedP=i0.interest-I2;prep={saved};
      const nm=esc(top.name),rt=num(top.rate);
      opts.push({id:'prepay',icon:'🏦',t:T(`Досрочное погашение (аванс): «${nm}»`,`Prepay the loan: “${nm}”`,`Վաղաժամկետ մարում. «${nm}»`),
        body:T(`Это самый дорогой кредит (${rt}%). Если внести <b>${fmt(put)}</b>:<br>• <b>Сократить срок</b> (платёж тот же): экономия <b class="good">${fmt(saved)}</b> процентов, кредит закроется на <b>${dur(i0.n-i1.n)}</b> раньше, в ${monthLabel(i1.n)}.<br>• <b>Уменьшить платёж</b> (срок тот же): платёж станет <b>${fmt(newPay)}</b> вместо ${fmt(num(top.payment))}, экономия ${fmt(savedP)}.`,
          `This is your most expensive loan (${rt}%). If you pay in <b>${fmt(put)}</b>:<br>• <b>Shorten the term</b> (same payment): save <b class="good">${fmt(saved)}</b> in interest and finish <b>${dur(i0.n-i1.n)}</b> earlier, in ${monthLabel(i1.n)}.<br>• <b>Lower the payment</b> (same term): the payment drops to <b>${fmt(newPay)}</b> from ${fmt(num(top.payment))}, saving ${fmt(savedP)}.`,
          `Սա ամենաթանկ վարկն է (${rt}%)։ Եթե մուծեք <b>${fmt(put)}</b>.<br>• <b>Կրճատել ժամկետը</b> (վճարը նույնն է). կխնայեք <b class="good">${fmt(saved)}</b> տոկոս, վարկը կփակվի <b>${dur(i0.n-i1.n)}</b> շուտ՝ ${monthLabel(i1.n)}։<br>• <b>Նվազեցնել վճարը</b> (ժամկետը նույնն է). վճարը կդառնա <b>${fmt(newPay)}</b>՝ ${fmt(num(top.payment))}-ի փոխարեն, խնայողությունը՝ ${fmt(savedP)}։`),
        why:T(`Каждые 100 единиц, внесённые досрочно, гарантированно «зарабатывают» ${rt}% годовых: ровно столько вы не заплатите банку. И налог с этой выгоды не берётся. Сокращать срок обычно выгоднее, а уменьшать платёж стоит, если бюджет впритык.`,`Every 100 you prepay is a guaranteed ${rt}% a year “return”: interest you simply never pay the bank. And there’s no tax on it. Shortening the term usually saves more; lowering the payment is better if your budget is tight.`,`Վաղաժամկետ մուծված յուրաքանչյուր 100-ը երաշխավորված «վաստակում» է տարեկան ${rt}%. ճիշտ այդքան չեք վճարի բանկին, և այդ օգուտից հարկ չի գանձվում։ Ժամկետը կրճատելը սովորաբար ավելի շահավետ է, իսկ վճարը նվազեցնելը՝ եթե բյուջեն սեղմ է։`)});
    }else{
      const s=simulate(S.loans,{extra:A,order:'avalanche'}),sb=simulate(S.loans,{extra:A,order:'snowball'});
      const saved=base.interest-s.interest,savedS=base.interest-sb.interest;prep={saved,curve:s.curve};
      const diff=savedS<saved-1?T(`«Лавина» выгоднее на ${fmt(saved-savedS)}.`,`Avalanche saves ${fmt(saved-savedS)} more.`,`«Ձնահյուսը» ${fmt(saved-savedS)}-ով ավելի շահավետ է։`):T('Результат такой же.','Same result.','Արդյունքը նույնն է։');
      opts.push({id:'prepay',icon:'🏦',t:T('Досрочное погашение каждый месяц','Monthly prepayment','Ամսական վաղաժամկետ մարում'),
        body:T(`Если каждый месяц добавлять <b>${fmt(A)}</b> к платежам по методу «Лавина» (сначала самый дорогой кредит, освободившиеся платежи — на следующий):<br>• Без долгов с <b>${monthLabel(s.months)}</b> вместо ${monthLabel(base.months)}, на <b>${dur(base.months-s.months)}</b> раньше.<br>• Экономия процентов: <b class="good">${fmt(saved)}</b>.<br>• Метод «Снежный ком» (сначала самый маленький долг): экономия ${fmt(savedS)}. ${diff}`,
          `Adding <b>${fmt(A)}</b> a month using the “Avalanche” method (most expensive loan first, freed-up payments roll to the next):<br>• Debt-free by <b>${monthLabel(s.months)}</b> instead of ${monthLabel(base.months)}, <b>${dur(base.months-s.months)}</b> sooner.<br>• Interest saved: <b class="good">${fmt(saved)}</b>.<br>• “Snowball” method (smallest debt first) saves ${fmt(savedS)}. ${diff}`,
          `Եթե ամեն ամիս վճարներին ավելացնեք <b>${fmt(A)}</b> «Ձնահյուս» մեթոդով (նախ ամենաթանկ վարկը, ազատված վճարները՝ հաջորդին).<br>• Առանց պարտքի՝ <b>${monthLabel(s.months)}</b>-ից՝ ${monthLabel(base.months)}-ի փոխարեն, <b>${dur(base.months-s.months)}</b> շուտ։<br>• Տոկոսների խնայողություն՝ <b class="good">${fmt(saved)}</b>։<br>• «Ձնագունդ» մեթոդը (նախ ամենափոքր պարտքը) կխնայի ${fmt(savedS)}։ ${diff}`),
        why:T('«Лавина» математически выгоднее всего. «Снежный ком» мотивирует: долги быстрее исчезают из списка. Оба метода работают, если не брать новых кредитов.','Avalanche is mathematically the cheapest. Snowball is motivating: debts disappear from the list faster. Both work as long as you don’t take on new loans.','«Ձնահյուսը» մաթեմատիկորեն ամենաշահավետն է։ «Ձնագունդը» ոգևորում է. պարտքերն ավելի արագ են անհետանում ցանկից։ Երկու մեթոդն էլ աշխատում են, եթե նոր վարկեր չվերցնեք։')});
    }
  }
  const depFV=once?fvLump(A,st.dep,H,st.tax):fvMonthly(A,st.dep,H,st.tax);const put=once?A:A*H;
  opts.push({id:'dep',icon:'🏛',t:T('Банковский депозит','Bank deposit','Բանկային ավանդ'),
    body:T(`За ${dur(H)} под ${st.dep}% (после налога ${st.tax}% ≈ ${pct(depNet)}): вложите ${fmt(put)}, получите <b>${fmt(depFV)}</b>, доход <b class="good">${fmt(depFV-put)}</b>. С поправкой на инфляцию ${st.infl}% реальная доходность ≈ <b>${pct(depNet-st.infl)}</b> в год.`,`Over ${dur(H)} at ${st.dep}% (≈${pct(depNet)} after ${st.tax}% tax): put in ${fmt(put)}, get <b>${fmt(depFV)}</b>, a gain of <b class="good">${fmt(depFV-put)}</b>. After ${st.infl}% inflation the real return is ≈<b>${pct(depNet-st.infl)}</b> a year.`,`${dur(H)} ժամկետով ${st.dep}%-ով (${st.tax}% հարկից հետո ≈ ${pct(depNet)}). ներդնում եք ${fmt(put)}, ստանում <b>${fmt(depFV)}</b>, եկամուտը՝ <b class="good">${fmt(depFV-put)}</b>։ ${st.infl}% գնաճը հաշվի առնելով՝ իրական եկամտաբերությունը ≈ <b>${pct(depNet-st.infl)}</b> տարեկան։`),
    why:T('Надёжно и предсказуемо. Подходит для подушки и целей на 1–3 года (учёба ребёнка, ремонт).','Safe and predictable. Good for your cushion and 1–3 year goals (a child’s tuition, renovation).','Հուսալի է և կանխատեսելի։ Հարմար է բարձի և 1–3 տարվա նպատակների համար (երեխայի ուսում, վերանորոգում)։')});
  const invFV=once?fvLump(A,st.inv,H,st.tax):fvMonthly(A,st.inv,H,st.tax);
  const badV=invFV*0.75,goodV=once?fvLump(A,st.inv+5,H,st.tax):fvMonthly(A,st.inv+5,H,st.tax);
  const shortH=H<36?' <b class="warn">'+T('Ваш горизонт слишком короткий для биржи.','Your horizon is too short for stocks.','Ձեր ժամկետը չափազանց կարճ է բորսայի համար։')+'</b>':'';
  opts.push({id:'inv',icon:'📈',t:T('Биржа: индексный фонд (ETF)','Stock market: index fund (ETF)','Բորսա. ինդեքսային ֆոնդ (ETF)'),
    body:T(`Ожидаемо за ${dur(H)}: <b>${fmt(invFV)}</b> (доход ≈ ${fmt(invFV-put)}). Возможный разброс: от <span class="bad">${fmt(badV)}</span> в неудачный момент (просадка −25%) до <span class="good">${fmt(goodV)}</span> в удачный период.`,`Expected over ${dur(H)}: <b>${fmt(invFV)}</b> (gain ≈ ${fmt(invFV-put)}). Possible range: from <span class="bad">${fmt(badV)}</span> at a bad moment (−25% drop) to <span class="good">${fmt(goodV)}</span> in a good stretch.`,`Սպասվող արդյունքը ${dur(H)}-ում՝ <b>${fmt(invFV)}</b> (եկամուտ ≈ ${fmt(invFV-put)})։ Հնարավոր տատանում՝ <span class="bad">${fmt(badV)}</span>-ից անհաջող պահին (−25% անկում) մինչև <span class="good">${fmt(goodV)}</span> հաջող ժամանակահատվածում։`),
    why:T('Биржа даёт больше депозита только на длинном сроке, от 5 лет. Покупайте широкий индексный фонд, а не отдельные акции, и не вкладывайте деньги, которые понадобятся раньше.','Stocks beat deposits only over the long run, 5+ years. Buy a broad index fund rather than single stocks, and don’t invest money you’ll need sooner.','Բորսան ավանդից ավելի շատ է տալիս միայն երկար ժամկետում՝ 5 տարուց։ Գնեք լայն ինդեքսային ֆոնդ, ոչ թե առանձին բաժնետոմսեր, և մի՛ ներդրեք այն գումարը, որը ավելի շուտ պետք կգա։')+shortH});
  const school=S.profile.kids.filter(k=>k.stage==='school'||k.stage==='preschool');
  if(school.length){const m=72;const ef=once?fvLump(A,st.dep,m,st.tax):fvMonthly(A,st.dep,m,st.tax);const nm=school.map(k=>esc(k.name)).join(', ');
    opts.push({id:'edu',icon:'🎓',t:T('Фонд на учёбу детей','Kids’ education fund','Երեխաների ուսման ֆոնդ'),
      body:T(`Отдельный депозит на будущий университет (${nm}). За 6 лет: <b>${fmt(ef)}</b>.`,`A separate deposit for future university (${nm}). In 6 years: <b>${fmt(ef)}</b>.`,`Առանձին ավանդ ապագա համալսարանի համար (${nm})։ 6 տարում՝ <b>${fmt(ef)}</b>։`),
      why:T('Когда цель отдельная, деньги не тратятся на текущие нужды. Так ребёнок сможет поступить без образовательного кредита.','A separate goal keeps the money from being spent on day-to-day needs, so your child can enrol without a student loan.','Առանձին նպատակի դեպքում գումարը չի ծախսվում ընթացիկ կարիքների վրա։ Այդպես երեխան կկարողանա ընդունվել առանց ուսանողական վարկի։')});}
  const topRate=top?num(top.rate):0;
  opts.forEach(o=>{
    if(o.id==='cushion')o.score=c.cushion<1?100:90;
    if(o.id==='prepay')o.score=(top&&top.type==='short')?110:topRate>invNet+2?95:topRate>depNet?70:40;
    if(o.id==='dep')o.score=H<36?60:45;
    if(o.id==='inv')o.score=H>=60?(topRate>invNet?50:75):H>=36?45:15;
    if(o.id==='edu')o.score=55;
    if(c.fcf<0&&o.id!=='cushion'&&o.id!=='prepay')o.score-=30;
  });
  opts.sort((a,b)=>b.score-a.score);
  let left=A;const plan=[];
  for(const o of opts){if(left<=0)break;
    if(o.id==='cushion'){if(once){const x=Math.min(left,gap);plan.push([o,x]);left-=x}else{plan.push([o,left]);left=0}}
    else if(o.id==='prepay'&&top){const x=once?Math.min(left,num(top.balance)):left;plan.push([o,x]);left-=x}
    else{plan.push([o,left]);left=0}}
  const verdict=c.fcf<0?tipH('bad',T('Сначала бюджет','Fix the budget first','Նախ՝ բյուջեն'),T(`Расходы превышают доходы на ${fmt(-c.fcf)}/мес. Пока это так, лишние деньги лучше направить на подушку или самый дорогой долг, а не на рискованные вложения.`,`Spending exceeds income by ${fmt(-c.fcf)}/mo. Until that changes, put extra money into your cushion or most expensive debt, not risky investments.`,`Ծախսերը գերազանցում են եկամուտները ${fmt(-c.fcf)}/ամս.-ով։ Քանի դեռ այդպես է, ազատ գումարը ուղղեք բարձին կամ ամենաթանկ պարտքին, ոչ թե ռիսկային ներդրումների։`)):'';
  const chart=(!once&&prep&&prep.curve)?`<div class="card"><h2>${T('Долг: как сейчас и с доплатой','Debt: as is vs. with extra payments','Պարտք. ինչպես հիմա և լրավճարով')}</h2>${lineChart([{data:base.curve,color:'var(--c4)',name:T('Как сейчас','As is','Ինչպես հիմա')},{data:prep.curve,color:'var(--c2)',name:T('С доплатой','With extra','Լրավճարով')+' '+fmt(A)}])}</div>`:'';
  const cmpTxt=topRate>invNet?T('✅ Кредит дороже любых вложений, поэтому выгоднее гасить его.','✅ The loan costs more than any investment returns, so paying it off wins.','✅ Վարկն ավելի թանկ է, քան ցանկացած ներդրման եկամուտ, ուստի ավելի շահավետ է այն մարել։'):topRate>depNet?T('⚖️ Кредит дороже депозита, но дешевле ожидаемой доходности биржи. На длинном горизонте инвестиции могут выиграть, но гашение гарантировано. Разумно разделить деньги.','⚖️ The loan costs more than a deposit but less than expected stock returns. Over the long run investing may win, but prepaying is guaranteed. Splitting the money is sensible.','⚖️ Վարկն ավելի թանկ է, քան ավանդը, բայց ավելի էժան, քան բորսայի սպասվող եկամտաբերությունը։ Երկար ժամկետում ներդրումները կարող են շահել, բայց մարումը երաշխավորված է։ Խելամիտ է գումարը բաժանել։'):T('📈 Кредит дешёвый (ставка ниже депозита). Гасить досрочно нет смысла: выгоднее вкладывать.','📈 The loan is cheap (rate below the deposit rate). No point prepaying; investing pays more.','📈 Վարկը էժան է (տոկոսադրույքը ավանդից ցածր է)։ Վաղաժամկետ մարելն իմաստ չունի. ավելի շահավետ է ներդնել։');
  const cmp=top?`<div class="card"><h2>${T('Гасить кредит или инвестировать?','Pay off the loan or invest?','Մարե՞լ վարկը, թե՞ ներդնել')}</h2><table>
      <tr><td>${T('Ставка самого дорогого кредита','Most expensive loan rate','Ամենաթանկ վարկի տոկոսադրույքը')}</td><td class="n"><b>${pct(topRate)}</b> ${T('гарантированно','guaranteed','երաշխավորված')}</td></tr>
      <tr><td>${T('Депозит после налога','Deposit after tax','Ավանդ հարկից հետո')}</td><td class="n">${pct(depNet)}</td></tr>
      <tr><td>${T('Биржа после налога (ожидание)','Stocks after tax (expected)','Բորսա հարկից հետո (սպասվող)')}</td><td class="n">${pct(invNet)} <span class="muted">${T('с риском','with risk','ռիսկով')}</span></td></tr></table>
      <p class="sub" style="margin-top:10px">${cmpTxt}</p></div>`:'';
  return verdict+`
  <div class="card"><h2>🧠 ${T('План распределения','Allocation plan','Բաշխման պլան')} ${fmt(A)}${once?'':' '+T('в месяц','per month','ամսական')}</h2>
    <div class="alloc">${plan.map(([o,x])=>`<div><span>${o.icon} ${o.t}</span><b>${fmt(x)}</b></div>`).join('')}</div>
  </div>
  ${cmp}
  <div class="card"><h2>${T('Все варианты по приоритету','All options by priority','Բոլոր տարբերակներն ըստ առաջնահերթության')}</h2>
    ${opts.map((o,i)=>`<div class="opt ${i===0?'best':''}">${i===0?`<span class="rank">${T('Лучший шаг','Best move','Լավագույն քայլ')}</span>`:''}<h4>${o.icon} ${o.t}</h4><div style="font-size:14px">${o.body}</div>${edu(T('Почему так?','Why?','Ինչու՞'),o.why)}</div>`).join('')}
  </div>${chart}`;
}

/* ================== MARKET (daily data from db) ================== */
let MK=null,HIST=[],MKstate='loading';
function rerenderMarket(){if($('#mkout'))$('#mkout').innerHTML=mkOut();if($('#mkbadge'))$('#mkbadge').innerHTML=mkBadge()}
async function loadMarket(){
  const t=setTimeout(()=>{if(MKstate==='loading'){MKstate='slow';rerenderMarket()}},10000);
  try{
    const [m,h]=await Promise.all([api('/api/market'),api('/api/history?limit=400')]);
    MK=m.market;HIST=h.history||[];MKstate=MK?'ok':'empty';
  }catch(e){MKstate='slow'}
  clearTimeout(t);rerenderMarket();
}
const fdate=iso=>{if(!iso)return '—';const d=new Date(iso.length<=10?iso+'T12:00:00':iso);return isNaN(d)?iso:d.getDate()+' '+MONTHS()[d.getMonth()]+' '+d.getFullYear()};
const nf=(n,d=2)=>Number(n).toLocaleString(LOC(),{maximumFractionDigits:d});
const DAYS=()=>T('дн.','days','օր');
function topDeposit(){return MK?.deposits?.filter(d=>d.cur==='AMD').sort((a,b)=>b.rate-a.rate)[0]}
function mkBadge(){const td=topDeposit();if(!td)return '';return tipH('',T('📈 Лучший вклад на рынке сегодня','📈 Best deposit on the market today','📈 Շուկայի լավագույն ավանդն այսօր'),T(`${esc(td.bank)} — ${td.rate}% (${td.term} ${DAYS()}). У вас в расчёте стоит ${S.set.dep}%.`,`${esc(td.bank)} — ${td.rate}% (${td.term} ${DAYS()}). Your calculation uses ${S.set.dep}%.`,`${esc(td.bank)} — ${td.rate}% (${td.term} ${DAYS()})։ Ձեր հաշվարկում ${S.set.dep}% է։`)+(S.set.dep!==td.rate?` <button class="btn ghost" style="margin-top:8px;padding:6px 10px" data-mk="dep">${T('Подставить','Use it','Կիրառել')} ${td.rate}%</button>`:''))}
function vMarket(){return `<div id="mkout">${mkOut()}</div>`}
function mkOut(){
  if(MKstate==='loading')return `<div class="card"><p class="muted">${T('Загружаю данные рынка…','Loading market data…','Բեռնվում են շուկայի տվյալները…')}</p></div>`;
  if(!MK)return `<div class="card"><h2>📈 ${T('Рынок','Market','Շուկա')}</h2><p class="muted">${MKstate==='slow'?T('Данные пока не удаётся получить. Проверьте интернет.','Can’t reach the market data yet. Check your connection.','Շուկայի տվյալները դեռ հասանելի չեն։ Ստուգեք կապը։'):MKstate==='empty'?T('Данные ещё не собраны: сервер заполнит их при следующем обновлении.','No data collected yet: the server will fill it on its next update.','Տվյալները դեռ հավաքված չեն. սերվերը կլրացնի դրանք հաջորդ թարմացմանը։'):T('Сервер данных недоступен.','The data server is unavailable.','Տվյալների սերվերը հասանելի չէ։')}</p></div>`;
  const m=MK,c=calc();
  const usdHist=HIST.filter(h=>h.USD).map(h=>h.USD);
  const fx=m.fx||{};
  const dep=(m.deposits||[]).slice().sort((a,b)=>b.rate-a.rate);
  const mort=(m.mortgages||[]).slice().sort((a,b)=>a.rate-b.rate);
  // personal comparison
  const pers=[];const td=dep[0];
  const myBest=Math.max(0,...S.accounts.filter(a=>a.type==='deposit'||a.type==='savings').map(a=>num(a.rate)));
  const idleDep=S.accounts.filter(a=>(a.type==='deposit'||a.type==='savings')&&num(a.rate)<(td?.rate||0)-1).reduce((s,a)=>s+num(a.balance),0);
  if(td&&idleDep>0)pers.push(['warn',T('Ваши вклады ниже рынка','Your deposits are below market','Ձեր ավանդները շուկայից ցածր են'),T(`Лучшая ставка у вас ${myBest}%, а на рынке до ${td.rate}% (${esc(td.bank)}). На ${fmt(idleDep)} разница даёт ≈${fmt(idleDep*(td.rate-myBest)/100*(1-S.set.tax/100))} в год. Перед переводом проверьте условия досрочного снятия.`,`Your best rate is ${myBest}%, while the market offers up to ${td.rate}% (${esc(td.bank)}). On ${fmt(idleDep)} that’s ≈${fmt(idleDep*(td.rate-myBest)/100*(1-S.set.tax/100))} more a year. Check early-withdrawal terms before moving money.`,`Ձեր լավագույն տոկոսը ${myBest}% է, իսկ շուկայում՝ մինչև ${td.rate}% (${esc(td.bank)})։ ${fmt(idleDep)}-ի վրա տարբերությունը ≈${fmt(idleDep*(td.rate-myBest)/100*(1-S.set.tax/100))} է տարեկան։ Փոխանցելուց առաջ ստուգեք վաղաժամկետ հանման պայմանները։`)]);
  const mFloor=mort[0]?.rate;
  S.loans.forEach(l=>{if(num(l.balance)<=0)return;const r=num(l.rate);
    if(l.type==='mortgage'&&mFloor&&r>mFloor+2)pers.push(['warn',T(`Рефинансирование: «${esc(l.name)}»`,`Refinance: “${esc(l.name)}”`,`Վերաֆինանսավորում. «${esc(l.name)}»`),T(`Ваша ипотека ${r}%, на рынке от ${mFloor}% (${esc(mort[0].bank)}). Спросите банки о рефинансировании и посчитайте комиссии.`,`Your mortgage is ${r}%, the market starts at ${mFloor}% (${esc(mort[0].bank)}). Ask banks about refinancing and count the fees.`,`Ձեր հիփոթեքը ${r}% է, շուկայում՝ ${mFloor}%-ից (${esc(mort[0].bank)})։ Հարցրեք բանկերին վերաֆինանսավորման մասին և հաշվեք միջնորդավճարները։`)]);
    if((l.type==='consumer'||l.type==='car'||l.type==='card'||l.type==='short')&&m.consumer&&r>m.consumer.effMax)pers.push(['warn',T(`«${esc(l.name)}» дороже рынка`,`“${esc(l.name)}” costs more than the market`,`«${esc(l.name)}»-ն շուկայից թանկ է`),T(`${r}% против обычных ${m.consumer.effMin}–${m.consumer.effMax}% по потребкредитам. Рефинансирование может снизить платёж.`,`${r}% vs a typical ${m.consumer.effMin}–${m.consumer.effMax}% for consumer loans. Refinancing could lower your payment.`,`${r}%՝ սպառողական վարկերի սովորական ${m.consumer.effMin}–${m.consumer.effMax}%-ի դիմաց։ Վերաֆինանսավորումը կարող է նվազեցնել վճարը։`)])});
  if(m.cba&&m.cba.refi>=(HIST.filter(h=>h.refi).slice(-30)[0]?.refi??m.cba.refi)+0.25)pers.push(['',T('Ставки растут','Rates are rising','Տոկոսադրույքները աճում են'),T('ЦБ повышает ставку. Вклады могут подорожать (выгодно зафиксировать ставку надолго), а новые кредиты с плавающей ставкой — стать дороже.','The central bank is raising rates. Deposits may pay more (locking in a long term can pay off), while new floating-rate loans may get pricier.','ԿԲ-ն բարձրացնում է տոկոսադրույքը։ Ավանդները կարող են ավելի շատ բերել (երկար ժամկետով ամրագրելը կարող է շահավետ լինել), իսկ լողացող տոկոսով նոր վարկերը՝ թանկանալ։')]);
  if(!pers.length)pers.push(['good',T('Ваши условия в рынке','Your terms are in line with the market','Ձեր պայմանները շուկայական են'),T('Ставки по вашим счетам и кредитам близки к рыночным.','Your account and loan rates are close to market levels.','Ձեր հաշիվների և վարկերի տոկոսադրույքները մոտ են շուկայականին։')]);
  const spark=usdHist.length>1?lineChartSimple(usdHist):'';
  return `
  <div class="card"><h2>📈 ${T('Рынок сегодня','Market today','Շուկան այսօր')}</h2>
    <p class="sub">${T('Обновлено','Updated','Թարմացվել է')}: ${fdate(m.updatedAt)} · ${T('данные собираются автоматически раз в день','collected automatically once a day','տվյալները հավաքվում են ավտոմատ օրը մեկ անգամ')}</p>
    ${m.summary?.[LANG]?`<div class="tip">${esc(m.summary[LANG])}</div>`:''}
  </div>
  <div class="card"><h2>🧠 ${T('Что это значит для вас','What it means for you','Ինչ է սա նշանակում ձեզ համար')}</h2>${pers.map(x=>tipH(...x)).join('')}</div>
  <div class="g2">
   <div class="card"><h2>🏛 ${T('Центробанк Армении','Central Bank of Armenia','ՀՀ Կենտրոնական բանկ')}</h2>
    <div class="grid">${stat(T('Ставка рефинансирования','Refinancing rate','Վերաֆինանսավորման տոկոսադրույք'),pct(m.cba?.refi))}${stat(T('Ломбардное репо','Lombard repo','Լոմբարդային ռեպո'),pct(m.cba?.lombard))}${stat(T('Депозитная ставка ЦБ','CBA deposit rate','ԿԲ ավանդային տոկոսադրույք'),pct(m.cba?.deposit))}${m.inflation?stat(T('Инфляция г/г','Inflation y/y','Գնաճ տ/տ'),pct(m.inflation.yoy)+`<span class="muted" style="font-size:12px"> ${esc(m.inflation.period)}</span>`):''}</div>
    <p class="sub" style="margin-top:8px">${T('Решение от','Decision of','Որոշում՝')} ${fdate(m.cba?.date)}</p>
    ${edu('📘 '+T('Как ставка ЦБ влияет на меня?','How does the CBA rate affect me?','Ինչպե՞ս է ԿԲ տոկոսադրույքն ազդում ինձ վրա'),T('Когда ЦБ поднимает ставку, банки со временем платят больше по вкладам и берут больше по новым кредитам, особенно с плавающей ставкой. Когда снижает — наоборот.','When the central bank raises its rate, banks gradually pay more on deposits and charge more on new loans, especially floating-rate ones. When it cuts, the opposite happens.','Երբ ԿԲ-ն բարձրացնում է տոկոսադրույքը, բանկերը ժամանակի ընթացքում ավելի շատ են վճարում ավանդների համար և ավելի շատ են գանձում նոր վարկերի համար, հատկապես լողացող տոկոսով վարկերի։ Իջեցնելու դեպքում՝ հակառակը։'))}
   </div>
   <div class="card"><h2>💱 ${T('Курсы ЦБ','CBA exchange rates','ԿԲ փոխարժեքներ')} <span class="muted" style="font-size:13px;font-weight:500">${fdate(fx.date)}</span></h2>
    <div class="grid">${stat('USD',nf(fx.USD)+' ֏')}${stat('EUR',nf(fx.EUR)+' ֏')}${stat('RUB',nf(fx.RUB,4)+' ֏')}${fx.goldGram?stat(T('Золото, 1 г','Gold, 1 g','Ոսկի, 1 գ'),nf(fx.goldGram,0)+' ֏'):''}</div>
    ${spark?`<h3>USD/AMD</h3>${spark}`:''}
   </div>
  </div>
  <div class="card"><h2>🏦 ${T('Лучшие вклады в драмах','Top AMD deposits','Լավագույն դրամային ավանդներ')}</h2><p class="sub">${T('По данным на','As of','Առ')} ${fdate(m.depositsDate)}. ${T('Доход облагается налогом 10%. Гарантия вкладов:','Interest is taxed at 10%. Deposit guarantee:','Եկամուտը հարկվում է 10%-ով։ Ավանդների երաշխիք՝')} ${m.guarantee?nf(m.guarantee.amd,0)+' ֏':''}</p>
    <div class="scroll"><table><tr><th>${T('Банк','Bank','Բանկ')}</th><th class="n">${T('Ставка','Rate','Տոկոս')}</th><th class="n">${T('Срок','Term','Ժամկետ')}</th><th class="n">${T('Доход с 1 млн за год','Net on 1M / year','Զուտ եկամուտ 1 մլն-ից տարեկան')}</th></tr>
    ${dep.map(d=>`<tr><td><b>${esc(d.bank)}</b><br><span class="muted">${esc(d.product||'')}${d.min?' · '+T('от','from','սկսած')+' '+nf(d.min,0):''}</span></td><td class="n"><b class="good">${d.rate}%</b></td><td class="n">${esc(d.term)} ${DAYS()}</td><td class="n">${nf(1e6*d.rate/100*(1-S.set.tax/100),0)} ֏</td></tr>`).join('')}</table></div>
    <div class="btns">${td?`<button class="btn ghost" data-mk="dep">${T('Использовать','Use','Օգտագործել')} ${td.rate}% ${T('в расчётах','in calculations','հաշվարկներում')}</button>`:''}</div>
  </div>
  <div class="card"><h2>🏠 ${T('Ипотека в банках','Bank mortgages','Հիփոթեք բանկերում')}</h2><p class="sub">${T('Минимальные ставки; итоговую банк назначает по доходу и взносу.','Starting rates; the final rate depends on income and down payment.','Նվազագույն տոկոսադրույքներ. վերջնականը բանկը սահմանում է ըստ եկամտի և կանխավճարի։')}</p>
    <div class="scroll"><table><tr><th>${T('Банк','Bank','Բանկ')}</th><th class="n">${T('Ставка от','Rate from','Տոկոս՝ սկսած')}</th><th class="n">${T('Взнос','Down','Կանխավճար')}</th><th></th></tr>
    ${mort.map((x,i)=>`<tr><td><b>${esc(x.bank)}</b><br><span class="muted">${esc(x.note||'')} · ${fdate(x.date)}</span></td><td class="n"><b>${x.rate}%</b></td><td class="n">${x.down?esc(x.down)+'%':'—'}</td><td class="n"><button class="btn ghost" style="padding:6px 10px" data-mkm="${i}">${T('Рассчитать','Calculate','Հաշվել')}</button></td></tr>`).join('')}</table></div>
  </div>
  ${m.consumer?`<div class="card"><h2>💳 ${T('Потребительские кредиты','Consumer loans','Սպառողական վարկեր')}</h2>
    <div class="grid">${stat(T('Номинальная от','Nominal from','Անվանական՝ սկսած'),pct(m.consumer.nominalFrom))}${stat(T('Эффективная обычно','Effective, typical','Արդյունավետ, սովորաբար'),m.consumer.effMin+'–'+m.consumer.effMax+'%')}${stat(T('Онлайн-кредиты от','Online loans from','Առցանց վարկեր՝ սկսած'),pct(m.consumer.onlineFrom))}</div>
    ${edu('📘 '+T('Номинальная и эффективная ставка','Nominal vs effective rate','Անվանական և արդյունավետ տոկոսադրույք'),T('Номинальная — то, что пишут в рекламе. Эффективная включает комиссии и страховки — это реальная цена кредита. Сравнивайте банки только по эффективной.','Nominal is the advertised rate. Effective includes fees and insurance: it’s the real price. Compare banks by the effective rate only.','Անվանականը գովազդվող տոկոսադրույքն է։ Արդյունավետը ներառում է միջնորդավճարներն ու ապահովագրությունը. դա վարկի իրական գինն է։ Բանկերը համեմատեք միայն արդյունավետով։'))}</div>`:''}
  <div class="card"><h2>🌍 ${T('Мировые биржевые индексы','World stock indices','Համաշխարհային բորսային ինդեքսներ')}</h2><p class="sub">${T('Закрытие','Close of','Փակում՝')} ${fdate(m.indicesDate)}</p>
    <table>${(m.indices||[]).map(x=>`<tr><td><b>${esc(x.name)}</b></td><td class="n">${nf(x.value)}</td><td class="n ${x.chg>=0?'good':'bad'}">${x.chg>=0?'+':''}${nf(x.chg)}%</td></tr>`).join('')}</table>
    ${edu('📘 '+T('Зачем мне индексы?','Why do indices matter to me?','Ինչու՞ են ինդեքսները կարևոր ինձ համար'),T('Индексный фонд (ETF) повторяет такой индекс. Однодневные скачки на ±3% нормальны: на бирже важен долгий срок, а не новости дня.','An index fund (ETF) tracks an index like these. Daily swings of ±3% are normal: in the stock market the long run matters, not the day’s news.','Ինդեքսային ֆոնդը (ETF) կրկնում է նման ինդեքս։ ±3% օրական տատանումները նորմալ են. բորսայում կարևորը երկար ժամկետն է, ոչ թե օրվա նորությունները։'))}
  </div>
  <div class="card"><h2>${T('Источники','Sources','Աղբյուրներ')}</h2><p class="sub">${T('Ставки ориентировочные. Перед решением проверьте условия на сайте банка.','Rates are indicative. Check terms on the bank’s site before deciding.','Տոկոսադրույքները մոտավոր են։ Որոշում կայացնելուց առաջ ստուգեք պայմանները բանկի կայքում։')}</p>
    ${(m.sources||[]).map(s=>`<div style="padding:4px 0;font-size:13px"><a href="${esc(s.u)}" target="_blank" rel="noopener" style="color:var(--brand)">${esc(s.t)}</a></div>`).join('')}
  </div>`;
}
function lineChartSimple(data){
  const W=640,H=140,P=40;const mx=Math.max(...data),mn=Math.min(...data),rg=(mx-mn)||1;
  const x=i=>P+(W-P-8)*i/Math.max(1,data.length-1),y=v=>H-18-(H-30)*(v-mn)/rg;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:160px"><line x1="${P}" x2="${W-8}" y1="${y(mx)}" y2="${y(mx)}" stroke="var(--line)"/><line x1="${P}" x2="${W-8}" y1="${y(mn)}" y2="${y(mn)}" stroke="var(--line)"/><text x="${P-4}" y="${y(mx)+3}" font-size="11" text-anchor="end" fill="var(--muted)">${nf(mx)}</text><text x="${P-4}" y="${y(mn)+3}" font-size="11" text-anchor="end" fill="var(--muted)">${nf(mn)}</text><polyline fill="none" stroke="var(--c1)" stroke-width="2.5" points="${data.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')}"/></svg>`;
}

/* ================== AI ASSISTANT ================== */
let AIturns=[],AIctl=null,AIbusy=false;
function aiContext(){
  const c=calc();
  const budget={currency:S.currency,income:Math.round(c.income),spending:Math.round(c.spend),leftover:Math.round(c.fcf),healthScore:c.score,savingsRatePct:+c.savingsRate.toFixed(1),dtiPct:+c.dti.toFixed(1),cushionMonths:+c.cushion.toFixed(1),cushionTarget:c.target,netWorth:Math.round(c.net),
    breakdown:{housing:Math.round(c.housing),utilities:Math.round(c.util),kids:Math.round(c.kids),car:Math.round(c.car),essentials:Math.round(c.need),wants:Math.round(c.want),loanPayments:Math.round(c.loans)},
    family:{married:S.profile.married,kids:S.profile.kids.map(k=>k.stage),housing:S.profile.housing.type,car:S.profile.car.has},
    loans:S.loans.map((l,i)=>({bank:l.bank,type:l.type,balance:num(l.balance),ratePct:num(l.rate),payment:num(l.payment),monthsLeft:isFinite(c.infos[i].n)?Math.ceil(c.infos[i].n):null,interestLeft:isFinite(c.infos[i].interest)?Math.round(c.infos[i].interest):null})),
    accounts:S.accounts.map(a=>({bank:a.bank,type:a.type,balance:num(a.balance),ratePct:num(a.rate)})),
    settings:S.set};
  const market=MK?{updated:MK.updatedAt,cba:MK.cba,inflation:MK.inflation,fx:MK.fx,topDeposits:(MK.deposits||[]).slice(0,6),mortgages:MK.mortgages,consumer:MK.consumer,indices:MK.indices,guarantee:MK.guarantee}:null;
  return {budget,market};
}
function md(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^#{1,4}\s*(.+)$/gm,'<b>$1</b>').replace(/^\s*[-•]\s+/gm,'• ').replace(/\n/g,'<br>')}
function aiRender(){
  const box=$('#aimsgs');if(!box)return;
  box.innerHTML=(AIturns.length?'':`<div class="aib">${T('Привет! Я разберу ваш бюджет, кредиты и ставки банков. Спросите что угодно или выберите вопрос ниже.','Hi! I can walk you through your budget, loans and bank rates. Ask anything or pick a question below.','Բարև։ Ես կօգնեմ հասկանալ ձեր բյուջեն, վարկերը և բանկերի տոկոսադրույքները։ Հարցրեք ցանկացած բան կամ ընտրեք հարց ներքևից։')}</div>`)+AIturns.map(t=>`<div class="${t.role==='user'?'aiu':'aib'}">${t.role==='user'?esc(t.content):md(t.content)}</div>`).join('');
  $('#aichips').innerHTML=AIturns.length?'':[T('Какой кредит гасить первым?','Which loan should I pay off first?','Ո՞ր վարկը մարել առաջինը'),T('Где сейчас лучший вклад?','Where is the best deposit now?','Որտե՞ղ է հիմա լավագույն ավանդը'),T('Потяну ли я ипотеку?','Can I afford a mortgage?','Կկարողանա՞մ հիփոթեք վերցնել'),T('Как сократить расходы?','How can I cut spending?','Ինչպե՞ս կրճատել ծախսերը')].map(q=>`<button class="chip" data-aiq="${esc(q)}">${q}</button>`).join('');
  box.scrollTop=box.scrollHeight;
}
async function aiSend(q){
  if(AIbusy||!q.trim())return;
  AIturns.push({role:'user',content:q.trim()});
  if(!USER){AIturns.push({role:'assistant',content:T('Чтобы пользоваться помощником, войдите в аккаунт (кнопка 👤 вверху).','Please sign in to use the assistant (👤 button at the top).','Օգնականից օգտվելու համար մուտք գործեք (👤 կոճակը վերևում)։')});aiRender();return}
  AIturns.push({role:'assistant',content:T('Думаю…','Thinking…','Մտածում եմ…'),pending:true});aiRender();
  AIbusy=true;$('#aistop').classList.remove('hide');$('#aisend').disabled=true;
  AIctl=new AbortController();
  const hist=AIturns.filter(t=>!t.pending&&!t.local).slice(-12).map(({role,content})=>({role,content}));
  const last=AIturns[AIturns.length-1];
  try{
    const r=await api('/api/ai',{method:'POST',signal:AIctl.signal,body:JSON.stringify({messages:hist,lang:LANG,currency:S.currency,budget:aiContext().budget})});
    last.content=r.text;
  }catch(e){
    last.local=true;
    if(e.name==='AbortError')last.content=T('Остановлено.','Stopped.','Կանգնեցված է։');
    else if(e.status===401){USER=null;renderUser();last.content=T('Сессия истекла. Войдите снова.','Session expired. Please sign in again.','Սեսիան ավարտվել է։ Մուտք գործեք կրկին։')}
    else if(e.status===429)last.content=T('Лимит вопросов на этот час исчерпан. Попробуйте позже.','You’ve reached this hour’s question limit. Try again later.','Այս ժամվա հարցերի սահմանաչափը սպառված է։ Փորձեք ավելի ուշ։');
    else if(e.status===503)last.content=T('AI не настроен на сервере (нет API-ключа).','AI isn’t configured on the server (no API key).','AI-ն կարգավորված չէ սերվերում (չկա API բանալի)։');
    else last.content=T('Не удалось получить ответ. Попробуйте ещё раз.','Couldn’t get an answer. Please try again.','Չհաջողվեց պատասխան ստանալ։ Փորձեք կրկին։');
  }finally{delete last.pending;AIbusy=false;$('#aistop').classList.add('hide');$('#aisend').disabled=false;aiRender()}
}

/* ================== ACCOUNT (login) ================== */
let authMode='login';
function renderUser(){
  const b=$('#userbtn');if(b)b.textContent=USER?'👤 '+USER.email.split('@')[0]:'👤 '+T('Войти','Sign in','Մուտք');
  $('#aibtn').classList.toggle('hide',!AIENABLED||AUTH!=='in');
}
function openAuth(){
  const m=$('#authmodal');m.classList.remove('hide');
  $('#authbody').innerHTML=USER?`<h2>👤 ${esc(USER.email)}</h2><p class="sub">${T('Данные бюджета сохраняются на сервере и доступны на любом устройстве.','Your budget is saved on the server and available on any device.','Բյուջեի տվյալները պահվում են սերվերում և հասանելի են ցանկացած սարքից։')} <span id="syncst"></span></p><div class="btns"><button class="btn ghost" data-act="logout">${T('Выйти','Sign out','Ելք')}</button><button class="btn ghost" data-act="authclose">${T('Закрыть','Close','Փակել')}</button></div>`
  :`<h2>${authMode==='login'?T('Вход','Sign in','Մուտք'):T('Регистрация','Create account','Գրանցում')}</h2>
   <p class="sub">${T('Аккаунт нужен, чтобы хранить бюджет на сервере и пользоваться AI-помощником.','An account keeps your budget on the server and unlocks the AI assistant.','Հաշիվը թույլ է տալիս պահել բյուջեն սերվերում և օգտվել AI օգնականից։')}</p>
   <form id="authform" class="grid" style="grid-template-columns:1fr">
     <label class="f">Email<input id="aemail" type="email" autocomplete="email" required></label>
     <label class="f">${T('Пароль (мин. 8 символов)','Password (min 8 characters)','Գաղտնաբառ (նվազ. 8 նիշ)')}<input id="apass" type="password" autocomplete="${authMode==='login'?'current-password':'new-password'}" minlength="8" required></label>
     <button class="btn" type="submit">${authMode==='login'?T('Войти','Sign in','Մուտք գործել'):T('Создать аккаунт','Create account','Ստեղծել հաշիվ')}</button>
   </form><p id="autherr" class="sub bad"></p>
   <div class="btns"><button class="btn ghost" data-act="authswitch">${authMode==='login'?T('Нет аккаунта? Регистрация','No account? Sign up','Հաշիվ չունե՞ք։ Գրանցվել'):T('Уже есть аккаунт? Войти','Have an account? Sign in','Արդեն ունե՞ք հաշիվ։ Մուտք')}</button></div>`;
  $('#authform')?.addEventListener('submit',async e=>{
    e.preventDefault();const err=$('#autherr');err.textContent='';
    try{
      const r=await api(authMode==='login'?'/api/login':'/api/register',{method:'POST',body:JSON.stringify({email:$('#aemail').value.trim(),password:$('#apass').value})});
      USER={email:r.email};AUTH='in';$('#authmodal').classList.remove('gate');await afterLogin();$('#authmodal').classList.add('hide');renderUser();render();loadMarket();
    }catch(x){err.textContent={bad_credentials:T('Неверный email или пароль.','Wrong email or password.','Սխալ email կամ գաղտնաբառ։'),email_taken:T('Этот email уже зарегистрирован.','This email is already registered.','Այս email-ն արդեն գրանցված է։'),weak_password:T('Пароль слишком короткий.','Password is too short.','Գաղտնաբառը շատ կարճ է։'),bad_email:T('Проверьте email.','Check the email.','Ստուգեք email-ը։'),too_many_requests:T('Слишком много попыток. Подождите.','Too many attempts. Please wait.','Չափազանց շատ փորձեր։ Սպասեք։')}[x.code]||T('Ошибка сервера.','Server error.','Սերվերի սխալ։')}
  });
}
async function afterLogin(){
  S=emptyState();
  try{const r=await api('/api/budget');S=normalize(r.data)}catch(_){}
  translateDefaults();
  if(migrateRefund()|rollLoans())pushBudget();
}
async function init(){
  try{const r=await api('/api/me');USER=r.user;AIENABLED=r.ai}catch(_){}
  AUTH=USER?'in':'out';
  if(USER){await afterLogin();loadMarket()}
  renderUser();render();
}
function logout(){
  api('/api/logout',{method:'POST'}).catch(()=>{});
  USER=null;AUTH='out';S=emptyState();MK=null;HIST=[];AIturns=[];
  $('#aipanel').classList.add('hide');renderUser();render();
}

/* ================== DATA CARD ================== */
function dataCard(){return `<div class="card"><h2>${T('Данные','Data','Տվյալներ')}</h2><p class="sub">${T('Сохраните копию данных или перенесите на другое устройство.','Back up your data or move it to another device.','Պահպանեք տվյալների պատճենը կամ տեղափոխեք այլ սարք։')}</p>
  <div class="btns"><button class="btn ghost" data-act="copy">📋 ${T('Скопировать данные','Copy data','Պատճենել տվյալները')}</button><button class="btn ghost" data-act="import">📥 ${T('Вставить данные','Paste data','Տեղադրել տվյալները')}</button><button class="btn ghost" data-act="demo">✨ ${T('Пример','Example','Օրինակ')}</button><button class="btn ghost" data-act="clear">🗑 ${T('Очистить всё','Clear all','Մաքրել ամբողջը')}</button></div>
  <div id="io" class="hide" style="margin-top:10px"><textarea id="iot" placeholder="${T('Вставьте сюда скопированные данные','Paste your copied data here','Տեղադրեք պատճենված տվյալներն այստեղ')}"></textarea><div class="btns"><button class="btn" data-act="doimport">${T('Загрузить','Load','Բեռնել')}</button></div></div><p id="msg" class="sub"></p></div>`}

/* ---- быстрый выбор названий ---- */
const Q_INCOME=[['↩️','Возврат налога (ипотека)','Mortgage tax refund','Հիփոթեքի հարկի վերադարձ',{freq:'quarterly',month:1,day:20}],['💼','Зарплата','Salary','Աշխատավարձ'],['🧑‍💻','Фриланс','Freelance','Ֆրիլանս'],['🛠','Подработка','Side job','Լրացուցիչ աշխատանք'],['🎁','Премия','Bonus','Պարգևավճար'],['🏠','Сдача квартиры','Rental income','Բնակարանի վարձակալություն'],['👴','Пенсия','Pension','Կենսաթոշակ'],['👶','Пособие','Benefit','Նպաստ'],['📈','Дивиденды','Dividends','Շահաբաժիններ'],['🌍','Перевод из-за границы','Remittance','Դրամական փոխանցում']];
const Q_EXPENSE=[['🛒','Продукты','Groceries','Մթերք','food'],['🍞','Хлеб, молоко','Bread, milk','Հաց, կաթ','food'],['💊','Аптека','Pharmacy','Դեղատուն','health'],['🩺','Врачи','Doctors','Բժիշկներ','health'],['🦷','Стоматолог','Dentist','Ատամնաբույժ','health'],['🚕','Такси','Taxi','Տաքսի','transport'],['🚌','Автобус, метро','Bus, metro','Ավտոբուս, մետրո','transport'],['👕','Одежда','Clothing','Հագուստ','clothes'],['👟','Обувь','Shoes','Կոշիկ','clothes'],['☕','Кафе','Cafes','Սրճարաններ','fun'],['🍕','Доставка еды','Food delivery','Սննդի առաքում','fun'],['🎬','Кино, развлечения','Cinema, fun','Կինո, զվարճանք','fun'],['📺','Подписки','Subscriptions','Բաժանորդագրություններ','subs'],['🏋️','Спорт, фитнес','Gym, sports','Սպորտ, ֆիթնես','fun'],['💇','Красота, парикмахер','Beauty, haircut','Գեղեցկություն, վարսավիր','other'],['🎁','Подарки','Gifts','Նվերներ','gifts'],['✈️','Путешествия','Travel','Ճամփորդություն','travel'],['🐾','Домашние животные','Pets','Ընտանի կենդանիներ','other'],['📚','Курсы, книги','Courses, books','Դասընթացներ, գրքեր','other'],['🧴','Бытовая химия','Household goods','Կենցաղային ապրանքներ','food'],['🚬','Сигареты','Cigarettes','Ծխախոտ','want'],['🙏','Благотворительность','Charity','Բարեգործություն','gifts']];
const Q_LOAN=[['🛍','Потребкредит','Consumer loan','Սպառողական վարկ','consumer'],['🏠','Ипотека','Mortgage','Հիփոթեք','mortgage'],['🚗','Автокредит','Car loan','Ավտովարկ','car'],['💳','Кредитная карта','Credit card','Վարկային քարտ','card'],['📱','Рассрочка','Installment plan','Ապառիկ','consumer'],['💍','Кредит под золото','Gold-backed loan','Ոսկու գրավով վարկ','consumer'],['🎓','Образовательный кредит','Student loan','Ուսանողական վարկ','consumer'],['⚡','Микрозайм','Payday loan','Միկրովարկ','short'],['🤝','Долг знакомым','Loan from friends','Պարտք ծանոթներին','other']];
const BANKS=['Ameriabank','Ardshinbank','ACBA Bank','Inecobank','Evocabank','IDBank','Converse Bank','Armeconombank','Unibank','Araratbank','AMIO Bank','Fast Bank','Artsakhbank','VTB Bank (Armenia)','Byblos Bank Armenia','ArmSwissBank','Mellat Bank'];
const Q_ACC=[['💳','current'],['🏦','deposit'],['🐖','savings'],['💵','cash'],['📈','invest']];
function qchips(kind){
  const lab=T('Быстро добавить:','Quick add:','Արագ ավելացնել՝');
  const list=kind==='income'?Q_INCOME:kind==='expense'?Q_EXPENSE:kind==='loan'?Q_LOAN:Q_ACC;
  return `<div class="qchips"><span class="muted">${lab}</span>${list.map((q,i)=>`<button class="chip" data-q="${kind}" data-i="${i}">${q[0]} ${kind==='account'?esc(lab2(ATYPE[q[1]])):esc(L(q.slice(1,4)))}</button>`).join('')}</div>`;
}
function lab2(v){return Array.isArray(v)&&Array.isArray(v[0])?L(v[0]):Array.isArray(v)?L(v):v}
function quickAdd(kind,i){
  if(kind==='income'){const q=Q_INCOME[i];S.incomes.push({name:L(q.slice(1,4)),amount:0,...(q[4]||{})});return `incomes.${S.incomes.length-1}.amount`}
  if(kind==='expense'){const q=Q_EXPENSE[i];S.expenses.push({name:L(q.slice(1,4)),cat:CATS[q[4]]?q[4]:'other',amount:0});return `expenses.${S.expenses.length-1}.amount`}
  if(kind==='loan'){const q=Q_LOAN[i];S.loans.push({name:L(q.slice(1,4)),bank:'',type:q[4],balance:0,rate:0,payment:0,day:1});return `loans.${S.loans.length-1}.bank`}
  if(kind==='account'){const q=Q_ACC[i];S.accounts.push({bank:q[1]==='cash'?T('Наличные','Cash','Կանխիկ'):'',type:q[1],balance:0,rate:0});return `accounts.${S.accounts.length-1}.${q[1]==='cash'?'balance':'bank'}`}
}
function datalists(){
  const opt=a=>a.map(v=>`<option value="${esc(v)}"></option>`).join('');
  return `<datalist id="dl-income">${opt(Q_INCOME.map(q=>L(q.slice(1,4))))}</datalist>
  <datalist id="dl-expense">${opt(Q_EXPENSE.map(q=>L(q.slice(1,4))))}</datalist>
  <datalist id="dl-loan">${opt(Q_LOAN.map(q=>L(q.slice(1,4))))}</datalist>
  <datalist id="dl-rem">${opt(Q_REM.map(q=>L(q.slice(1,4))))}</datalist>
  <datalist id="dl-bank">${opt([...BANKS,T('Наличные','Cash','Կանխիկ')])}</datalist>`;
}
function autoFill(path,val){
  let m=path.match(/^expenses\.(\d+)\.name$/);
  if(m){const q=Q_EXPENSE.find(q=>q.slice(1,4).includes(String(val).trim()));if(q&&CATS[q[4]]){S.expenses[+m[1]].cat=q[4];const el=document.querySelector(`[data-k="expenses.${m[1]}.cat"]`);if(el)el.value=q[4]}return}
  m=path.match(/^loans\.(\d+)\.name$/);
  if(m){const q=Q_LOAN.find(q=>q.slice(1,4).includes(String(val).trim()));if(q){S.loans[+m[1]].type=q[4];const el=document.querySelector(`[data-k="loans.${m[1]}.type"]`);if(el)el.value=q[4]}}
}

/* ---- перевод стандартных названий (из примера) при смене языка ---- */
const DEFAULT_NAMES=[['Зарплата','Salary','Աշխատավարձ'],['Продукты','Groceries','Մթերք'],['Аптека, врачи','Pharmacy, doctors','Դեղատուն, բժիշկներ'],['Одежда','Clothing','Հագուստ'],['Кафе, кино','Cafes, cinema','Սրճարան, կինո'],['Подписки','Subscriptions','Բաժանորդագրություններ'],['Разное','Misc','Տարբեր'],['Потребкредит','Consumer loan','Սպառողական վարկ'],['Кредитная карта','Credit card','Վարկային քարտ'],['Автокредит','Car loan','Ավտովարկ'],['Ипотека','Mortgage','Հիփոթեք'],['Короткий займ','Short-term loan','Կարճաժամկետ վարկ'],['Новый кредит','New loan','Նոր վարկ'],['Наличные','Cash','Կանխիկ'],['Основной банк','Main bank','Հիմնական բանկ'],['Аня','Anna','Աննա'],['Давид','David','Դավիթ']];
const ALL_NAMES=()=>[...DEFAULT_NAMES,...Q_INCOME.map(q=>q.slice(1,4)),...Q_EXPENSE.map(q=>q.slice(1,4)),...Q_LOAN.map(q=>q.slice(1,4)),...Q_REM.map(q=>q.slice(1,4))];
function trName(v){if(typeof v!=='string')return v;const t=v.trim();for(const row of ALL_NAMES())if(row.includes(t))return L(row);return v}
function translateDefaults(){
  if(!S)return;
  (S.incomes||[]).forEach(x=>x.name=trName(x.name));
  (S.expenses||[]).forEach(x=>x.name=trName(x.name));
  (S.loans||[]).forEach(x=>x.name=trName(x.name));
  (S.accounts||[]).forEach(x=>x.bank=trName(x.bank));
  (S.profile?.kids||[]).forEach(x=>x.name=trName(x.name));
  (S.reminders||[]).forEach(x=>x.title=trName(x.title));
}

/* ================== CALCULATORS ================== */
function calcDefaults(){return{
  view:'salary',
  sal:{dir:'g2n',amount:0,pension:'mandatory',it:false,health:true},
  loan:{amount:0,rate:0,months:36,type:'annuity',feeOnce:0,feeOncePct:0,feeMonthly:0,insPct:0,showAll:false},
  mort:{price:0,downPct:20,rate:0,years:20,type:'annuity',fee:0,insPct:0,region:'yerevan',gross:0,contract:new Date().toISOString().slice(0,10),showAll:false},
  pre:{balance:0,rate:0,months:0,type:'annuity',onceAt:1,once:0,monthly:0,mode:'term',feePct:0}
}}
function C(){if(!S.calc)S.calc=calcDefaults();const d=calcDefaults();for(const k in d)if(!S.calc[k])S.calc[k]=d[k];return S.calc}

/* ---- salary (Armenian Tax Code, 2026) ---- */
function pensionOf(g,mode){
  if(mode==='none')return 0;
  if(mode==='voluntary')return Math.min(g,1125000)*0.05;
  if(g<=500000)return g*0.05;
  if(g<=1125000)return g*0.10-25000;
  return 87500;
}
const stampOf=g=>g<=0?0:g<=1000000?1000:15000;
const healthOf=(g,on)=>!on||g<=200000?0:g<=500000?4800:10800;
function salaryFromGross(g,o){
  const tax=g*(o.it?0.10:0.20),pen=pensionOf(g,o.pension),st=stampOf(g),he=healthOf(g,o.health);
  return{gross:g,tax,pen,st,he,net:g-tax-pen-st-he};
}
function grossFromNet(n,o){ // net is monotonic only inside each bracket (health insurance and stamp duty jump at the edges)
  const net=g=>salaryFromGross(g,o).net,edges=[0,200000,500000,1000000,1125000,Math.max(5e9,n*3)];let best=null;
  for(let k=0;k<edges.length-1;k++){let lo=edges[k]+(k?0.01:0),hi=edges[k+1];if(net(hi)<n)continue;
    for(let i=0;i<90;i++){const m=(lo+hi)/2;if(net(m)<n)lo=m;else hi=m}
    const g=Math.round(hi*100)/100;if(best===null||g<best)best=g}
  return Math.ceil(best??n)}

/* ---- loan engine like banks ---- */
function schedule({P,rateY,n,type='annuity',feeMonthly=0,insPct=0,onceAt=0,once=0,monthly=0,mode='term',feePct=0}){
  const r=rateY/1200;let b=P,rows=[],pay=type==='annuity'?annuity(P,rateY,n):0,princ=P/n,left=n;
  for(let m=1;m<=600&&b>0.5;m++){
    const interest=b*r;
    let principal=type==='annuity'?Math.min(b,pay-interest):Math.min(b,princ);
    if(type==='annuity'&&m>=n)principal=b;
    if(type!=='annuity'&&m>=n)principal=b;
    const fees=feeMonthly+b*insPct/1200;
    b-=principal;
    let extra=0;
    if(b>0.5){extra=Math.min(b,(m===onceAt?once:0)+monthly);b-=extra}
    const penalty=extra*feePct/100;
    rows.push({m,interest,principal,extra,fees:fees+penalty,pay:interest+principal,balance:Math.max(0,b)});
    left=n-m;
    if(extra>0&&b>0.5&&left>0){
      if(mode==='payment'){if(type==='annuity')pay=annuity(b,rateY,left);else princ=b/left}
    }
  }
  const sum=k=>rows.reduce((s,x)=>s+x[k],0);
  return{rows,months:rows.length,interest:sum('interest'),fees:sum('fees'),extra:sum('extra'),first:rows[0]?.pay||0,last:rows.at(-1)?.pay||0};
}
function effRate(P,upfront,rows){ // effective annual rate via IRR of monthly cash flows
  const cf=[P-upfront,...rows.map(x=>-(x.pay+x.fees+x.extra))];
  const npv=r=>cf.reduce((s,c,i)=>s+c/Math.pow(1+r,i),0);
  let lo=0,hi=1;if(npv(0)>=0)return 0;
  for(let i=0;i<100;i++){const m=(lo+hi)/2;if(npv(m)<0)lo=m;else hi=m}
  return (Math.pow(1+lo,12)-1)*100;
}
function schedTable(rows,showAll,flag){
  const list=showAll?rows:rows.filter((x,i)=>i<12||i===rows.length-1);
  const yr=T('мес.','mo','ամս.');
  return `<div class="scroll"><table><tr><th>${yr}</th><th class="n">${T('Платёж','Payment','Վճար')}</th><th class="n">${T('Проценты','Interest','Տոկոս')}</th><th class="n">${T('Долг','Principal','Մայր գումար')}</th><th class="n">${T('Комиссии','Fees','Միջնորդավճար')}</th><th class="n">${T('Остаток','Balance','Մնացորդ')}</th></tr>
  ${list.map(x=>`<tr><td>${x.m}</td><td class="n"><b>${fmt(x.pay+x.fees+x.extra)}</b></td><td class="n bad">${fmt(x.interest)}</td><td class="n good">${fmt(x.principal+x.extra)}</td><td class="n muted">${fmt(x.fees)}</td><td class="n">${fmt(x.balance)}</td></tr>`).join('')}</table></div>
  ${rows.length>13?`<div class="btns"><button class="btn ghost" data-seg="${flag}" data-v="${!showAll}">${showAll?T('Свернуть','Collapse','Փակել'):T(`Показать все ${rows.length} мес.`,`Show all ${rows.length} months`,`Ցույց տալ բոլոր ${rows.length} ամիսները`)}</button></div>`:''}`;
}
const typeSeg=path=>`<div class="wide"><label class="f">${T('Тип платежей','Repayment type','Վճարման տեսակ')}</label>${seg(path,[['annuity',T('Аннуитет (равные)','Annuity (equal)','Անուիտետ (հավասար)')],['diff',T('Дифференцированный','Differentiated','Դիֆերենցված')]])}</div>`;

/* ---- views ---- */
function vCalc(){
  const c=C();
  const tabs=[['salary','💼 '+T('Зарплата','Salary','Աշխատավարձ')],['loan','💳 '+T('Кредит','Loan','Վարկ')],['mort','🏠 '+T('Ипотека','Mortgage','Հիփոթեք')],['pre','⚡ '+T('Аванс / досрочно','Prepayment','Վաղաժամկետ մարում')]];
  let form='';
  if(c.view==='salary')form=`<h2>💼 ${T('Зарплата: «грязными» и «чистыми»','Salary: gross and net','Աշխատավարձ. մաքուր և կեղտոտ')}</h2>
    <p class="sub">${T('По Налоговому кодексу РА на 2026 год: подоходный налог, пенсионный (социальный) взнос, штамповый (военный) сбор, медицинская страховка.','Per the RA Tax Code for 2026: income tax, funded pension (social) contribution, stamp (military) duty, health insurance.','ՀՀ հարկային օրենսգրքով՝ 2026 թ. եկամտային հարկ, կուտակային կենսաթոշակային (սոցիալական) վճար, դրոշմանիշային վճար, առողջության ապահովագրություն։')}</p>
    <div class="grid">
      <div class="wide"><label class="f">${T('Что известно?','What do you know?','Ի՞նչ է հայտնի')}</label>${seg('calc.sal.dir',[['g2n',T('Сумма до налогов (грязными)','Gross (before tax)','Կեղտոտ (հարկերից առաջ)')],['n2g',T('Сумма на руки (чистыми)','Net (take-home)','Մաքուր (ձեռքին)')]])}</div>
      ${inp('calc.sal.amount',c.sal.dir==='g2n'?T('Грязная зарплата в месяц','Gross monthly salary','Կեղտոտ ամսական աշխատավարձ'):T('Чистая зарплата в месяц','Net monthly salary','Մաքուր ամսական աշխատավարձ'))}
      ${sel('calc.sal.pension',T('Пенсионная система','Funded pension','Կուտակային կենսաթոշակ'),{mandatory:[T('Обязательная (род. с 1974)','Mandatory (born 1974+)','Պարտադիր (ծնված 1974-ից)')],voluntary:[T('Добровольно после 07.2018','Voluntary after 07/2018','Կամավոր 07.2018-ից հետո')],none:[T('Не участвую (род. до 1974)','Not a participant (born before 1974)','Չեմ մասնակցում (ծնված մինչև 1974)')]})}
      <div><label class="f">${T('Подоходный налог','Income tax','Եկամտային հարկ')}</label>${seg('calc.sal.it',[[false,'20%'],[true,T('10% (IT-льгота)','10% (IT relief)','10% (ՏՏ արտոնություն)')]])}</div>
      <div><label class="f">${T('Медстраховка','Health insurance','Առողջ. ապահովագրություն')}</label>${seg('calc.sal.health',[[true,T('Да (18–65 лет)','Yes (age 18–65)','Այո (18–65 տ.)')],[false,T('Нет','No','Ոչ')]])}</div>
    </div>`;
  if(c.view==='loan')form=`<h2>💳 ${T('Кредитный калькулятор как в банке','Bank-style loan calculator','Վարկային հաշվիչ՝ ինչպես բանկում')}</h2>
    <p class="sub">${T('График платежей, все комиссии и фактическая (эффективная) ставка — та, которую банк обязан указать в договоре.','Payment schedule, all fees and the effective rate the bank must state in the contract.','Վճարումների ժամանակացույց, բոլոր միջնորդավճարները և փաստացի (արդյունավետ) տոկոսադրույքը, որը բանկը պարտավոր է նշել պայմանագրում։')}</p>
    <div class="grid">
      ${inp('calc.loan.amount',T('Сумма кредита','Loan amount','Վարկի գումար'))}${inp('calc.loan.rate',T('Номинальная ставка, % годовых','Nominal rate, % per year','Անվանական տոկոսադրույք, % տարեկան'))}${inp('calc.loan.months',T('Срок, мес.','Term, months','Ժամկետ, ամիս'))}
      ${typeSeg('calc.loan.type')}
      ${inp('calc.loan.feeOncePct',T('Комиссия за выдачу, %','Origination fee, %','Տրամադրման միջնորդավճար, %'))}${inp('calc.loan.feeOnce',T('Разовые расходы (оценка, нотариус)','One-off costs (appraisal, notary)','Միանվագ ծախսեր (գնահատում, նոտար)'))}${inp('calc.loan.feeMonthly',T('Ежемесячная комиссия','Monthly fee','Ամսական միջնորդավճար'))}${inp('calc.loan.insPct',T('Страховка, % в год от остатка','Insurance, % per year of balance','Ապահովագրություն, % տարեկան մնացորդից'))}
    </div>`;
  if(c.view==='mort')form=`<h2>🏠 ${T('Ипотечный калькулятор','Mortgage calculator','Հիփոթեքային հաշվիչ')}</h2>
    <p class="sub">${T('С учётом возврата подоходного налога за проценты по правилам 2026 года.','Includes the 2026 rules for the income tax refund on mortgage interest.','Ներառում է հիփոթեքի տոկոսների դիմաց եկամտային հարկի վերադարձը՝ 2026 թ. կանոններով։')}</p>
    <div class="grid">
      ${inp('calc.mort.price',T('Стоимость жилья','Property price','Բնակարանի արժեք'))}${inp('calc.mort.downPct',T('Первоначальный взнос, %','Down payment, %','Կանխավճար, %'))}${inp('calc.mort.rate',T('Ставка, % годовых','Rate, % per year','Տոկոսադրույք, % տարեկան'))}${inp('calc.mort.years',T('Срок, лет','Term, years','Ժամկետ, տարի'))}
      ${typeSeg('calc.mort.type')}
      ${inp('calc.mort.fee',T('Разовые расходы (оценка, нотариус, комиссия)','One-off costs (appraisal, notary, fee)','Միանվագ ծախսեր (գնահատում, նոտար, միջնորդավճար)'))}${inp('calc.mort.insPct',T('Страховка, % в год от остатка','Insurance, % per year of balance','Ապահովագրություն, % տարեկան մնացորդից'))}
      ${sel('calc.mort.region',T('Где жильё','Property location','Որտեղ է բնակարանը'),{yerevan:[T('Ереван','Yerevan','Երևան')],yerevanOld:[T('Ереван, разрешение на стройку до 2022','Yerevan, building permit before 2022','Երևան, շինթույլտվություն մինչև 2022')],near:[T('Арагацотн, Арарат, Армавир, Котайк','Aragatsotn, Ararat, Armavir, Kotayk','Արագածոտն, Արարատ, Արմավիր, Կոտայք')],other:[T('Другие области','Other regions','Այլ մարզեր')],border:[T('Приграничное село','Border settlement','Սահմանամերձ բնակավայր')]})}
      ${inp('calc.mort.contract',T('Дата договора','Contract date','Պայմանագրի ամսաթիվ'),'str')}
      ${inp('calc.mort.gross',T('Ваша грязная зарплата (для возврата налога)','Your gross salary (for tax refund)','Ձեր կեղտոտ աշխատավարձը (հարկի վերադարձի համար)'))}
    </div>`;
  if(c.view==='pre'){
    const opts={'':[T('— вручную —','— enter manually —','— ձեռքով —')]};S.loans.forEach((l,i)=>opts[i]=[(l.name||'#'+(i+1))+' · '+fmt(num(l.balance))]);
    form=`<h2>⚡ ${T('Калькулятор аванса (досрочного погашения)','Prepayment calculator','Վաղաժամկետ մարման հաշվիչ')}</h2>
    <p class="sub">${T('Сколько сэкономите, если внести деньги раньше: разово, каждый месяц или и то и другое.','How much you save by paying early: once, every month, or both.','Որքան կխնայեք՝ գումարը շուտ մուծելով. միանվագ, ամեն ամիս կամ երկուսն էլ։')}</p>
    <div class="grid">
      ${S.loans.length?`<label class="f">${T('Взять из моих кредитов','Use one of my loans','Վերցնել իմ վարկերից')}<select data-prefill="1">${Object.entries(opts).map(([k,v])=>`<option value="${k}">${esc(v[0])}</option>`).join('')}</select></label>`:''}
      ${inp('calc.pre.balance',T('Остаток долга','Remaining balance','Պարտքի մնացորդ'))}${inp('calc.pre.rate',T('Ставка, % годовых','Rate, % per year','Տոկոսադրույք, % տարեկան'))}${inp('calc.pre.months',T('Осталось месяцев','Months left','Մնացած ամիսներ'))}
      ${typeSeg('calc.pre.type')}
      ${inp('calc.pre.once',T('Разовый аванс','One-off prepayment','Միանվագ կանխավճար'))}${inp('calc.pre.onceAt',T('В каком месяце (1 = следующий)','In which month (1 = next)','Որ ամսին (1 = հաջորդ)'))}${inp('calc.pre.monthly',T('Плюс каждый месяц','Plus every month','Գումարած ամեն ամիս'))}${inp('calc.pre.feePct',T('Штраф банка за досрочку, %','Bank prepayment fee, %','Բանկի տույժ վաղաժամկետ մարման համար, %'))}
      <div class="wide"><label class="f">${T('После аванса','After prepaying','Կանխավճարից հետո')}</label>${seg('calc.pre.mode',[['term',T('Сократить срок','Shorten the term','Կրճատել ժամկետը')],['payment',T('Уменьшить платёж','Lower the payment','Նվազեցնել վճարը')]])}</div>
    </div>`;}
  return `<div class="card"><div class="seg">${tabs.map(([k,l])=>`<button data-seg="calc.view" data-v="${k}" class="${c.view===k?'on':''}">${l}</button>`).join('')}</div></div>
  <div class="card">${form}</div><div id="calcout"></div>`;
}
function calcOut(){
  const c=C();
  if(c.view==='salary'){
    const o=c.sal,a=num(o.amount);if(a<=0)return `<div class="card"><p class="muted">${T('Введите сумму.','Enter an amount.','Մուտքագրեք գումարը։')}</p></div>`;
    const g=o.dir==='g2n'?a:grossFromNet(a,o),x=salaryFromGross(g,o);
    const row=(l,v,cl='')=>`<tr><td>${l}</td><td class="n ${cl}">${fmt(v)}</td><td class="n muted">${pct(v/g*100)}</td></tr>`;
    return `<div class="card"><div class="grid">${stat(T('Грязными','Gross','Կեղտոտ'),fmt(x.gross))}${stat(T('На руки','Take-home','Ձեռքին'),fmt(x.net),'good')}${stat(T('Удержано всего','Total withheld','Ընդամենը պահված'),fmt(x.gross-x.net),'bad')}${stat(T('За год на руки','Take-home per year','Տարեկան ձեռքին'),fmt(x.net*12))}</div>
      <table style="margin-top:12px">${row(T('Подоходный налог','Income tax','Եկամտային հարկ')+` (${o.it?10:20}%)`,x.tax,'bad')}${row(T('Пенсионный (социальный) взнос','Funded pension (social) contribution','Կուտակային կենսաթոշակային վճար'),x.pen,'bad')}${row(T('Штамповый (военный) сбор','Stamp (military) duty','Դրոշմանիշային վճար'),x.st,'bad')}${row(T('Медицинская страховка','Health insurance','Առողջության ապահովագրություն'),x.he,'bad')}<tr><th>${T('На руки','Take-home','Ձեռքին')}</th><th class="n">${fmt(x.net)}</th><th class="n">${pct(x.net/g*100)}</th></tr></table>
      <div class="btns"><button class="btn" data-calc="addsalary" data-v="${Math.round(x.net)}">${T('Добавить в мои доходы','Add to my income','Ավելացնել իմ եկամուտներին')} (${fmt(x.net)})</button></div><p id="calcmsg" class="sub"></p>
      ${edu('📘 '+T('Как считается','How it’s calculated','Ինչպես է հաշվվում'),T('Подоходный налог — 20% (10% для сотрудников IT-компаний с льготой). Пенсионный взнос для родившихся с 1974 года: 5% при зарплате до 500 000 ֏ (ещё 5% добавляет государство), выше — 10% минус 25 000 ֏, максимум 87 500 ֏. Штамповый сбор: 1 000 ֏ при зарплате до 1 000 000 ֏, выше — 15 000 ֏. Медстраховка с 2026 года: до 200 000 ֏ — 0, до 500 000 ֏ — 4 800 ֏ (ещё 6 000 ֏ платит государство), выше — 10 800 ֏. Ставки на 2026 год; проверяйте изменения на src.am.','Income tax is 20% (10% for staff of IT companies with the relief). Pension contribution for those born from 1974: 5% on salaries up to 500,000 ֏ (the state adds another 5%), above that 10% minus 25,000 ֏, max 87,500 ֏. Stamp duty: 1,000 ֏ up to a 1,000,000 ֏ salary, 15,000 ֏ above. Health insurance from 2026: 0 up to 200,000 ֏, 4,800 ֏ up to 500,000 ֏ (the state adds 6,000 ֏), 10,800 ֏ above. 2026 rates; check src.am for changes.','Եկամտային հարկը 20% է (10%՝ արտոնություն ունեցող ՏՏ ընկերությունների աշխատակիցների համար)։ 1974-ից ծնվածների կենսաթոշակային վճարը՝ 5% մինչև 500 000 ֏ աշխատավարձի դեպքում (ևս 5% վճարում է պետությունը), ավելի բարձրի դեպքում՝ 10% հանած 25 000 ֏, առավելագույնը 87 500 ֏։ Դրոշմանիշային վճար՝ 1 000 ֏ մինչև 1 000 000 ֏, ավելի բարձրի դեպքում՝ 15 000 ֏։ Առողջության ապահովագրություն 2026-ից՝ մինչև 200 000 ֏ — 0, մինչև 500 000 ֏ — 4 800 ֏ (ևս 6 000 ֏ վճարում է պետությունը), ավելի բարձր՝ 10 800 ֏։ 2026 թ. դրույքներ. փոփոխությունները ստուգեք src.am-ում։'))}</div>`;
  }
  if(c.view==='loan'){
    const o=c.loan,P=num(o.amount),n=Math.max(1,Math.round(num(o.months)));
    if(P<=0)return `<div class="card"><p class="muted">${T('Введите сумму кредита.','Enter the loan amount.','Մուտքագրեք վարկի գումարը։')}</p></div>`;
    const s=schedule({P,rateY:num(o.rate),n,type:o.type,feeMonthly:num(o.feeMonthly),insPct:num(o.insPct)});
    const upfront=P*num(o.feeOncePct)/100+num(o.feeOnce);const eff=effRate(P,upfront,s.rows);
    const total=P+s.interest+s.fees+upfront;
    return `<div class="card"><div class="grid">
      ${stat(o.type==='annuity'?T('Платёж в месяц','Monthly payment','Ամսական վճար'):T('Первый / последний платёж','First / last payment','Առաջին / վերջին վճար'),o.type==='annuity'?fmt(s.first+s.rows[0].fees):fmt(s.first)+' → '+fmt(s.last))}
      ${stat(T('Переплата по процентам','Total interest','Ընդհանուր տոկոսներ'),fmt(s.interest),'bad')}
      ${stat(T('Комиссии и страховка','Fees & insurance','Միջնորդավճարներ և ապահովագրություն'),fmt(s.fees+upfront),'bad')}
      ${stat(T('Отдадите всего','Total repaid','Ընդամենը կվճարեք'),fmt(total))}
      ${stat(T('Эффективная ставка','Effective rate (APR)','Փաստացի տոկոսադրույք'),pct(eff),eff>num(o.rate)+2?'warn':'')}
      ${stat(T('На руки при выдаче','You receive','Կստանաք ձեռքին'),fmt(P-upfront))}
    </div>
    ${eff>num(o.rate)+2?tipH('warn',T('Комиссии заметно удорожают кредит','Fees make the loan noticeably dearer','Միջնորդավճարները զգալիորեն թանկացնում են վարկը'),T(`Банк пишет ${num(o.rate)}%, а с комиссиями реальная цена ${pct(eff)}. Сравнивайте банки только по эффективной ставке.`,`The bank advertises ${num(o.rate)}%, but with fees the real price is ${pct(eff)}. Compare banks by the effective rate only.`,`Բանկը նշում է ${num(o.rate)}%, բայց միջնորդավճարներով իրական գինը ${pct(eff)} է։ Բանկերը համեմատեք միայն փաստացի տոկոսադրույքով։`)):''}
    <h3>${T('График платежей','Payment schedule','Վճարումների ժամանակացույց')}</h3>${schedTable(s.rows,o.showAll,'calc.loan.showAll')}
    <div class="btns"><button class="btn" data-calc="addloan">${T('Добавить в мои кредиты','Add to my loans','Ավելացնել իմ վարկերին')}</button></div><p id="calcmsg" class="sub"></p>
    ${edu('📘 '+T('Аннуитет или дифференцированный?','Annuity or differentiated?','Անուիտե՞տ, թե՞ դիֆերենցված'),T('Аннуитет — платёж одинаковый весь срок, удобно планировать. Дифференцированный — долг гасится равными частями, поэтому первые платежи больше, но общая переплата меньше. Банки начисляют проценты на остаток долга; эффективная ставка учитывает все комиссии и страховки.','Annuity: the same payment for the whole term, easy to plan. Differentiated: principal is repaid in equal parts, so early payments are bigger but total interest is lower. Banks charge interest on the remaining balance; the effective rate includes all fees and insurance.','Անուիտետ՝ վճարը նույնն է ամբողջ ժամկետում, հեշտ է պլանավորել։ Դիֆերենցված՝ մայր գումարը մարվում է հավասար մասերով, ուստի առաջին վճարներն ավելի մեծ են, բայց ընդհանուր գերավճարը՝ փոքր։ Բանկերը տոկոս են հաշվում պարտքի մնացորդի վրա. փաստացի տոկոսադրույքը ներառում է բոլոր միջնորդավճարներն ու ապահովագրությունները։'))}</div>`;
  }
  if(c.view==='mort'){
    const o=c.mort,price=num(o.price),P=price*(1-num(o.downPct)/100),n=Math.max(12,Math.round(num(o.years)*12));
    if(P<=0)return `<div class="card"><p class="muted">${T('Введите стоимость жилья.','Enter the property price.','Մուտքագրեք բնակարանի արժեքը։')}</p></div>`;
    const s=schedule({P,rateY:num(o.rate),n,type:o.type,insPct:num(o.insPct)});
    const eff=effRate(P,num(o.fee),s.rows);
    // income-tax refund (Tax Code art. 160, 2026 rules)
    const cd=new Date(o.contract||Date.now());const after25=cd>=new Date('2025-01-01');
    let elig=price<=55000000,why='';
    if(price>55000000)why=T('жильё дороже 55 млн ֏','the property costs over 55M ֏','բնակարանն արժե 55 մլն ֏-ից ավելի');
    else if(o.region==='yerevan'&&after25){elig=false;why=T('в Ереване для договоров с 2025 года возврата нет','no refund in Yerevan for contracts from 2025','Երևանում 2025-ից կնքված պայմանագրերի համար վերադարձ չկա')}
    else if(o.region==='near'&&cd>=new Date('2027-01-01')){elig=false;why=T('в этих областях — только для договоров до 2027 года','in these regions only for contracts before 2027','այս մարզերում՝ միայն մինչև 2027 կնքված պայմանագրերի համար')}
    else if(o.region==='other'&&cd>=new Date('2029-01-01')){elig=false;why=T('в областях — только для договоров до 2029 года','in the regions only for contracts before 2029','մարզերում՝ միայն մինչև 2029 կնքված պայմանագրերի համար')}
    const qCap=after25?750000:1500000,taxQ=num(o.gross)*0.2*3;
    let refund=0,refund1=0;
    if(elig&&num(o.gross)>0)for(let q=0;q*3<s.rows.length;q++){const iq=s.rows.slice(q*3,q*3+3).reduce((a,x)=>a+x.interest,0);const rq=Math.min(iq,taxQ,qCap);refund+=rq;if(q<4)refund1+=rq}
    const c2=calc();const pay=s.first;
    return `<div class="card"><div class="grid">
      ${stat(T('Первоначальный взнос','Down payment','Կանխավճար'),fmt(price-P))}
      ${stat(T('Сумма кредита','Loan amount','Վարկի գումար'),fmt(P))}
      ${stat(o.type==='annuity'?T('Платёж в месяц','Monthly payment','Ամսական վճար'):T('Первый платёж','First payment','Առաջին վճար'),fmt(pay+(s.rows[0]?.fees||0)))}
      ${stat(T('Переплата по процентам','Total interest','Ընդհանուր տոկոսներ'),fmt(s.interest),'bad')}
      ${stat(T('Эффективная ставка','Effective rate (APR)','Փաստացի տոկոսադրույք'),pct(eff))}
      ${stat(T('Возврат налога за всё время','Tax refund over the term','Հարկի վերադարձ ամբողջ ժամկետում'),fmt(refund),refund>0?'good':'')}
    </div>
    ${elig?(num(o.gross)>0?tipH('good',T('Возврат подоходного налога','Income tax refund','Եկամտային հարկի վերադարձ'),T(`Государство вернёт до ${fmt(refund1)} в первый год и ≈${fmt(refund)} за весь срок. Реальная переплата: ${fmt(s.interest-refund)}. Лимит — ${fmt(qCap)} в квартал и не больше вашего подоходного налога.`,`The state refunds up to ${fmt(refund1)} in year one and ≈${fmt(refund)} over the term. Real interest cost: ${fmt(s.interest-refund)}. Cap: ${fmt(qCap)} per quarter and no more than your income tax.`,`Պետությունը կվերադարձնի մինչև ${fmt(refund1)} առաջին տարում և ≈${fmt(refund)} ամբողջ ժամկետում։ Իրական գերավճարը՝ ${fmt(s.interest-refund)}։ Սահմանաչափը՝ ${fmt(qCap)} եռամսյակում և ոչ ավելի, քան ձեր եկամտային հարկը։`)):tipH('',T('Возможен возврат налога','A tax refund may apply','Հնարավոր է հարկի վերադարձ'),T('Введите вашу грязную зарплату, чтобы посчитать возврат.','Enter your gross salary to calculate the refund.','Մուտքագրեք ձեր կեղտոտ աշխատավարձը՝ վերադարձը հաշվելու համար։'))):tipH('warn',T('Возврата налога не будет','No tax refund','Հարկի վերադարձ չի լինի'),why)}
    ${c2.income>0?tipH(pay/c2.income>0.4?'bad':pay/c2.income>0.3?'warn':'good',T('Нагрузка на бюджет','Budget load','Բեռ բյուջեի վրա'),T(`Платёж — ${pct(pay/c2.income*100)} от дохода семьи. Комфортно — до 30–35%.`,`The payment is ${pct(pay/c2.income*100)} of household income. Comfortable is up to 30–35%.`,`Վճարը ընտանիքի եկամտի ${pct(pay/c2.income*100)}-ն է։ Հարմարավետ է մինչև 30–35%։`)):''}
    <h3>${T('График платежей','Payment schedule','Վճարումների ժամանակացույց')}</h3>${schedTable(s.rows,o.showAll,'calc.mort.showAll')}
    <div class="btns"><button class="btn" data-calc="addmort">${T('Добавить в мои кредиты','Add to my loans','Ավելացնել իմ վարկերին')}</button></div><p id="calcmsg" class="sub"></p>
    ${edu('📘 '+T('Правила возврата налога','Tax refund rules','Հարկի վերադարձի կանոններ'),T('Работающему заёмщику возвращают подоходный налог в пределах уплаченных процентов по ипотеке. Для договоров с 2025 года: лимит 750 000 ֏ в квартал (раньше 1,5 млн), жильё не дороже 55 млн ֏, в Ереване возврата нет (кроме домов с разрешением на строительство до 2022 года). В Арагацотне, Арарате, Армавире и Котайке — для договоров до 2027 года, в остальных областях — до 2029 года, в приграничных сёлах программа продолжится. Уточняйте в банке и на src.am.','An employed borrower gets back income tax up to the mortgage interest paid. For contracts from 2025: cap 750,000 ֏ per quarter (previously 1.5M), property up to 55M ֏, no refund in Yerevan (except buildings permitted before 2022). Aragatsotn, Ararat, Armavir and Kotayk: contracts before 2027; other regions: before 2029; border settlements continue. Check with your bank and src.am.','Աշխատող վարկառուին վերադարձվում է եկամտային հարկը՝ վճարված հիփոթեքային տոկոսների չափով։ 2025-ից կնքված պայմանագրերի համար՝ սահմանաչափը 750 000 ֏ եռամսյակում (նախկինում՝ 1,5 մլն), բնակարանը՝ մինչև 55 մլն ֏, Երևանում վերադարձ չկա (բացի մինչև 2022 շինթույլտվություն ստացած շենքերից)։ Արագածոտն, Արարատ, Արմավիր, Կոտայք՝ մինչև 2027 կնքված պայմանագրեր, այլ մարզեր՝ մինչև 2029, սահմանամերձ բնակավայրերում ծրագիրը շարունակվում է։ Ճշտեք բանկում և src.am-ում։'))}</div>`;
  }
  if(c.view==='pre'){
    const o=c.pre,P=num(o.balance),n=Math.max(1,Math.round(num(o.months)));
    if(P<=0||num(o.months)<=0)return `<div class="card"><p class="muted">${T('Введите остаток долга и срок.','Enter the balance and months left.','Մուտքագրեք պարտքի մնացորդը և ժամկետը։')}</p></div>`;
    const base=schedule({P,rateY:num(o.rate),n,type:o.type});
    const w=schedule({P,rateY:num(o.rate),n,type:o.type,onceAt:Math.max(1,Math.round(num(o.onceAt))),once:num(o.once),monthly:num(o.monthly),mode:o.mode,feePct:num(o.feePct)});
    const saved=base.interest-w.interest-w.fees;
    const after=w.rows.find(x=>x.extra>0);const newPay=after?(w.rows[after.m]?.pay||0):base.first;
    return `<div class="card"><div class="grid">
      ${stat(T('Экономия на процентах','Interest saved','Տոկոսների խնայողություն'),fmt(saved),saved>0?'good':'bad')}
      ${stat(T('Закроете раньше на','Paid off sooner by','Կփակեք ավելի շուտ'),dur(base.months-w.months))}
      ${stat(T('Новая дата закрытия','New payoff date','Փակման նոր ամսաթիվ'),monthLabel(w.months))}
      ${stat(o.mode==='payment'?T('Новый платёж','New payment','Նոր վճար'):T('Платёж','Payment','Վճար'),fmt(newPay))}
    </div>
    <table style="margin-top:12px"><tr><th></th><th class="n">${T('Без аванса','Without','Առանց')}</th><th class="n">${T('С авансом','With prepayment','Կանխավճարով')}</th></tr>
      <tr><td>${T('Срок','Term','Ժամկետ')}</td><td class="n">${dur(base.months)}</td><td class="n">${dur(w.months)}</td></tr>
      <tr><td>${T('Проценты банку','Interest to bank','Տոկոսներ բանկին')}</td><td class="n bad">${fmt(base.interest)}</td><td class="n bad">${fmt(w.interest)}</td></tr>
      <tr><td>${T('Штраф за досрочку','Prepayment fee','Վաղաժամկետ մարման տույժ')}</td><td class="n">—</td><td class="n">${fmt(w.fees)}</td></tr>
      <tr><td>${T('Внесено авансом','Prepaid','Կանխավճարված')}</td><td class="n">—</td><td class="n">${fmt(w.extra)}</td></tr></table>
    <h3>${T('Остаток долга','Balance over time','Պարտքի մնացորդ')}</h3>${lineChart([{data:[P,...base.rows.map(x=>x.balance)],color:'var(--c4)',name:T('Без аванса','Without','Առանց')},{data:[P,...w.rows.map(x=>x.balance)],color:'var(--c2)',name:T('С авансом','With prepayment','Կանխավճարով')}])}
    ${edu('📘 '+T('Срок или платёж?','Shorter term or lower payment?','Ժամկե՞տ, թե՞ վճար'),T('Сокращение срока экономит больше процентов. Уменьшение платежа освобождает деньги в бюджете каждый месяц — полезно, если бюджет впритык. Многие банки Армении не берут штраф за досрочное погашение, но уточните в своём договоре.','Shortening the term saves more interest. Lowering the payment frees up money every month, useful if your budget is tight. Many Armenian banks charge no prepayment fee, but check your contract.','Ժամկետի կրճատումն ավելի շատ տոկոս է խնայում։ Վճարի նվազեցումն ամեն ամիս գումար է ազատում բյուջեում, ինչը օգտակար է սեղմ բյուջեի դեպքում։ Հայաստանի շատ բանկեր վաղաժամկետ մարման տույժ չեն գանձում, բայց ստուգեք ձեր պայմանագիրը։'))}</div>`;
  }
  return '';
}
function calcAction(kind){
  const c=C();let msg='';
  if(kind==='addsalary'){const o=c.sal,a=num(o.amount),g=o.dir==='g2n'?a:grossFromNet(a,o),x=salaryFromGross(g,o);S.incomes.push({name:T('Зарплата','Salary','Աշխատավարձ'),amount:Math.round(x.net)});msg=T('✓ Добавлено в доходы.','✓ Added to income.','✓ Ավելացվեց եկամուտներին։')}
  if(kind==='addloan'){const o=c.loan,P=num(o.amount),s=schedule({P,rateY:num(o.rate),n:Math.max(1,Math.round(num(o.months))),type:o.type});S.loans.push({name:T('Потребкредит','Consumer loan','Սպառողական վարկ'),bank:'',type:'consumer',balance:Math.round(P),rate:num(o.rate),payment:Math.round(s.first),day:new Date().getDate()});msg=T('✓ Кредит добавлен.','✓ Loan added.','✓ Վարկը ավելացվեց։')}
  if(kind==='addmort'){const o=c.mort,P=num(o.price)*(1-num(o.downPct)/100),s=schedule({P,rateY:num(o.rate),n:Math.max(12,Math.round(num(o.years)*12)),type:o.type});S.loans.push({name:T('Ипотека','Mortgage','Հիփոթեք'),bank:'',type:'mortgage',balance:Math.round(P),rate:num(o.rate),payment:Math.round(s.first),day:new Date().getDate()});msg=T('✓ Ипотека добавлена.','✓ Mortgage added.','✓ Հիփոթեքը ավելացվեց։')}
  save();live();const m=$('#calcmsg');if(m)m.textContent=msg;
}
function prefillPre(i){const l=S.loans[+i];if(!l)return;const f=loanInfo(l);Object.assign(C().pre,{balance:num(l.balance),rate:num(l.rate),months:isFinite(f.n)?Math.ceil(f.n):0,type:'annuity'})}

/* ================== REMINDERS ================== */
const R_CATS={save:['🎯','Накопление','Saving','Խնայողություն'],plan:['🔁','Регулярный платёж','Recurring payment','Պարբերական վճար'],income:['💰','Поступление','Income','Մուտք'],utility:['💡','Коммунальные','Utilities','Կոմունալ'],loan:['🏦','Кредит','Loan','Վարկ'],car:['🚗','Машина','Car','Մեքենա'],tax:['🧾','Налоги','Taxes','Հարկեր'],home:['🏠','Дом, аренда','Home, rent','Տուն, վարձ'],kids:['👶','Дети, учёба','Kids, school','Երեխաներ, ուսում'],health:['🩺','Здоровье','Health','Առողջություն'],other:['📌','Другое','Other','Այլ']};
const R_FREQ={monthly:['Каждый месяц','Monthly','Ամեն ամիս'],quarterly:['Раз в квартал','Quarterly','Եռամսյակը մեկ'],yearly:['Раз в год','Yearly','Տարին մեկ'],once:['Один раз','Once','Մեկ անգամ']};
const Q_REM=[
  ['⚡','Электричество','Electricity','Էլեկտրաէներգիա','utility','monthly',25,0],
  ['🔥','Газ','Gas','Գազ','utility','monthly',25,0],
  ['💧','Вода','Water','Ջուր','utility','monthly',25,0],
  ['🌐','Интернет / ТВ','Internet / TV','Ինտերնետ / TV','utility','monthly',10,0],
  ['📱','Мобильная связь','Mobile phone','Բջջային կապ','utility','monthly',10,0],
  ['🏢','Обслуживание дома, мусор','Building fees, trash','Շենքի սպասարկում, աղբ','utility','monthly',10,0],
  ['🏠','Аренда квартиры','Rent','Բնակարանի վարձ','home','monthly',1,0],
  ['🔧','Техосмотр','Car inspection','Տեխզննում','car','yearly',1,0],
  ['🛡','Страховка ОСАГО','Car insurance (OSAGO)','ԱՊՊԱ ապահովագրություն','car','yearly',1,0],
  ['🧾','Налог на имущество / авто','Property / car tax','Գույքահարկ','tax','yearly',1,12],
  ['🎓','Оплата учёбы','Tuition','Ուսման վարձ','kids','yearly',1,9],
  ['🩺','Медосмотр','Check-up','Բժշկական զննում','health','yearly',1,0],
];
function remList(){if(!S.reminders)S.reminders=[];return S.reminders}
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function nextOcc(r,from){ // first occurrence on/after `from` (Date, 00:00) that is after lastPaid
  const day=Math.max(1,Math.min(31,num(r.day)||1));const paid=r.lastPaid?new Date(r.lastPaid+'T00:00:00'):null;
  const mk=(y,m)=>new Date(y,m,Math.min(day,dim(y,m)));
  const since=r.since?new Date(r.since+'T00:00:00'):null,until=r.until?new Date(r.until+'T00:00:00'):null;
  const ok=d=>d>=from&&(!paid||d>paid)&&(!since||d>=since)&&(!until||d<=until);
  if(r.freq==='weekly'){const a=since||from;let d=new Date(Math.max(+from,+a));d.setHours(0,0,0,0);const off=((Math.round((d-a)/864e5)%7)+7)%7;if(off)d.setDate(d.getDate()+7-off);while(paid&&d<=paid)d.setDate(d.getDate()+7);return !until||d<=until?d:null}
  if(r.freq==='once'){const d=r.date?new Date(r.date+'T00:00:00'):null;return d&&(!paid||d>paid)?d:null}
  const step=r.freq==='yearly'?12:r.freq==='quarterly'?3:1;
  let start=r.freq==='monthly'?mk(from.getFullYear(),from.getMonth()-1):mk(from.getFullYear()-1,(num(r.month)||1)-1);
  if(r.freq==='quarterly'){const m0=((num(r.month)||1)-1)%3;start=mk(from.getFullYear()-1,m0)}
  for(let i=0;i<60;i++){const d=mk(start.getFullYear(),start.getMonth()+i*step);if(ok(d))return d}
  return null;
}
function allReminders(){ // user reminders + automatic loan payments
  const lp=S.loanPaid||{},auto=[];
  S.loans.forEach((l,i)=>{if(num(l.balance)<=0)return;const title=(l.name||LTYPE[l.type]?.[LI()]||'')+(l.bank?' · '+l.bank:'');
    if(isTemp(l))loanPlan(l).forEach((x,k)=>auto.push({id:'loan'+i+'_'+k,auto:true,title,cat:'loan',amount:x.amount,freq:'once',date:x.date,daysBefore:3,lastPaid:lp[i+'_'+k]}));
    else if(num(l.payment)>0)auto.push({id:'loan'+i,auto:true,title,cat:'loan',amount:num(l.payment),freq:'monthly',day:num(l.day)||1,daysBefore:3,lastPaid:lp[i]})});
  const ip=S.incPaid||{};S.incomes.forEach((x,i)=>{const f=incFreq(x);if(f==='monthly'||!(num(x.amount)>0))return;auto.push({id:'inc'+i,auto:true,title:x.name||'',cat:'income',amount:num(x.amount),freq:f,day:num(x.day)||15,month:num(x.month)||1,date:x.date,daysBefore:3,lastPaid:ip[i]})});
  const pp=S.planPaid||{};PLANS().forEach((p,i)=>{if(!(num(p.amount)>0)||!p.from)return;const f0=new Date(p.from+'T00:00:00');auto.push({id:'plan'+i,auto:true,title:p.name||'',cat:p.kind==='save'?'save':'plan',amount:num(p.amount),freq:p.freq||'monthly',day:f0.getDate(),month:f0.getMonth()+1,since:p.from,until:p.to||'',daysBefore:2,lastPaid:pp[i]})});
  return [...auto,...remList()];
}
function upcoming(days=60){
  const t=new Date();t.setHours(0,0,0,0);const end=new Date(t);end.setDate(end.getDate()+days);
  const out=[];
  for(const r of allReminders()){if(r.active===false)continue;let from=t;
    for(let k=0;k<6;k++){const d=nextOcc(r,from);if(!d||d>end)break;out.push({r,d,days:Math.round((d-t)/864e5)});from=new Date(d);from.setDate(from.getDate()+1);if(r.freq==='once')break}}
  // overdue: unpaid occurrences in the last 31 days
  for(const r of allReminders()){if(r.active===false)continue;const past=new Date(t);past.setDate(past.getDate()-5);const d=nextOcc(r,past);if(d&&d<t)out.push({r,d,days:Math.round((d-t)/864e5)})}
  return out.sort((a,b)=>a.d-b.d);
}
function vRem(){
  const list=remList();
  const catOpts=Object.fromEntries(Object.entries(R_CATS).map(([k,v])=>[k,[v[0]+' '+L(v.slice(1,4))]]));
  return `<div class="card"><h2>🔔 ${T('Напоминания о платежах','Payment reminders','Վճարումների հիշեցումներ')}</h2>
    <p class="sub">${T('Коммунальные, кредиты, техосмотр, страховка, налоги. Платежи по кредитам добавляются автоматически из вкладки «Кредиты».','Utilities, loans, car inspection, insurance, taxes. Loan payments are added automatically from the Loans tab.','Կոմունալ, վարկեր, տեխզննում, ապահովագրություն, հարկեր։ Վարկերի վճարներն ավելանում են ավտոմատ «Վարկեր» բաժնից։')}</p>
    <div id="tgbox"></div>
  </div>
  <div id="remout">${remOut()}</div>
  <div class="card"><h2>${T('Мои напоминания','My reminders','Իմ հիշեցումները')}</h2>
    ${list.map((r,i)=>`<div class="row r-rem">
      ${inp(`reminders.${i}.title`,T('Название','Name','Անվանում'),'str','dl-rem')}
      ${sel(`reminders.${i}.cat`,T('Категория','Category','Կատեգորիա'),catOpts)}
      ${inp(`reminders.${i}.amount`,T('Сумма (необяз.)','Amount (optional)','Գումար (ըստ ցանկ.)'))}
      ${sel(`reminders.${i}.freq`,T('Как часто','How often','Որքան հաճախ'),R_FREQ)}
      ${r.freq==='once'?inp(`reminders.${i}.date`,T('Дата (ГГГГ-ММ-ДД)','Date (YYYY-MM-DD)','Ամսաթիվ (ՏՏՏՏ-ԱԱ-ՕՕ)'),'str'):inp(`reminders.${i}.day`,T('День месяца','Day of month','Ամսվա օր'))}
      ${r.freq==='yearly'||r.freq==='quarterly'?sel(`reminders.${i}.month`,r.freq==='yearly'?T('Месяц','Month','Ամիս'):T('Первый месяц','First month','Առաջին ամիս'),Object.fromEntries(MONTHSF().map((m,k)=>[k+1,[m]]))):'<div></div>'}
      ${inp(`reminders.${i}.daysBefore`,T('Напомнить за, дней','Remind days before','Հիշեցնել, օր առաջ'))}
      <button class="x" data-del="reminders.${i}">✕</button></div>`).join('')||`<p class="muted">${T('Своих напоминаний пока нет.','No reminders yet.','Հիշեցումներ դեռ չկան։')}</p>`}
    <div class="qchips"><span class="muted">${T('Быстро добавить:','Quick add:','Արագ ավելացնել՝')}</span>${Q_REM.map((q,i)=>`<button class="chip" data-qr="${i}">${q[0]} ${esc(L(q.slice(1,4)))}</button>`).join('')}</div>
    <div class="btns"><button class="btn ghost" data-add="reminder">+ ${T('Напоминание','Reminder','Հիշեցում')}</button></div>
  </div>`;
}
function remOut(){
  const up=upcoming(60);
  if(!up.length)return `<div class="card"><p class="muted">${T('В ближайшие 60 дней платежей нет.','No payments in the next 60 days.','Առաջիկա 60 օրում վճարումներ չկան։')}</p></div>`;
  const tot30=up.filter(x=>x.days<=30&&x.r.cat!=='income').reduce((s,x)=>s+num(x.r.amount),0),in30=up.filter(x=>x.days<=30&&x.r.cat==='income').reduce((s,x)=>s+num(x.r.amount),0);
  const when=x=>x.days<0?`<span class="bad">${T(`просрочено ${-x.days} дн.`,`${-x.days} days overdue`,`ուշացած ${-x.days} օր`)}</span>`:x.days===0?`<b class="warn">${T('сегодня','today','այսօր')}</b>`:x.days===1?`<b class="warn">${T('завтра','tomorrow','վաղը')}</b>`:x.days<=num(x.r.daysBefore||3)?`<b class="warn">${T(`через ${x.days} дн.`,`in ${x.days} days`,`${x.days} օրից`)}</b>`:T(`через ${x.days} дн.`,`in ${x.days} days`,`${x.days} օրից`);
  return `<div class="card"><h2>📅 ${T('Ближайшие платежи','Upcoming payments','Առաջիկա վճարումներ')}</h2>
    <p class="sub">${T('За 30 дней к оплате:','Due in the next 30 days:','Վճարման ենթակա 30 օրում՝')} <b>${fmt(tot30)}</b>${in30>0?` · ${T('ожидается поступлений','expected income','սպասվող մուտքեր')}: <b class="good">+${fmt(in30)}</b>`:''}</p>
    <div class="scroll"><table>${up.map(x=>{const c=R_CATS[x.r.cat]||R_CATS.other;const key=x.r.auto?x.r.id:'u'+remList().indexOf(x.r);return `<tr><td style="width:64px;white-space:nowrap"><b>${x.d.getDate()} ${MONTHS()[x.d.getMonth()]}</b></td><td>${c[0]} ${esc(x.r.title||L(c.slice(1,4)))}<br><span class="muted" style="font-size:12px">${when(x)} · ${esc(L(R_FREQ[x.r.freq]||PL_FREQ[x.r.freq]||R_FREQ.monthly))}</span></td><td class="n ${x.r.cat==='income'?'good':''}">${num(x.r.amount)?(x.r.cat==='income'?'+':'')+fmt(num(x.r.amount)):''}</td><td class="n"><button class="btn ghost" style="padding:6px 10px" data-paid="${key}" data-d="${ymd(x.d)}">✓ ${x.r.cat==='income'?T('Получено','Received','Ստացված է'):T('Оплачено','Paid','Վճարված է')}</button></td></tr>`}).join('')}</table></div>
  </div>`;
}
function markPaid(key,d){
  if(key.startsWith('loan')){S.loanPaid=S.loanPaid||{};S.loanPaid[key.slice(4)]=d}
  else if(key.startsWith('plan')){S.planPaid=S.planPaid||{};S.planPaid[key.slice(4)]=d}
  else if(key.startsWith('inc')){S.incPaid=S.incPaid||{};S.incPaid[key.slice(3)]=d}
  else{const r=remList()[+key.slice(1)];if(r)r.lastPaid=d}
  save();live();
}
function quickRem(i){const q=Q_REM[i];remList().push({title:L(q.slice(1,4)),cat:q[4],amount:0,freq:q[5],day:q[6],month:q[7]||((new Date().getMonth()+1)%12+1),daysBefore:q[5]==='yearly'?14:3,active:true});return `reminders.${remList().length-1}.amount`}

/* ---- Telegram (только версия с сервером) ---- */
async function renderTg(){
  const box=$('#tgbox');if(!box)return;
  let st;try{st=await api('/api/telegram')}catch(_){return}
  if(!$('#tgbox'))return;
  if(!st.enabled){box.innerHTML=`<p class="sub">📵 ${T('Уведомления в Telegram не настроены на сервере (нет TELEGRAM_BOT_TOKEN). Напоминания видны здесь, в приложении.','Telegram notifications aren’t configured on the server (no TELEGRAM_BOT_TOKEN). Reminders are shown here in the app.','Telegram ծանուցումները կարգավորված չեն սերվերում (չկա TELEGRAM_BOT_TOKEN)։ Հիշեցումները երևում են այստեղ՝ հավելվածում։')}</p>`;return}
  box.innerHTML=st.linked?`<div class="tip good"><b>✅ ${T('Telegram подключён','Telegram connected','Telegram-ը միացված է')}</b>${T('Каждое утро в 9:00 пришлём напоминание о платежах на сегодня и о тех, что скоро.','Every morning at 9:00 we’ll message you about today’s and upcoming payments.','Ամեն առավոտ 9:00-ին կուղարկենք հիշեցում այսօրվա և մոտակա վճարումների մասին։')}<div class="btns"><button class="btn ghost" data-tg="test">${T('Отправить тест','Send test','Ուղարկել թեստ')}</button><button class="btn ghost" data-tg="off">${T('Отключить','Disconnect','Անջատել')}</button></div></div>`
  :`<div class="tip"><b>📲 ${T('Напоминания в Telegram','Reminders in Telegram','Հիշեցումներ Telegram-ում')}</b>${T('Подключите бота, и каждое утро он будет присылать, что нужно оплатить.','Connect the bot and it will message you every morning about what’s due.','Միացրեք բոտը, և այն ամեն առավոտ կգրի, թե ինչ է պետք վճարել։')}<div class="btns"><button class="btn" data-tg="link">${T('Подключить Telegram','Connect Telegram','Միացնել Telegram')}</button><button class="btn ghost" data-tg="check">${T('Я подключил — проверить','I’ve connected — check','Միացրել եմ — ստուգել')}</button></div><p id="tglink" class="sub"></p></div>`;
}
async function tgAction(a){
  try{
    if(a==='link'){const r=await api('/api/telegram/link',{method:'POST'});$('#tglink').innerHTML=`<a href="${esc(r.url)}" target="_blank" rel="noopener" style="color:var(--brand);font-weight:600">${T('Открыть бота в Telegram →','Open the bot in Telegram →','Բացել բոտը Telegram-ում →')}</a> ${T('и нажмите «Start». Ссылка действует 30 минут.','and tap “Start”. The link is valid for 30 minutes.','և սեղմեք «Start»։ Հղումը գործում է 30 րոպե։')}`;return}
    if(a==='test'){await api('/api/telegram/test',{method:'POST'})}
    if(a==='off'){await api('/api/telegram',{method:'DELETE'})}
    renderTg();
  }catch(e){const l=$('#tglink');if(l)l.textContent=T('Ошибка. Попробуйте ещё раз.','Error. Please try again.','Սխալ։ Փորձեք կրկին։')}
}

/* ================== FORECAST («что будет через N месяцев») ================== */
const EV_TYPES={
  oneIncome:['💰','Разовое поступление','One-off income','Միանվագ մուտք'],
  oneExpense:['🛒','Разовая трата / снять деньги','One-off spend / withdrawal','Միանվագ ծախս / հանում'],
  incomeDelta:['📈','Доход изменится (в месяц)','Income change (monthly)','Եկամտի փոփոխություն (ամսական)'],
  expenseDelta:['🧾','Расходы изменятся (в месяц)','Expense change (monthly)','Ծախսերի փոփոխություն (ամսական)'],
  prepay:['⚡','Досрочно внести в кредит','Prepay a loan','Վաղաժամկետ մուծում վարկին'],
  payoff:['✅','Полностью закрыть кредит','Pay off a loan','Ամբողջությամբ փակել վարկը'],
  newLoan:['➕','Взять новый кредит','Take a new loan','Վերցնել նոր վարկ'],
  rate:['％','Изменить ставку','Change a rate','Փոխել տոկոսադրույքը'],
};
const EV_QUICK=[
  ['oneIncome','🎁','Премия','Bonus','Պարգևավճար'],
  ['incomeDelta','📈','Повышение зарплаты','Pay rise','Աշխատավարձի բարձրացում'],
  ['incomeDelta','💼','Новая работа','New job','Նոր աշխատանք'],
  ['oneExpense','🛒','Крупная покупка','Big purchase','Խոշոր գնում'],
  ['oneExpense','✈️','Отпуск','Vacation','Արձակուրդ'],
  ['expenseDelta','👶','Садик / школа','Kindergarten / school','Մանկապարտեզ / դպրոց'],
  ['expenseDelta','✂️','Сократить расходы','Cut spending','Կրճատել ծախսերը'],
  ['prepay','⚡','Аванс в кредит','Prepay a loan','Կանխավճար վարկին'],
  ['payoff','✅','Закрыть кредит','Pay off a loan','Փակել վարկը'],
  ['newLoan','🚗','Новый кредит','New loan','Նոր վարկ'],
  ['rate','％','Новая ставка','New rate','Նոր տոկոսադրույք'],
];
const fcMonth=m=>addMonths(new Date(),m-1);
const fcLabel=m=>{const d=fcMonth(m);return MONTHSF()[d.getMonth()]+' '+d.getFullYear()};
function FC(){if(!S.scen)S.scen={events:[],infl:true,growth:0,horizon:24,target:-1};return S.scen}

function fcSim(events,M){
  const c=calc(),st=FC(),tax=S.set.tax/100;
  const loans=S.loans.map(l=>{const t=isTemp(l);return{skip1:!t&&!!l.asOf&&ymDay(ymd(new Date()).slice(0,7),l.day)<=l.asOf,temp:t,name:l.name||lab(LTYPE[l.type]||''),b:num(l.balance),r:(t&&loanMode(l)==='once')?0:num(l.rate)/1200,p:t?0:num(l.payment),closed:null,sched:t?loanPlan(l).map(x=>({ym:x.date.slice(0,7),amount:x.amount})):(Array.isArray(l.schedule)&&l.schedule.length?l.schedule:null)}});
  const curYm=ymd(new Date()).slice(0,7),ymOf=m=>ymd(fcMonth(m)).slice(0,7);
  const accs=S.accounts.map(a=>({name:a.bank||lab(ATYPE[a.type]||''),type:a.type,b:num(a.balance),r:num(a.rate)/1200}));
  if(!accs.length)accs.push({name:T('Свободные деньги','Spare cash','Ազատ գումար'),type:'current',b:0,r:0});
  const order={cash:0,current:1,savings:2,deposit:3,invest:4};
  const liquid=accs.map((a,i)=>i).sort((x,y)=>(order[accs[x].type]??5)-(order[accs[y].type]??5));
  let main=num(st.target);if(!(main>=0&&accs[main]))main=liquid.find(i=>accs[i].type!=='invest')??0;
  const withdraw=(x,from=-1)=>{let left=x;const seq=from>=0&&accs[from]?[from,...liquid.filter(i=>i!==from)]:liquid;
    for(const i of seq){if(left<=0)break;const t=Math.min(Math.max(0,accs[i].b),left);accs[i].b-=t;left-=t}
    if(left>0)accs[main].b-=left;return x};
  const remain=l=>{if(l.b<=0.5)return 0;if(l.r===0)return Math.ceil(l.b/Math.max(1,l.p));if(l.p<=l.b*l.r)return 600;return Math.ceil(-Math.log(1-l.r*l.b/l.p)/Math.log(1+l.r))};
  const baseInc=c.income,baseExp=c.spend-c.loans-c.planPay,infl=st.infl?S.set.infl/100:0,growth=num(st.growth)/100;
  let incD=0,expD=0;const rows=[];
  const snap=()=>{const sav=accs.reduce((s,a)=>s+a.b,0),debt=loans.reduce((s,l)=>s+Math.max(0,l.b),0);return{sav,debt,worth:sav-debt}};
  const s0=snap();rows.push({m:0,income:baseInc,expenses:baseExp,payments:c.loans,interest:0,one:0,net:c.fcf,...s0,notes:[],closed:[]});
  for(let m=1;m<=M;m++){
    let one=0;const notes=[],closed=[];
    for(const ev of events.filter(e=>Math.round(num(e.month))===m)){
      const amt=Math.abs(num(ev.amount)),L_=loans[num(ev.loan)],ttl=ev.note?esc(ev.note):EV_TYPES[ev.type]?.[0]||'';
      if(ev.type==='oneIncome'&&amt){const a=accs[num(ev.acc)]&&num(ev.acc)>=0?num(ev.acc):main;accs[a].b+=amt;one+=amt;notes.push(`${ttl} +${fmt(amt)}`)}
      if(ev.type==='oneExpense'&&amt){withdraw(amt,num(ev.acc)>=0?num(ev.acc):-1);one-=amt;notes.push(`${ttl} −${fmt(amt)}`)}
      if(ev.type==='incomeDelta'){incD+=num(ev.amount);notes.push(`${ttl} ${num(ev.amount)>=0?'+':'−'}${fmt(Math.abs(num(ev.amount)))}/${MO()}`)}
      if(ev.type==='expenseDelta'){expD+=num(ev.amount);notes.push(`${ttl} ${num(ev.amount)>=0?'+':'−'}${fmt(Math.abs(num(ev.amount)))}/${MO()}`)}
      if((ev.type==='prepay'||ev.type==='payoff')&&L_&&L_.b>0.5){
        const n=remain(L_);const x=ev.type==='payoff'?L_.b:Math.min(amt,L_.b);if(x<=0)continue;
        withdraw(x);L_.b-=x;notes.push(`${EV_TYPES[ev.type][0]} ${esc(L_.name)} −${fmt(x)}`);
        if(L_.b<=0.5){L_.b=0;L_.closed=m;closed.push(L_.name)}
        else if(ev.mode==='payment'&&n>0)L_.p=annuity(L_.b,L_.r*1200,n);
      }
      if(ev.type==='newLoan'&&amt){const n=Math.max(1,Math.round(num(ev.months)||12));loans.push({name:ev.note||T('Новый кредит','New loan','Նոր վարկ'),b:amt,r:num(ev.rate)/1200,p:annuity(amt,num(ev.rate),n),closed:null,isNew:true});
        if(ev.use!=='spend')accs[main].b+=amt;notes.push(`➕ ${esc(ev.note||T('Кредит','Loan','Վարկ'))} ${fmt(amt)} · ${num(ev.rate)}%`)}
      if(ev.type==='rate'){const [k,i]=String(ev.target||'').split(':');const nr=num(ev.rate);
        if(k==='loan'&&loans[+i]){const l=loans[+i],n=remain(l);l.r=nr/1200;if(n>0&&l.b>0.5)l.p=annuity(l.b,nr,n);notes.push(`％ ${esc(l.name)} → ${nr}%`)}
        if(k==='acc'&&accs[+i]){accs[+i].r=nr/1200;notes.push(`％ ${esc(accs[+i].name)} → ${nr}%`)}}
    }
    const irr=S.incomes.filter(x=>incFreq(x)!=='monthly').reduce((a,x)=>a+incomeInMonth(x,fcMonth(m)),0);
    if(irr>0)notes.push(`💰 +${fmt(irr)}`);
    const ymX=ymOf(m),income=(baseInc+monthlyIncAt(ymX)-monthlyIncAt(curYm))*Math.pow(1+growth,Math.floor((m-1)/12))+incD+irr;
    const pPay=PLANS().filter(p=>p.kind!=='save').reduce((a,p)=>a+planOccIn(p,ymX),0);const expenses=Math.max(0,(baseExp+expAt(ymX)-expAt(curYm))*Math.pow(1+infl,(m-1)/12)+expD)+pPay;
    let payments=0,interest=0;
    const ymM=ymOf(m);for(const l of loans){if(l.b<=0.5||(m===1&&l.skip1))continue;const i=l.b*l.r;let due=l.p;if(l.sched){const lastYm=l.sched.reduce((a,x)=>x.ym>a?x.ym:a,'');due=ymM>lastYm?(l.p>0?l.p:l.b+i):(l.temp&&ymM===lastYm)?l.b+i:l.sched.filter(x=>x.ym===ymM||(m===1&&x.ym<=curYm)).reduce((a,x)=>a+num(x.amount),0)}const pay=Math.min(due,l.b+i);interest+=i;payments+=pay;l.b=l.b+i-pay;if(l.b<=0.5){l.b=0;if(!l.closed){l.closed=m;closed.push(l.name)}}}
    for(const a of accs)if(a.b>0&&a.r>0)a.b+=a.b*a.r*(1-tax);
    const net=income-expenses-payments;
    if(net>=0)accs[main].b+=net;else withdraw(-net);
    PLANS().forEach(p=>{if(p.kind==='save'){const x=planOccIn(p,ymX),t=num(p.acc);if(x>0&&t>=0&&accs[t]&&t!==main){withdraw(x,main);accs[t].b+=x}}if(p.to&&p.to.slice(0,7)===ymX&&num(p.amount)>0)notes.push((p.kind==='save'?'🎯 ':'🔁 ')+esc(p.name||'')+' ✓')});
    rows.push({m,income,expenses,payments,interest,principal:payments-interest,one,net,...snap(),notes,closed});
  }
  return{rows,loans,accs,main};
}

function vForecast(){
  const st=FC(),M=num(st.horizon)||24;
  const loanOpts=Object.fromEntries(S.loans.map((l,i)=>[i,[(l.name||lab(LTYPE[l.type]||''))+' · '+fmt(num(l.balance))]]));
  const accOpts={'-1':[T('Авто (основной счёт)','Auto (main account)','Ավտո (հիմնական հաշիվ)')],...Object.fromEntries(S.accounts.map((a,i)=>[i,[(a.bank||lab(ATYPE[a.type]||''))+' · '+fmt(num(a.balance))]]))};
  const rateOpts=Object.fromEntries([...S.loans.map((l,i)=>['loan:'+i,['🏦 '+(l.name||'')+' · '+num(l.rate)+'%']]),...S.accounts.map((a,i)=>['acc:'+i,['💳 '+(a.bank||'')+' · '+num(a.rate)+'%']])]);
  const monthOpts=Object.fromEntries(Array.from({length:M},(_,i)=>[i+1,[`${i+1} · ${fcLabel(i+1)}`]]));
  const typeOpts=Object.fromEntries(Object.entries(EV_TYPES).map(([k,v])=>[k,[v[0]+' '+L(v.slice(1,4))]]));
  const evRow=(e,i)=>{const p=`scen.events.${i}`;let f='';
    if(e.type==='oneIncome'||e.type==='oneExpense')f=inp(p+'.amount',T('Сумма','Amount','Գումար'))+sel(p+'.acc',e.type==='oneIncome'?T('Куда','To account','Ուր'):T('Откуда','From account','Որտեղից'),accOpts)+inp(p+'.note',T('Описание','Note','Նկարագրություն'),'str');
    if(e.type==='incomeDelta'||e.type==='expenseDelta')f=inp(p+'.amount',T('± в месяц (минус — уменьшение)','± per month (minus = decrease)','± ամսական (մինուս՝ նվազում)'),'num')+inp(p+'.note',T('Описание','Note','Նկարագրություն'),'str');
    if(e.type==='prepay')f=(S.loans.length?sel(p+'.loan',T('Кредит','Loan','Վարկ'),loanOpts):'')+inp(p+'.amount',T('Сумма','Amount','Գումար'))+sel(p+'.mode',T('После','After','Հետո'),{term:[T('Сократить срок','Shorten term','Կրճատել ժամկետը')],payment:[T('Уменьшить платёж','Lower payment','Նվազեցնել վճարը')]});
    if(e.type==='payoff')f=S.loans.length?sel(p+'.loan',T('Кредит','Loan','Վարկ'),loanOpts):`<p class="muted">${T('Сначала добавьте кредит во вкладке «Кредиты».','Add a loan in the Loans tab first.','Նախ ավելացրեք վարկ «Վարկեր» բաժնում։')}</p>`;
    if(e.type==='newLoan')f=inp(p+'.amount',T('Сумма','Amount','Գումար'))+inp(p+'.rate',T('Ставка, %','Rate, %','Տոկոս, %'))+inp(p+'.months',T('Срок, мес.','Term, months','Ժամկետ, ամիս'))+sel(p+'.use',T('Деньги','Money','Գումարը'),{account:[T('Положить на счёт','Put in account','Դնել հաշվին')],spend:[T('Сразу потратить (покупка)','Spend at once (purchase)','Անմիջապես ծախսել (գնում)')]})+inp(p+'.note',T('Название','Name','Անվանում'),'str');
    if(e.type==='rate')f=(Object.keys(rateOpts).length?sel(p+'.target',T('Что','What','Ինչը'),rateOpts):'')+inp(p+'.rate',T('Новая ставка, %','New rate, %','Նոր տոկոս, %'));
    return `<div class="opt" style="padding:12px"><div class="grid">${sel(p+'.month',T('Месяц','Month','Ամիս'),monthOpts)}${sel(p+'.type',T('Событие','Event','Իրադարձություն'),typeOpts)}${f}</div><div class="btns" style="margin-top:6px"><button class="x" style="width:auto;padding:0 12px" data-del="${p}">✕ ${T('Удалить','Remove','Ջնջել')}</button></div></div>`};
  return `<div class="card"><h2>🔮 ${T('Прогноз: что будет через 3–24 месяца','Forecast: where you’ll be in 3–24 months','Կանխատեսում. ինչ կլինի 3–24 ամսից')}</h2>
    <p class="sub">${T('Прогноз берёт ваши текущие доходы, расходы, кредиты и счета и «проживает» каждый месяц вперёд. Добавьте события — премию, покупку, новый кредит, досрочное погашение, новую ставку — и сравните с вариантом «ничего не менять».','The forecast takes your current income, spending, loans and accounts and plays each month forward. Add events — a bonus, a purchase, a new loan, a prepayment, a new rate — and compare with “change nothing”.','Կանխատեսումը վերցնում է ձեր ընթացիկ եկամուտները, ծախսերը, վարկերն ու հաշիվները և «ապրում» յուրաքանչյուր ամիսը առաջ։ Ավելացրեք իրադարձություններ՝ պարգևավճար, գնում, նոր վարկ, վաղաժամկետ մարում, նոր տոկոսադրույք, և համեմատեք «ոչինչ չփոխել» տարբերակի հետ։')}</p>
    <div class="grid">
      <div><label class="f">${T('Горизонт','Horizon','Ժամկետ')}</label>${seg('scen.horizon',[[12,'12'],[24,'24'],[36,'36']])}</div>
      <div><label class="f">${T('Инфляция расходов','Expense inflation','Ծախսերի գնաճ')} (${S.set.infl}%)</label>${seg('scen.infl',[[true,T('Учитывать','Include','Հաշվի առնել')],[false,T('Нет','No','Ոչ')]])}</div>
      ${inp('scen.growth',T('Рост дохода, % в год','Income growth, % per year','Եկամտի աճ, % տարեկան'))}
      ${S.accounts.length>1?sel('scen.target',T('Куда идёт остаток каждый месяц','Where monthly surplus goes','Ուր է գնում ամսական ավելցուկը'),{'-1':[T('Авто','Auto','Ավտո')],...Object.fromEntries(S.accounts.map((a,i)=>[i,[(a.bank||lab(ATYPE[a.type]||''))]]))}):''}
    </div>
  </div>
  <div class="card"><h2>📅 ${T('События плана','Plan events','Պլանի իրադարձություններ')}</h2>
    ${st.events.map(evRow).join('')||`<p class="muted">${T('Событий пока нет — прогноз показывает «если ничего не менять». Добавьте событие ниже.','No events yet — the forecast shows “change nothing”. Add an event below.','Իրադարձություններ դեռ չկան. կանխատեսումը ցույց է տալիս «ոչինչ չփոխել»։ Ավելացրեք իրադարձություն ներքևում։')}</p>`}
    <div class="qchips"><span class="muted">${T('Добавить:','Add:','Ավելացնել՝')}</span>${EV_QUICK.map((q,i)=>`<button class="chip" data-ev="${i}">${q[1]} ${esc(L(q.slice(2,5)))}</button>`).join('')}</div>
  </div>
  <div id="fcout"></div>`;
}

function fcChart(series,M){
  const W=640,H=220,P=46;const all=series.flatMap(s=>s.data);let mx=Math.max(0,...all),mn=Math.min(0,...all);if(mx===mn)mx=mn+1;
  const x=i=>P+(W-P-8)*i/Math.max(1,M),y=v=>H-22-(H-34)*(v-mn)/(mx-mn);
  const lines=series.map(s=>`<polyline fill="none" stroke="${s.color}" stroke-width="2.5" ${s.dash?'stroke-dasharray="6 5"':''} points="${s.data.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')}"/>`).join('');
  const grid=[mx,(mx+mn)/2,mn].map(v=>`<line x1="${P}" x2="${W-8}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${P-4}" y="${y(v)+3}" font-size="10" text-anchor="end" fill="var(--muted)">${k1(v)}</text>`).join('')+(mn<0?`<line x1="${P}" x2="${W-8}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-dasharray="2 3"/>`:'');
  const ticks=[0,3,6,9,12,18,24,36].filter(m=>m<=M).map(m=>`<text x="${x(m)}" y="${H-6}" font-size="10" text-anchor="middle" fill="var(--muted)">${m}</text>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:260px">${grid}${lines}${ticks}</svg><div class="legend" style="flex-direction:row;flex-wrap:wrap;gap:14px;margin-top:6px">${series.map(s=>`<div><i style="background:${s.color}"></i>${s.name}</div>`).join('')}</div>`;
}

function fcOut(){
  const st=FC(),M=num(st.horizon)||24,c=calc();
  if(c.income<=0&&!S.loans.length&&!S.accounts.length)return `<div class="card"><p class="muted">${T('Сначала заполните доходы, расходы, счета и кредиты — прогноз строится от них.','Fill in income, spending, accounts and loans first — the forecast is built from them.','Նախ լրացրեք եկամուտները, ծախսերը, հաշիվներն ու վարկերը. կանխատեսումը կառուցվում է դրանցից։')}</p></div>`;
  const plan=fcSim(st.events,M),base=fcSim([],M),hasEv=st.events.length>0;
  const H=[3,6,9,12,18,24,36].filter(h=>h<=M);
  const d=(a,b)=>{const v=a-b;return `<span class="${v>=0?'good':'bad'}" style="font-size:12px">${v>=0?'+':'−'}${fmt(Math.abs(v))}</span>`};
  const cards=H.map(h=>{const r=plan.rows[h],b=base.rows[h],r0=plan.rows[0];return `<div class="opt" style="padding:12px;margin:0">
    <div class="muted" style="font-size:12px">${T('через','in','')} <b style="color:var(--ink);font-size:15px">${h} ${MO()}</b> · ${T('конец','end of','վերջ՝')} ${fcLabel(h)}</div>
    <div style="margin-top:6px;font-size:13px">${T('Капитал','Net worth','Կապիտալ')}: <b class="${r.worth>=0?'good':'bad'}">${fmt(r.worth)}</b> ${d(r.worth,r0.worth)}</div>
    <div style="font-size:13px">${T('Накопления','Savings','Խնայողություններ')}: <b>${fmt(r.sav)}</b></div>
    <div style="font-size:13px">${T('Долги','Debts','Պարտքեր')}: <b class="${r.debt>0?'bad':''}">${fmt(r.debt)}</b></div>
    <div style="font-size:13px">${T('Свободно в месяц','Free per month','Ազատ ամսական')}: <b class="${r.net>=0?'good':'bad'}">${fmt(r.net)}</b></div>
    <div style="font-size:12px" class="muted">${T('Банкам процентов к этому месяцу','Interest paid by then','Տոկոսներ բանկերին մինչ այդ')}: <span class="bad">${fmt(plan.rows.slice(1,h+1).reduce((a,x)=>a+x.interest,0))}</span></div>
    ${hasEv?`<div style="font-size:12px;margin-top:4px" class="muted">${T('vs «ничего не менять»','vs “change nothing”','vs «ոչինչ չփոխել»')}: ${d(r.worth,b.worth)}</div>`:''}
  </div>`}).join('');
  // brain analysis
  const tips=[];const last=plan.rows[M],bl=base.rows[M];
  const neg=plan.rows.find(r=>r.m>0&&r.sav<0);
  if(neg)tips.push(['bad',T('Не хватит денег','You’ll run short','Գումարը չի բավականացնի'),T(`В ${fcLabel(neg.m)} (через ${neg.m} мес.) накопления уйдут в минус: ${fmt(neg.sav)}. Нужно сократить расходы, отложить покупку или растянуть план.`,`In ${fcLabel(neg.m)} (month ${neg.m}) savings go negative: ${fmt(neg.sav)}. Cut spending, postpone a purchase or stretch the plan.`,`${fcLabel(neg.m)}-ին (${neg.m} ամսից) խնայողությունները կդառնան բացասական՝ ${fmt(neg.sav)}։ Պետք է կրճատել ծախսերը, հետաձգել գնումը կամ երկարացնել պլանը։`)]);
  const goal=c.target*c.essential;const gm=plan.rows.find(r=>r.m>0&&r.sav>=goal&&goal>0);
  if(goal>0&&c.savings<goal)tips.push(gm?['good',T('Подушка будет собрана','Cushion will be ready','Բարձը կհավաքվի'),T(`Запас на ${c.target} мес. (${fmt(goal)}) наберётся к ${fcLabel(gm.m)} — через ${gm.m} мес.`,`A ${c.target}-month reserve (${fmt(goal)}) is reached by ${fcLabel(gm.m)} — in ${gm.m} months.`,`${c.target} ամսվա պահուստը (${fmt(goal)}) կհավաքվի ${fcLabel(gm.m)}-ին՝ ${gm.m} ամսից։`)]:['warn',T('Подушка не наберётся','Cushion not reached','Բարձը չի հավաքվի'),T(`За ${M} мес. запас на ${c.target} мес. (${fmt(goal)}) не наберётся.`,`A ${c.target}-month reserve (${fmt(goal)}) isn’t reached within ${M} months.`,`${M} ամսում ${c.target} ամսվա պահուստը (${fmt(goal)}) չի հավաքվի։`)]);
  const closedL=plan.loans.filter(l=>l.closed&&l.closed<=M);
  if(closedL.length){const byM={};closedL.forEach(l=>(byM[l.closed]=byM[l.closed]||[]).push(l.name));tips.push(['good',T(`Закроете кредитов: ${closedL.length}`,`Loans you’ll close: ${closedL.length}`,`Կփակեք վարկեր՝ ${closedL.length}`),Object.entries(byM).map(([m,ns])=>`<b>${fcLabel(+m)}</b>: ${ns.length>3?ns.slice(0,3).map(esc).join(', ')+T(` и ещё ${ns.length-3}`,` and ${ns.length-3} more`,` և ևս ${ns.length-3}`):ns.map(esc).join(', ')}`).join('<br>')])}
  const intPlan=plan.rows.reduce((s,r)=>s+r.interest,0),intBase=base.rows.reduce((s,r)=>s+r.interest,0);
  if(hasEv){const dv=last.worth-bl.worth;tips.push([dv>=0?'good':'warn',T('Итог плана','Plan result','Պլանի արդյունքը'),T(`Через ${M} мес. капитал будет ${fmt(last.worth)} — на ${fmt(Math.abs(dv))} ${dv>=0?'больше':'меньше'}, чем если ничего не менять. Процентов банкам: ${fmt(intPlan)} против ${fmt(intBase)}.`,`In ${M} months net worth will be ${fmt(last.worth)} — ${fmt(Math.abs(dv))} ${dv>=0?'more':'less'} than changing nothing. Interest to banks: ${fmt(intPlan)} vs ${fmt(intBase)}.`,`${M} ամսից կապիտալը կլինի ${fmt(last.worth)}՝ ${fmt(Math.abs(dv))}-ով ${dv>=0?'ավելի':'պակաս'}, քան ոչինչ չփոխելու դեպքում։ Տոկոսներ բանկերին՝ ${fmt(intPlan)}՝ ${fmt(intBase)}-ի դիմաց։`)])}
  else tips.push(['',T('Если ничего не менять','If nothing changes','Եթե ոչինչ չփոխեք'),T(`Через ${M} мес. капитал будет ${fmt(last.worth)} (сейчас ${fmt(plan.rows[0].worth)}). За это время банкам уйдёт ${fmt(intBase)} процентов.`,`In ${M} months net worth will be ${fmt(last.worth)} (now ${fmt(plan.rows[0].worth)}). Over that time ${fmt(intBase)} goes to banks as interest.`,`${M} ամսից կապիտալը կլինի ${fmt(last.worth)} (հիմա՝ ${fmt(plan.rows[0].worth)})։ Այդ ընթացքում բանկերին կգնա ${fmt(intBase)} տոկոս։`)]);
  {const R=plan.rows.slice(1),pay=R.reduce((a,r)=>a+r.payments,0),int=R.reduce((a,r)=>a+r.interest,0);
   if(pay>0){const split=S.loans.filter(l=>!isTemp(l)&&num(l.balance)>0&&num(l.rate)>0).map(l=>{const i=num(l.balance)*num(l.rate)/1200;return `${esc(l.name)}: ${T('из платежа','of the payment','վճարից')} ${fmt(num(l.payment))} — <span class="bad">${T('проценты','interest','տոկոս')} ${fmt(Math.min(i,num(l.payment)))}</span>, <span class="good">${T('в счёт долга','to principal','մայր գումարին')} ${fmt(Math.max(0,num(l.payment)-i))}</span>`}).join('<br>');
    tips.push([int/pay>0.5?'warn':'',T(`Проценты: ${pct(int/pay*100)} ваших платежей по кредитам`,`Interest is ${pct(int/pay*100)} of your loan payments`,`Տոկոսները՝ ձեր վարկային վճարների ${pct(int/pay*100)}-ը`),T(`За ${M} мес. вы заплатите по кредитам ${fmt(pay)}, из них банкам в виде процентов — ${fmt(int)}, а сам долг уменьшится на ${fmt(pay-int)}.`,`Over ${M} months you’ll pay ${fmt(pay)} on loans: ${fmt(int)} of it is interest, and the debt itself falls by ${fmt(pay-int)}.`,`${M} ամսում վարկերի համար կվճարեք ${fmt(pay)}, որից տոկոսներ՝ ${fmt(int)}, իսկ պարտքը կնվազի ${fmt(pay-int)}-ով։`)+(split?'<br><br>'+T('Сейчас в месяц:','This month:','Այս ամիս՝')+'<br>'+split:'')])}}
  if(st.infl&&S.set.infl>0&&!(num(st.growth)>0)){const r12=plan.rows[Math.min(12,M)];const lost=r12.expenses-plan.rows[0].expenses;if(lost>0)tips.push(['warn',T('Инфляция','Inflation','Գնաճ'),T(`Без роста дохода инфляция ${S.set.infl}% через год добавит ≈${fmt(lost)} к расходам в месяц.`,`Without income growth, ${S.set.infl}% inflation adds ≈${fmt(lost)} to monthly spending in a year.`,`Առանց եկամտի աճի ${S.set.infl}% գնաճը մեկ տարում կավելացնի ≈${fmt(lost)} ամսական ծախսերին։`)])}
  const rowsHtml=plan.rows.slice(1).map(r=>`<tr${H.includes(r.m)?' style="background:var(--soft)"':''}><td style="white-space:nowrap"><b>${r.m}</b> <span class="muted">${MONTHS()[fcMonth(r.m).getMonth()]}</span></td><td class="n">${fmt(r.income)}</td><td class="n">${fmt(r.expenses)}</td><td class="n">${fmt(r.payments)}${r.interest>0.5?`<br><span class="bad" style="font-size:11px">${T('проценты','interest','տոկոս')} ${fmt(r.interest)}</span><br><span class="good" style="font-size:11px">${T('долг','principal','մայր գումար')} ${fmt(r.principal)}</span>`:''}</td><td class="n ${r.one>0?'good':r.one<0?'bad':'muted'}">${r.one?fmt(r.one):'—'}</td><td class="n ${r.net>=0?'good':'bad'}">${fmt(r.net)}</td><td class="n">${fmt(r.sav)}</td><td class="n">${fmt(r.debt)}</td><td class="n"><b class="${r.worth>=0?'good':'bad'}">${fmt(r.worth)}</b></td><td style="font-size:12px;min-width:140px">${[...r.notes,...(r.closed.length>3?['✅ '+T(`закрыто кредитов: ${r.closed.length}`,`loans closed: ${r.closed.length}`,`փակված վարկեր՝ ${r.closed.length}`)]:r.closed.map(n=>'✅ '+esc(n)))].join('<br>')}</td></tr>`).join('');
  return `<div class="card"><h2>🧭 ${T('Что будет','What happens','Ինչ կլինի')}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">${cards}</div></div>
  <div class="card"><h2>📈 ${T('Капитал по месяцам','Net worth by month','Կապիտալն ըստ ամիսների')}</h2>
    ${fcChart([{data:plan.rows.map(r=>r.worth),color:'var(--c1)',name:T('Капитал (план)','Net worth (plan)','Կապիտալ (պլան)')},...(hasEv?[{data:base.rows.map(r=>r.worth),color:'var(--muted)',dash:true,name:T('Если ничего не менять','Change nothing','Ոչինչ չփոխել')}]:[]),{data:plan.rows.map(r=>r.sav),color:'var(--c2)',name:T('Накопления','Savings','Խնայողություններ')},{data:plan.rows.map(r=>r.debt),color:'var(--c4)',name:T('Долги','Debts','Պարտքեր')}],M)}
    ${edu('📘 '+T('Как считается прогноз','How the forecast works','Ինչպես է հաշվվում կանխատեսումը'),T('Каждый месяц: доход минус расходы (с инфляцией, если включена) минус платежи по кредитам. Остаток идёт на основной счёт, нехватка снимается сначала с наличных и карты, потом с накопительного счёта и вклада. По счетам начисляются проценты после налога, по кредитам — проценты на остаток. Капитал = все счета минус все долги.','Each month: income minus spending (with inflation if enabled) minus loan payments. Surplus goes to the main account; shortfalls come out of cash and cards first, then savings and deposits. Accounts earn after-tax interest; loans accrue interest on the balance. Net worth = all accounts minus all debts.','Ամեն ամիս՝ եկամուտ հանած ծախսեր (գնաճով, եթե միացված է) հանած վարկերի վճարներ։ Ավելցուկը գնում է հիմնական հաշվին, պակասը հանվում է նախ կանխիկից ու քարտից, հետո խնայողական հաշվից և ավանդից։ Հաշիվների վրա հաշվվում են տոկոսներ հարկից հետո, վարկերի վրա՝ տոկոսներ մնացորդից։ Կապիտալ = բոլոր հաշիվները հանած բոլոր պարտքերը։'))}
  </div>
  <div class="card"><h2>🧠 ${T('Анализ','Analysis','Վերլուծություն')}</h2>${tips.map(x=>tipH(...x)).join('')}</div>
  <div class="card"><h2>🗓 ${T('Доходы и расходы по месяцам','Income and spending by month','Եկամուտներ և ծախսեր ըստ ամիսների')}</h2>
    <div class="scroll"><table style="font-size:13px"><tr><th>${T('Мес.','Mo','Ամս.')}</th><th class="n">${T('Доход','Income','Եկամուտ')}</th><th class="n">${T('Расходы','Spending','Ծախսեր')}</th><th class="n">${T('Кредиты','Loans','Վարկեր')}</th><th class="n">${T('Разовые','One-off','Միանվագ')}</th><th class="n">${T('Свободно','Free','Ազատ')}</th><th class="n">${T('Накопления','Savings','Խնայողություններ')}</th><th class="n">${T('Долги','Debts','Պարտքեր')}</th><th class="n">${T('Капитал','Net worth','Կապիտալ')}</th><th>${T('События','Events','Իրադարձություններ')}</th></tr>${rowsHtml}${(()=>{const R=plan.rows.slice(1),sm=k=>R.reduce((a,r)=>a+r[k],0);return `<tr style="border-top:2px solid var(--line)"><th>${T('Итого','Total','Ընդամենը')}</th><th class="n">${fmt(sm('income'))}</th><th class="n">${fmt(sm('expenses'))}</th><th class="n">${fmt(sm('payments'))}<br><span class="bad" style="font-size:11px">${T('проценты','interest','տոկոս')} ${fmt(sm('interest'))}</span><br><span class="good" style="font-size:11px">${T('долг','principal','մայր գումար')} ${fmt(sm('principal'))}</span></th><th class="n">${fmt(sm('one'))}</th><th class="n">${fmt(sm('net')+sm('one'))}</th><th></th><th></th><th></th><th></th></tr>`})()}</table></div>
  </div>`;
}
function addEvent(i){const q=EV_QUICK[i];const ev={month:q[0]==='payoff'?6:3,type:q[0],amount:0,acc:-1,loan:0,mode:'term',rate:q[0]==='newLoan'?14:0,months:36,use:'spend',note:L(q.slice(2,5)),target:S.loans.length?'loan:0':(S.accounts.length?'acc:0':'')};FC().events.push(ev);return `scen.events.${FC().events.length-1}.amount`}

/* ================== OPERATIONS (разовые доходы и расходы) ================== */
const OP_OUT={car:['🚗','Машина: ремонт, бензин','Car: repair, fuel','Մեքենա. վերանորոգում, վառելիք'],food:['🛒','Продукты','Groceries','Մթերք'],home:['🏠','Дом: ремонт, техника','Home: repair, appliances','Տուն. վերանորոգում, տեխնիկա'],health:['💊','Здоровье','Health','Առողջություն'],clothes:['👕','Одежда','Clothing','Հագուստ'],transport:['🚕','Транспорт','Transport','Տրանսպորտ'],fun:['🍽','Кафе, развлечения','Cafes, fun','Սրճարան, զվարճանք'],kids:['👶','Дети','Kids','Երեխաներ'],gifts:['🎁','Подарки','Gifts','Նվերներ'],travel:['✈️','Путешествия','Travel','Ճամփորդություն'],utility:['💡','Коммунальные','Utilities','Կոմունալ'],loan:['🏦','Платёж по кредиту','Loan payment','Վարկի վճար'],other:['📌','Другое','Other','Այլ']};
const OP_IN={gift:['🎁','Подарок','Gift','Նվեր'],bonus:['💰','Премия','Bonus','Պարգևավճար'],salary:['💼','Зарплата','Salary','Աշխատավարձ'],side:['🧑‍💻','Подработка','Side job','Լրացուցիչ աշխատանք'],sale:['💵','Продажа','Sale','Վաճառք'],refund:['↩️','Возврат долга / денег','Repayment / refund','Պարտքի / գումարի վերադարձ'],interest:['🏦','Проценты, кэшбэк','Interest, cashback','Տոկոս, քեշբեք'],other:['📌','Другое','Other','Այլ']};
const OP_QUICK=[['out','car','🔧','Ремонт авто','Car repair','Մեքենայի վերանորոգում'],['out','car','⛽','Бензин','Fuel','Բենզին'],['out','food','🛒','Продукты','Groceries','Մթերք'],['out','health','💊','Аптека','Pharmacy','Դեղատուն'],['out','fun','🍽','Ресторан','Restaurant','Ռեստորան'],['out','transport','🚕','Такси','Taxi','Տաքսի'],['out','clothes','👕','Одежда','Clothing','Հագուստ'],['out','home','📱','Техника','Electronics','Տեխնիկա'],['out','home','🛠','Ремонт дома','Home repair','Տան վերանորոգում'],['out','gifts','🎁','Подарок кому-то','Gift for someone','Նվեր ինչ-որ մեկին'],['out','other','🤝','Дал в долг','Lent money','Պարտք տվեցի'],
  ['in','gift','🎁','Подарили деньги','Money gift','Գումար նվիրեցին'],['in','bonus','💰','Премия','Bonus','Պարգևավճար'],['in','side','🧑‍💻','Подработка','Side job','Լրացուցիչ աշխատանք'],['in','sale','💵','Продал вещь','Sold an item','Վաճառեցի իր'],['in','refund','↩️','Вернули долг','Debt repaid to me','Պարտքը վերադարձրին']];
const FX_FALLBACK={AMD:1,USD:360.12,EUR:405.03,RUB:4.3947};
function fxRate(cur){if(cur==='AMD')return 1;const r=(typeof MK!=='undefined'&&MK?.fx?.[cur])||FX_FALLBACK[cur];return num(r)||FX_FALLBACK[cur]||1}
const toBase=(amt,cur)=>amt*fxRate(cur)/fxRate(S.currency);
const todayStr=()=>ymd(new Date());
function OPS(){if(!S.ops)S.ops=[];if(!S.opDraft)S.opDraft={type:'out',amount:0,cur:S.currency,cat:'other',date:todayStr(),acc:-1,note:''};if(!S.opView)S.opView='';return S.ops}
const opCats=t=>t==='in'?OP_IN:OP_OUT;
const monthKey=d=>String(d).slice(0,7);
function monthName(k){const [y,m]=k.split('-');return MONTHSF()[+m-1]+' '+y}

function vOps(){
  OPS();const d=S.opDraft,cats=opCats(d.type);
  if(!cats[d.cat])d.cat='other';
  const accOpts={'-1':[T('Не связывать со счётом','Don’t link to an account','Չկապել հաշվի հետ')],...Object.fromEntries(S.accounts.map((a,i)=>[i,[(a.bank||lab(ATYPE[a.type]||''))+' · '+fmt(num(a.balance))]]))};
  const conv=opConv();
  return `<div class="card"><h2>✍️ ${T('Записать операцию','Log a transaction','Գրանցել գործարք')}</h2>
    <p class="sub">${T('Разовые траты и поступления: ремонт машины, подарок, покупка техники, премия. Регулярные (зарплата, аренда, коммуналка) задаются в других вкладках.','One-off spending and income: car repair, a gift, an appliance, a bonus. Regular items (salary, rent, utilities) live in the other tabs.','Միանվագ ծախսեր և մուտքեր՝ մեքենայի վերանորոգում, նվեր, տեխնիկայի գնում, պարգևավճար։ Կանոնավորները (աշխատավարձ, վարձ, կոմունալ) լրացվում են այլ բաժիններում։')}</p>
    <div class="grid">
      <div class="wide">${seg('opDraft.type',[['out','➖ '+T('Расход','Expense','Ծախս')],['in','➕ '+T('Доход','Income','Մուտք')]])}</div>
      ${inp('opDraft.amount',T('Сумма','Amount','Գումար'))}
      ${sel('opDraft.cur',T('Валюта','Currency','Արժույթ'),{AMD:['֏ AMD'],USD:['$ USD'],EUR:['€ EUR'],RUB:['₽ RUB']})}
      ${sel('opDraft.cat',T('Категория','Category','Կատեգորիա'),Object.fromEntries(Object.entries(cats).map(([k,v])=>[k,[v[0]+' '+L(v.slice(1,4))]])))}
      <label class="f">${T('Дата','Date','Ամսաթիվ')}<input type="date" data-k="opDraft.date" data-t="str" value="${esc(d.date)}"></label>
      ${sel('opDraft.acc',d.type==='in'?T('Зачислить на счёт','Credit to account','Մուտքագրել հաշվին'):T('Списать со счёта','Take from account','Գանձել հաշվից'),accOpts)}
      ${inp('opDraft.note',T('Комментарий','Note','Մեկնաբանություն'),'str')}
    </div><div id="opconv">${conv}</div>
    <div class="qchips"><span class="muted">${T('Быстро:','Quick:','Արագ՝')}</span>${OP_QUICK.map((q,i)=>`<button class="chip" data-opq="${i}">${q[0]==='in'?'➕':'➖'} ${q[2]} ${esc(L(q.slice(3,6)))}</button>`).join('')}</div>
    <div class="btns"><button class="btn" data-op="save">✓ ${T('Записать','Save','Գրանցել')}</button></div><p id="opmsg" class="sub"></p>
  </div><div id="opsout"></div>`;
}
function opConv(){const d=S.opDraft;if(!d||d.cur===S.currency||!(num(d.amount)>0))return '';return `<p class="sub" style="margin:6px 0 0">≈ <b>${fmt(toBase(num(d.amount),d.cur))}</b> ${T('по курсу','at','փոխարժեքով')} 1 ${d.cur} = ${nf(fxRate(d.cur)/fxRate(S.currency),4)} ${S.currency}${(typeof MK!=='undefined'&&MK?.fx?.date)?` (${T('ЦБ','CBA','ԿԲ')}, ${fdate(MK.fx.date)})`:''}</p>`}
function opsMonths(){const s=new Set(OPS().map(o=>monthKey(o.date)));s.add(monthKey(todayStr()));return [...s].sort().reverse()}
function opsOut(){
  const ops=OPS(),months=opsMonths();if(!S.opView||!months.includes(S.opView))S.opView=months[0];
  const mk=S.opView,list=ops.filter(o=>monthKey(o.date)===mk).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  const tin=list.filter(o=>o.type==='in').reduce((s,o)=>s+o.amount,0),tout=list.filter(o=>o.type==='out').reduce((s,o)=>s+o.amount,0);
  // bars: last 6 months
  const last=[];{const t=new Date();for(let i=5;i>=0;i--){const d=new Date(t.getFullYear(),t.getMonth()-i,1);last.push(ymd(d).slice(0,7))}}
  const agg=k=>{const l=ops.filter(o=>monthKey(o.date)===k);return{i:l.filter(o=>o.type==='in').reduce((s,o)=>s+o.amount,0),o:l.filter(o=>o.type==='out').reduce((s,o)=>s+o.amount,0)}};
  const bars=last.map(k=>({k,...agg(k)}));const bmax=Math.max(1,...bars.flatMap(b=>[b.i,b.o]));
  const W=480,H=220,P=40,bw=(W-P-10)/bars.length;
  const barSvg=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-height:230px">${[0,.5,1].map(f=>`<line x1="${P}" x2="${W-6}" y1="${H-24-(H-40)*f}" y2="${H-24-(H-40)*f}" stroke="var(--line)"/><text x="${P-4}" y="${H-21-(H-40)*f}" font-size="10" text-anchor="end" fill="var(--muted)">${k1(bmax*f)}</text>`).join('')}
    ${bars.map((b,i)=>{const x=P+i*bw+bw*0.15,w=bw*0.33,hi=(H-40)*b.i/bmax,ho=(H-40)*b.o/bmax;return `<rect x="${x}" y="${H-24-hi}" width="${w}" height="${hi}" rx="3" fill="var(--c2)"/><rect x="${x+w+2}" y="${H-24-ho}" width="${w}" height="${ho}" rx="3" fill="var(--c4)"/><text x="${x+w}" y="${H-6}" font-size="14" text-anchor="middle" fill="${b.k===mk?'var(--brand)':'var(--muted)'}" font-weight="${b.k===mk?700:400}">${MONTHS()[+b.k.slice(5)-1]}</text>`}).join('')}</svg>
    <div class="legend" style="flex-direction:row;gap:14px"><div><i style="background:var(--c2)"></i>${T('Доходы','Income','Մուտքեր')}</div><div><i style="background:var(--c4)"></i>${T('Расходы','Spending','Ծախսեր')}</div></div>`;
  // categories donut for month
  const colors=['var(--c1)','var(--c2)','var(--c3)','var(--c4)','var(--c5)','var(--c6)','var(--c7)','var(--c8)'];
  const byCat={};list.filter(o=>o.type==='out').forEach(o=>byCat[o.cat]=(byCat[o.cat]||0)+o.amount);
  const items=Object.entries(byCat).sort((a,b)=>b[1]-a[1]).map(([k,v],i)=>({n:(OP_OUT[k]||OP_OUT.other)[0]+' '+L((OP_OUT[k]||OP_OUT.other).slice(1,4)),v,c:colors[i%colors.length]}));
  // cumulative within month
  const [yy,mm]=mk.split('-').map(Number),days=dim(yy,mm-1);let run=0;const cum=[0];for(let dd=1;dd<=days;dd++){const ds=mk+'-'+String(dd).padStart(2,'0');list.filter(o=>o.date===ds).forEach(o=>run+=o.type==='in'?o.amount:-o.amount);cum.push(run)}
  const isCur=mk===monthKey(todayStr()),upto=isCur?new Date().getDate():days;
  const cumSvg=(()=>{const data=cum.slice(0,upto+1),mx=Math.max(0,...data),mn=Math.min(0,...data),rg=(mx-mn)||1,W2=640,H2=150,P2=46;const x=i=>P2+(W2-P2-8)*i/days,y=v=>H2-20-(H2-32)*(v-mn)/rg;
    return `<svg viewBox="0 0 ${W2} ${H2}" width="100%" style="max-height:170px"><line x1="${P2}" x2="${W2-8}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-dasharray="2 3"/><text x="${P2-4}" y="${y(mx)+3}" font-size="10" text-anchor="end" fill="var(--muted)">${k1(mx)}</text><text x="${P2-4}" y="${y(mn)+3}" font-size="10" text-anchor="end" fill="var(--muted)">${k1(mn)}</text><polyline fill="none" stroke="${run>=0?'var(--c2)':'var(--c4)'}" stroke-width="2.5" points="${data.map((v,i)=>x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')}"/>${[1,10,20,days].map(dd=>`<text x="${x(dd)}" y="${H2-4}" font-size="10" text-anchor="middle" fill="var(--muted)">${dd}</text>`).join('')}</svg>`})();
  const c=calc();const planOut=c.spend,share=planOut>0?tout/planOut*100:0;
  return `<div class="card"><div class="seg" style="overflow-x:auto;flex-wrap:nowrap">${months.slice(0,12).map(k=>`<button data-seg="opView" data-v="${k}" class="${k===mk?'on':''}">${MONTHS()[+k.slice(5)-1]} ${k.slice(2,4)}</button>`).join('')}</div>
    <div class="grid" style="margin-top:12px">${stat(T('Разовые доходы','One-off income','Միանվագ մուտքեր'),'+'+fmt(tin),'good')}${stat(T('Разовые расходы','One-off spending','Միանվագ ծախսեր'),'−'+fmt(tout),'bad')}${stat(T('Итог месяца','Month total','Ամսվա արդյունք'),fmt(tin-tout),tin-tout>=0?'good':'bad')}${stat(T('Операций','Transactions','Գործարքներ'),list.length)}</div>
    ${tout>0&&planOut>0?tipH(share>20?'warn':'',T('Сверх плана','On top of the plan','Պլանից ավելի'),T(`Разовые траты за ${monthName(mk)} — ${fmt(tout)}, это ${pct(share)} к вашим обычным расходам в месяц (${fmt(planOut)}).`,`One-off spending in ${monthName(mk)} is ${fmt(tout)}, or ${pct(share)} on top of your usual monthly spending (${fmt(planOut)}).`,`${monthName(mk)}-ի միանվագ ծախսերը՝ ${fmt(tout)}, ձեր սովորական ամսական ծախսերի (${fmt(planOut)}) ${pct(share)}-ն են։`)):''}
  </div>
  <div class="g2">
    <div class="card"><h2>📊 ${T('По месяцам','By month','Ըստ ամիսների')}</h2>${barSvg}</div>
    <div class="card"><h2>🍩 ${T('Куда ушли деньги','Where the money went','Ուր գնաց գումարը')} · ${monthName(mk)}</h2>${items.length?donut(items):`<p class="muted">${T('Расходов в этом месяце нет.','No spending this month.','Այս ամիս ծախսեր չկան։')}</p>`}</div>
  </div>
  <div class="card"><h2>📉 ${T('Ход месяца','Month so far','Ամսվա ընթացքը')} · ${monthName(mk)}</h2>${cumSvg}<p class="sub">${T('Накопительный итог разовых операций по дням.','Running total of one-off transactions by day.','Միանվագ գործարքների կուտակային արդյունքն ըստ օրերի։')}</p></div>
  <div class="card"><h2>🧾 ${T('Журнал','Log','Մատյան')} · ${monthName(mk)}</h2>
    ${list.length?`<div class="scroll"><table>${list.map(o=>{const cat=(opCats(o.type)[o.cat]||OP_OUT.other);const acc=S.accounts[o.acc];return `<tr><td style="white-space:nowrap;width:60px"><b>${+o.date.slice(8)} ${MONTHS()[+o.date.slice(5,7)-1]}</b></td><td>${cat[0]} ${esc(o.note||L(cat.slice(1,4)))}<br><span class="muted" style="font-size:12px">${esc(L(cat.slice(1,4)))}${o.cur!==S.currency?` · ${nf(o.orig,2)} ${o.cur}`:''}${o.acc>=0&&acc?' · '+esc(acc.bank||''):''}</span></td><td class="n"><b class="${o.type==='in'?'good':'bad'}">${o.type==='in'?'+':'−'}${fmt(o.amount)}</b></td><td style="width:40px"><button class="x" data-opdel="${o.id}">✕</button></td></tr>`}).join('')}</table></div>`:`<p class="muted">${T('В этом месяце операций нет. Запишите первую выше.','No transactions this month. Log the first one above.','Այս ամիս գործարքներ չկան։ Գրանցեք առաջինը վերևում։')}</p>`}
  </div>`;
}
function opSave(){
  const d=S.opDraft,amt=num(d.amount);const m=$('#opmsg');
  if(amt<=0){if(m)m.textContent=T('Введите сумму.','Enter an amount.','Մուտքագրեք գումարը։');return}
  const base=Math.round(toBase(amt,d.cur)*100)/100,acc=num(d.acc);
  const op={id:Date.now(),type:d.type,amount:base,orig:amt,cur:d.cur,rate:fxRate(d.cur)/fxRate(S.currency),cat:d.cat,date:d.date||todayStr(),note:String(d.note||'').slice(0,120),acc:acc>=0&&S.accounts[acc]?acc:-1};
  if(op.acc>=0){const a=S.accounts[op.acc];a.balance=Math.round((num(a.balance)+(op.type==='in'?base:-base))*100)/100}
  OPS().push(op);S.opView=monthKey(op.date);
  Object.assign(S.opDraft,{amount:0,note:'',cur:S.currency,date:todayStr()});save();render();
  const mm=$('#opmsg');if(mm)mm.textContent='✓ '+T('Записано','Saved','Գրանցված է')+(op.acc>=0?' · '+T('баланс счёта обновлён','account balance updated','հաշվի մնացորդը թարմացվեց'):'');
}
function opDelete(id){
  const ops=OPS(),i=ops.findIndex(o=>String(o.id)===String(id));if(i<0)return;const o=ops[i];
  if(o.acc>=0&&S.accounts[o.acc]){const a=S.accounts[o.acc];a.balance=Math.round((num(a.balance)-(o.type==='in'?o.amount:-o.amount))*100)/100}
  ops.splice(i,1);save();render();
}
function opQuick(i){const q=OP_QUICK[i];Object.assign(S.opDraft,{type:q[0],cat:q[1],note:L(q.slice(3,6))});return 'opDraft.amount'}
function opsMonthSummary(){OPS();const mk=monthKey(todayStr());const l=S.ops.filter(o=>monthKey(o.date)===mk);return{inn:l.filter(o=>o.type==='in').reduce((s,o)=>s+o.amount,0),out:l.filter(o=>o.type==='out').reduce((s,o)=>s+o.amount,0),n:l.length}}

/* ================== IMPORT FROM EXCEL (только версия с сервером) ================== */
let IMP=null,IMPopt={replace:true,debts:true,salary:true,expenses:true,mortgage:true,mBal:0,mRate:0,cash:true,tax:true,plan:true,goal:true,deposit:true},IMPmsg='';
function vImport(){
  return `<div class="card"><h2>📥 ${T('Импорт из Excel','Import from Excel','Ներմուծում Excel-ից')}</h2>
    <p class="sub">${T('Загрузите таблицу с планом долгов (.xlsx): листы «Долги», «Настройки», «План». Сначала увидите, что будет добавлено, и только потом подтвердите.','Upload a debt-plan spreadsheet (.xlsx) with “Debts”, “Settings”, “Plan” sheets. You’ll see a preview before anything is added.','Վերբեռնեք պարտքերի պլանի աղյուսակը (.xlsx)՝ «Պարտքեր», «Կարգավորումներ», «Պլան» թերթերով։ Նախ կտեսնեք, թե ինչ կավելացվի, և միայն հետո կհաստատեք։')}</p>
    <p class="sub">📄 <a href="/samples/finbrain-template.xlsx" download style="color:var(--brand);font-weight:600">${T('Скачать шаблон с примером','Download the sample template','Ներբեռնել օրինակով ձևանմուշը')}</a> — ${T('в нём лист «Инструкция»: что и куда писать.','it has an “Instructions” sheet explaining what goes where.','այնտեղ «Հրահանգ» թերթում բացատրված է՝ ինչ և որտեղ գրել։')}</p>
    <input type="file" id="impfile" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
    <p id="impstatus" class="sub">${esc(IMPmsg)}</p></div><div id="impout">${impOut()}</div>`;
}
const shortContract=c=>String(c).length>9?'…'+String(c).slice(-4):String(c);
function ymToMonth(s){const [y,m]=s.split('-').map(Number),t=new Date();return Math.max(1,(y-t.getFullYear())*12+(m-1-t.getMonth())+1)}
function impBuild(){
  const r=IMP,o=IMPopt,src='xlsx',b={loans:[],incomes:[],expenses:[],accounts:[],events:[],reminders:[]};
  if(o.debts)for(const d of r.debts){const n=Math.max(1,d.schedule.length);const rocket=/rocket|line/i.test(d.type);
    const tcl=d.type.replace(/\s*\d+[.,]?\d*\s*%/,'').replace(/,\s*$/,'').trim(),txt2=d.type+' '+d.contract,human=/[a-zа-яё]{3,}\s/i.test(d.contract)&&!/\d{5,}/.test(d.contract);
    b.loans.push({name:human?d.contract:(tcl||T('Кредит','Loan','Վարկ'))+' · '+shortContract(d.contract),bank:rocket?'Rocket Line':(txt2.match(/ameriabank|ardshinbank|acba|inecobank|evocabank|idbank|unibank|araratbank|amio bank|fast bank|vtb|converse bank|armeconombank/i)||[''])[0],type:/ипотек|mortgage/i.test(txt2)?'mortgage':/авто|car/i.test(txt2)?'car':/карт|card|rocket|line/i.test(txt2)?'card':/микро|payday/i.test(txt2)?'short':/знаком|друг|брат|сестр|родител|friend/i.test(txt2)?'other':'consumer',balance:Math.round(d.balance*100)/100,rate:d.rate,payment:Math.ceil(d.balance/n*(1+d.rate/1200)),day:d.due?+d.due.slice(8,10):1,contract:d.contract,schedule:d.schedule,mode:d.schedule.length>1?'plan':d.schedule.length===1||d.due?'once':'monthly',due:d.schedule.length===1?ymDay(d.schedule[0].ym,d.due?+d.due.slice(8,10):1):d.schedule.length?undefined:d.due||undefined,deadline:d.due||undefined,src})}
  const s=r.settings||{};
  if(o.salary&&s.salary)b.incomes.push({name:T('Зарплата','Salary','Աշխատավարձ'),amount:s.salary,src});
  if(o.expenses)(s.expenses||[]).forEach(e=>b.expenses.push({name:e.name,cat:CATS[e.cat]?e.cat:'other',amount:e.amount,src}));
  if(o.mortgage&&s.mortgage){if(num(o.mBal)>0)b.loans.push({name:s.mortgage.name,bank:(s.mortgage.name.match(/ameria|ardshin|acba|ineco|evoca|idbank|unibank|araratbank|amio|fast|vtb|converse|armeconom/i)||[''])[0],type:'mortgage',balance:num(o.mBal),rate:num(o.mRate),payment:s.mortgage.payment,day:1,src});
    else b.expenses.push({name:s.mortgage.name+' · '+T('платёж','payment','վճար'),cat:'other',amount:s.mortgage.payment,src})}
  if(o.cash&&s.cash)b.accounts.push({bank:T('Наличные','Cash','Կանխիկ'),type:'cash',balance:s.cash,rate:0,src});
  if(o.deposit&&s.depositRate)b.accounts.push({bank:T('Вклад на цель','Goal deposit','Նպատակային ավանդ'),type:'deposit',balance:0,rate:s.depositRate,src,target:true});
  if(o.tax&&s.taxRefund)b.incomes.push({name:T('Возврат налога (ипотека)','Mortgage tax refund','Հիփոթեքի հարկի վերադարձ'),amount:s.taxRefund.amount,freq:'quarterly',month:((Math.min(...s.taxRefund.months)-1)%3)+1,day:20,src});
  if(o.plan)(r.plan||[]).forEach(p=>b.events.push({month:ymToMonth(p.ym),type:'oneExpense',amount:p.amount,acc:-1,note:p.note,src}));
  if(o.goal&&s.goalDate)b.reminders.push({title:s.goalLabel||T('Цель','Goal','Նպատակ'),cat:'home',amount:0,freq:'once',date:s.goalDate,day:1,month:1,daysBefore:30,active:true,src});
  return b;
}
function impOut(){
  if(!IMP)return '';
  const r=IMP,b=impBuild(),s=r.settings||{};
  const tot=r.debts.reduce((a,d)=>a+d.balance,0);
  const chk=(k,l)=>`<label style="display:flex;gap:8px;align-items:center;font-size:14px;margin:6px 0"><input type="checkbox" data-imp="${k}" ${IMPopt[k]?'checked':''} style="width:auto"> ${l}</label>`;
  return `<div class="card"><h2>👀 ${T('Предпросмотр','Preview','Նախադիտում')}</h2>
    <p class="sub">${T('Листы','Sheets','Թերթեր')}: ${r.sheets.map(esc).join(', ')}</p>
    ${chk('debts',`🏦 ${T('Долги','Debts','Պարտքեր')}: <b>${r.debts.length}</b> ${T('на сумму','totalling','ընդհանուր')} <b>${fmt(tot)}</b>`)}
    ${IMPopt.debts&&r.debts.length?`<div class="scroll" style="max-height:260px;overflow-y:auto"><table style="font-size:13px"><tr><th>${T('Договор','Contract','Պայմանագիր')}</th><th class="n">${T('К закрытию','To close','Փակելու համար')}</th><th class="n">${T('Ставка','Rate','Տոկոս')}</th><th class="n">${T('Срок','Due','Ժամկետ')}</th><th class="n">${T('План платежей','Planned payments','Վճարման պլան')}</th></tr>${r.debts.map(d=>`<tr><td>${esc(d.contract)}<br><span class="muted">${esc(d.type)}</span></td><td class="n">${fmt(d.balance)}</td><td class="n">${d.rate}%</td><td class="n">${d.due?fdate(d.due):'—'}</td><td class="n" style="font-size:12px">${d.schedule.map(x=>`${MONTHS()[+x.ym.slice(5)-1]} ${x.ym.slice(2,4)}: ${fmt(x.amount)}`).join('<br>')}</td></tr>`).join('')}</table></div>`:''}
    ${s.salary?chk('salary',`💼 ${T('Зарплата','Salary','Աշխատավարձ')}: <b>${fmt(s.salary)}</b>/${MO()}`):''}
    ${(s.expenses||[]).length?chk('expenses',`🛒 ${T('Расходы в месяц','Monthly expenses','Ամսական ծախսեր')}: ${s.expenses.map(e=>esc(e.name)+' '+fmt(e.amount)).join(', ')}`):''}
    ${s.mortgage?chk('mortgage',`🏠 ${esc(s.mortgage.name)}: <b>${fmt(s.mortgage.payment)}</b>/${MO()}`)+(IMPopt.mortgage?`<div class="grid" style="margin:4px 0 8px 26px">${inp('IMPMBAL',T('Остаток ипотеки (из приложения банка)','Mortgage balance (from bank app)','Հիփոթեքի մնացորդ (բանկի հավելվածից)'))}${inp('IMPMRATE',T('Ставка ипотеки, %','Mortgage rate, %','Հիփոթեքի տոկոս, %'))}</div><p class="sub" style="margin-left:26px">${T('Без остатка ипотека добавится как ежемесячный расход, а не как кредит.','Without a balance the mortgage is added as a monthly expense, not a loan.','Առանց մնացորդի հիփոթեքը կավելացվի որպես ամսական ծախս, ոչ թե վարկ։')}</p>`:''):''}
    ${s.cash?chk('cash',`💵 ${T('Наличные','Cash','Կանխիկ')}: <b>${fmt(s.cash)}</b>`):''}
    ${s.depositRate?chk('deposit',`🏦 ${T('Вклад для накоплений','Savings deposit','Խնայողական ավանդ')} ${s.depositRate}% — ${T('остаток каждого месяца в прогнозе пойдёт туда','monthly surplus in the forecast goes there','կանխատեսման ամսական ավելցուկը կգնա այնտեղ')}`):''}
    ${s.taxRefund?chk('tax',`↩️ ${T('Возврат налога','Tax refund','Հարկի վերադարձ')}: ${fmt(s.taxRefund.amount)} × ${s.taxRefund.months.map(m=>MONTHS()[m-1]).join(', ')} → ${T('периодический доход раз в квартал','quarterly periodic income','եռամսյակային պարբերական եկամուտ')}`):''}
    ${(r.plan||[]).length?chk('plan',`🛒 ${T('Разовые траты из плана','One-off costs from the plan','Միանվագ ծախսեր պլանից')}: ${r.plan.map(p=>esc(p.note)+' '+fmt(p.amount)+' ('+MONTHS()[+p.ym.slice(5)-1]+')').join(', ')} → ${T('в прогноз','into the forecast','կանխատեսման մեջ')}`):''}
    ${s.goalDate?chk('goal',`🔔 ${T('Напоминание','Reminder','Հիշեցում')}: ${esc(s.goalLabel||'')} — ${fdate(s.goalDate)}`):''}
    <hr style="border:0;border-top:1px solid var(--line);margin:10px 0">
    ${chk('replace',T('Заменить данные прошлого импорта (не трогая то, что вы вводили вручную)','Replace data from a previous import (keeps what you entered by hand)','Փոխարինել նախորդ ներմուծման տվյալները (ձեռքով մուտքագրվածը չի փոխվի)'))}
    <div class="btns"><button class="btn" data-impgo="1">✓ ${T('Добавить в мои данные','Add to my data','Ավելացնել իմ տվյալներին')}</button><button class="btn ghost" data-impgo="0">${T('Отмена','Cancel','Չեղարկել')}</button></div>
  </div>`;
}
async function impUpload(file){
  IMPmsg=T('Читаю файл…','Reading the file…','Կարդում եմ ֆայլը…');$('#impstatus').textContent=IMPmsg;
  try{
    if(file.size>5*1024*1024)throw {code:'too_big'};
    const buf=await file.arrayBuffer();
    const r=await fetch('/api/import/xlsx',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/octet-stream'},body:buf});
    const j=await r.json().catch(()=>({}));if(!r.ok)throw {code:j.error};
    if(!j.debts.length&&!j.settings?.salary)throw {code:'nothing'};
    IMP=j;IMPmsg='✓ '+file.name;
  }catch(e){IMP=null;IMPmsg={too_big:T('Файл больше 5 МБ.','File is over 5 MB.','Ֆայլը 5 ՄԲ-ից մեծ է։'),nothing:T('В файле не нашлось долгов или настроек.','No debts or settings found in the file.','Ֆայլում պարտքեր կամ կարգավորումներ չգտնվեցին։'),bad_file:T('Не удалось прочитать файл. Нужен формат .xlsx.','Couldn’t read the file. It must be .xlsx.','Չհաջողվեց կարդալ ֆայլը։ Անհրաժեշտ է .xlsx ձևաչափ։')}[e?.code]||T('Ошибка загрузки.','Upload failed.','Վերբեռնման սխալ։')}
  render();
}
function impApply(){
  const b=impBuild();
  if(IMPopt.replace){S.loans=S.loans.filter(x=>x.src!=='xlsx');S.incomes=S.incomes.filter(x=>x.src!=='xlsx');S.expenses=S.expenses.filter(x=>x.src!=='xlsx');remList().splice(0,remList().length,...remList().filter(x=>x.src!=='xlsx'));FC().events=FC().events.filter(x=>x.src!=='xlsx')}
  const nm=x=>String(x||'').trim().toLowerCase(),dup=[];
  const add=(arr,items,key)=>{for(const it of items){if(arr.some(x=>x.src!=='xlsx'&&nm(key(x))===nm(key(it)))){dup.push(key(it));continue}arr.push(it)}};
  add(S.loans,b.loans,x=>x.contract||x.name);add(S.incomes,b.incomes,x=>x.name);add(S.expenses,b.expenses,x=>x.name);add(remList(),b.reminders,x=>x.title);FC().events.push(...b.events);
  b.accounts=b.accounts.filter(a=>{const ex=S.accounts.some(x=>x.src!=='xlsx'&&(a.type==='cash'?x.type==='cash':nm(x.bank)===nm(a.bank)));if(ex)dup.push(a.bank);return !ex});
  for(const a of b.accounts){const ex=S.accounts.findIndex(x=>x.src==='xlsx'&&x.type===a.type&&x.bank===a.bank);const {target,...acc}=a;let idx;
    if(ex>=0){S.accounts[ex].balance=acc.balance;S.accounts[ex].rate=acc.rate;idx=ex}else{S.accounts.push(acc);idx=S.accounts.length-1}
    if(target)FC().target=idx}
  const n=b.loans.length;IMP=null;IMPopt.mBal=0;IMPopt.mRate=0;IMPmsg=(dup.length?'⚠️ '+T(`Уже были, не дублировал: ${dup.join(', ')}. `,`Already existed, not duplicated: ${dup.join(', ')}. `,`Արդեն կային, չկրկնեցի՝ ${dup.join(', ')}։ `):'')+'✓ '+T(`Добавлено: кредитов ${n}, доходов ${b.incomes.length}, расходов ${b.expenses.length}, счетов ${b.accounts.length}, событий прогноза ${b.events.length}, напоминаний ${b.reminders.length}.`,`Added: ${n} loans, ${b.incomes.length} incomes, ${b.expenses.length} expenses, ${b.accounts.length} accounts, ${b.events.length} forecast events, ${b.reminders.length} reminders.`,`Ավելացվեց՝ ${n} վարկ, ${b.incomes.length} եկամուտ, ${b.expenses.length} ծախս, ${b.accounts.length} հաշիվ, ${b.events.length} կանխատեսման իրադարձություն, ${b.reminders.length} հիշեցում։`);
  save();render();
}

/* ================== RENDER ================== */
function render(){
  renderChrome();
  const out=AUTH!=='in';
  ['#kpis','#tabs','#view','#foot'].forEach(id=>$(id).classList.toggle('hide',out));
  $('#userbtn').classList.toggle('hide',out);
  $('#opbtn').classList.toggle('hide',out);
  if(out){$('#aibtn').classList.add('hide');
    if(AUTH==='out'){authMode=authMode||'login';openAuth();$('#authmodal').classList.add('gate')}
    return}
  const v={home:vHome,plans:vPlans,profile:()=>vProfile()+dataCard(),money:vMoney,accounts:vAccounts,loans:vLoans,market:vMarket,analytics:vAnalytics,ops:vOps,forecast:vForecast,advice:vAdvice,calc:vCalc,reminders:vRem}[tab]||vHome;
  $('#view').innerHTML=pageHead(tab)+v()+(tab==='loans'&&S.loans.length?rollNote():'');
  if(tab==='reminders')renderTg();
  live();
}
function live(){
  renderKpis();
  if($('#sumtable'))$('#sumtable').innerHTML=sumTable();
  if($('#t-inc'))$('#t-inc').textContent=fmt(calc().income);
  if($('#loanout'))$('#loanout').innerHTML=loanOut();
  if($('#advout'))$('#advout').innerHTML=advOut();
  if($('#accout'))$('#accout').innerHTML=accOut();
  if($('#nlout'))$('#nlout').innerHTML=nlOut();
  if($('#calcout'))$('#calcout').innerHTML=calcOut();
  if($('#opsout'))$('#opsout').innerHTML=opsOut();
  if($('#opconv'))$('#opconv').innerHTML=opConv();
  if($('#fcout'))$('#fcout').innerHTML=fcOut();
  if($('#remout'))$('#remout').innerHTML=remOut();
  if($('#plansout'))$('#plansout').innerHTML=plansOut();
  if($('#homeout'))$('#homeout').innerHTML=homeOut()+homePlans();
}

/* ================== EVENTS ================== */
document.addEventListener('input',e=>{
  const k=e.target.dataset.k;if(!k)return;
  setPath(k,e.target.dataset.t==='num'?num(e.target.value):e.target.value);autoFill(k,e.target.value);
  {const m=/^loans\.(\d+)\.(balance|schedule)/.exec(k);if(m&&S.loans[+m[1]])S.loans[+m[1]].asOf=ymd(new Date())}
  {const m=/^plans\.(\d+)\.from$/.exec(k),p=m&&PLANS()[+m[1]];if(p&&num(p.months)>0&&p.from)planDur(+m[1],num(p.months))}
  save();live();
});
document.addEventListener('change',e=>{if(e.target.dataset.durin!==undefined){planDur(+e.target.dataset.durin,Math.round(num(e.target.value)));save();render();return}if(e.target.id==='impfile'&&e.target.files[0]){impUpload(e.target.files[0]);return}if(e.target.dataset.imp){IMPopt[e.target.dataset.imp]=e.target.checked;$('#impout').innerHTML=impOut();return}if(e.target.dataset.prefill){prefillPre(e.target.value);save();render();return}if(e.target.tagName==='SELECT'&&e.target.dataset.k){save();if(/^(reminders\.\d+\.freq|calc\.|loans\.\d+\.mode|incomes\.\d+\.freq|plans\.\d+\.(kind|freq)|scen\.events\.\d+\.type|scen\.target)/.test(e.target.dataset.k))render();else live()}});
$('#cur').addEventListener('change',e=>{S.currency=e.target.value;save();render()});
$('#lang').addEventListener('change',e=>{LANG=e.target.value;try{localStorage.setItem(KEY+'-lang',LANG)}catch(_){}translateDefaults();save();render()});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.t){tab=b.dataset.t;try{localStorage.setItem(KEY+'-tab',tab)}catch(_){}render();window.scrollTo({top:0,behavior:'smooth'});return}
  if(b.dataset.more){$('#tabs').classList.toggle('open');return}
  if(b.dataset.seg){let v=b.dataset.v;v=v==='true'?true:v==='false'?false:v;if(b.dataset.seg==='homeRange'){S.homeFrom='';S.homeTo='';v=v==='all'?'all':+v}setPath(b.dataset.seg,v);save();render();return}
  if(b.dataset.q){const focus=quickAdd(b.dataset.q,+b.dataset.i);save();render();const el=document.querySelector(`[data-k="${focus}"]`);if(el){el.focus();el.select?.()}return}
  if(b.dataset.tg){tgAction(b.dataset.tg);return}
  if(b.dataset.dur!==undefined){planDur(+b.dataset.dur,+b.dataset.n);save();render();return}
  if(b.dataset.sched!==undefined){SCHED_OPEN[b.dataset.sched]=!SCHED_OPEN[b.dataset.sched];if($('#plansout'))$('#plansout').innerHTML=plansOut();return}
  if(b.dataset.ev!==undefined){const f=addEvent(+b.dataset.ev);save();render();const el=document.querySelector(`[data-k="${f}"]`);if(el){el.focus();el.select?.()}return}
  if(b.dataset.op==='save'){opSave();return}
  if(b.dataset.opdel){opDelete(b.dataset.opdel);return}
  if(b.dataset.opq!==undefined){const f=opQuick(+b.dataset.opq);save();render();const el=document.querySelector(`[data-k="${f}"]`);if(el){el.focus();el.select?.()}return}
  if(b.dataset.impgo!==undefined){if(b.dataset.impgo==='1')impApply();else{IMP=null;IMPmsg='';render()}return}
  if(b.id==='opbtn'){tab='ops';try{localStorage.setItem(KEY+'-tab',tab)}catch(_){}render();window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>$('[data-k="opDraft.amount"]')?.focus(),250);return}
  if(b.dataset.calc){calcAction(b.dataset.calc);return}
  if(b.dataset.paid){markPaid(b.dataset.paid,b.dataset.d);return}
  if(b.dataset.qr!==undefined){const f=quickRem(+b.dataset.qr);save();render();const el=document.querySelector(`[data-k="${f}"]`);if(el){el.focus();el.select?.()}return}
  if(b.dataset.del){const ks=b.dataset.del.split('.');const i=+ks.pop();getPath(ks.join('.')).splice(i,1);save();render();return}
  if(b.dataset.add){const a=b.dataset.add;
    if(a==='kid')S.profile.kids.push({name:'',stage:'school',monthly:0,tuitionYear:0});
    if(a==='income')S.incomes.push({name:'',amount:0});
    if(a==='expense')S.expenses.push({name:'',cat:'other',amount:0});
    if(a==='loan')S.loans.push({name:T('Новый кредит','New loan','Նոր վարկ'),bank:'',type:'consumer',balance:0,rate:0,payment:0,day:1});
    if(a==='reminder')remList().push({title:'',cat:'other',amount:0,freq:'monthly',day:1,month:1,daysBefore:3,active:true});
    if(a==='plansave'||a==='planpay')PLANS().push({name:'',kind:a==='plansave'?'save':'pay',amount:0,freq:'monthly',from:todayStr(),to:'',acc:-1,goal:0});
    if(a==='account')S.accounts.push({bank:'',type:'current',balance:0,rate:0});
    if(a==='takeloan'){const msgs=takeLoan();save();render();const m=$('#nlmsg');if(m)m.innerHTML=msgs;return}
    save();render();return}
  if(b.dataset.mk==='dep'){const td=topDeposit();if(td){S.set.dep=td.rate;save();render()}return}
  if(b.dataset.mkm!==undefined){const x=(MK.mortgages||[]).slice().sort((a,b)=>a.rate-b.rate)[+b.dataset.mkm];if(x){S.nl.kind='mortgage';S.nl.rate=x.rate;S.nl.bank=x.bank;tab='loans';save();render();setTimeout(()=>$('#nlout')?.scrollIntoView({behavior:'smooth'}),50)}return}
  if(b.id==='aibtn'){$('#aipanel').classList.remove('hide');aiRender();setTimeout(()=>$('#aiin').focus(),50);return}
  if(b.id==='aiclose'){$('#aipanel').classList.add('hide');return}
  if(b.id==='aistop'){AIctl?.abort();return}
  if(b.dataset.aiq){aiSend(b.dataset.aiq);return}
  if(b.dataset.fcf){S.adv.mode='monthly';S.adv.amount=Math.max(0,Math.round(calc().fcf));save();render();return}
  if(b.id==='userbtn'){openAuth();return}
  if(b.dataset.act==='authclose'){$('#authmodal').classList.add('hide');return}
  if(b.dataset.act==='authswitch'){authMode=authMode==='login'?'register':'login';openAuth();return}
  if(b.dataset.act==='logout'){$('#authmodal').classList.add('hide');logout();return}
  const act=b.dataset.act;if(!act)return;const msg=t=>{const m=$('#msg');if(m)m.textContent=t};
  if(act==='copy'){const fb=()=>{$('#io').classList.remove('hide');$('#iot').value=JSON.stringify(S);msg(T('Скопируйте текст из поля вручную','Copy the text from the box manually','Պատճենեք տեքստը դաշտից ձեռքով'))};try{navigator.clipboard.writeText(JSON.stringify(S)).then(()=>msg(T('Скопировано ✓','Copied ✓','Պատճենված է ✓')),fb)}catch(_){fb()}}
  if(act==='import'){$('#io').classList.toggle('hide')}
  if(act==='doimport'){try{const d=JSON.parse($('#iot').value);if(!d.profile)throw 0;S=normalize(d);save();render();msg(T('Загружено ✓','Loaded ✓','Բեռնված է ✓'))}catch(_){msg(T('Не получилось прочитать данные','Couldn’t read the data','Չհաջողվեց կարդալ տվյալները'))}}
  if(act==='demo'){S=demo();save();render()}
  if(act==='clear'){if(b.dataset.sure){S=emptyState();save();render()}else{b.dataset.sure=1;b.textContent=T('Точно очистить? Нажмите ещё раз','Really clear? Tap again','Իսկապե՞ս մաքրել։ Սեղմեք ևս մեկ անգամ')}}
});
$('#aiform').addEventListener('submit',e=>{e.preventDefault();const v=$('#aiin').value;$('#aiin').value='';aiSend(v)});
$('#aiin').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#aiform').requestSubmit()}});
render();
init();

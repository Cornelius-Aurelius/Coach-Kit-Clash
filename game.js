import {COLORS,STAGES,TOTAL,initialState,chooseDecision,chooseFix,nextStage,chapter,grade} from './game-core.mjs';
const $=id=>document.getElementById(id);
const safeGet=(k,fallback=0)=>{try{return Number(localStorage.getItem(k))||fallback}catch{return fallback}};
const safeSet=(k,v)=>{try{localStorage.setItem(k,String(v))}catch{}};
let state=null, hintUsed=false, sound=false, audioCtx=null, guideReturn=null;
let best=safeGet('coachKitClashMatchV2Best');
let lastFocused=null;
const nodes=['homeCard','awayCard','homeKeeper','awayKeeper','official'];
const playPanel=$('playPanel'), menuPanel=$('menuPanel'), finishPanel=$('finishPanel');
function beep(freq=550,kind='sine'){
 if(!sound)return;
 try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();const oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain(),now=audioCtx.currentTime;oscillator.type=kind;oscillator.frequency.setValueAtTime(freq,now);oscillator.frequency.exponentialRampToValueAtTime(Math.max(120,freq*.72),now+.115);gain.gain.setValueAtTime(.04,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.13);oscillator.connect(gain);gain.connect(audioCtx.destination);oscillator.start(now);oscillator.stop(now+.14)}catch{}
}
function jersey(colour,num,large=false){
 const shade=COLORS[colour]?.[1]||'#888';const number=num||'★';
 return `<svg class="jersey${large?' large':''}" viewBox="0 0 94 110" aria-hidden="true" focusable="false"><defs><linearGradient id="shirt-${colour}-${number}" x1="0" x2=".9" y1="0" y2="1"><stop stop-color="${shade}"/><stop offset="1" stop-color="${shade}"/></linearGradient></defs><path d="M25 11L38 5Q47 12 56 5L69 11L90 27L79 48L70 41L71 104H23L24 41L15 48L4 27Z" fill="url(#shirt-${colour}-${number})" stroke="#e3f2ff" stroke-width="2.4" stroke-linejoin="round"/><path d="M39 5Q47 16 55 5" stroke="#17253b" stroke-width="5" fill="none"/><path d="M26 35H68M26 39H68" stroke="rgba(255,255,255,.18)" stroke-width="2"/><text x="47" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="31" fill="#fff" stroke="#172333" stroke-width="5" paint-order="stroke" font-weight="900">${number}</text></svg>`;
}
function teamCard(id,label,color,nums){$(id).innerHTML=`<h4>${label}</h4><div class="jerseys">${nums.map(n=>jersey(color,n,true)).join('')}</div><div class="kit-name">${COLORS[color][0]} shirts</div>`;}
function roleCard(id,label,color,num){$(id).innerHTML=`<h5>${label}</h5>${jersey(color,num)}<div><small>${COLORS[color][0]}</small></div>`;}
function renderPitch(){
 const s=state?STAGES[state.index]:STAGES[0];
 teamCard('homeCard','HOME TEAM',s.home,['7','10']);teamCard('awayCard','AWAY TEAM',s.away,['8','11']);roleCard('homeKeeper','HOME GK',s.homeGK,'1');roleCard('awayKeeper','AWAY GK',s.awayGK,'1');roleCard('official','REFEREE',s.ref,'R');
 highlight(false);$('pitch').classList.toggle('contrast-view',hintUsed);$('viewLabel').textContent=hintUsed?'Contrast lens · not a CVD simulation':'Full colour view';
 $('matchCondition').textContent=state?chapter(state.index).toUpperCase():'READY FOR KICK-OFF';
}
function highlight(show){
 nodes.forEach(id=>$(id).classList.remove('flagged','safe'));
 if(!show||!state)return;
 const s=STAGES[state.index];
 if(s.answer==='clear'){nodes.forEach(id=>$(id).classList.add('safe'));return;}
 const focus=s.focus==='teams'?['homeCard','awayCard']:s.focus==='homeGK'?['homeKeeper','awayCard']:s.focus==='awayGK'?['awayKeeper','homeCard']:s.focus==='ref'?['official',s.ref===s.home?'homeCard':'awayCard']:[];
 focus.forEach(id=>$(id).classList.add('flagged'));
}
function updateHeader(){
 const i=state?.index||0;
 $('chapterStat').textContent=chapter(i).toUpperCase();$('roundStat').textContent=`${String(i+1).padStart(2,'0')} / 18`;
 $('scoreStat').textContent=String(state?.score||0).padStart(4,'0');$('streakStat').textContent=`${state?.streak||0} ✦`;
 $('livesStat').textContent=!state?'♥ ♥ ♥':state.mode==='practice'?'∞ TRAINING':'♥ '.repeat(Math.max(0,state.lives)).trim()||'0 ♥';
 $('bestStat').textContent=String(best).padStart(4,'0');$('progressFill').style.width=`${state?((state.index+(state.phase==='over'?1:0))/TOTAL)*100:0}%`;
 $('restartButton').disabled=!state;
}
function showPanel(panel){[menuPanel,playPanel,finishPanel].forEach(x=>x.classList.toggle('hidden',x!==panel));}
function render(){
 updateHeader();renderPitch();
 if(!state){showPanel(menuPanel);return;}
 if(state.phase==='over'){
  showPanel(finishPanel);if(state.mode==='match'&&state.score>best){best=state.score;safeSet('coachKitClashMatchV2Best',best)}
  const rank=grade(state.score,state.correct);$('finishTitle').textContent=rank;$('finalScore').textContent=state.score.toLocaleString('en-GB');$('finishCopy').textContent=state.index===17&&state.lives>0?'Full time! You completed all 18 kit decisions.':'Match completed. Every mistake is a useful coaching lesson.';
  $('finishStats').textContent=`${state.correct} correct kit judgements • ${state.hints} contrast hints • ${state.index+1} rounds visited`;updateHeader();$('againButton').focus();return;
 }
 showPanel(playPanel);const s=STAGES[state.index];$('stageTitle').textContent=s.name;
 $('stepLabel').textContent=state.phase==='judge'?'STEP 1 / SPOT THE CLASH':state.phase==='fix'?'STEP 2 / FIX THE KIT':'COACHING REVIEW';
 $('question').textContent=state.phase==='judge'?'Can every player, keeper and official be distinguished quickly?':state.phase==='fix'?'You spotted a potential clash. Which change gives the clearest shirts?':'What should a good coach remember?';
 $('decidePanel').classList.toggle('hidden',state.phase!=='judge');$('fixPanel').classList.toggle('hidden',state.phase!=='fix');$('reviewPanel').classList.toggle('hidden',state.phase!=='review');
 $('contrastButton').textContent=hintUsed?'◐ Contrast lens enabled · reduced points':'◐ Contrast lens · reduced points';
 if(state.phase==='fix'){
  $('fixOptions').replaceChildren(...s.options.map((option,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<span class="num">${i+1}</span><span></span>`;b.lastElementChild.textContent=option;b.addEventListener('click',()=>answerFix(i));return b}));
  $('fixOptions').querySelector('button')?.focus();
 }
 if(state.phase==='review'){
  highlight(true);const correct=state.decision===s.answer;const msg=correct?(state.fixCorrect===false?'GOOD SPOT · REPAIR TO IMPROVE':state.fixCorrect===true?'EXCELLENT REPAIR':'CORRECT KIT CALL'):'A USEFUL LEARNING MOMENT';
  $('feedbackHead').textContent=msg;$('feedbackHead').classList.toggle('wrong',!correct||state.fixCorrect===false);
  $('feedbackWhy').textContent=s.why+(state.fixCorrect===false?' Best change: '+s.fix+'.':'');
  $('lesson').textContent='COACH TIP — '+s.lesson;
  $('nextButton').innerHTML=(state.index===TOTAL-1||state.lives<=0?'SEE FINAL SCORE →':'NEXT MATCHUP →')+' <kbd>ENTER</kbd>';
  $('nextButton').focus();
 }
}
function start(mode){state=initialState(mode);hintUsed=false;render();$('clearButton').focus();document.getElementById('game-stage').scrollIntoView({behavior:'smooth',block:'start'});}
function answerJudge(choice){if(!state||state.phase!=='judge')return;state=chooseDecision(state,choice,hintUsed);beep(state.decision===STAGES[state.index].answer?720:250,state.decision===STAGES[state.index].answer?'sine':'triangle');render();}
function answerFix(choice){if(!state||state.phase!=='fix')return;state=chooseFix(state,choice);beep(state.fixCorrect?870:280);render();}
function advance(){if(!state||state.phase!=='review')return;state=nextStage(state);hintUsed=false;render();if(state.phase==='judge')$('clearButton').focus();}
function toggleContrast(){if(!state||state.phase!=='judge')return;hintUsed=true;$('pitch').classList.toggle('contrast-view');$('viewLabel').textContent=$('pitch').classList.contains('contrast-view')?'Contrast lens · not a CVD simulation':'Full colour view';$('contrastButton').textContent=$('pitch').classList.contains('contrast-view')?'◐ Contrast lens on · reduced points':'◐ Contrast lens used · reduced points';}
function openGuide(){lastFocused=document.activeElement;$('guideDialog').classList.remove('hidden');$('closeGuide').focus();}
function closeGuide(){$('guideDialog').classList.add('hidden');lastFocused?.focus();}
$('matchButton').addEventListener('click',()=>start('match'));
$('practiceButton').addEventListener('click',()=>start('practice'));
$('againButton').addEventListener('click',()=>start(state?.mode||'match'));
$('practiceAgainButton').addEventListener('click',()=>start('practice'));
$('restartButton').addEventListener('click',()=>start(state?.mode||'match'));
$('clearButton').addEventListener('click',()=>answerJudge('clear'));
$('reviewButton').addEventListener('click',()=>answerJudge('review'));
$('contrastButton').addEventListener('click',toggleContrast);
$('nextButton').addEventListener('click',advance);
$('soundButton').addEventListener('click',()=>{sound=!sound;$('soundButton').textContent=sound?'♫ Sound on':'♫ Sound off';$('soundButton').setAttribute('aria-pressed',String(sound));beep(700)});
$('guideButton').addEventListener('click',openGuide);
$('guideOkay').addEventListener('click',closeGuide);
$('closeGuide').addEventListener('click',closeGuide);
$('guideDialog').addEventListener('click',e=>{if(e.target===$('guideDialog'))closeGuide()});
document.addEventListener('keydown',e=>{
 const key=e.key.toLowerCase();if(!$('guideDialog').classList.contains('hidden')){if(key==='escape')closeGuide();return}
 if(e.metaKey||e.ctrlKey||e.altKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 if(!state||state.phase==='over')return;
 if(state.phase==='judge'){
  if(key==='1'){e.preventDefault();answerJudge('clear')}
  if(key==='2'){e.preventDefault();answerJudge('review')}
  if(key==='c'){e.preventDefault();toggleContrast()}
 }else if(state.phase==='fix'&&['1','2','3'].includes(key)){e.preventDefault();answerFix(Number(key)-1)}
 else if(state.phase==='review'&&key==='enter'){e.preventDefault();advance()}
});
render();
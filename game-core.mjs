export const COLORS=Object.freeze({
 blue:['Royal blue','#2667ed'],yellow:['Bright yellow','#ffe263'],white:['White','#f5f6fa'],black:['Black','#171d2a'],
 red:['Red','#db3856'],green:['Green','#2ca56e'],orange:['Orange','#f28a41'],purple:['Purple','#8555c7'],
 cream:['Cream','#e9dcc0'],navy:['Navy','#1d3154'],lime:['Lime','#c5e46c'],maroon:['Maroon','#74283e'],grey:['Light grey','#cad5e2']
});
export const S = (name, home,away,homeGK,awayGK,ref, answer,focus,why,fix,options,lesson)=>({name,home,away,homeGK,awayGK,ref,answer,focus,why,fix,options,lesson});
// These curated examples illustrate general accessibility principles, not a certified assessment of real-world match kits.
export const STAGES=Object.freeze([
 S('The opening whistle','blue','yellow','black','white','purple','clear','team','Blue and yellow have clearly different lightness and are among the FA’s suggested combinations.',null,null,'Start with strongly contrasting outfield shirts, then check the goalkeepers and referee.'),
 S('The invisible rival','red','green','blue','yellow','black','review','teams','Red versus green is a well-known potential colour-vision kit clash.','Change away shirts to bright yellow',['Keep both kits; socks are different','Change away shirts to bright yellow','Add a small badge to each shirt'],'Shirt visibility takes priority over small details.'),
 S('The clean contrast','white','black','blue','yellow','purple','clear','team','A very light shirt versus a very dark shirt creates strong tonal contrast.',null,null,'Contrast is easier to recognise quickly than relying on hue names.'),
 S('Nearly midnight','navy','black','yellow','white','orange','review','teams','Navy and black can merge under poor lighting or at distance.','Swap away shirts to white',['Swap away shirts to white','Use striped socks only','Keep both dark shirts'],'Use a clear light-versus-dark distinction.'),
 S('Bright confusion','yellow','lime','navy','white','purple','review','teams','Bright yellow and lime can be difficult to separate because of similar lightness.','Switch away shirts to blue',['Use larger badges','Switch away shirts to blue','Only alter short colours'],'Check actual contrast, not whether two colours have different names.'),
 S('Blue and white','blue','white','yellow','black','orange','clear','team','Blue versus white offers a strong outfield contrast, with other roles visibly distinct.',null,null,'When choosing kits, consider every person on the pitch.'),
 S('Goalkeeper in disguise','blue','yellow','yellow','white','black','review','homeGK','The home goalkeeper is wearing the same yellow as the away outfield players.','Change the home goalkeeper to white',['Change the home goalkeeper to white','Only change the goalkeeper gloves','Put a number on the keeper shirt'],'Goalkeepers need to contrast with outfield players on both teams.'),
 S('The official illusion','red','yellow','blue','white','red','review','ref','The referee shirt matches the red home outfield shirts.','Referee changes to black',['Add a whistle in a new colour','Referee changes to black','Alter the referee socks only'],'Officials must be distinguishable from both teams.'),
 S('The contrast classic','black','yellow','blue','white','purple','clear','team','Black and bright yellow are one of the FA’s suggested high-contrast pairings.',null,null,'Strong shirt contrast makes quick decisions easier.'),
 S('A problem with orange','red','orange','blue','white','black','review','teams','Red and orange can be difficult to distinguish in rapid play for some people with CVD.','Away side changes to bright yellow',['Away side changes to bright yellow','Keep kits but shout team names','Use different shorts'],'Prefer a clearly different shirt colour rather than relying on communication as a workaround.'),
 S('Referee in the shadows','blue','white','yellow','purple','blue','review','ref','The blue referee shirt could blend with the blue home team.','Referee changes to black',['Make referee shorts white','Referee changes to black','Add a small armband'],'Make officials distinct by their dominant shirt colour.'),
 S('Black and white decision','black','white','blue','yellow','purple','clear','team','The outfield shirts are distinct and the other roles do not repeat them.',null,null,'Verify kits before kick-off and in matchday lighting.'),
 S('Striping cannot rescue this','red','black','blue','yellow','white','review','teams','Red versus black is listed in FA guidance as a possible clash, even if small details differ.','Change away to bright yellow',['Make numbers bigger but keep kits','Change away to bright yellow','Add narrow sleeve stripes'],'Do not assume numbers or small patterns compensate for a poor main-colour pairing.'),
 S('The other goalkeeper','yellow','blue','white','yellow','black','review','awayGK','The away goalkeeper wears yellow, matching the home outfield side.','Away keeper shirt changes to purple',['Keeper gloves change to purple','Away keeper shirt changes to purple','Only goalkeeper shorts change'],'Check each goalkeeper against the opposition outfield shirt.'),
 S('A bright final','yellow','black','white','blue','purple','clear','team','High-contrast yellow and black outfield shirts, and separately identifiable goalkeeper/official shirts.',null,null,'A matchday kit check should cover players, keepers, officials and the pitch.'),
 S('Red against black','red','black','yellow','blue','white','review','teams','Red against black is a specific possible clash in the FA’s football kit guidance.','Change black side to yellow',['Change black side to yellow','Keep kits and rely on numbers','Only switch the socks'],'Design for instant recognition, not close inspection.'),
 S('White and cream','white','cream','blue','yellow','black','review','teams','White and cream are both light and may be hard to distinguish at distance.','Change cream shirts to navy',['Change cream shirts to navy','Keep the shirts but wear coloured boots','Add a tiny badge'],'Even if hues differ, similar brightness can make teams merge.'),
 S('Final whistle','blue','yellow','white','black','purple','clear','team','The blue-yellow pairing has distinct contrast, with separate goalkeeper and referee colours.',null,null,'You are ready to assess kits at a glance—and make improvements when needed.')
]);
export const TOTAL=STAGES.length;
export const isStageValid=s=>[s.home,s.away,s.homeGK,s.awayGK,s.ref].every(x=>x in COLORS)&&['clear','review'].includes(s.answer)&&s.name&&s.why&&s.lesson&&(s.answer==='clear'?s.fix===null&&s.options===null:s.fix&&s.options?.length===3&&s.options.filter(x=>x===s.fix).length===1);
export const chapter=index=>index<6?'Warm-up':index<12?'Match control':'Final whistle';
export const initialState=(mode='match')=>({mode,index:0,score:0,streak:0,lives:3,hints:0,answered:false,decision:null,phase:'judge',fixCorrect:null,correct:0});
export const grade=(score,correct)=>correct===TOTAL&&score>=2400?'Master Coach':correct>=15?'Kit Specialist':correct>=11?'Matchday Ready':correct>=7?'Learning Coach':'Rookie Coach';
export function chooseDecision(state,answer,hint=false){
 if(state.phase!=='judge'||state.answered||state.index>=TOTAL)return state;
 const stage=STAGES[state.index],ok=stage.answer===answer;
 const streak=ok?state.streak+1:0;
 const earned=ok?(hint?65:110)+Math.min(60,(streak-1)*10):0;
 return {...state,answered:true,decision:answer,phase:ok&&stage.answer==='review'?'fix':'review',score:Math.max(0,state.score+earned),streak,lives:ok||state.mode==='practice'?state.lives:state.lives-1,correct:state.correct+(ok?1:0),hints:state.hints+(hint?1:0)};
}
export function chooseFix(state,choice){
 if(state.phase!=='fix'||state.fixCorrect!==null)return state;
 const s=STAGES[state.index],ok=s.options[choice]===s.fix;
 return {...state,fixCorrect:ok,score:state.score+(ok?70:0),phase:'review',streak:ok?state.streak:0};
}
export function nextStage(state){
 if(state.phase!=='review')return state;
 if(state.index===TOTAL-1||state.lives<=0)return {...state,phase:'over'};
 return {...state,index:state.index+1,phase:'judge',decision:null,answered:false,fixCorrect:null};
}
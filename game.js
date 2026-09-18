(() => {
'use strict';

const SAVE_KEY='melodicIslesSave_v2';
const OLD_SAVE_KEY='melodicIslesSave_v1';
const VERSION=4;
const FOUR_HOURS=4*60*60*1000;
const ONE_HOUR=60*60*1000;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const now=()=>Date.now();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fmt=n=>Math.floor(Number(n)||0).toLocaleString();
const uid=()=>`m_${Math.random().toString(36).slice(2,10)}${Date.now().toString(36).slice(-4)}`;
const dayStamp=()=>new Date().toISOString().slice(0,10);
const currentRotation=()=>Math.floor(Date.now()/FOUR_HOURS);

const VARIANTS={
  Common:{mult:1,chance:.70,color:'#dce4ef',fx:'soft'},
  Rare:{mult:1.55,chance:.20,color:'#64d3ff',fx:'glass'},
  Epic:{mult:2.25,chance:.08,color:'#d578ff',fx:'harmonic'},
  Legendary:{mult:3.5,chance:.02,color:'#ffd15f',fx:'sparkle'}
};

const ISLANDS={
  groove:{name:'Verdant Groove',type:'ISLAND I · GARDEN GROOVE',desc:'Leaves, drums, horns and chirps lock into a bright opening song.',theme:'groove',icon:'🌿',unlockLevel:1,unlockCost:0,lifeStars:0,decor:['🌳','🌼','🪨','🌷','🍄','🌿'],root:220},
  frost:{name:'Frostbell Atoll',type:'ISLAND II · CRYSTAL CHOIR',desc:'Glassy bells, snowy percussion and wide choir notes shimmer over the ice.',theme:'frost',icon:'❄️',unlockLevel:4,unlockCost:8000,lifeStars:0,decor:['❄️','💎','🌲','🧊','🔷','❄️'],root:261.63},
  ember:{name:'Ember Circuit',type:'ISLAND III · VOLTAGE STAGE',desc:'Molten marimba, sub bass, sparks and machines turn the island into a festival.',theme:'ember',icon:'⚡',unlockLevel:8,unlockCost:25000,lifeStars:0,decor:['🔥','⚙️','🪨','⚡','🔩','🔥'],root:185},
  moon:{name:'Moonlit Reverie',type:'ISLAND IV · CELESTIAL DREAM',desc:'Harp, celesta, distant choir and starlight percussion make the most heavenly song yet.',theme:'moon',icon:'🌙',unlockLevel:12,unlockCost:45000,lifeStars:10,decor:['🌙','✨','🔮','⭐','☁️','💫'],root:293.66}
};

const MONSTERS=[
  // Verdant Groove — 10 regular + 1 island titan
  ['spriggle','Spriggle','groove','Leaf','pluck',350,22,5,'leaf',['#75df6b','#2eaa62','#d6ff93'],'A leafy little plucker that snaps its stem like a tiny string instrument.'],
  ['drumroot','Drumroot','groove','Earth','kick',700,38,8,'root',['#b77a46','#6cb64e','#f4c879'],'Its hollow roots thump the ground in a warm, bouncy beat.'],
  ['pufflehorn','Pufflehorn','groove','Air','horn',1200,62,12,'puff',['#e7a6da','#9a6ad6','#ffd6ef'],'A fluffy horn singer with a surprisingly enormous brass voice.'],
  ['shellody','Shellody','groove','Water','bell',1900,86,18,'shell',['#69d5e9','#3678c4','#c3f8ff'],'Taps the ridges of its shell to ring clean watery notes.'],
  ['chirplet','Chirplet','groove','Song','chirp',2800,118,24,'bird',['#ffd25a','#f47767','#fff0a8'],'A tiny three-note vocalist that never misses its entrance.','Songster'],
  ['bloombass','Bloombass','groove','Bloom','bass',3600,145,28,'flower',['#ff8fc8','#4cbd6b','#fff0a5'],'A flower-backed bass singer whose petals bounce on every downbeat.'],
  ['vinebell','Vinebell','groove','Vine','chime',4300,170,32,'vine',['#76d15b','#387d4b','#ffe783'],'Its curling vines hold tiny bells that sway in perfect time.'],
  ['dewdropper','Dewdropper','groove','Dew','kalimba',5200,205,36,'slime',['#72e6d2','#45a5c3','#dffff7'],'Plucks little droplets like a thumb piano.'],
  ['twiggle','Twiggle','groove','Wood','clack',6100,242,40,'stag',['#bd8c53','#5eaf62','#ecce8b'],'Knocks its wooden antlers together for a crisp clack groove.'],
  ['mossmara','Mossmara','groove','Moss','choir',7600,295,46,'moth',['#8cd879','#596db8','#d9ffd0'],'A mossy moth whose wingbeats make a soft humming choir.'],
  ['heartwood','Heartwood Harmonizer','groove','Heartwood','heaven',18000,620,60,'tower',['#86e26e','#38643e','#ffe285'],'The island titan. Its living wooden pipes turn the whole garden into a cathedral.', 'Island Titan',true,260,5],

  // Frostbell Atoll
  ['glisswing','Glisswing','frost','Ice','choir',4200,160,30,'wing',['#c8f2ff','#6db4ef','#f6fdff'],'Crystal feathers whistle a smooth sliding harmony.'],
  ['crystoad','Crystoad','frost','Crystal','mallet',5200,190,34,'toad',['#7ee8ee','#5f79df','#d8ffff'],'A squat crystal drummer that plays its own sparkling back.'],
  ['snowbongo','Snowbongo','frost','Snow','snare',6800,228,38,'bongo',['#dfefff','#7a9fd2','#ffffff'],'Two frost drums and one goofy grin. Somehow, it works.'],
  ['chimecub','Chimecub','frost','Bell','chime',8500,280,44,'cub',['#b8ddff','#6c77d1','#edf7ff'],'A cuddly bell-beast whose antlers ring when it hops.'],
  ['echoowl','Echoowl','frost','Echo','pad',11000,350,50,'owl',['#8e79d7','#403d83','#d5cfff'],'Sings one note, then throws its echo across the whole atoll.','Mythic'],
  ['icicello','Icicello','frost','Cello','cello',12600,402,54,'jelly',['#9cecff','#4268ba','#f4ffff'],'Its icicle arms bow a deep frozen cello tone.'],
  ['flurrit','Flurrit','frost','Flurry','flute',13900,455,58,'bird',['#f3fbff','#7db3ec','#a9eeff'],'A tiny snow flutist with breathy, dancing runs.'],
  ['glacitone','Glacitone','frost','Glacier','glass',15200,510,62,'orb',['#7ef0ff','#5566c9','#e8ffff'],'A floating glass orb that sings when its rings collide.'],
  ['sleetbeat','Sleetbeat','frost','Sleet','hihat',16800,575,66,'bug',['#c6edff','#6378a9','#ffffff'],'Taps sleet-crystals into a bright, fast hi-hat pattern.'],
  ['prismoth','Prismoth','frost','Prism','arp',19000,650,70,'moth',['#c8a8ff','#59c9ea','#fff6ff'],'Splits one tone into a rainbow arpeggio with every wingbeat.'],
  ['cryocantor','Cryocantor-X','frost','Aurora Core','heaven',30000,980,78,'tower',['#b7f2ff','#6656b3','#ffffff'],'The frost titan. Aurora pipes and crystal choirs bloom into enormous suspended chords.','Island Titan',true,420,7],

  // Ember Circuit
  ['sparko','Sparko','ember','Volt','zap',14500,430,52,'spark',['#ffe45d','#f28c35','#fff8bb'],'A hyper little voltage singer that crackles right on beat.'],
  ['magmarimba','Magmarimba','ember','Magma','marimba',18000,520,56,'magma',['#ff7b48','#9f3039','#ffc164'],'Plays lava-rock bars across its back like a volcanic marimba.'],
  ['coilcat','Coilcat','ember','Coil','bass',23000,640,60,'cat',['#65e2ff','#3b4f94','#baf7ff'],'Purrs sub-bass through a glowing coil wrapped around its tail.'],
  ['beatbug','Beatbug','ember','Circuit','tick',30000,780,64,'bug',['#80f0a8','#263b4c','#d4ffe2'],'A clockwork bug whose feet create an impossibly tight rhythm.'],
  ['furnacefin','Furnacefin','ember','Furnace','timpani',33500,850,68,'crab',['#ff9b42','#7d2934','#ffd277'],'A molten little beast that booms like a floor tom.'],
  ['voltelope','Voltelope','ember','Static','synthlead',37000,920,72,'stag',['#6ef2ff','#4358d1','#fff068'],'Its antlers arc melodic electricity from note to note.'],
  ['cinderclick','Cinderclick','ember','Cinder','clack',40500,1000,76,'bug',['#ff784a','#4a2e42','#ffd380'],'Clicks heated plates together for a sharp industrial rhythm.'],
  ['gearling','Gearling','ember','Gear','hihat',45000,1100,80,'machine',['#8ad8d7','#48506e','#f2d783'],'A tiny machine whose spinning teeth make metallic percussion.'],
  ['ashvox','Ashvox','ember','Ash','choir',49000,1210,84,'ghost',['#c9c2c7','#5d475d','#ffb78a'],'A smoky vocalist that drifts through the mix like a ghost choir.'],
  ['neonix','Neonix','ember','Neon','arp',54000,1340,88,'orb',['#ff69db','#3a63e9','#8effff'],'A neon oscillator that spits out a relentless arpeggio.'],
  ['resonator','Resonator-X','ember','Core','titan',65000,1800,90,'machine',['#77dcff','#5042a3','#ffe36d'],'The circuit titan. It drops a massive power-grid chord that makes the entire island feel twice as large.','Island Titan',true,600,9],

  // Moonlit Reverie
  ['lumibun','Lumibun','moon','Lumen','harp',22000,610,48,'puff',['#fff0c4','#7b67c8','#fff9ed'],'Plucks luminous whiskers like a miniature harp.'],
  ['nocturnote','Nocturnote','moon','Night','flute',25000,680,52,'bat',['#8175cf','#29305f','#c2e8ff'],'A moon-bat that breathes soft flute lines between the stars.'],
  ['starwhisp','Starwhisp','moon','Star','celesta',28500,760,56,'ghost',['#e8f5ff','#8f79db','#fff5b2'],'A little wisp that taps sparkling celesta notes into the air.'],
  ['moondrum','Moondrum','moon','Moon','timpani',32000,850,60,'bongo',['#ddd7ff','#7565a8','#f5f3ff'],'A gentle lunar drummer with huge, warm low-end pulses.'],
  ['cometail','Cometail','moon','Comet','bell',36000,945,64,'cat',['#8ae9ff','#6552a5','#fff59a'],'Its comet tail rings like a distant bell as it circles the stage.'],
  ['dreamhorn','Dreamhorn','moon','Dream','choir',41000,1050,68,'stag',['#f1d7ff','#8064b2','#fff6ff'],'Sings a breathy choir tone through antlers shaped like crescents.'],
  ['orbitaloop','Orbitaloop','moon','Orbit','pad',47000,1170,72,'planet',['#84d7ff','#5e4ea4','#ffdc9b'],'Three tiny moons orbit it, building slow ambient pads.'],
  ['halope','Halope','moon','Halo','glass',53000,1320,76,'halo',['#fff6bd','#85a7e9','#ffffff'],'A floating halo creature with pristine glass harmonics.'],
  ['nebulark','Nebulark','moon','Nebula','bass',60000,1490,82,'jelly',['#b997ff','#344b8d','#f9d8ff'],'A cosmic bass singer whose body ripples like a nebula.'],
  ['tidemoon','Tidemoon','moon','Tide','kalimba',68000,1680,88,'shell',['#75d9e8','#7463bd','#e9faff'],'Plucks moonlit tide-drops into a calm, hypnotic rhythm.'],
  ['astralorganon','Astral Organon','moon','Astral Core','heaven',85000,2400,90,'tower',['#efe4ff','#7862cb','#fff5aa'],'The celestial titan. A radiant organ-choir chord with harp overtones turns the island genuinely heavenly.','Island Titan',true,900,12]
].map(r=>({id:r[0],name:r[1],island:r[2],element:r[3],instrument:r[4],price:r[5],rate:r[6],wait:r[7],shape:r[8],colors:r[9],desc:r[10],featured:r[11]||'',special:!!r[12],notes:r[13]||0,stars:r[14]||0}));
const M=Object.fromEntries(MONSTERS.map(m=>[m.id,m]));

const QUESTS=[
  ['q01','🎤','Start the Chorus','Place 3 monsters on one island.',3,'placed',{coins:900,xp:35}],
  ['q02','🥚','Growing Family','Own 5 monsters.',5,'owned',{gems:4,xp:50}],
  ['q03','🪙','Pocket the Beat','Collect 2,000 monster coins.',2000,'collectedCoins',{notes:80,xp:60}],
  ['q04','💞','New Harmony','Complete 1 breeding.',1,'breedCount',{gems:6,coins:1800,xp:70}],
  ['q05','🗺️','Island Hopper','Unlock 2 islands.',2,'islands',{stars:1,notes:120,xp:80}],
  ['q06','🌼','Stage Decorator','Buy 3 decorations.',3,'decorBought',{coins:2800,notes:90,xp:70}],
  ['q07','🎶','Full Performance','Play 3 island songs.',3,'songsPlayed',{notes:140,gems:3,xp:85}],
  ['q08','💎','No Waiting Around','Instant-finish 1 breed with Gems.',1,'instantBreeds',{stars:1,notes:100,xp:80}],
  ['q09','🔵','Rare Find','Own 2 Rare monsters.',2,'rareOwned',{gems:6,stars:1,xp:100}],
  ['q10','🟣','Epic Moment','Own an Epic monster.',1,'epicOwned',{gems:8,stars:1,xp:110}],
  ['q11','✨','Legendary!','Own a Legendary monster.',1,'legendaryOwned',{gems:12,stars:2,xp:140}],
  ['q12','📖','Big Songbook','Discover 15 species.',15,'species',{notes:250,stars:2,xp:160}],
  ['q13','🎨','Variant Hunter','Discover 20 rarity slots.',20,'variantSlots',{gems:10,stars:2,xp:170}],
  ['q14','❄️','Frozen Ensemble','Place 6 monsters on Frostbell Atoll.',6,'frostPlaced',{notes:220,coins:6000,xp:150}],
  ['q15','⚡','Circuit Breaker','Place 7 monsters on Ember Circuit.',7,'emberPlaced',{gems:9,stars:2,xp:170}],
  ['q16','🌙','Dream Arrival','Unlock Moonlit Reverie.',1,'moonUnlocked',{gems:12,notes:300,stars:2,xp:220}],
  ['q17','🏛️','Awaken a Titan','Own any Island Titan.',1,'titanOwned',{gems:15,stars:3,xp:260}],
  ['q18','🎼','Spend the Music','Spend 500 Music Notes.',500,'notesSpent',{stars:2,gems:8,xp:160}],
  ['q19','⭐','Island Mastery','Buy 2 permanent Star upgrades.',2,'masteryBought',{notes:300,gems:10,xp:200}],
  ['q20','🌌','Four-Island Symphony','Unlock all 4 islands.',4,'islands',{stars:4,gems:20,notes:500,xp:350}]
].map(q=>({id:q[0],icon:q[1],name:q[2],desc:q[3],target:q[4],kind:q[5],reward:q[6]}));

const RUSH_MODES={
  easy:{name:'Easy',island:'groove',rushIsland:'Coinflower Cay',icon:'🌿',tag:'RELAXED RUSH',rounds:20,options:4,startMs:1800,endMs:800,hitCoins:125,finishCoins:1500,unlock:'groove',desc:'Wide reaction windows, four monsters at a time, and a friendly warm-up song.'},
  medium:{name:'Medium',island:'frost',rushIsland:'Frostcoin Fjord',icon:'❄️',tag:'QUICK CHORUS',rounds:24,options:5,startMs:1450,endMs:650,hitCoins:220,finishCoins:2600,unlock:'frost',desc:'Faster targets, five choices, icy percussion, and much stronger payouts.'},
  hard:{name:'Hard',island:'ember',rushIsland:'Jackpot Circuit',icon:'⚡',tag:'VOLTAGE RUSH',rounds:28,options:6,startMs:1100,endMs:500,hitCoins:360,finishCoins:4600,unlock:'ember',desc:'Rapid-fire monster calls across a hot electric island. Misses start to hurt.'},
  extreme:{name:'Extreme',island:'moon',rushIsland:'Starlight Panic',icon:'🌙',tag:'FINAL RUSH',rounds:32,options:8,startMs:850,endMs:350,hitCoins:580,finishCoins:8000,unlock:'moon',desc:'Tiny reaction windows, eight choices, heavenly rush music, and enormous coin jackpots.'}
};


function freshState(){
  return {
    version:VERSION,coins:2600,gems:18,notes:0,stars:0,starsEarned:0,xp:0,level:1,
    currentIsland:'groove',unlocked:['groove'],owned:[],
    placed:{groove:[],frost:[],ember:[],moon:[]},breedJobs:{groove:null,frost:null,ember:null,moon:null},
    decorBoost:{groove:0,frost:0,ember:0,moon:0},
    songBoostUntil:{groove:0,frost:0,ember:0,moon:0},
    mastery:{groove:{amp:0,luck:0,stage:0},frost:{amp:0,luck:0,stage:0},ember:{amp:0,luck:0,stage:0},moon:{amp:0,luck:0,stage:0}},
    questClaimed:{},rotationId:currentRotation(),rotationClaimed:{},rotationBaseline:null,
    coinRush:{runs:[],best:{easy:0,medium:0,hard:0,extreme:0},totalEarned:0},
    stats:{collectedCoins:0,breedCount:0,decorBought:0,songsPlayed:0,instantBreeds:0,notesSpent:0,starsSpent:0,gemsSpent:0,monstersBought:0,masteryBought:0,hatched:0,activePlayMs:0,coinRushRuns:0,coinRushCoins:0},
    collectionMilestones:0,lastSeen:now(),dailyStamp:'',settings:{music:true,sfx:true,reduceEffects:false}
  };
}

const DEMO=window.__MELODIC_DEMO__||null;
let demoMode=new URLSearchParams(location.search).get('demo')==='1'||!!DEMO;
let state=load();
let audio=null,masterGain=null,musicBus=null,sfxBus=null,songTimer=null,songStep=0,selectedBreed=[],collectionVariant='All',lastActiveTick=now(),rushGame=null;

function migrate(raw){
  const base=freshState();
  const s={...base,...raw};
  s.version=VERSION;
  s.stars=Number(raw.stars||0);s.starsEarned=Number(raw.starsEarned||raw.stars||0);
  s.placed={...base.placed,...(raw.placed||{})};
  s.breedJobs={...base.breedJobs,...(raw.breedJobs||{})};
  s.decorBoost={...base.decorBoost,...(raw.decorBoost||{})};
  s.songBoostUntil={...base.songBoostUntil,...(raw.songBoostUntil||{})};
  s.mastery={...base.mastery,...(raw.mastery||{})};
  Object.keys(ISLANDS).forEach(k=>s.mastery[k]={amp:0,luck:0,stage:0,...(s.mastery[k]||{})});
  s.stats={...base.stats,...(raw.stats||{})};
  s.settings={...base.settings,...(raw.settings||{})};
  s.coinRush={...base.coinRush,...(raw.coinRush||{})};s.coinRush.runs=Array.isArray(s.coinRush.runs)?s.coinRush.runs.filter(x=>Number.isFinite(Number(x))).map(Number):[];s.coinRush.best={...base.coinRush.best,...(s.coinRush.best||{})};
  s.unlocked=[...new Set((raw.unlocked||['groove']).filter(k=>ISLANDS[k]))]; if(!s.unlocked.includes('groove'))s.unlocked.unshift('groove');
  s.currentIsland=ISLANDS[raw.currentIsland]?raw.currentIsland:'groove';
  s.owned=(raw.owned||[]).filter(o=>M[o.id]).map(o=>({uid:o.uid||uid(),id:o.id,variant:VARIANTS[o.variant]?o.variant:'Common',level:o.level||1,lastCollected:o.lastCollected||now()}));
  const valid=new Set(s.owned.map(o=>o.uid)); Object.keys(s.placed).forEach(k=>s.placed[k]=s.placed[k].filter(x=>valid.has(x)));
  ensureRotationState(s);
  return s;
}
function load(){
  if(demoMode)return demoState();
  try{
    const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem(OLD_SAVE_KEY);
    if(!raw)return freshState();
    const s=migrate(JSON.parse(raw));
    localStorage.setItem(SAVE_KEY,JSON.stringify(s));
    return s;
  }catch(e){console.warn('Save load failed',e);return freshState();}
}
function save(){if(demoMode)return;state.lastSeen=now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function demoState(){
  const s=freshState();s.coins=392450;s.gems=118;s.notes=1860;s.stars=23;s.starsEarned=31;s.level=18;s.xp=620;s.unlocked=Object.keys(ISLANDS);
  const vars=['Common','Rare','Epic','Legendary'];
  Object.keys(ISLANDS).forEach((isl,ix)=>{
    MONSTERS.filter(m=>m.island===isl).forEach((m,i)=>{
      if(i<8 || m.special){const o={uid:uid(),id:m.id,variant:vars[(i+ix)%4],level:1,lastCollected:now()-((i%5)+1)*580000};s.owned.push(o);s.placed[isl].push(o.uid);}
    });
    s.decorBoost[isl]=2+ix;s.mastery[isl]={amp:Math.min(3,ix+1),luck:Math.min(3,ix),stage:ix>1?1:0};
  });
  s.stats={...s.stats,collectedCoins:98000,breedCount:18,decorBought:9,songsPlayed:14,instantBreeds:3,notesSpent:740,starsSpent:11,gemsSpent:14,monstersBought:25,masteryBought:5,hatched:16,activePlayMs:76*60000,coinRushRuns:7,coinRushCoins:58400};
  s.coinRush={runs:[now()-52*60000,now()-36*60000],best:{easy:4800,medium:7920,hard:13840,extreme:22600},totalEarned:58400};
  s.breedJobs.groove={startedAt:now()-60000,endsAt:now()+4*60000,monsterId:'spriggle',variant:'Legendary'};
  s.rotationBaseline={...s.stats};s.rotationBaseline.collectedCoins-=4200;s.rotationBaseline.songsPlayed-=3;s.rotationBaseline.breedCount-=2;s.rotationBaseline.hatched-=2;s.rotationBaseline.monstersBought-=1;s.rotationBaseline.decorBought-=1;s.rotationBaseline.notesSpent-=180;s.rotationBaseline.activePlayMs-=67*60000;
  return s;
}
function ensureRotationState(s=state){
  const rid=currentRotation();
  if(s.rotationId!==rid||!s.rotationBaseline){s.rotationId=rid;s.rotationClaimed={};s.rotationBaseline={...s.stats};}
}

function levelNeed(l=state.level){return 100+(l-1)*110;}
function gainXP(n){state.xp+=n;while(state.xp>=levelNeed()){state.xp-=levelNeed();state.level++;state.coins+=500*state.level;if(state.level%3===0)state.gems+=2;toast(`Level ${state.level}! Bonus coins added 🎉`);sfx('level');}}
function grantStars(n){state.stars+=n;state.starsEarned+=n;}
function addReward(r={}){if(r.coins)state.coins+=r.coins;if(r.gems)state.gems+=r.gems;if(r.notes)state.notes+=r.notes;if(r.stars)grantStars(r.stars);if(r.xp)gainXP(r.xp);}

function trackActivePlayTime(){
  const t=now(),delta=t-lastActiveTick;lastActiveTick=t;
  if(!document.hidden&&delta>0&&delta<5000)state.stats.activePlayMs=(state.stats.activePlayMs||0)+delta;
}
function init(){
  ensureRotationState();lastActiveTick=now();buildParticles();bindStatic();grantDaily();checkFinishedJobs(false);awardCollectionMilestones(false);renderAll();
  setInterval(()=>{ensureRotationState();trackActivePlayTime();updateTimers();renderTop();if(!$('#modalLayer').classList.contains('hidden')&&$('#modalTitle').textContent==='Quests')renderQuests();},1000);
  window.addEventListener('beforeunload',()=>{trackActivePlayTime();save();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){trackActivePlayTime();save();}else{lastActiveTick=now();ensureRotationState();checkFinishedJobs(true);renderAll();}});
  const p=new URLSearchParams(location.search),screen=(DEMO&&DEMO.screen)||p.get('screen'),island=(DEMO&&DEMO.island)||p.get('island');
  if(demoMode){if(island&&ISLANDS[island])state.currentIsland=island;renderAll();if(screen&&['market','breed','collection','quests','settings','map','mastery','coinrush'].includes(screen))setTimeout(()=>openModal(screen),100);}
}
function bindStatic(){
  $('#closeModalBtn').addEventListener('click',closeModal);$('#modalLayer').addEventListener('click',e=>{if(e.target.id==='modalLayer')closeModal();});
  $('#settingsBtn').addEventListener('click',()=>openModal('settings'));$('#collectAllBtn').addEventListener('click',collectAll);$('#performanceBtn').addEventListener('click',toggleSong);
  $$('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>b.dataset.nav==='island'?closeModal():openModal(b.dataset.nav)));
  document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)openModal(b.dataset.open);});
  $$('.resource-pill').forEach(b=>b.addEventListener('click',()=>openCurrencyHelp(b.dataset.currency)));
}

function renderAll(){renderTop();renderTabs();renderIsland();save();}
function renderTop(){
  $('#coinsValue').textContent=fmt(state.coins);$('#gemsValue').textContent=fmt(state.gems);$('#notesValue').textContent=fmt(state.notes);$('#starsValue').textContent=fmt(state.stars);
  $('#levelBadge').textContent=state.level;const need=levelNeed();$('#xpFill').style.width=`${clamp(state.xp/need*100,0,100)}%`;$('#xpText').textContent=`${fmt(state.xp)} / ${fmt(need)} XP`;
}
function renderTabs(){
  const root=$('#islandTabs');root.innerHTML='';Object.entries(ISLANDS).forEach(([k,is])=>{const unlocked=state.unlocked.includes(k),b=document.createElement('button');b.className=`island-tab${state.currentIsland===k?' active':''}${!unlocked?' locked':''}`;b.textContent=`${is.icon} ${is.name}${unlocked?'':` · Lv ${is.unlockLevel}`}`;b.addEventListener('click',()=>unlocked?switchIsland(k):unlockPrompt(k));root.appendChild(b);});
}
function switchIsland(k){state.currentIsland=k;selectedBreed=[];stopSong();renderAll();}
function unlockPrompt(k){
  const is=ISLANDS[k];if(state.level<is.unlockLevel){toast(`${is.name} unlocks at level ${is.unlockLevel}.`);return;}if(state.starsEarned<is.lifeStars){toast(`Earn ${is.lifeStars} lifetime Stars first. You have ${state.starsEarned}.`);return;}if(state.coins<is.unlockCost){toast(`You need ${fmt(is.unlockCost)} coins.`);return;}
  if(confirm(`Unlock ${is.name} for ${fmt(is.unlockCost)} coins?`)){state.coins-=is.unlockCost;state.unlocked.push(k);gainXP(100);sfx('unlock');toast(`${is.name} unlocked! ${is.icon}`);renderAll();}
}
function renderIsland(){
  const is=ISLANDS[state.currentIsland],stage=$('#stage');stage.dataset.theme=is.theme;$('#islandName').textContent=is.name;$('#islandType').textContent=is.type;$('#islandDesc').textContent=is.desc;
  const amp=state.mastery[state.currentIsland].amp||0,luck=state.mastery[state.currentIsland].luck||0,stageLv=state.mastery[state.currentIsland].stage||0,boost=state.songBoostUntil[state.currentIsland]>now();
  $('#islandStats').innerHTML=`<span class="stat-chip">⭐ Mastery ${amp+luck+stageLv}/9</span><span class="stat-chip">🎵 ${boost?'Harmony Boost ACTIVE':'Harmony Boost ready'}</span><button class="stat-chip" data-open="mastery">Upgrade island</button>`;
  const field=$('#monsterField');field.innerHTML='';const ids=state.placed[state.currentIsland]||[];$('#emptyIsland').classList.toggle('hidden',ids.length>0);field.classList.toggle('hidden',ids.length===0);
  const positions=getPositions(ids.length);ids.forEach((id,i)=>{const o=state.owned.find(x=>x.uid===id);if(!o)return;const m=M[o.id],bank=monsterBank(o),u=document.createElement('div');u.className='monster-unit';u.style.left=positions[i].x+'%';u.style.top=positions[i].y+'%';u.innerHTML=`<button aria-label="${m.name}, ${o.variant}"><div class="monster-avatar">${monsterSVG(m,o.variant)}</div><span class="monster-name"><i class="variant-dot ${o.variant}"></i>${m.name}</span>${bank>=1?`<span class="coin-bubble">🪙 ${fmt(bank)}</span>`:''}</button>`;u.querySelector('button').addEventListener('click',e=>collectMonster(o,e));field.appendChild(u);});
  $('#decorStrip').innerHTML=is.decor.map((d,i)=>`<span class="decor-item" style="transform:translateY(${i%2?6:0}px)">${d}</span>`).join('');updateTimers();
}
function getPositions(n){const out=[];if(n<=0)return out;const rows=n<=5?[n]:n<=10?[5,n-5]:[4,4,n-8];let y=[34,59,78],idx=0;rows.forEach((count,r)=>{for(let j=0;j<count;j++){out.push({x:10+(j+1)*(80/(count+1)),y:y[r]});idx++;}});return out;}
function islandMultiplier(isl){const amp=state.mastery[isl]?.amp||0,decor=state.decorBoost[isl]||0,song=state.songBoostUntil[isl]>now()?1.5:1;return (1+decor*.05+amp*.15)*song;}
function monsterBank(o){const m=M[o.id];if(!m)return 0;const hours=clamp((now()-(o.lastCollected||now()))/3600000,0,12);return Math.floor(m.rate*VARIANTS[o.variant].mult*hours*islandMultiplier(m.island));}
function collectMonster(o,e){const bank=monsterBank(o);if(bank<1){sfx('tap');return;}state.coins+=bank;state.stats.collectedCoins+=bank;o.lastCollected=now();gainXP(Math.max(1,Math.floor(bank/140)));spark(e.clientX||innerWidth/2,e.clientY||innerHeight/2,'🪙');sfx('coin');renderTop();renderIsland();save();}
function collectAll(){let total=0;state.placed[state.currentIsland].forEach(id=>{const o=state.owned.find(x=>x.uid===id);if(!o)return;const b=monsterBank(o);total+=b;if(b>0)o.lastCollected=now();});if(total<1){toast('No coins ready yet.');return;}state.coins+=total;state.stats.collectedCoins+=total;gainXP(Math.max(1,Math.floor(total/120)));toast(`Collected ${fmt(total)} coins! 🪙`);sfx('coin');renderAll();}

function openModal(type){
  if(rushGame&&rushGame.active&&type!=='coinrush')endCoinRush(false,true);
  stopSong();$('#modalLayer').classList.remove('hidden');$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===type));
  const titles={market:['MONSTER MARKET','Market'],breed:['HARMONY HATCH','Breeding'],collection:['MONSTER BOOK','Collection'],quests:['GOALS','Quests'],coinrush:['COIN RUSH','Coin Rush'],settings:['OPTIONS','Settings'],map:['WORLD','Island Map'],mastery:['STAR WORKSHOP','Island Mastery']};const [eye,title]=titles[type]||['MELODIC ISLES','Menu'];$('#modalEyebrow').textContent=eye;$('#modalTitle').textContent=title;
  ({market:renderMarket,breed:renderBreed,collection:renderCollection,quests:renderQuests,coinrush:renderCoinRush,settings:renderSettings,map:renderMap,mastery:renderMastery}[type]||renderMarket)();
}
function closeModal(){if(rushGame&&rushGame.active)endCoinRush(false,true);$('#modalLayer').classList.add('hidden');$$('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav==='island'));}
function openCurrencyHelp(kind){openModal('market');setTimeout(()=>{const el=document.querySelector(`[data-tool="${kind}"]`);el?.scrollIntoView({behavior:'smooth',block:'center'});},50);}

function renderMarket(){
  const isl=state.currentIsland,root=$('#modalContent');root.innerHTML=`
  <div class="currency-help">
    <div data-tool="gems"><b>💎 Gems</b>Instant-finish breeding or reroll an egg rarity.</div>
    <div data-tool="notes"><b>🎵 Music Notes</b>Buy a 20-minute Harmony Boost and awaken Island Titans.</div>
    <div data-tool="stars"><b>⭐ Stars</b>Permanent island mastery upgrades and Titan awakening.</div>
  </div>
  <div class="market-tools">
    <article class="tool-card"><h3>🎵 Harmony Boost</h3><p>+50% monster income on ${ISLANDS[isl].name} for 20 minutes. Timer continues offline.</p><button class="primary-btn" id="noteBoostBtn">Activate · 🎵 120</button></article>
    <article class="tool-card"><h3>🌼 Decoration</h3><p>Permanent +5% income on this island. Stackable up to 10 times.</p><button class="secondary-btn" id="decorBuyBtn">Buy · 🪙 1,250</button></article>
    <article class="tool-card"><h3>⭐ Island Mastery</h3><p>Spend Stars on permanent income, breeding luck, and performance upgrades.</p><button class="secondary-btn" data-open="mastery">Open Mastery</button></article>
  </div>
  <div class="collection-top"><div><b>${ISLANDS[isl].icon} ${ISLANDS[isl].name}</b><div class="mini">10 regular monsters + 1 Island Titan. Everything is earnable in-game.</div></div></div><div class="card-grid" id="marketGrid"></div>`;
  $('#noteBoostBtn').addEventListener('click',buySongBoost);$('#decorBuyBtn').addEventListener('click',buyDecor);const grid=$('#marketGrid');
  MONSTERS.filter(m=>m.island===isl).forEach(m=>{const card=document.createElement('article');card.className=`monster-card${m.special?' special-card':''}`;const owned=state.owned.filter(o=>o.id===m.id).length;card.innerHTML=`<div class="card-art">${monsterSVG(m,m.special?'Legendary':'Common')}</div><h3>${m.name}</h3>${m.special?'<span class="special-ribbon">⚙️ ISLAND TITAN</span>':''}<p>${m.desc}</p><div class="card-meta"><span class="tag">${m.element}</span><span class="tag">🎼 ${m.instrument}</span><span class="tag">⏱ ${m.wait}m</span></div><div class="mini">${fmt(m.rate)} coins/hour · Owned ${owned}</div><div class="price-row"><div class="price-stack"><b>🪙 ${fmt(m.price)}</b>${m.special?`<span>🎵 ${fmt(m.notes)} · ⭐ ${m.stars}</span>`:''}</div><button class="primary-btn">${m.special?'Awaken':'Buy'}</button></div>`;card.querySelector('button').addEventListener('click',()=>buyMonster(m));grid.appendChild(card);});
}
function buySongBoost(){if(state.notes<120){toast('You need 120 Music Notes.');return;}state.notes-=120;state.stats.notesSpent+=120;state.songBoostUntil[state.currentIsland]=Math.max(now(),state.songBoostUntil[state.currentIsland]||0)+20*60000;sfx('quest');toast('Harmony Boost active for 20 minutes! 🎵');renderTop();renderMarket();renderIsland();save();}
function buyDecor(){if((state.decorBoost[state.currentIsland]||0)>=10){toast('This island already has the maximum 10 decoration boosts.');return;}if(state.coins<1250){toast('You need 1,250 coins.');return;}state.coins-=1250;state.decorBoost[state.currentIsland]++;state.stats.decorBought++;gainXP(12);sfx('buy');toast('Decoration placed! +5% island income.');renderTop();renderIsland();save();}
function buyMonster(m){
  if(m.special){if(state.coins<m.price||state.notes<m.notes||state.stars<m.stars){toast(`Titan requires 🪙 ${fmt(m.price)} + 🎵 ${m.notes} + ⭐ ${m.stars}.`);return;}state.coins-=m.price;state.notes-=m.notes;state.stars-=m.stars;state.stats.notesSpent+=m.notes;state.stats.starsSpent+=m.stars;const variant=rollVariant(true,m.island);addOwned(m.id,variant);toast(`${variant} ${m.name} awakened!`);sfx('titan');}
  else{if(state.coins<m.price){toast('Not enough coins yet.');return;}state.coins-=m.price;state.stats.monstersBought++;addOwned(m.id,'Common');toast(`${m.name} joined ${ISLANDS[m.island].name}!`);sfx('hatch');}
  gainXP(20+Math.floor(m.price/2000));awardCollectionMilestones();renderTop();renderMarket();renderIsland();save();
}
function addOwned(id,variant){const m=M[id],o={uid:uid(),id,variant,level:1,lastCollected:now()};state.owned.push(o);state.placed[m.island].push(o.uid);return o;}

function eligibleBreeders(){return state.owned.filter(o=>M[o.id]?.island===state.currentIsland&&!M[o.id].special);}
function renderBreed(){
  const root=$('#modalContent'),job=state.breedJobs[state.currentIsland],candidates=eligibleBreeders();if(job){root.innerHTML=renderBreedJob(job);bindBreedJobButtons(job);return;}
  const luck=state.mastery[state.currentIsland].luck||0;root.innerHTML=`<p class="mini">Pick two regular monsters. Timers use real timestamps and keep moving while offline. The absolute maximum is <b>90 minutes</b>.</p><div class="mastery-banner"><div><strong>⭐ Breeding Luck ${luck}/3</strong><p>Each Luck level shifts a little probability from Common into Rare/Epic/Legendary.</p></div><button class="secondary-btn" data-open="mastery">Upgrade</button></div><div class="rarity-odds">${rarityOdds(luck).map(([v,p])=>`<span>${v}<br>${p}%</span>`).join('')}</div><div class="select-row"><div class="select-box" id="breedSlotA">Choose monster 1</div><div class="select-plus">+</div><div class="select-box" id="breedSlotB">Choose monster 2</div></div><h3>Available monsters</h3><div class="card-grid" id="breedChoices"></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="primary-btn" id="startBreedBtn">💞 Start breeding</button></div>`;
  updateBreedSlots();const grid=$('#breedChoices');candidates.forEach(o=>{const m=M[o.id],c=document.createElement('article');c.className='monster-card';c.innerHTML=`<div class="card-art">${monsterSVG(m,o.variant)}</div><h3>${m.name}</h3><div class="card-meta"><span class="tag ${o.variant.toLowerCase()}">${o.variant}</span><span class="tag">${m.element}</span></div><button class="secondary-btn" style="width:100%">Select</button>`;c.querySelector('button').addEventListener('click',()=>selectBreeder(o.uid));grid.appendChild(c);});$('#startBreedBtn').addEventListener('click',startBreed);
}
function selectBreeder(id){if(selectedBreed.includes(id))selectedBreed=selectedBreed.filter(x=>x!==id);else if(selectedBreed.length<2)selectedBreed.push(id);else selectedBreed=[selectedBreed[1],id];updateBreedSlots();sfx('tap');}
function updateBreedSlots(){['A','B'].forEach((s,i)=>{const box=$('#breedSlot'+s);if(!box)return;const o=state.owned.find(x=>x.uid===selectedBreed[i]);if(!o){box.innerHTML=`<span>Choose monster ${i+1}</span>`;return;}const m=M[o.id];box.innerHTML=`<div style="width:96px">${monsterSVG(m,o.variant)}</div><b>${m.name}</b><span class="tag ${o.variant.toLowerCase()}">${o.variant}</span>`;});}
function rarityOdds(luck=0){const rare=20+luck*2,epic=8+luck*1.2,leg=2+luck*.8,common=100-rare-epic-leg;return [['Common',common.toFixed(1)],['Rare',rare.toFixed(1)],['Epic',epic.toFixed(1)],['Legendary',leg.toFixed(1)]];}
function rollVariant(titan=false,isl=state.currentIsland){const luck=state.mastery[isl]?.luck||0;let leg=.02+luck*.008,epic=.08+luck*.012,rare=.20+luck*.02;if(titan){leg+=.01;epic+=.03;rare+=.05;}const r=Math.random();if(r<leg)return'Legendary';if(r<leg+epic)return'Epic';if(r<leg+epic+rare)return'Rare';return'Common';}
function startBreed(){if(selectedBreed.length<2){toast('Choose two monsters first.');return;}const a=state.owned.find(o=>o.uid===selectedBreed[0]),b=state.owned.find(o=>o.uid===selectedBreed[1]);if(!a||!b)return;const pool=MONSTERS.filter(m=>m.island===state.currentIsland&&!m.special);let result=pool[Math.floor(Math.random()*pool.length)];if(a.id===b.id&&Math.random()<.64)result=M[a.id];const wait=Math.min(90,Math.max(5,Math.round((M[a.id].wait+M[b.id].wait+result.wait)/3)));state.breedJobs[state.currentIsland]={startedAt:now(),endsAt:now()+wait*60000,monsterId:result.id,variant:rollVariant(false,state.currentIsland)};selectedBreed=[];sfx('breed');toast(`Egg started! ${wait} minute timer.`);save();renderBreed();renderIsland();}
function renderBreedJob(job){const m=M[job.monsterId],left=Math.max(0,job.endsAt-now()),total=Math.max(1,job.endsAt-job.startedAt),pct=clamp((1-left/total)*100,0,100),gemCost=Math.max(1,Math.ceil(left/600000));return `<div class="breed-card" style="text-align:center"><div style="width:180px;margin:auto">${monsterSVG(m,job.variant)}</div><span class="job-variant ${job.variant.toLowerCase()}">${job.variant}${job.variant==='Legendary'?' ✨':''}</span><h2>${left<=0?'Egg ready!':'Harmony forming…'}</h2><p>${left<=0?`${m.name} is ready to hatch.`:'Come back whenever you want — this keeps counting down while offline.'}</p><div class="progress-track" style="margin:16px 0"><div class="progress-fill" style="width:${pct}%"></div></div><b style="font-size:24px">${left<=0?'READY':formatTime(left)}</b><div class="breed-actions"><button class="primary-btn" id="claimBreedBtn" ${left>0?'disabled':''}>🥚 Hatch monster</button>${left>0?`<button class="instant-btn primary-btn" id="instantBreedBtn">💎 Finish now · ${gemCost}</button>`:''}<button class="reroll-btn primary-btn" id="rerollBreedBtn">💎 Reroll rarity · 4</button></div></div>`;}
function bindBreedJobButtons(job){$('#claimBreedBtn')?.addEventListener('click',claimBreed);$('#instantBreedBtn')?.addEventListener('click',()=>instantBreed(job));$('#rerollBreedBtn')?.addEventListener('click',rerollBreed);}
function instantBreed(job){const left=Math.max(0,job.endsAt-now()),cost=Math.max(1,Math.ceil(left/600000));if(state.gems<cost){toast(`You need ${cost} Gems.`);return;}state.gems-=cost;state.stats.gemsSpent+=cost;state.stats.instantBreeds++;job.endsAt=now();sfx('gem');toast(`Breeding finished instantly for ${cost} Gems!`);renderTop();renderBreed();renderIsland();save();}
function rerollBreed(){const job=state.breedJobs[state.currentIsland];if(!job)return;if(state.gems<4){toast('You need 4 Gems.');return;}state.gems-=4;state.stats.gemsSpent+=4;const old=job.variant;job.variant=rollVariant(false,state.currentIsland);sfx('gem');toast(`Rarity rerolled: ${old} → ${job.variant}`);renderTop();renderBreed();save();}
function claimBreed(){const job=state.breedJobs[state.currentIsland];if(!job||job.endsAt>now())return;addOwned(job.monsterId,job.variant);state.breedJobs[state.currentIsland]=null;state.stats.breedCount++;state.stats.hatched++;gainXP(60);sfx('hatch');toast(`${M[job.monsterId].name} hatched as ${job.variant}!`);awardCollectionMilestones();save();renderBreed();renderAll();}
function updateTimers(){const job=state.breedJobs[state.currentIsland],bar=$('#timerBanner');if(!job){bar.classList.add('hidden');return;}bar.classList.remove('hidden');const left=job.endsAt-now();bar.innerHTML=left<=0?`🥚 <b>${M[job.monsterId].name}</b> is ready! <button class="primary-btn" id="bannerClaim" style="margin-left:8px;padding:7px 11px;min-height:34px">Hatch</button>`:`💞 Breeding: <b>${formatTime(left)}</b> remaining`;$('#bannerClaim')?.addEventListener('click',()=>openModal('breed'));if(!$('#modalLayer').classList.contains('hidden')&&$('#modalTitle').textContent==='Breeding')renderBreed();}
function checkFinishedJobs(notify){Object.values(state.breedJobs).filter(Boolean).forEach(j=>{if(j.endsAt<=now()&&notify)toast(`${M[j.monsterId].name}'s egg is ready! 🥚`);});}
function formatTime(ms){const s=Math.ceil(Math.max(0,ms)/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h?`${h}h ${m}m ${sec}s`:`${m}m ${sec}s`;}

function collectionStats(){const species=new Set(state.owned.map(o=>o.id)).size;const slots=new Set(state.owned.map(o=>`${o.id}|${o.variant}`)).size;const c={species,slots};Object.keys(VARIANTS).forEach(v=>c[v.toLowerCase()]=state.owned.filter(o=>o.variant===v).length);c.titans=state.owned.filter(o=>M[o.id]?.special).length;return c;}
function awardCollectionMilestones(notify=true){const slots=collectionStats().slots,target=Math.floor(slots/10);while(state.collectionMilestones<target){state.collectionMilestones++;grantStars(1);if(notify)toast(`Collection milestone! ${state.collectionMilestones*10} rarity slots discovered → ⭐ +1`);}}
function renderCollection(){
  const root=$('#modalContent'),stats=collectionStats();root.innerHTML=`<div class="collection-top"><div><b>${stats.species} / 44 species · ${stats.slots} / 176 rarity slots</b><div class="mini">Every monster has Common, Rare, Epic and Legendary forms.</div></div><div class="collection-tabs">${['All','Common','Rare','Epic','Legendary'].map(v=>`<button data-v="${v}" class="${collectionVariant===v?'active':''}">${v}</button>`).join('')}</div></div><div class="card-grid" id="collectionGrid"></div>`;$$('.collection-tabs button',root).forEach(b=>b.addEventListener('click',()=>{collectionVariant=b.dataset.v;renderCollection();}));const grid=$('#collectionGrid');
  MONSTERS.forEach(m=>{const owned=state.owned.filter(o=>o.id===m.id),speciesOwned=owned.length>0;if(collectionVariant!=='All'&&!owned.some(o=>o.variant===collectionVariant))return;const display=collectionVariant!=='All'?collectionVariant:(owned.find(o=>o.variant==='Legendary')?.variant||owned[0]?.variant||'Common'),c=document.createElement('article');c.className=`monster-card collection-card${!speciesOwned?' locked':''}${m.special?' special-card':''}`;c.innerHTML=`<div class="card-art">${monsterSVG(m,display)}</div><div class="collection-island">${ISLANDS[m.island].icon} ${ISLANDS[m.island].name}</div><h3>${speciesOwned?m.name:'???'}</h3>${m.special?'<span class="special-ribbon">⚙️ ISLAND TITAN</span>':''}<p>${speciesOwned?m.desc:'Discover this monster to reveal its entry.'}</p><div class="variant-row">${Object.keys(VARIANTS).map(v=>`<span class="variant-chip ${owned.some(o=>o.variant===v)?'owned':''}">${v}</span>`).join('')}</div>`;grid.appendChild(c);});
}

function questProgress(q){const c=collectionStats(),s=state.stats;switch(q.kind){case'placed':return Math.max(...Object.values(state.placed).map(a=>a.length));case'owned':return state.owned.length;case'collectedCoins':return s.collectedCoins;case'breedCount':return s.breedCount;case'islands':return state.unlocked.length;case'decorBought':return s.decorBought;case'songsPlayed':return s.songsPlayed;case'instantBreeds':return s.instantBreeds;case'rareOwned':return c.rare;case'epicOwned':return c.epic;case'legendaryOwned':return c.legendary;case'species':return c.species;case'variantSlots':return c.slots;case'frostPlaced':return state.placed.frost.length;case'emberPlaced':return state.placed.ember.length;case'moonUnlocked':return state.unlocked.includes('moon')?1:0;case'titanOwned':return c.titans;case'notesSpent':return s.notesSpent;case'masteryBought':return s.masteryBought;default:return 0;}}
function rotatingQuests(){
  const rid=state.rotationId,level=state.level;
  const coinA=1800+level*220,coinB=5200+level*420;
  return [
    {id:`r${rid}01`,icon:'🪙',name:'Four-Hour Coin Run',desc:`Collect ${fmt(coinA)} monster coins during this rotation.`,target:coinA,kind:'deltaCoins',reward:{notes:80+level*2,gems:3,xp:60}},
    {id:`r${rid}02`,icon:'🎶',name:'Encore Session',desc:'Play 2 complete island performances.',target:2,kind:'deltaSongs',reward:{notes:100,gems:3,xp:70}},
    {id:`r${rid}03`,icon:'💞',name:'Breeding Session',desc:'Complete 1 breeding during this rotation.',target:1,kind:'deltaBreed',reward:{gems:5,coins:1800+level*120,xp:80}},
    {id:`r${rid}04`,icon:'🥚',name:'Hatch Pair',desc:'Hatch 2 monsters during this rotation.',target:2,kind:'deltaHatched',reward:{gems:6,notes:90,xp:90}},
    {id:`r${rid}05`,icon:'🛒',name:'Market Pickup',desc:'Buy 1 monster from the Market.',target:1,kind:'deltaBought',reward:{coins:2200+level*140,notes:70,xp:65}},
    {id:`r${rid}06`,icon:'🌼',name:'Freshen the Stage',desc:'Buy 1 island decoration.',target:1,kind:'deltaDecor',reward:{gems:4,notes:75,xp:60}},
    {id:`r${rid}07`,icon:'💎',name:'Speed Breeder',desc:'Instant-finish 1 breeding with Gems.',target:1,kind:'deltaInstant',reward:{gems:8,stars:1,xp:95}},
    {id:`r${rid}08`,icon:'🎵',name:'Spend the Beat',desc:'Spend 120 Music Notes during this rotation.',target:120,kind:'deltaNotesSpent',reward:{gems:6,stars:1,coins:2600,xp:85}},
    {id:`r${rid}09`,icon:'💰',name:'Big Coin Sweep',desc:`Collect ${fmt(coinB)} monster coins during this rotation.`,target:coinB,kind:'deltaCoins',reward:{gems:9,stars:2,notes:140,xp:120}},
    {id:`r${rid}10`,icon:'⏱️',name:'Stay for the Chorus',desc:'Play for 15 minutes during this rotation.',target:15*60000,kind:'deltaPlay',unit:'time',reward:{gems:4,notes:100,xp:80}},
    {id:`r${rid}11`,icon:'🎧',name:'Half-Hour Headphones',desc:'Play for 30 minutes during this rotation.',target:30*60000,kind:'deltaPlay',unit:'time',reward:{gems:8,stars:2,notes:150,xp:120}},
    {id:`r${rid}12`,icon:'🌟',name:'Forty-Five Minute Jam',desc:'Play for 45 minutes during this rotation.',target:45*60000,kind:'deltaPlay',unit:'time',reward:{gems:14,stars:3,notes:220,xp:160}},
    {id:`r${rid}13`,icon:'☠️',name:'ONE HOUR GRIND',desc:'Play for 1 full hour during this 4-hour rotation.',target:60*60000,kind:'deltaPlay',unit:'time',reward:{gems:25,stars:5,notes:300,xp:250}},
    {id:`r${rid}14`,icon:'🔥',name:'Ninety-Minute Encore',desc:'Play for 1 hour 30 minutes during this rotation.',target:90*60000,kind:'deltaPlay',unit:'time',reward:{gems:55,stars:8,notes:450,xp:360}},
    {id:`r${rid}15`,icon:'💀',name:'TWO HOUR MONSTER MARATHON',desc:'Play for 2 HOURS during this 4-hour rotation.',target:120*60000,kind:'deltaPlay',unit:'time',reward:{gems:100,stars:12,notes:700,xp:600}}
  ];
}
function rotatingProgress(q){
  const b=state.rotationBaseline||state.stats,s=state.stats;
  if(q.kind==='deltaCoins')return s.collectedCoins-(b.collectedCoins||0);
  if(q.kind==='deltaSongs')return s.songsPlayed-(b.songsPlayed||0);
  if(q.kind==='deltaBreed')return s.breedCount-(b.breedCount||0);
  if(q.kind==='deltaHatched')return s.hatched-(b.hatched||0);
  if(q.kind==='deltaBought')return s.monstersBought-(b.monstersBought||0);
  if(q.kind==='deltaDecor')return s.decorBought-(b.decorBought||0);
  if(q.kind==='deltaInstant')return s.instantBreeds-(b.instantBreeds||0);
  if(q.kind==='deltaNotesSpent')return s.notesSpent-(b.notesSpent||0);
  if(q.kind==='deltaPlay')return (s.activePlayMs||0)-(b.activePlayMs||0);
  return 0;
}
function rotationEndsIn(){return ((state.rotationId+1)*FOUR_HOURS)-Date.now();}
function renderQuests(){
  ensureRotationState();const root=$('#modalContent');root.innerHTML=`<div class="quest-section-title"><div><h3>🔄 Four-Hour Quest Board <span class="quest-badge">15 ACTIVE</span></h3><div class="mini">All 15 reset together every 4 hours. The refresh clock keeps running while the game is closed; play-time quests only count while the game is actually open.</div></div><span class="refresh-clock">${formatTime(rotationEndsIn())}</span></div><div id="rotatingList"></div><div class="quest-section-title"><h3>🏆 Main Questbook <span class="quest-badge">20 QUESTS</span></h3><button class="secondary-btn" id="dailyBtn">🎁 Daily gift</button></div><div id="questList"></div>`;
  $('#dailyBtn').addEventListener('click',grantDailyManual);const rr=$('#rotatingList');rotatingQuests().forEach(q=>{const p=rotatingProgress(q),done=p>=q.target,claimed=!!state.rotationClaimed[q.id];rr.appendChild(questCard(q,p,done,claimed,true,()=>claimRotating(q)));});const list=$('#questList');QUESTS.forEach(q=>{const p=questProgress(q),done=p>=q.target,claimed=!!state.questClaimed[q.id];list.appendChild(questCard(q,p,done,claimed,false,()=>claimQuest(q)));});
}
function questCard(q,p,done,claimed,rot,fn){
  const c=document.createElement('article');c.className=`quest-card${done?' done':''}${rot?' refresh':''}`;
  const progressLabel=q.unit==='time'?`${formatQuestTime(Math.min(p,q.target))} / ${formatQuestTime(q.target)}`:`${fmt(Math.min(p,q.target))} / ${fmt(q.target)}`;
  c.innerHTML=`<div class="quest-icon">${q.icon}</div><div class="quest-copy"><h3>${q.name}${rot?'<span class="quest-badge">4H</span>':''}</h3><p>${q.desc}</p><div class="progress-track" style="margin-top:8px"><div class="progress-fill" style="width:${clamp(p/q.target*100,0,100)}%"></div></div><div class="mini">${progressLabel}</div><div class="reward-line">${rewardText(q.reward)}</div></div><button class="primary-btn" ${!done||claimed?'disabled':''}>${claimed?'Claimed':'Claim'}</button>`;c.querySelector('button').addEventListener('click',fn);return c;
}
function formatQuestTime(ms){const total=Math.floor(Math.max(0,ms)/1000),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),sec=total%60;return h?`${h}h ${m}m`:(m?`${m}m ${sec}s`:`${sec}s`);}
function rewardText(r){return ['coins','gems','notes','stars','xp'].filter(k=>r[k]).map(k=>`${k==='coins'?'🪙':k==='gems'?'💎':k==='notes'?'🎵':k==='stars'?'⭐':'XP'} ${fmt(r[k])}`).join(' · ');}
function claimQuest(q){if(state.questClaimed[q.id]||questProgress(q)<q.target)return;state.questClaimed[q.id]=true;addReward(q.reward);sfx('quest');toast(`Quest complete! ${rewardText(q.reward)}`);renderTop();renderQuests();save();}
function claimRotating(q){if(state.rotationClaimed[q.id]||rotatingProgress(q)<q.target)return;state.rotationClaimed[q.id]=true;state.stats.claimedRotating=(state.stats.claimedRotating||0)+1;addReward(q.reward);sfx('quest');toast(`Rotating quest complete! ${rewardText(q.reward)}`);renderTop();renderQuests();save();}
function grantDaily(){if(demoMode||state.dailyStamp===dayStamp())return;state.dailyStamp=dayStamp();state.coins+=700+state.level*100;state.gems+=2;state.notes+=35;if(new Date().getUTCDay()===0)grantStars(1);save();setTimeout(()=>toast('Daily gift claimed! 🎁'),350);}
function grantDailyManual(){if(state.dailyStamp===dayStamp()){toast('Today’s daily gift is already claimed.');return;}grantDaily();renderTop();renderQuests();}


function cleanRushRuns(){
  const cutoff=now()-ONE_HOUR;
  state.coinRush.runs=(state.coinRush.runs||[]).filter(t=>t>cutoff).sort((a,b)=>a-b);
}
function rushStatus(){
  cleanRushRuns();const used=state.coinRush.runs.length,remaining=Math.max(0,5-used),nextAt=used>=5?state.coinRush.runs[0]+ONE_HOUR:0;
  return {used,remaining,nextAt};
}
function rushResetText(){const st=rushStatus();if(st.remaining>0)return `${st.remaining} / 5 runs available this rolling hour`;return `Next run in ${formatTime(st.nextAt-now())}`;}
function renderCoinRush(){
  if(rushGame&&rushGame.active){renderRushRound();return;}
  const root=$('#modalContent'),st=rushStatus();
  root.innerHTML=`<section class="rush-hero"><div><span class="eyebrow">5 RUNS PER ROLLING HOUR</span><h3>🪙 Coin Rush</h3><p>Find the called monster before the beat expires. Every round gets faster. Correct taps build combo and speed bonuses; wrong taps cost score. Difficulty islands unlock with your matching main islands.</p></div><div class="rush-limit"><b>${st.remaining}/5</b><span>runs ready</span><small>${st.remaining? 'A run is consumed when you press Start.' : `Next run ${formatTime(st.nextAt-now())}`}</small></div></section><div class="rush-mode-grid" id="rushModes"></div><div class="rush-history"><b>🏦 Coin Rush lifetime earnings: 🪙 ${fmt(state.coinRush.totalEarned||0)}</b><span>${rushResetText()}</span></div>`;
  const grid=$('#rushModes');
  Object.entries(RUSH_MODES).forEach(([key,m])=>{
    const unlocked=state.unlocked.includes(m.unlock),best=state.coinRush.best?.[key]||0,c=document.createElement('article');c.className=`rush-mode-card rush-${m.island}${unlocked?'':' locked'}`;
    const low=Math.round((m.rounds*m.hitCoins*.95+m.finishCoins*.65)/100)*100,high=Math.round((m.rounds*m.hitCoins*1.8+m.finishCoins)/100)*100;
    c.innerHTML=`<div class="rush-island-preview"><span>${m.icon}</span><i>♪</i><i>🪙</i></div><span class="rush-mode-tag">${m.tag}</span><h3>${m.name} · ${m.rushIsland}</h3><p>${m.desc}</p><div class="rush-mode-stats"><span>🎯 ${m.rounds} targets</span><span>⚡ ${m.startMs/1000}s → ${m.endMs/1000}s</span><span>🪙 ~${fmt(low)}–${fmt(high)}</span></div><div class="rush-best">Best payout: 🪙 ${fmt(best)}</div><button class="primary-btn" ${!unlocked||st.remaining<=0?'disabled':''}>${!unlocked?`Unlock ${ISLANDS[m.unlock].name} first`:st.remaining<=0?'Hourly limit reached':`Start ${m.name}`}</button>`;
    c.querySelector('button').addEventListener('click',()=>startCoinRush(key));grid.appendChild(c);
  });
}
function startCoinRush(key){
  const mode=RUSH_MODES[key],st=rushStatus();if(!mode)return;if(!state.unlocked.includes(mode.unlock)){toast(`Unlock ${ISLANDS[mode.unlock].name} first.`);return;}if(st.remaining<=0){toast(`All 5 Coin Rush runs used. Next run in ${formatTime(st.nextAt-now())}.`);return;}
  state.coinRush.runs.push(now());state.stats.coinRushRuns=(state.stats.coinRushRuns||0)+1;save();
  rushGame={active:true,key,mode,round:0,hits:0,misses:0,combo:0,maxCombo:0,score:0,targetId:null,roundStarted:0,roundMs:mode.startMs,timeout:null,ticker:null,locked:false};
  ensureAudio()?.resume?.();sfx('rushstart');nextRushRound();
}
function nextRushRound(){
  if(!rushGame||!rushGame.active)return;clearRushTimers();const g=rushGame,m=g.mode;
  if(g.round>=m.rounds){endCoinRush(true,false);return;}
  g.round++;
  const t=(g.round-1)/Math.max(1,m.rounds-1);g.roundMs=Math.round(m.startMs+(m.endMs-m.startMs)*t);g.roundStarted=now();g.locked=false;
  const pool=MONSTERS.filter(x=>x.island===m.island&&!x.special),target=pool[Math.floor(Math.random()*pool.length)];g.targetId=target.id;
  renderRushRound();
  g.timeout=setTimeout(()=>rushTimeout(),g.roundMs);
  g.ticker=setInterval(updateRushClock,40);
}
function buildRushChoices(){
  const g=rushGame,pool=MONSTERS.filter(x=>x.island===g.mode.island&&!x.special),target=M[g.targetId];let picks=[target],others=pool.filter(x=>x.id!==target.id);
  while(picks.length<g.mode.options&&others.length){const i=Math.floor(Math.random()*others.length);picks.push(others.splice(i,1)[0]);}
  for(let i=picks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[picks[i],picks[j]]=[picks[j],picks[i]];}return picks;
}
function renderRushRound(){
  if(!rushGame||!rushGame.active){renderCoinRush();return;}const g=rushGame,m=g.mode,target=M[g.targetId],root=$('#modalContent'),choices=buildRushChoices();
  root.innerHTML=`<section class="rush-play rush-${m.island}"><div class="rush-hud"><div><span class="eyebrow">${m.icon} ${m.rushIsland} · ${m.name.toUpperCase()}</span><h3>CLICK: <strong>${target.name}</strong></h3></div><div class="rush-score"><span>🪙 ${fmt(g.score)}</span><span>🔥 ×${g.combo}</span></div></div><div class="rush-target"><div class="rush-target-art">${monsterSVG(target,'Common')}</div><div><b>${target.name}</b><small>Round ${g.round} / ${m.rounds}</small></div></div><div class="rush-clock"><div id="rushClockFill"></div></div><div class="rush-grid" id="rushGrid"></div><div class="rush-footer"><span>✅ ${g.hits} hits</span><span>❌ ${g.misses} misses</span><span>🏆 best combo ×${g.maxCombo}</span><button class="secondary-btn" id="rushQuit">Quit run</button></div></section>`;
  const grid=$('#rushGrid');choices.forEach(mon=>{const b=document.createElement('button');b.className='rush-monster';b.dataset.id=mon.id;b.setAttribute('aria-label',mon.name);b.innerHTML=`<div>${monsterSVG(mon,'Common')}</div><span>${mon.name}</span>`;b.addEventListener('click',()=>rushClick(mon.id,b));grid.appendChild(b);});
  $('#rushQuit').addEventListener('click',()=>{if(confirm('Quit this Coin Rush run? The run will still count toward the 5-per-hour limit.'))endCoinRush(false,false);});updateRushClock();rushBeat(m.island,g.round);
}
function updateRushClock(){
  if(!rushGame?.active)return;const fill=$('#rushClockFill');if(!fill)return;const left=Math.max(0,rushGame.roundMs-(now()-rushGame.roundStarted));fill.style.width=`${left/rushGame.roundMs*100}%`;fill.classList.toggle('danger',left<rushGame.roundMs*.28);
}
function rushClick(id,button){
  const g=rushGame;if(!g?.active||g.locked)return;if(id!==g.targetId){g.misses++;g.combo=0;g.score=Math.max(0,g.score-Math.round(g.mode.hitCoins*.35));button.classList.add('wrong');setTimeout(()=>button.classList.remove('wrong'),180);sfx('bad');return;}
  g.locked=true;clearRushTimers();const elapsed=now()-g.roundStarted,speed=clamp(1-elapsed/g.roundMs,0,1);g.hits++;g.combo++;g.maxCombo=Math.max(g.maxCombo,g.combo);
  const comboMult=1+Math.min(g.combo,12)*.05,speedMult=1+speed*.5,earned=Math.round(g.mode.hitCoins*comboMult*speedMult);g.score+=earned;button.classList.add('correct');sfx('rushhit');spark(button.getBoundingClientRect().left+button.offsetWidth/2,button.getBoundingClientRect().top+button.offsetHeight/2,'🪙');
  setTimeout(nextRushRound,170);
}
function rushTimeout(){
  const g=rushGame;if(!g?.active||g.locked)return;g.locked=true;clearRushTimers();g.misses++;g.combo=0;sfx('bad');toast(`Too slow! It was ${M[g.targetId].name}.`);setTimeout(nextRushRound,260);
}
function clearRushTimers(){if(!rushGame)return;if(rushGame.timeout){clearTimeout(rushGame.timeout);rushGame.timeout=null;}if(rushGame.ticker){clearInterval(rushGame.ticker);rushGame.ticker=null;}}
function endCoinRush(completed=false,silent=false){
  if(!rushGame)return;const g=rushGame;clearRushTimers();g.active=false;
  if(completed){const accuracy=g.hits/g.mode.rounds,completion=Math.round(g.mode.finishCoins*accuracy),reward=Math.max(0,g.score+completion);state.coins+=reward;state.stats.collectedCoins+=reward;state.stats.coinRushCoins=(state.stats.coinRushCoins||0)+reward;state.coinRush.totalEarned=(state.coinRush.totalEarned||0)+reward;state.coinRush.best[g.key]=Math.max(state.coinRush.best[g.key]||0,reward);gainXP(Math.max(20,Math.round(reward/180)));save();renderTop();sfx('rushwin');
    const root=$('#modalContent');if(root)root.innerHTML=`<section class="rush-results rush-${g.mode.island}"><div class="rush-result-icon">${g.mode.icon}🪙</div><span class="eyebrow">${g.mode.rushIsland}</span><h3>${g.mode.name} Rush complete!</h3><div class="rush-payout">+ 🪙 ${fmt(reward)}</div><p>${g.hits}/${g.mode.rounds} correct · ${g.misses} misses · best combo ×${g.maxCombo}</p><div class="rush-result-grid"><span>Tap score <b>${fmt(g.score)}</b></span><span>Finish bonus <b>${fmt(completion)}</b></span><span>Runs left <b>${rushStatus().remaining}/5</b></span></div><button class="primary-btn" id="rushAgain">Back to Coin Rush</button></section>`;$('#rushAgain')?.addEventListener('click',()=>{rushGame=null;renderCoinRush();});
  }else{rushGame=null;if(!silent){toast('Coin Rush run ended.');renderCoinRush();}}
}
function rushBeat(island,round){if(!state.settings.music)return;const roots={groove:220,frost:261.63,ember:185,moon:293.66},r=roots[island]||220;const step=round%4;tone(r*(step?1.5:1),.09,'triangle',.018,0,'music');if(island==='ember')tone(r*2.5,.05,'square',.010,.05,'music');if(island==='moon')tone(r*2,.16,'sine',.012,.04,'music');}

function renderMastery(){
  const isl=state.currentIsland,m=state.mastery[isl],root=$('#modalContent');const upgrades=[
    ['amp','🔊 Amplifier','+15% permanent monster income per level.',[3,5,8]],
    ['luck','🍀 Lucky Nest','Improves Rare, Epic and Legendary breeding odds.',[4,7,10]],
    ['stage','🎼 Grand Stage','Song performance rewards +25 Notes per level.',[4,6,9]]
  ];root.innerHTML=`<div class="mastery-banner"><div><strong>${ISLANDS[isl].icon} ${ISLANDS[isl].name}</strong><p>Spend Stars for permanent island upgrades. Stars come from quests and collection milestones.</p></div><span class="stat-chip">⭐ ${state.stars} available</span></div><div class="card-grid" id="masteryGrid"></div>`;const grid=$('#masteryGrid');upgrades.forEach(([key,name,desc,costs])=>{const lv=m[key]||0,cost=costs[lv]||null,c=document.createElement('article');c.className='monster-card star-amp';c.innerHTML=`<h3>${name}</h3><p>${desc}</p><div class="mini">Level ${lv} / 3</div><div class="progress-track" style="margin:10px 0"><div class="progress-fill" style="width:${lv/3*100}%"></div></div><button class="primary-btn" ${lv>=3?'disabled':''}>${lv>=3?'MAXED':`Upgrade · ⭐ ${cost}`}</button>`;c.querySelector('button').addEventListener('click',()=>buyMastery(key,cost));grid.appendChild(c);});
}
function buyMastery(key,cost){if(!cost)return;if(state.stars<cost){toast(`You need ${cost} Stars.`);return;}state.stars-=cost;state.stats.starsSpent+=cost;state.stats.masteryBought++;state.mastery[state.currentIsland][key]++;sfx('quest');toast('Permanent island mastery upgraded! ⭐');renderTop();renderMastery();renderIsland();save();}

function renderSettings(){
  const root=$('#modalContent'),encoded=encodeSave(state);root.innerHTML=`<div class="settings-grid"><article class="setting-card"><h3>🔊 Audio</h3><p>Music and effects are generated live with Web Audio. Variant rarities add their own sound layers.</p><label class="toggle-line">Music <input id="musicToggle" type="checkbox" ${state.settings.music?'checked':''}></label><label class="toggle-line">Sound effects <input id="sfxToggle" type="checkbox" ${state.settings.sfx?'checked':''}></label></article><article class="setting-card"><h3>✨ Effects</h3><p>Reduce particles if your phone or tablet needs lighter visuals.</p><label class="toggle-line">Reduce effects <input id="effectsToggle" type="checkbox" ${state.settings.reduceEffects?'checked':''}></label></article><article class="setting-card compat"><h3>💾 Export Save</h3><p>Encore save code. Your old v1 save codes are also accepted by Import.</p><textarea class="save-code" id="exportCode" readonly>${encoded}</textarea><button class="secondary-btn" id="selectSaveBtn">Select code</button></article><article class="setting-card compat"><h3>📥 Import Save</h3><p>Paste either your old Melodic Isles code or a new Encore code.</p><textarea class="save-code" id="importCode" placeholder="Paste save code here"></textarea><button class="primary-btn" id="importBtn">Import</button></article><article class="setting-card"><h3>🗺️ World</h3><p>View all four islands and unlock requirements.</p><button class="secondary-btn" id="mapBtn">Open Island Map</button></article><article class="setting-card"><h3>⚠️ Reset</h3><p>Deletes this browser’s Melodic Isles save and starts over.</p><button class="danger-btn" id="resetBtn">Reset save</button></article></div>`;
  $('#musicToggle').addEventListener('change',e=>{state.settings.music=e.target.checked;if(!e.target.checked)stopSong();save();});$('#sfxToggle').addEventListener('change',e=>{state.settings.sfx=e.target.checked;save();});$('#effectsToggle').addEventListener('change',e=>{state.settings.reduceEffects=e.target.checked;$('#skyParticles').classList.toggle('hidden',e.target.checked);save();});$('#selectSaveBtn').addEventListener('click',()=>$('#exportCode').select());$('#mapBtn').addEventListener('click',()=>openModal('map'));$('#importBtn').addEventListener('click',importSave);$('#resetBtn').addEventListener('click',()=>{if(confirm('Really reset all Melodic Isles progress on this browser?')){localStorage.removeItem(SAVE_KEY);localStorage.removeItem(OLD_SAVE_KEY);location.reload();}});
}
function encodeSave(s){return btoa(unescape(encodeURIComponent(JSON.stringify(s))));}
function decodeSave(code){return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));}
function importSave(){try{const raw=decodeSave($('#importCode').value);state=migrate(raw);save();toast(raw.version===1?'Old v1 save upgraded to Encore! 🎉':'Save imported! 🎉');closeModal();renderAll();}catch(e){toast('That save code could not be read.');sfx('bad');}}
function renderMap(){const root=$('#modalContent');root.innerHTML=`<div class="island-map">${Object.entries(ISLANDS).map(([k,is])=>{const u=state.unlocked.includes(k);return `<button data-island="${k}" class="${u?'':'locked'}"><div class="map-emoji">${is.icon}</div><h3>${is.name}</h3><p>${u?'Unlocked':`Requires Lv ${is.unlockLevel}${is.lifeStars?` + ${is.lifeStars} lifetime ⭐`:''} + 🪙 ${fmt(is.unlockCost)}`}</p></button>`;}).join('')}</div>`;$$('[data-island]',root).forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.island;if(state.unlocked.includes(k)){switchIsland(k);closeModal();}else unlockPrompt(k);}));}

function ensureAudio(){if(audio)return audio;const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;audio=new A();masterGain=audio.createGain();masterGain.gain.value=.7;masterGain.connect(audio.destination);musicBus=audio.createGain();musicBus.gain.value=.62;musicBus.connect(masterGain);sfxBus=audio.createGain();sfxBus.gain.value=.7;sfxBus.connect(masterGain);return audio;}
function tone(freq,dur=.15,type='sine',gain=.03,delay=0,bus='music',detune=0){const a=ensureAudio();if(!a)return;const o=a.createOscillator(),g=a.createGain(),out=bus==='sfx'?sfxBus:musicBus;o.type=type;o.frequency.value=freq;o.detune.value=detune;g.gain.setValueAtTime(.0001,a.currentTime+delay);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),a.currentTime+delay+.01);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+delay+dur);o.connect(g);g.connect(out);o.start(a.currentTime+delay);o.stop(a.currentTime+delay+dur+.03);}
function noise(dur=.05,gain=.02,delay=0){const a=ensureAudio();if(!a)return;const len=Math.floor(a.sampleRate*dur),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=a.createBufferSource(),g=a.createGain();s.buffer=buf;g.gain.value=gain;s.connect(g);g.connect(musicBus);s.start(a.currentTime+delay);}
function sfx(k){if(!state.settings.sfx)return;ensureAudio()?.resume?.();const map={tap:[380,.05,'sine'],coin:[860,.08,'triangle'],buy:[520,.12,'triangle'],breed:[330,.2,'sine'],hatch:[660,.3,'triangle'],quest:[900,.25,'sine'],level:[980,.3,'sine'],unlock:[740,.3,'triangle'],bad:[150,.14,'square'],gem:[1180,.18,'sine'],titan:[392,.65,'sine'],rushstart:[520,.22,'triangle'],rushhit:[980,.07,'sine'],rushwin:[760,.35,'triangle']};const v=map[k]||map.tap;tone(v[0],v[1],v[2],.055,0,'sfx');if(['hatch','quest','level','unlock','titan','rushstart','rushwin'].includes(k))tone(v[0]*1.5,v[1]*1.3,'sine',.032,.08,'sfx');if(k==='titan')tone(v[0]*2,.9,'sine',.025,.14,'sfx');}
function toggleSong(){songTimer?stopSong():startSong();}
function startSong(){
  if(!state.settings.music){toast('Music is turned off in Settings.');return;}const isl=state.currentIsland,played=state.placed[isl].map(id=>state.owned.find(o=>o.uid===id)).filter(Boolean);if(!played.length){toast('Place a monster first!');return;}ensureAudio()?.resume?.();$('#performanceBtn').textContent='■ Stop song';$$('.monster-avatar').forEach(a=>a.classList.add('singing'));songStep=0;state.stats.songsPlayed++;const stageBonus=state.mastery[isl].stage||0;if(stageBonus){state.notes+=25*stageBonus;state.stats.notesSpent=Math.max(0,state.stats.notesSpent);}renderTop();save();
  const tick=()=>{played.forEach((o,i)=>playMonster(o,songStep,i));if(!state.settings.reduceEffects&&songStep%2===0)spawnSongNote();songStep=(songStep+1)%16;};tick();songTimer=setInterval(tick,360);toast(stageBonus?`Performance! Grand Stage earned 🎵 ${25*stageBonus}`:'Performance started!');
}
function stopSong(){if(songTimer){clearInterval(songTimer);songTimer=null;}$('#performanceBtn').textContent='▶ Play song';$$('.monster-avatar').forEach(a=>a.classList.remove('singing'));}
function playMonster(o,step,i){const m=M[o.id],seq=instrumentSequence(m.instrument,step,i,m.island);if(seq){if(seq.noise)noise(seq.d,seq.g,seq.delay||0);else tone(seq.f,seq.d,seq.t,seq.g,seq.delay||0,'music',seq.detune||0);variantAudioFX(o.variant,seq.f,step,i);}}
function variantAudioFX(v,base,step,i){if(v==='Common')return;if(v==='Rare'&&step%4===0)tone(base*2,.12,'sine',.012,.05,'music');if(v==='Epic'&&step%4===0){tone(base*1.5,.22,'triangle',.012,.04,'music');tone(base*2,.18,'sine',.009,.09,'music');}if(v==='Legendary'&&step%2===0){tone(base*2,.09,'sine',.012,.02,'music');tone(base*2.5,.09,'sine',.009,.08,'music');tone(base*3,.12,'triangle',.007,.14,'music');}}
function instrumentSequence(inst,s,i,isl){const root=ISLANDS[isl].root,sc=[1,1.12246,1.2599,1.4983,1.6818,2];if(inst==='kick'&&s%4===0)return{f:72,d:.12,t:'sine',g:.075};if(inst==='snare'&&s%4===2)return{noise:true,d:.07,g:.025};if(inst==='hihat'&&s%2===1)return{noise:true,d:.028,g:.013};if(inst==='tick'&&s%2===1)return{f:1100,d:.025,t:'square',g:.011};if(inst==='bass'&&s%4===0)return{f:root/2*sc[(s/4+i)%4|0],d:.28,t:'sawtooth',g:.03};if(inst==='zap'&&s%4===1)return{f:root*2.5,d:.07,t:'square',g:.018};if(inst==='chime'&&s%4===0)return{f:root*sc[(s/4+i)%sc.length],d:.5,t:'sine',g:.028};if(inst==='bell'&&s%4===2)return{f:root*2*sc[(i+s)%sc.length],d:.3,t:'triangle',g:.026};if(inst==='horn'&&s%8===0)return{f:root*sc[i%4],d:.55,t:'sawtooth',g:.022};if(inst==='choir'&&s%8===4)return{f:root*sc[(i+2)%5],d:.8,t:'sine',g:.022};if(inst==='pad'&&s%8===0)return{f:root/2*sc[(i+1)%5],d:1.1,t:'sine',g:.018};if(inst==='pluck'&&s%2===0)return{f:root*sc[(s/2+i)%sc.length],d:.1,t:'triangle',g:.022};if(inst==='chirp'&&s%4===3)return{f:root*2*sc[(s+i)%5],d:.08,t:'sine',g:.022};if(inst==='mallet'&&s%4===0)return{f:root*1.5*sc[(s/4+i)%4],d:.16,t:'triangle',g:.027};if(inst==='marimba'&&s%2===0)return{f:root*sc[(s/2+i)%5],d:.13,t:'triangle',g:.026};if(inst==='kalimba'&&s%2===0)return{f:root*1.25*sc[(s/2+i)%5],d:.09,t:'sine',g:.024};if(inst==='clack'&&s%4===2)return{noise:true,d:.035,g:.02};if(inst==='cello'&&s%8===0)return{f:root/2*sc[i%4],d:.9,t:'sawtooth',g:.017};if(inst==='flute'&&s%4===1)return{f:root*2*sc[(s+i)%5],d:.35,t:'sine',g:.018};if(inst==='glass'&&s%4===0)return{f:root*2.5*sc[(i+s/4)%5],d:.55,t:'sine',g:.018};if(inst==='arp'&&s%2===0)return{f:root*1.5*sc[(s/2+i)%6],d:.13,t:'triangle',g:.019};if(inst==='timpani'&&s%8===0)return{f:root/2,d:.38,t:'sine',g:.055};if(inst==='synthlead'&&s%2===0)return{f:root*sc[(s/2+i)%5],d:.18,t:'square',g:.017};if(inst==='celesta'&&s%4===0)return{f:root*2*sc[(s/4+i)%6],d:.42,t:'sine',g:.02};if(inst==='harp'&&s%2===0)return{f:root*sc[(s/2+i)%6],d:.28,t:'triangle',g:.019};if(inst==='titan'&&s%4===0)return{f:root/2*sc[(s/4)%4],d:.72,t:'sawtooth',g:.024};if(inst==='heaven'&&s%8===0){const f=root*sc[i%4];tone(f,.9,'sine',.021,0);tone(f*1.25,1.05,'sine',.015,.03);tone(f*1.5,1.15,'triangle',.012,.07);tone(f*2,.8,'sine',.008,.14);return null;}return null;}
function spawnSongNote(){const el=document.createElement('span');el.className='song-note';el.textContent=['♪','♫','✦'][Math.floor(Math.random()*3)];el.style.left=`${20+Math.random()*60}%`;el.style.top=`${40+Math.random()*35}%`;el.style.setProperty('--note-x',`${-30+Math.random()*60}px`);$('#stage').appendChild(el);setTimeout(()=>el.remove(),1000);}

function buildParticles(){const root=$('#skyParticles');root.innerHTML='';for(let i=0;i<26;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.top=Math.random()*70+'%';s.style.animationDelay=Math.random()*5+'s';root.appendChild(s);}root.classList.toggle('hidden',state.settings.reduceEffects);}
function spark(x,y,emoji='✨'){if(state.settings.reduceEffects)return;for(let i=0;i<5;i++){const s=document.createElement('span');s.className='spark';s.textContent=emoji;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',`${-45+Math.random()*90}px`);s.style.setProperty('--dy',`${-35-Math.random()*70}px`);document.body.appendChild(s);setTimeout(()=>s.remove(),800);}}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;$('#toastStack').appendChild(d);setTimeout(()=>d.remove(),3500);}

function monsterSVG(m,variant='Common'){
  const c1=tint(m.colors[0],variant),c2=tint(m.colors[1],variant),c3=tint(m.colors[2],variant);const eyes=`<ellipse cx="49" cy="55" rx="7" ry="9" fill="#fff"/><ellipse cx="79" cy="55" rx="7" ry="9" fill="#fff"/><circle cx="50" cy="57" r="3.6" fill="#19243a"/><circle cx="78" cy="57" r="3.6" fill="#19243a"/><path d="M50 76 Q64 88 78 76" fill="none" stroke="#27314a" stroke-width="5" stroke-linecap="round"/>`;let body='';
  const basic=`<ellipse cx="64" cy="70" rx="37" ry="36" fill="${c1}"/>${eyes}`;
  switch(m.shape){
    case'leaf':body=`<path d="M41 34 Q23 8 47 13 Q59 16 64 31 Q70 8 91 13 Q102 27 80 38" fill="${c2}"/>${basic}<circle cx="36" cy="72" r="5" fill="${c3}"/><circle cx="92" cy="72" r="5" fill="${c3}"/>`;break;
    case'root':body=`<ellipse cx="64" cy="68" rx="38" ry="33" fill="${c1}"/><path d="M42 42 Q35 18 48 22 L57 43 M74 43 L83 21 Q96 17 87 44" fill="none" stroke="${c2}" stroke-width="11" stroke-linecap="round"/><path d="M39 93 L30 112 M55 99 L49 117 M75 99 L81 117 M91 91 L99 111" stroke="${c1}" stroke-width="9" stroke-linecap="round"/>${eyes}`;break;
    case'puff':body=`<g fill="${c1}"><circle cx="41" cy="53" r="24"/><circle cx="72" cy="42" r="28"/><circle cx="91" cy="66" r="24"/><circle cx="55" cy="78" r="31"/></g>${eyes}<path d="M91 79 Q116 73 120 87 Q110 96 92 90" fill="${c3}" stroke="${c2}" stroke-width="4"/>`;break;
    case'shell':body=`<path d="M26 73 Q25 38 56 30 Q96 19 108 56 Q118 91 81 104 Q44 116 26 73" fill="${c1}"/><path d="M44 43 Q79 29 96 56 Q107 78 82 94" fill="none" stroke="${c2}" stroke-width="10"/>${eyes}`;break;
    case'bird':body=`<ellipse cx="63" cy="68" rx="34" ry="37" fill="${c1}"/><path d="M34 67 Q12 57 16 39 Q31 43 44 55 M92 66 Q116 56 111 39 Q96 42 83 55" fill="${c2}"/><path d="M56 65 L71 65 L64 75 Z" fill="#ee8f3f"/>${eyes}`;break;
    case'flower':body=`<g fill="${c2}"><circle cx="64" cy="27" r="19"/><circle cx="91" cy="43" r="19"/><circle cx="92" cy="73" r="19"/><circle cx="37" cy="43" r="19"/><circle cx="36" cy="73" r="19"/></g>${basic}<circle cx="64" cy="35" r="12" fill="${c3}"/>`;break;
    case'vine':body=`${basic}<path d="M32 65 Q6 50 23 28 Q43 16 46 39 M96 65 Q122 49 104 27 Q85 17 81 39" fill="none" stroke="${c2}" stroke-width="8"/><circle cx="21" cy="29" r="8" fill="${c3}"/><circle cx="106" cy="28" r="8" fill="${c3}"/>`;break;
    case'slime':body=`<path d="M25 86 Q22 50 43 34 Q50 24 58 37 Q64 17 71 38 Q83 24 88 42 Q105 54 102 87 Q84 108 64 107 Q42 108 25 86" fill="${c1}"/>${eyes}`;break;
    case'stag':body=`${basic}<path d="M43 42 Q31 21 18 17 M43 40 Q23 36 14 29 M85 42 Q97 21 110 17 M85 40 Q105 36 114 29" fill="none" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>`;break;
    case'moth':body=`<ellipse cx="64" cy="69" rx="23" ry="35" fill="${c1}"/><path d="M42 63 Q12 48 17 20 Q45 23 58 48 M86 63 Q116 48 111 20 Q83 23 70 48" fill="${c2}" stroke="${c3}" stroke-width="3"/>${eyes}`;break;
    case'wing':body=`<ellipse cx="64" cy="70" rx="28" ry="34" fill="${c1}"/><path d="M42 63 Q15 36 18 18 Q42 20 58 48 M86 63 Q111 35 110 17 Q86 19 70 48" fill="${c3}" stroke="${c2}" stroke-width="4"/>${eyes}`;break;
    case'toad':body=`<ellipse cx="64" cy="76" rx="43" ry="30" fill="${c2}"/><circle cx="43" cy="48" r="18" fill="${c1}"/><circle cx="85" cy="48" r="18" fill="${c1}"/>${eyes}`;break;
    case'bongo':body=`${basic}<ellipse cx="37" cy="94" rx="17" ry="10" fill="${c2}"/><ellipse cx="91" cy="94" rx="17" ry="10" fill="${c2}"/><circle cx="36" cy="93" r="12" fill="${c3}"/><circle cx="92" cy="93" r="12" fill="${c3}"/>`;break;
    case'cub':body=`${basic}<path d="M44 41 Q32 17 42 12 Q53 15 56 38 M73 38 Q77 15 88 12 Q98 18 84 42" fill="none" stroke="${c2}" stroke-width="8" stroke-linecap="round"/>`;break;
    case'owl':body=`${basic}<path d="M31 53 L42 26 L56 43 M72 43 L87 25 L98 54" fill="${c2}"/><circle cx="49" cy="58" r="14" fill="${c3}"/><circle cx="79" cy="58" r="14" fill="${c3}"/>${eyes}`;break;
    case'jelly':body=`<path d="M28 78 Q29 33 64 28 Q99 33 100 78 L92 104 L82 90 L72 107 L61 91 L49 106 L39 90 Z" fill="${c1}" stroke="${c2}" stroke-width="4"/>${eyes}`;break;
    case'orb':body=`<circle cx="64" cy="67" r="38" fill="${c1}"/><ellipse cx="64" cy="67" rx="52" ry="17" fill="none" stroke="${c2}" stroke-width="6" transform="rotate(-18 64 67)"/>${eyes}`;break;
    case'spark':body=`<path d="M66 16 L80 44 L104 35 L92 62 L113 77 L84 82 L81 111 L61 90 L41 111 L39 83 L13 75 L36 61 L24 35 L50 44 Z" fill="${c1}" stroke="${c2}" stroke-width="5"/>${eyes}`;break;
    case'magma':body=`<ellipse cx="64" cy="73" rx="40" ry="34" fill="${c2}"/><path d="M30 60 Q36 25 49 44 Q55 17 65 42 Q78 16 82 46 Q100 29 98 63" fill="${c1}"/>${eyes}`;break;
    case'cat':body=`${basic}<path d="M34 48 L38 22 L54 43 M74 43 L92 22 L95 50" fill="${c2}"/><path d="M93 83 Q120 78 113 54" fill="none" stroke="${c2}" stroke-width="9" stroke-linecap="round"/>`;break;
    case'bug':body=`<ellipse cx="64" cy="74" rx="31" ry="36" fill="${c1}"/><path d="M48 42 Q32 23 25 33 M80 42 Q96 23 103 33" fill="none" stroke="${c2}" stroke-width="5"/>${eyes}`;break;
    case'crab':body=`${basic}<path d="M31 67 Q11 55 14 40 Q31 39 43 53 M97 67 Q117 55 114 40 Q97 39 85 53" fill="${c2}"/><path d="M36 96 L24 112 M51 101 L45 118 M77 101 L84 118 M92 96 L104 112" stroke="${c2}" stroke-width="7"/>`;break;
    case'ghost':body=`<path d="M29 100 V62 Q29 28 64 25 Q99 28 99 62 V103 L86 93 L75 106 L63 93 L51 106 L40 93 Z" fill="${c1}" stroke="${c2}" stroke-width="4"/>${eyes}`;break;
    case'bat':body=`${basic}<path d="M34 62 Q7 43 15 25 Q33 28 48 49 M94 62 Q121 43 113 25 Q95 28 80 49" fill="${c2}"/>`;break;
    case'planet':body=`${basic}<ellipse cx="64" cy="71" rx="55" ry="17" fill="none" stroke="${c3}" stroke-width="8" transform="rotate(-12 64 71)"/><circle cx="106" cy="48" r="7" fill="${c2}"/>`;break;
    case'halo':body=`${basic}<ellipse cx="64" cy="27" rx="30" ry="9" fill="none" stroke="${c3}" stroke-width="6"/>`;break;
    case'machine':body=`<rect x="27" y="35" width="74" height="72" rx="19" fill="${c2}" stroke="${c3}" stroke-width="6"/><rect x="38" y="45" width="52" height="34" rx="8" fill="#16243f"/><circle cx="50" cy="61" r="5" fill="${c1}"/><circle cx="78" cy="61" r="5" fill="${c1}"/><path d="M52 70 Q64 78 76 70" fill="none" stroke="${c1}" stroke-width="4"/><circle cx="64" cy="91" r="12" fill="${c1}" stroke="${c3}" stroke-width="4"/>`;break;
    case'tower':body=`<path d="M34 107 L38 48 L49 36 L49 20 L58 20 L58 42 L70 42 L70 12 L80 12 L80 40 L91 51 L95 107 Z" fill="${c2}" stroke="${c3}" stroke-width="5"/><circle cx="64" cy="70" r="20" fill="${c1}"/>${eyes}`;break;
    default:body=basic;
  }
  const rare=variant==='Rare'?`<path d="M17 22 L22 12 L27 22 L37 27 L27 32 L22 42 L17 32 L7 27 Z" fill="#70dcff" opacity=".9"/>`:'';const epic=variant==='Epic'?`<circle cx="64" cy="67" r="54" fill="none" stroke="#d578ff" stroke-width="2" opacity=".55"><animate attributeName="r" values="50;57;50" dur="2.2s" repeatCount="indefinite"/></circle>`:'';const leg=variant==='Legendary'?`<circle cx="64" cy="65" r="55" fill="none" stroke="#ffd66d" stroke-width="3" opacity=".55"><animate attributeName="r" values="50;58;50" dur="2s" repeatCount="indefinite"/></circle><path d="M103 20 L108 9 L113 20 L124 25 L113 30 L108 41 L103 30 L92 25 Z" fill="#ffe88b"><animateTransform attributeName="transform" type="rotate" from="0 108 25" to="360 108 25" dur="5s" repeatCount="indefinite"/></path>`:'';
  return `<svg viewBox="0 0 128 128" role="img" aria-label="${m.name}">${leg}${epic}<g>${body}</g>${rare}</svg>`;
}
function tint(hex,v){if(v==='Common')return hex;const h=hex.replace('#','');let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);if(v==='Rare')[r,g,b]=[Math.round(b*.7+50),Math.round(g*.75+80),Math.min(255,r*.7+120)];if(v==='Epic')[r,g,b]=[Math.min(255,r*.85+70),Math.round(b*.55+60),Math.min(255,g*.75+100)];if(v==='Legendary'){r=Math.min(255,r+55);g=Math.min(255,g+50);b=Math.round(b*.5+35);}return'#'+[r,g,b].map(x=>Math.round(clamp(x,0,255)).toString(16).padStart(2,'0')).join('');}

init();
})();

/* === NOVA BOOT + GAMES CLEANUP (auto-generated) === */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const appMeta = {
 files:{name:'File Explorer',icon:'▰',color:'blue',desc:'Browse your NOVA workspace'},
 notes:{name:'Notes',icon:'▤',color:'violet',desc:'A place for your thoughts'},
 store:{name:'NOVA Store',icon:'▣',color:'pink',desc:'Discover apps for your desktop'},
 settings:{name:'Settings',icon:'⚙',color:'slate',desc:'Make NOVA feel like yours'},
 calculator:{name:'Calculator',icon:'＋',color:'blue',desc:'Quick calculations'},
 about:{name:'About NOVA',icon:'✦',color:'violet',desc:'Your browser-based desktop'},
 snake:{name:'Snake',icon:'▦',color:'orange',desc:'A tiny arcade classic'},
 music:{name:'Spotify',icon:'♫',color:'spotify',desc:'Stream previews of millions of songs'},
 gamelib:{name:'Games',icon:'♞',color:'violet',desc:'A library of browser games'}
};
let zTop=10, winCount=0, activeApp=null, snakeTimer=null, snakeState=null, calcExpr='0', calcFresh=true;
const appState = {notes: localStorage.getItem('nova-notes') || '', wallpaper:localStorage.getItem('nova-wallpaper')||'mountains', accent:localStorage.getItem('nova-accent')||'#9a7bff', profile:JSON.parse(localStorage.getItem('nova-profile')||'{"name":"Nova User","initial":"N"}'), installed:JSON.parse(localStorage.getItem('nova-installed')||'["files","notes","games","store","settings","calculator","snake","music"]'), dark:true};

/* === NOVA WALLPAPER GALLERY DATA (auto-generated) === */
const NOVA_WALLPAPERS = [
  {key:'nova-cosmic-void', name:'Cosmic Void', cat:'Space'},
  {key:'nova-velocity', name:'Velocity', cat:'Automotive'},
  {key:'nova-dreamscape', name:'Dreamscape', cat:'Aesthetic'},
  {key:'nova-whispering-woods', name:'Whispering Woods', cat:'Nature'},
  {key:'nova-perfect-evolution', name:'Perfect Evolution', cat:'Anime'},
  {key:'nova-teyvat-dreams', name:'Teyvat Dreams', cat:'Fantasy'},
  {key:'nova-crimson-saiyan', name:'Crimson Saiyan', cat:'Anime'},
  {key:'nova-pure-atmosphere', name:'Pure Atmosphere', cat:'Aesthetic'},
  {key:'nova-copy-ninja', name:'Copy Ninja', cat:'Anime'},
  {key:'nova-lightning-shinobi', name:'Lightning Shinobi', cat:'Anime'},
  {key:'nova-orbital-dreams', name:'Orbital Dreams', cat:'Space'},
  {key:'nova-scarlet-gaze', name:'Scarlet Gaze', cat:'Anime'},
  {key:'nova-frozen-silence', name:'Frozen Silence', cat:'Nature'},
  {key:'nova-astral-muse', name:'Astral Muse', cat:'Space'},
  {key:'nova-friendly-neighborhood', name:'Friendly Neighborhood', cat:'Superheroes'},
  {key:'nova-king-of-curses', name:'King of Curses', cat:'Anime'},

  /* === NOVA CLASSIC WALLPAPERS (auto-generated) === */
  {key:'mountains', name:'Mountain Lake', cat:'Classic'},
  {key:'aurora',    name:'Aurora',        cat:'Classic'},
  {key:'ocean',     name:'Ocean',         cat:'Classic'},
  {key:'desert',    name:'Desert',        cat:'Classic'},
  {key:'space',     name:'Deep Space',    cat:'Classic'},
  /* === END NOVA CLASSIC WALLPAPERS === */
];
const NOVA_WALLPAPER_CATS = ['All', 'Classic', 'Anime', 'Space', 'Nature', 'Automotive', 'Fantasy', 'Aesthetic', 'Superheroes'];
/* === END NOVA WALLPAPER GALLERY DATA === */
function novaApplyGlass(){
  const on = localStorage.getItem('nova-liquid-glass') !== '0';
  document.documentElement.classList.toggle('glass-on', on);
}
novaApplyGlass();
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.add('hidden'),2400)}
function applyPrefs(){ $('#wallpaper').className='wallpaper wp-'+appState.wallpaper;document.documentElement.style.setProperty('--accent',appState.accent);$('#profileName').textContent=appState.profile.name;$('#startName').textContent=appState.profile.name;$('#avatar').textContent=appState.profile.initial;$('#startAvatar').textContent=appState.profile.initial; }
function updateClock(){const d=new Date();$('#clock').textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});$('#trayClock').textContent=$('#clock').textContent;$('#date').textContent=d.toLocaleDateString([],{month:'short',day:'numeric',year:'numeric'})}
setInterval(updateClock,1000);updateClock();applyPrefs();
initTopbar();
installSnapOverlay();
function glyph(id){const a=appMeta[id]||{icon:'✦',color:'violet'};const icon=a.icon==='✦'?'<img class="nova-logo nova-logo-app" src="NovaOsLogo.png" alt="">':a.icon;return `<span class="app-glyph ${a.color}">${icon}</span>`}
function openApp(id){
 if(!appMeta[id])return;
 $('#startMenu').classList.add('hidden');$('#profileMenu').classList.add('hidden');
 const existing=$(`.window[data-app="${id}"]`);if(existing){if(existing.classList.contains('minimized'))existing.classList.remove('minimized');existing.style.display='flex';focusWindow(existing);return}
 const win=document.createElement('article');win.className='window active';win.dataset.app=id;
 const w= Math.min(590,window.innerWidth-24), h=Math.min(470,window.innerHeight-140);
 win.style.width=w+'px';win.style.height=h+'px';win.style.left=Math.max(90,(window.innerWidth-w)/2+(winCount%5)*19)+'px';win.style.top=Math.max(68,(window.innerHeight-h-100)/2+(winCount%5)*13)+'px';win.style.zIndex=++zTop;winCount++;
 win.innerHTML=`<div class="win-title"><span class="win-app-icon">${appMeta[id].icon}</span><b>${appMeta[id].name}</b><div class="win-controls"><button data-action="min" title="Minimize">—</button><button data-action="max" title="Maximize">□</button><button data-action="fullscreen" title="Fullscreen">⤢</button><button class="close" data-action="close" title="Close">×</button></div></div><div class="win-body">${renderApp(id)}</div>`;
 $('#windows').appendChild(win);focusWindow(win);wireWindow(win,id);renderTaskbar();
}
function focusWindow(win){$$('.window').forEach(w=>w.classList.remove('active'));win.classList.add('active');win.style.zIndex=++zTop;activeApp=win.dataset.app;renderTaskbar();if(typeof updateTopbarAppName==='function')updateTopbarAppName()}
/* === NOVA WINDOW MANAGER (auto-generated) === */
const WM_MIN_W = 300;
const WM_MIN_H = 180;
const WM_TOPBAR = 58;
const WM_TASKBAR = 58;
const WM_SNAP_PX = 22;

const wmState = new Map();

function wmDesktop(){
  const win = document.querySelector('.desktop');
  const rect = win ? win.getBoundingClientRect() : {width: innerWidth, height: innerHeight};
  return {w: rect.width, h: rect.height};
}

function wmClamp(win){
  const d = wmDesktop();
  const w = win.offsetWidth, h = win.offsetHeight;
  let left = parseFloat(win.style.left) || 0;
  let top  = parseFloat(win.style.top)  || 0;
  const maxTop  = Math.max(WM_TOPBAR, d.h - WM_TASKBAR - 24);
  left = Math.max(-w + 120, Math.min(left, d.w - 60));
  top  = Math.max(WM_TOPBAR, Math.min(top, maxTop));
  win.style.left = left + 'px';
  win.style.top  = top + 'px';
}

function installSnapOverlay(){
  if (document.getElementById('snapPreview')) return;
  const el = document.createElement('div');
  el.id = 'snapPreview';
  const desk = document.querySelector('.desktop');
  if (desk) desk.appendChild(el);
}

function showSnapPreview(side){
  const el = document.getElementById('snapPreview');
  if (!el) return;
  const d = wmDesktop();
  let x = 0, y = WM_TOPBAR, w = d.w, h = d.h - WM_TOPBAR - WM_TASKBAR;
  if (side === 'left')  { w = d.w/2; }
  if (side === 'right') { x = d.w/2; w = d.w/2; }
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  el.style.width = w + 'px';
  el.style.height = h + 'px';
  el.classList.add('show');
}

function hideSnapPreview(){
  const el = document.getElementById('snapPreview');
  if (el) el.classList.remove('show');
}

function wmSnapTo(win, side){
  const d = wmDesktop();
  let s = wmState.get(win);
  if (!s){ s = {snapSide:null, preMax:null}; wmState.set(win, s); }
  if (!s.preMax){
    s.preMax = {
      left: win.style.left,
      top: win.style.top,
      width: win.style.width,
      height: win.style.height,
    };
  }
  win.classList.add('snapping');
  if (side === 'top'){
    win.classList.add('maximized');
  } else if (side === 'left'){
    win.classList.remove('maximized');
    win.style.left = '10px';
    win.style.top = (WM_TOPBAR + 8) + 'px';
    win.style.width = (d.w/2 - 14) + 'px';
    win.style.height = (d.h - WM_TOPBAR - WM_TASKBAR - 16) + 'px';
  } else if (side === 'right'){
    win.classList.remove('maximized');
    win.style.left = (d.w/2 + 4) + 'px';
    win.style.top = (WM_TOPBAR + 8) + 'px';
    win.style.width = (d.w/2 - 14) + 'px';
    win.style.height = (d.h - WM_TOPBAR - WM_TASKBAR - 16) + 'px';
  }
  s.snapSide = side;
  setTimeout(() => win.classList.remove('snapping'), 180);
}

function wmUnsnap(win){
  const s = wmState.get(win);
  if (!s) return;
  win.classList.remove('maximized','snapping');
  if (s.preMax){
    win.style.left = s.preMax.left || '';
    win.style.top  = s.preMax.top  || '';
    win.style.width = s.preMax.width || '';
    win.style.height = s.preMax.height || '';
    s.preMax = null;
  }
  s.snapSide = null;
}

function wmToggleMax(win){
  let s = wmState.get(win);
  if (!s){ s = {snapSide:null, preMax:null}; wmState.set(win, s); }
  if (win.classList.contains('maximized')){
    wmUnsnap(win);
  } else {
    if (!s.preMax){
      s.preMax = {
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height,
      };
    }
    win.classList.add('maximized');
    s.snapSide = 'top';
  }
}

function wmAttachResize(win){
  const dirs = ['n','s','e','w','ne','nw','se','sw'];
  dirs.forEach(dir => {
    const h = document.createElement('div');
    h.className = 'wm-resize ' + dir;
    h.dataset.dir = dir;
    win.appendChild(h);
    h.addEventListener('pointerdown', ev => {
      if (win.classList.contains('maximized')) return;
      ev.preventDefault();
      ev.stopPropagation();
      h.setPointerCapture(ev.pointerId);
      const startX = ev.clientX, startY = ev.clientY;
      const start = {
        left: win.offsetLeft, top: win.offsetTop,
        w: win.offsetWidth, h: win.offsetHeight,
      };
      const move = e => {
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        let left = start.left, top = start.top, w = start.w, h = start.h;
        if (dir.includes('e')) w = Math.max(WM_MIN_W, start.w + dx);
        if (dir.includes('s')) h = Math.max(WM_MIN_H, start.h + dy);
        if (dir.includes('w')){
          const nw = Math.max(WM_MIN_W, start.w - dx);
          left = start.left + (start.w - nw);
          w = nw;
        }
        if (dir.includes('n')){
          const nh = Math.max(WM_MIN_H, start.h - dy);
          top = start.top + (start.h - nh);
          h = nh;
        }
        win.style.left = left + 'px';
        win.style.top = Math.max(WM_TOPBAR, top) + 'px';
        win.style.width = w + 'px';
        win.style.height = h + 'px';
      };
      const end = () => {
        h.removeEventListener('pointermove', move);
        h.removeEventListener('pointerup', end);
      };
      h.addEventListener('pointermove', move);
      h.addEventListener('pointerup', end);
    });
  });
}

function wmAttachDrag(win){
  const bar = win.querySelector('.win-title');
  if (!bar) return;

  bar.addEventListener('dblclick', ev => {
    if (ev.target.closest('.win-controls')) return;
    wmToggleMax(win);
  });

  bar.addEventListener('pointerdown', ev => {
    if (ev.target.closest('.win-controls')) return;
    if (ev.detail > 1) return;
    ev.preventDefault();
    bar.setPointerCapture(ev.pointerId);

    const wasMax = win.classList.contains('maximized');
    if (wasMax){
      const s = wmState.get(win);
      const prevW = s && s.preMax ? parseFloat(s.preMax.width) : 520;
      wmUnsnap(win);
      win.style.width = prevW + 'px';
      win.style.left = (ev.clientX - prevW/2) + 'px';
      win.style.top  = (WM_TOPBAR + 8) + 'px';
    }

    const s = wmState.get(win);
    if (s && s.snapSide && s.snapSide !== 'top'){
      const d = wmDesktop();
      wmUnsnap(win);
      win.style.width = (d.w/2 - 14) + 'px';
      win.style.left = (ev.clientX - 100) + 'px';
      win.style.top  = (WM_TOPBAR + 8) + 'px';
    }

    const startX = ev.clientX, startY = ev.clientY;
    const startLeft = win.offsetLeft, startTop = win.offsetTop;
    let snapCandidate = null;

    const move = e => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      win.style.left = (startLeft + dx) + 'px';
      win.style.top  = (startTop + dy) + 'px';

      const nearTop = e.clientY <= WM_TOPBAR + WM_SNAP_PX;
      const nearLeft = e.clientX <= WM_SNAP_PX;
      const nearRight = e.clientX >= innerWidth - WM_SNAP_PX;
      let next = null;
      if (nearTop) next = 'top';
      else if (nearLeft) next = 'left';
      else if (nearRight) next = 'right';

      if (next !== snapCandidate){
        snapCandidate = next;
        if (next) showSnapPreview(next);
        else hideSnapPreview();
      }
    };

    const end = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', end);
      if (snapCandidate){
        hideSnapPreview();
        wmSnapTo(win, snapCandidate);
      } else {
        wmClamp(win);
      }
      snapCandidate = null;
    };

    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', end);
  });
}
/* === END NOVA WINDOW MANAGER === */
function wireWindow(win,id){
 win.addEventListener('pointerdown',()=>focusWindow(win));
 wmAttachDrag(win);
 wmAttachResize(win);
 win.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const a=b.dataset.action;if(a==='close'){if(id==='snake')stopSnake();win.remove();wmState.delete(win);renderTaskbar()}if(a==='min'){win.style.display='none';win.classList.add('minimized');renderTaskbar()}if(a==='max'){wmToggleMax(win)}if(a==='fullscreen'){wmToggleFullscreen(win)}}));
 if(id==='notes'){const ta=win.querySelector('#notesText');ta.value=appState.notes;ta.addEventListener('input',()=>{appState.notes=ta.value;localStorage.setItem('nova-notes',ta.value);win.querySelector('#noteSaved').textContent='Saved automatically'})}
 if(id==='settings')wireSettings(win);
 if(id==='music')wireSpotify(win);
 if(id==='gamelib')wireGamelib(win);
 if(id==='calculator')wireCalc(win);
 if(id==='snake')initSnake(win);
 if(id==='store')wireStore(win);
if(id==='files'){
  win.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openApp(b.dataset.open));
  const shell=win.querySelector('.finder-shell');
  if(shell){
    const locationLabel=shell.querySelector('#finderLocation');
    const status=shell.querySelector('#finderStatus');
    const search=shell.querySelector('#finderSearch');
    const navs=[...shell.querySelectorAll('.finder-nav')];
    const tiles=[...shell.querySelectorAll('.finder-tile')];
    const items=[...shell.querySelectorAll('.finder-item')];
    const content=shell.querySelector('.finder-content');
    const recentHeading=shell.querySelector('.finder-recent-title');
    let current='Recents', history=['Recents'], historyIndex=0;
    const itemCategory=(el)=>{
      const text=el.innerText.toLowerCase();
      if(text.includes('arcade')||text.includes('game'))return 'Games';
      if(text.includes('desktop preferences')||text.includes('settings')||text.includes('welcome to nova'))return 'Applications';
      return 'Recents';
    };
    const applyFilter=(folder,addHistory=true)=>{
      current=folder;
      if(addHistory){
        history=history.slice(0,historyIndex+1);
        if(history[history.length-1]!==folder){history.push(folder);historyIndex=history.length-1;}
      }
      if(locationLabel)locationLabel.textContent=folder;
      navs.forEach(n=>n.classList.toggle('active',n.dataset.folder===folder));
      const q=(search?.value||'').trim().toLowerCase();
      let visibleTiles=0,visibleItems=0;
      tiles.forEach(tile=>{
        const matchFolder=folder==='Recents'||folder==='NOVA Drive'||tile.dataset.folder===folder;
        const matchSearch=!q||tile.innerText.toLowerCase().includes(q);
        const show=matchFolder&&matchSearch;
        tile.hidden=!show;
        if(show)visibleTiles++;
      });
      items.forEach(item=>{
        const category=itemCategory(item);
        let matchFolder=folder==='Recents'||folder==='NOVA Drive';
        if(folder==='Applications')matchFolder=category==='Applications';
        if(folder==='Games')matchFolder=category==='Games';
        if(folder==='Desktop')matchFolder=item.innerText.toLowerCase().includes('welcome');
        if(folder==='Downloads')matchFolder=false;
        const matchSearch=!q||item.innerText.toLowerCase().includes(q);
        const show=matchFolder&&matchSearch;
        item.hidden=!show;
        if(show)visibleItems++;
      });
      let empty=shell.querySelector('.finder-empty');
      if(!empty){
        empty=document.createElement('div');empty.className='finder-empty';
        empty.textContent='No matching items in this location';
        items[0]?.parentElement?.appendChild(empty);
      }
      empty.hidden=visibleItems>0 || (folder==='Recents'&&visibleTiles>0&&q==='');
      if(recentHeading)recentHeading.textContent=folder==='Recents'?'RECENT ITEMS':folder.toUpperCase()+' ITEMS';
      if(status)status.textContent=`${visibleTiles} folder${visibleTiles===1?'':'s'} · ${visibleItems} item${visibleItems===1?'':'s'}`;
    };
    navs.forEach(n=>n.addEventListener('click',()=>applyFilter(n.dataset.folder)));
    tiles.forEach(tile=>tile.addEventListener('click',()=>applyFilter(tile.dataset.folder)));
    shell.querySelectorAll('.finder-arrows [data-folder]').forEach(btn=>btn.addEventListener('click',()=>{
      if(btn.dataset.folder==='Back'&&historyIndex>0){historyIndex--;applyFilter(history[historyIndex],false);}
      if(btn.dataset.folder==='Forward'&&historyIndex<history.length-1){historyIndex++;applyFilter(history[historyIndex],false);}
    }));
    search?.addEventListener('input',()=>applyFilter(current,false));
    applyFilter('Recents',false);
  }
}
 }
function renderApp(id){
 if(id==='files')return `<div class="finder-shell">
  <aside class="finder-sidebar">
    <div class="finder-side-heading">FAVORITES</div>
    <button class="finder-nav active" data-folder="Recents"><span>◷</span> Recents</button>
    <button class="finder-nav" data-folder="Applications"><span>▦</span> Applications</button>
    <button class="finder-nav" data-folder="Desktop"><span>▣</span> Desktop</button>
    <button class="finder-nav" data-folder="Downloads"><span>⇩</span> Downloads</button>
    <button class="finder-nav" data-folder="Games"><span>♧</span> Games</button>
    <div class="finder-side-heading finder-locations">LOCATIONS</div>
    <button class="finder-nav" data-folder="NOVA Drive"><span>◫</span> NOVA Drive</button>
    <div class="finder-storage"><span></span><div><b>Local workspace</b><small>Browser storage</small></div></div>
  </aside>
  <section class="finder-main">
    <div class="finder-toolbar">
      <div class="finder-arrows"><button type="button" data-folder="Back" title="Back">‹</button><button type="button" data-folder="Forward" title="Forward">›</button></div>
      <strong id="finderLocation">Recents</strong>
      <label class="finder-search"><span>⌕</span><input id="finderSearch" type="search" placeholder="Search files…"></label>
    </div>
    <div class="finder-content">
      <div class="finder-section-title">FREQUENT LOCATIONS</div>
      <div class="finder-tiles">
        <button class="finder-tile" data-folder="Desktop"><span class="finder-file-icon folder-blue">▰</span><b>Desktop</b><small>Your workspace</small></button>
        <button class="finder-tile" data-folder="Applications"><span class="finder-file-icon folder-violet">▦</span><b>Applications</b><small>Installed apps</small></button>
        <button class="finder-tile" data-folder="Downloads"><span class="finder-file-icon folder-cyan">⇩</span><b>Downloads</b><small>Recent items</small></button>
        <button class="finder-tile" data-folder="Games"><span class="finder-file-icon folder-orange">✣</span><b>Games</b><small>Arcade collection</small></button>
      </div>
      <div class="finder-section-title finder-recent-title">RECENT ITEMS</div>
      <div class="finder-items" id="finderItems">
        <button class="finder-item" data-open="about"><span class="finder-doc-icon">▤</span><span><b>Welcome to NOVA.txt</b><small>Text document · Built in</small></span><span class="finder-item-kind">TXT</span></button>
        <button class="finder-item" data-open="gamelib"><span class="finder-doc-icon">▦</span><span><b>Arcade collection</b><small>Games · Built in</small></span><span class="finder-item-kind">APP</span></button>
        <button class="finder-item" data-open="settings"><span class="finder-doc-icon">⚙</span><span><b>Desktop preferences</b><small>System settings</small></span><span class="finder-item-kind">APP</span></button>
      </div>
    </div>
    <div class="finder-status"><span id="finderStatus">4 locations · 3 recent items</span><span>On this device</span></div>
  </section>
</div>`; if(id==='notes')return `<h1 class="app-heading">Quick Notes</h1><div class="subtle">Notes save automatically on this device.</div><div class="section-row"><b>Untitled note</b><span id="noteSaved" class="subtle">All changes saved</span></div><textarea id="notesText" class="note-area" placeholder="Start typing your ideas here…"></textarea>`;
 if(id==='gamelib')return `<h1 class="app-heading">Games</h1><div class="subtle">A small library of browser games, bundled with NOVA OS.</div><label class="game-search"><span>⌕</span><input id="gameSearch" placeholder="Search games…" autocomplete="off"></label><div class="games-grid" id="gamesGrid"></div>`;
 if(id==='settings')return `<h1 class="app-heading">Personalization</h1><div class="subtle">Make your desktop feel like home.</div><div class="section-row"><b>Desktop wallpaper</b><span class="subtle">Choose a scene</span></div><div class="wall-cats" id="wallCats">${NOVA_WALLPAPER_CATS.map(c=>`<button class="wall-cat ${c==='All'?'active':''}" data-wallcat="${c}">${c}</button>`).join('')}</div><div class="wall-grid nova-wall-grid" id="wallGrid">${NOVA_WALLPAPERS.map(w=>`<button class="wall-choice ${appState.wallpaper===w.key?'selected':''} wp-${w.key}" data-wall="${w.key}" data-wallcat="${w.cat}"><span>${w.name}</span></button>`).join('')}</div><div class="section-row"><b>Accent color</b><span class="subtle">Interface highlight</span></div><div style="display:flex;gap:12px;margin:13px 0">${['#9a7bff','#4e8cff','#28c5c7','#36c982','#ffb43f','#ff6488','#e76de8'].map(c=>`<button data-accent="${c}" aria-label="Accent ${c}" style="width:27px;height:27px;border-radius:50%;background:${c};border:2px solid ${appState.accent===c?'white':'transparent'};box-shadow:0 0 0 2px ${appState.accent===c?c:'transparent'}"></button>`).join('')}</div><div class="section-row"><b>Pinned Apps</b><span class="subtle">Choose what stays in the dock</span></div><div class="pin-grid" id="pinnedAppsGrid"></div><div class="setting-row"><div><b>Boot animation</b><p>Show the NOVA startup screen on launch</p></div><button class="toggle on" id="bootToggle" aria-label="Toggle boot animation"></button></div><div class="setting-row"><div><b>Lock screen</b><p>Show a lock screen on startup</p></div><button class="toggle on" id="lockToggle" aria-label="Toggle lock screen"></button></div><div class="setting-row"><div><b>Desktop icons</b><p>Show shortcuts on the desktop</p></div><button class="toggle on" id="iconsToggle" aria-label="Toggle desktop icons"></button></div><div class="setting-row"><div><b>Liquid Glass</b><p>Heavier blur and softer surfaces across the OS</p></div><button class="toggle" id="liquidGlassToggle" aria-label="Toggle Liquid Glass"></button></div><div class="section-row"><b>Widgets</b><span class="subtle">Show or hide desktop widgets</span></div><div class="setting-row"><div><b>Clock</b><p>Time and date</p></div><button class="toggle on" id="wToggleClock" aria-label="Toggle Clock widget"></button></div><div class="setting-row"><div><b>Calendar</b><p>This month at a glance</p></div><button class="toggle on" id="wToggleCalendar" aria-label="Toggle Calendar widget"></button></div><div class="setting-row"><div><b>Notes</b><p>Preview of your notes</p></div><button class="toggle on" id="wToggleNotes" aria-label="Toggle Notes widget"></button></div><div class="setting-row"><div><b>Quick Actions</b><p>Shortcuts to common apps</p></div><button class="toggle on" id="wToggleQuick" aria-label="Toggle Quick Actions widget"></button></div><div class="setting-row"><div><b>Lock widgets</b><p>Prevent dragging</p></div><button class="toggle" id="widgetLockToggle" aria-label="Lock widgets"></button></div><div class="section-row"><button class="soft-button" id="widgetReset">Reset widget positions</button><span class="subtle">NOVA OS</span></div><div class="setting-row"><div><b>Snowfall</b><p>Gentle snow falling across the desktop</p></div><button class="toggle" id="snowToggle" aria-label="Toggle snowfall"></button></div><div class="section-row"><button class="soft-button" id="resetPrefs">Reset appearance</button><span class="subtle">NOVA OS · 1.0</span></div>`;

 if(id==='store')return `<div class="store-hero"><div style="font-size:11px;letter-spacing:.12em;color:#c6b7ff">WELCOME TO NOVA</div><h2>Make this desktop yours.</h2><p>Little tools, creative spaces, and games — all inside your browser.</p><button class="primary" data-store-open="gamelib">Explore games</button></div><div class="section-row"><b>Featured apps</b><span class="subtle">Curated for you</span></div><div class="app-grid">${[['notes','Notes','Productivity'],['calculator','Calculator','Utilities'],['snake','Snake','Arcade'],['music','Music Player','Lifestyle'],['settings','Settings','System'],['about','About NOVA','System']].map(([a,n,d])=>`<div class="app-card">${glyph(a)}<b>${n}</b><small>${d}</small><button class="soft-button" style="margin-top:3px" data-install="${a}">${appState.installed.includes(a)?'Open':'Install'}</button></div>`).join('')}</div>`;
 if(id==='calculator')return `<h1 class="app-heading">Calculator</h1><div class="subtle">A handy little number tool.</div><div class="calc" style="margin-top:18px"><div id="calcDisplay" class="calc-display">0</div><div class="calc-grid">${['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','⌫','='].map(x=>`<button class="${['÷','×','−','+','='].includes(x)?'calc-op':''}" data-calc="${x}">${x}</button>`).join('')}</div></div>`;
 if(id==='snake')return `<div class="game-wrap"><h1 class="app-heading">Snake</h1><div class="subtle">Eat the glowing dot. Don't hit the wall or yourself.</div><div class="game-stats"><div><span>SCORE</span><b id="snakeScore">0</b></div><div><span>BEST</span><b id="snakeBest">${localStorage.getItem('nova-snake-best')||0}</b></div><div><span>STATUS</span><b id="snakeStatus">Ready</b></div></div><canvas id="snakeCanvas" class="snake-board" width="360" height="260"></canvas><div class="game-controls"><button class="primary" id="snakeStart">Start game</button><button class="soft-button" id="snakePause">Pause</button><button class="soft-button" id="snakeReset">New game</button></div><div class="subtle">Keyboard: arrow keys or WASD · On mobile, use the directional controls below.</div><div class="game-controls"><button class="soft-button" data-dir="up">↑</button></div><div class="game-controls"><button class="soft-button" data-dir="left">←</button><button class="soft-button" data-dir="down">↓</button><button class="soft-button" data-dir="right">→</button></div></div>`;
 if(id==='music')return `<div class="sp-app">  <div class="sp-header">    <div class="sp-brand"><span class="sp-brand-dot">♫</span>Spotify</div>    <label class="sp-search"><span>⌕</span><input id="spSearch" type="search" placeholder="Search songs, artists, albums…" autocomplete="off"></label>  </div>  <div class="sp-content">    <div class="sp-sidebar">      <button class="sp-nav active" data-sp-tab="home">Home</button>      <button class="sp-nav" data-sp-tab="recent">Recently Played</button>    </div>    <div class="sp-main" id="spMain">      <div class="sp-empty"><b>Search for a song</b><span>Type in the box above to find music.</span></div>    </div>  </div>  <div class="sp-player" id="spPlayer">    <div class="sp-player-info"><img id="spCover" alt=""><div><b id="spTitle">Nothing playing</b><small id="spArtist">—</small></div></div>    <div class="sp-player-controls">      <button id="spPrev" title="Previous">⏮</button>      <button id="spPlayBtn" title="Play">▶</button>      <button id="spNext" title="Next">⏭</button>    </div>    <div class="sp-player-progress">      <span id="spTime">0:00</span>      <input type="range" id="spSeek" min="0" max="30" step="0.1" value="0">      <span id="spDur">0:30</span>    </div>    <div class="sp-player-volume"><span>🔊</span><input type="range" id="spVol" min="0" max="1" step="0.01" value="0.8"></div>    <audio id="spAudio" preload="none"></audio>  </div></div>`;
 return `<div style="text-align:center;padding:18px"><img src="NovaOsLogo.png" alt="NOVA OS" class="nova-logo nova-logo-about"><h1 class="app-heading">NOVA OS</h1><p class="subtle">A playful desktop, running entirely in your browser.</p><p style="line-height:1.8">Version 1.0 · Self-hostable<br>Preferences and notes stay in this browser's local storage.</p><button id="aboutCheck" class="primary">Check system</button></div>`;
}
function wireSettings(win){
 novaWireLockscreen(win);
 novaWireWidgets(win);
 novaWirePins(win);

 novaWireSnow(win);

 // Liquid Glass toggle
 const _lgToggle = win.querySelector('#liquidGlassToggle');
 if(_lgToggle){
   const _lgOn = localStorage.getItem('nova-liquid-glass') !== '0';
   _lgToggle.classList.toggle('on', _lgOn);
   _lgToggle.onclick = (e)=>{
     e.currentTarget.classList.toggle('on');
     const on = e.currentTarget.classList.contains('on');
     localStorage.setItem('nova-liquid-glass', on ? '1' : '0');
     if (typeof novaApplyGlass === 'function') novaApplyGlass();
     toast('Liquid Glass ' + (on ? 'enabled' : 'disabled'));
   };
 }

 win.querySelectorAll('[data-wall]').forEach(b=>b.onclick=()=>{appState.wallpaper=b.dataset.wall;localStorage.setItem('nova-wallpaper',appState.wallpaper);applyPrefs();win.querySelectorAll('[data-wall]').forEach(x=>x.classList.toggle('selected',x===b));toast('Wallpaper updated')});
 wireWallpaperCategories(win);
 win.querySelectorAll('[data-accent]').forEach(b=>b.onclick=()=>{appState.accent=b.dataset.accent;localStorage.setItem('nova-accent',appState.accent);applyPrefs();wireSettingsRefresh(win);toast('Accent color updated')});
 win.querySelector('#bootToggle').onclick=e=>{e.currentTarget.classList.toggle('on');localStorage.setItem('nova-boot',e.currentTarget.classList.contains('on')?'1':'0')};
 win.querySelector('#iconsToggle').onclick=e=>{e.currentTarget.classList.toggle('on');$('#desktopIcons').style.display=e.currentTarget.classList.contains('on')?'flex':'none';localStorage.setItem('nova-icons',e.currentTarget.classList.contains('on')?'1':'0')};
 win.querySelector('#resetPrefs').onclick=()=>{appState.wallpaper='mountains';appState.accent='#9a7bff';localStorage.removeItem('nova-wallpaper');localStorage.removeItem('nova-accent');applyPrefs();win.querySelector('.win-body').innerHTML=renderApp('settings');wireSettings(win);toast('Appearance reset')};
}
function wireWallpaperCategories(win){
  const grid=win.querySelector('#wallGrid');
  if(!grid)return;
  const choices=[...grid.querySelectorAll('[data-wall]')];
  win.querySelectorAll('[data-wallcat]').forEach(btn=>{
    if(btn.classList.contains('wall-choice'))return;
    btn.onclick=()=>{
      const cat=btn.dataset.wallcat;
      win.querySelectorAll('.wall-cat').forEach(b=>b.classList.toggle('active',b===btn));
      choices.forEach(c=>{c.style.display=(cat==='All'||c.dataset.wallcat===cat)?'':'none'});
    };
  });
}

/* === NOVA GAMES APP v2 (auto-generated) === */
function novaGamesBase(){
  var b = localStorage.getItem('nova-games-base') || 'games/';
  return b.endsWith('/') ? b : b + '/';
}
function wireGamelib(win){
  var grid = win.querySelector('#gamesGrid');
  var search = win.querySelector('#gameSearch');
  var status = win.querySelector('#gamesStatus');
  if (!grid) return;

  var base = novaGamesBase();

  fetch(base + 'manifest.json').then(function(r){
    if (!r.ok) throw new Error('manifest HTTP ' + r.status);
    return r.json();
  }).then(function(list){
    if (status) status.textContent = list.length + ' games';
    var render = function(){
      var q = (search.value || '').toLowerCase().trim();
      var filtered = q ? list.filter(function(g){ return g.name.toLowerCase().indexOf(q) !== -1; }) : list;
      if (status) status.textContent = filtered.length + ' / ' + list.length + ' games';
      grid.innerHTML = filtered.map(function(g){
        var coverSrc = g.cover ? (base + g.cover) : '';
        var img = coverSrc
          ? '<img loading="lazy" src="' + coverSrc + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'">'
          : '';
        var initial = (g.name[0] || '?').toUpperCase();
        var fallback = '<div class="game-fallback" style="' + (coverSrc ? 'display:none' : '') + '">' + initial + '</div>';
        return '<div class="game-card" data-game-url="' + base + g.url + '" data-game-name="' + g.name.replace(/"/g, '&quot;') + '">' + img + fallback + '<b>' + g.name + '</b></div>';
      }).join('') || '<div class="empty-state"><b>No games found</b>Try a different search.</div>';
      grid.querySelectorAll('.game-card').forEach(function(c){
        c.onclick = function(){ openGameInWindow(win, c.dataset.gameUrl, c.dataset.gameName); };
      });
    };
    search.oninput = render;
    render();
  }).catch(function(err){
    grid.innerHTML = '<div class="empty-state"><b>Games manifest missing</b>' +
      'Serve NOVA OS over HTTP (not file://), then run the patcher again.' +
      '<br><small style="opacity:.7">' + String(err.message || err) + '</small></div>';
  });
}
function openGameInWindow(win, url, name){
  var body = win.querySelector('.win-body');
  if (!body) return;
  body.innerHTML = '<div class="game-viewer">' +
      '<div class="game-viewer-bar"><b>' + name + '</b>' +
      '<button class="soft-button" id="openExternal">Open in new tab</button>' +
      '<button class="soft-button" id="closeGame">Close game</button></div>' +
      '<iframe src="' + url + '" allowfullscreen></iframe></div>';
  body.querySelector('#closeGame').onclick = function(){
    body.innerHTML = renderApp('gamelib');
    wireGamelib(win);
  };
  body.querySelector('#openExternal').onclick = function(){
    window.open(url, '_blank', 'noopener');
  };
}
/* === END NOVA GAMES APP v2 === */
/* === NOVA TOPBAR (auto-generated) === */
const TOPBAR_MENUS = {
  file: [
    { label: 'New Window', action: 'file:new' },
    { label: 'Close Window', action: 'file:close', needsWindow: true },
  ],
  view: [
    { label: 'Toggle Desktop Icons', action: 'view:icons' },
    { label: 'Change Wallpaper…', action: 'view:wallpaper' },
    { label: 'Enter Fullscreen', action: 'view:fullscreen' },
  ],
  go: [
    { label: 'Recents', action: 'go:files' },
    { label: 'Games', action: 'go:games' },
    { label: 'Settings', action: 'go:settings' },
  ],
  window: [
    { label: 'Minimize', action: 'win:min', needsWindow: true },
    { label: 'Maximize / Restore', action: 'win:max', needsWindow: true },
    { label: 'Close', action: 'win:close', needsWindow: true },
  ],
  help: [
    { label: 'About NOVA', action: 'help:about' },
  ],
};

let topbarOpenMenu = null;

function initTopbar(){
  const bar = document.querySelector('.topbar.macbar');
  if (!bar) return;
  const menuBtns = bar.querySelectorAll('.macbar-menu');
  menuBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const key = btn.dataset.menu;
      if (topbarOpenMenu === key){ closeTopbarMenu(); return; }
      openTopbarMenu(key, btn);
    });
    btn.addEventListener('mouseenter', () => {
      if (topbarOpenMenu && topbarOpenMenu !== btn.dataset.menu){
        openTopbarMenu(btn.dataset.menu, btn);
      }
    });
  });

  const fullscreenBtn = document.getElementById('topbarFullscreen');
  if (fullscreenBtn){
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  document.addEventListener('click', closeTopbarMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTopbarMenu(); });
  document.addEventListener('fullscreenchange', updateFullscreenBtn);

  updateTopbarAppName();
}

function openTopbarMenu(key, btn){
  const bar = document.querySelector('.topbar.macbar');
  const dropdown = document.getElementById('topbarDropdown');
  if (!bar || !dropdown) return;

  const items = TOPBAR_MENUS[key];
  if (!items) return;

  const hasFocus = !!document.querySelector('.window.active');
  const html = items.map(it => {
    const disabled = it.needsWindow && !hasFocus;
    return `<button class="mi${disabled ? ' disabled' : ''}" data-action="${it.action}">${it.label}</button>`;
  }).join('');
  dropdown.innerHTML = html;
  // Position dropdown under the menu button.
  const rect = btn.getBoundingClientRect();
  const barRect = bar.getBoundingClientRect();
  dropdown.style.left = (rect.left - barRect.left) + 'px';
  dropdown.classList.remove('hidden');

  bar.querySelectorAll('.macbar-menu').forEach(b => b.classList.toggle('active', b === btn));
  topbarOpenMenu = key;

  dropdown.querySelectorAll('.mi').forEach(el => {
    if (el.classList.contains('disabled')) return;
    el.addEventListener('click', ev => {
      ev.stopPropagation();
      runTopbarAction(el.dataset.action);
      closeTopbarMenu();
    });
  });
}

function closeTopbarMenu(){
  const dropdown = document.getElementById('topbarDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  document.querySelectorAll('.macbar-menu').forEach(b => b.classList.remove('active'));
  topbarOpenMenu = null;
}

function updateTopbarAppName(){
  const label = document.getElementById('topbarAppNameLabel');
  if (!label) return;
  let name = 'NOVA OS';
  if (activeApp && typeof appMeta !== 'undefined' && appMeta[activeApp]) {
    name = appMeta[activeApp].name;
  }
  label.textContent = name;
}

function activeWindow(){
  return document.querySelector('.window.active') || null;
}

function toggleFullscreen(){
  if (!document.fullscreenElement){
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function updateFullscreenBtn(){
  const btn = document.getElementById('topbarFullscreen');
  if (!btn) return;
  btn.textContent = document.fullscreenElement ? '⤢' : '⛶';
}

function runTopbarAction(action){
  const win = activeWindow();
  switch(action){
    case 'file:new': {
      const lastApp = activeApp || (win && win.dataset.app) || 'notes';
      openApp(lastApp);
      break;
    }
    case 'file:close': if (win) win.querySelector('[data-action="close"]')?.click(); break;
    case 'view:icons': {
      const icons = document.getElementById('desktopIcons');
      if (icons){
        const visible = icons.style.display !== 'none';
        icons.style.display = visible ? 'none' : 'flex';
        localStorage.setItem('nova-icons', visible ? '0' : '1');
      }
      break;
    }
    case 'view:wallpaper': openApp('settings'); break;
    case 'view:fullscreen': toggleFullscreen(); break;
    case 'go:files': openApp('files'); break;
    case 'go:games': openApp('gamelib'); break;
    case 'go:settings': openApp('settings'); break;
    case 'win:min': win && win.querySelector('[data-action="min"]')?.click(); break;
    case 'win:max': win && win.querySelector('[data-action="max"]')?.click(); break;
    case 'win:close': win && win.querySelector('[data-action="close"]')?.click(); break;
    case 'help:about': openApp('about'); break;
  }
}
/* === END NOVA TOPBAR === */
/* === NOVA SPOTIFY (auto-generated) === */
const SP_API = 'https://itunes.apple.com/search';
const SP_RESULTS_LIMIT = 24;
const SP_STORAGE_RECENT = 'nova-spotify-recent';
const SP_STORAGE_VOL = 'nova-spotify-volume';
const SP_STORAGE_LAST = 'nova-spotify-last-search';

let spQueue = [];
let spIndex = -1;
let spRecent = [];
let spPlaying = false;

function spFmtTime(sec){
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

function spLoadStorage(){
  try { spRecent = JSON.parse(localStorage.getItem(SP_STORAGE_RECENT) || '[]'); }
  catch { spRecent = []; }
  if (!Array.isArray(spRecent)) spRecent = [];
}

function spSaveRecent(){
  try { localStorage.setItem(SP_STORAGE_RECENT, JSON.stringify(spRecent.slice(0, 20))); }
  catch {}
}

function spPushRecent(track){
  spRecent = spRecent.filter(t => t.previewUrl !== track.previewUrl);
  spRecent.unshift(track);
  spRecent = spRecent.slice(0, 20);
  spSaveRecent();
}

function spSearchUrl(term){
  return SP_API + '?term=' + encodeURIComponent(term) + '&entity=musicTrack&limit=' + SP_RESULTS_LIMIT;
}

function spNormalize(raw){
  return {
    trackName: raw.trackName || 'Unknown',
    artistName: raw.artistName || 'Unknown',
    collectionName: raw.collectionName || '',
    artwork: (raw.artworkUrl100 || raw.artworkUrl60 || '').replace('100x100bb', '200x200bb'),
    previewUrl: raw.previewUrl || '',
    duration: (raw.trackTimeMillis ? raw.trackTimeMillis / 1000 : 30),
    trackId: raw.trackId,
  };
}

function spRenderTracks(tracks){
  const main = document.getElementById('spMain');
  if (!main) return;
  if (!tracks.length){
    main.innerHTML = '<div class="sp-empty"><b>No results</b><span>Try a different search.</span></div>';
    return;
  }
  main.innerHTML = '<div class="sp-track-list">' + tracks.map((t, i) => {
    const unavailable = !t.previewUrl;
    const art = t.artwork
      ? '<img src="' + t.artwork + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'">'
      : '';
    const fallback = '<div class="sp-art-fallback" style="' + (t.artwork ? 'display:none' : '') + '">♫</div>';
    return '<div class="sp-track' + (unavailable ? ' unavailable' : '') + '" data-sp-idx="' + i + '">' +
      art + fallback +
      '<div class="sp-track-info"><div class="sp-track-title">' + t.trackName + '</div>' +
      '<div class="sp-track-artist">' + t.artistName + '</div></div>' +
      '<div class="sp-track-album">' + t.collectionName + '</div>' +
      '<div class="sp-track-dur">' + (unavailable ? 'N/A' : spFmtTime(t.duration)) + '</div>' +
      '<div class="sp-track-play">' + (unavailable ? '—' : '▶') + '</div>' +
    '</div>';
  }).join('') + '</div>';

  main.querySelectorAll('.sp-track').forEach(row => {
    row.addEventListener('click', () => {
      const idx = Number(row.dataset.spIdx);
      const track = tracks[idx];
      if (!track || !track.previewUrl) return;
      spPlayTrack(tracks, idx);
    });
  });
}

function spPlayTrack(tracks, idx){
  spQueue = tracks.filter(t => t.previewUrl);
  // find idx within filtered queue
  const target = tracks[idx];
  const qIdx = spQueue.findIndex(t => t.previewUrl === target.previewUrl);
  if (qIdx === -1) return;
  spIndex = qIdx;
  spLoadTrack(spQueue[spIndex]);
}

function spLoadTrack(track){
  const audio = document.getElementById('spAudio');
  const cover = document.getElementById('spCover');
  const title = document.getElementById('spTitle');
  const artist = document.getElementById('spArtist');
  if (!audio || !track || !track.previewUrl) return;

  audio.src = track.previewUrl;
  audio.volume = parseFloat(localStorage.getItem(SP_STORAGE_VOL) || '0.8');
  audio.play().then(() => { spPlaying = true; spUpdatePlayBtn(); }).catch(() => { spPlaying = false; spUpdatePlayBtn(); });

  if (cover){
    if (track.artwork){ cover.src = track.artwork; cover.style.display = 'inline-block'; }
    else { cover.removeAttribute('src'); cover.style.display = 'none'; }
  }
  if (title) title.textContent = track.trackName;
  if (artist) artist.textContent = track.artistName;

  spPushRecent(track);
  spMarkPlayingRow(track);
}

function spMarkPlayingRow(track){
  document.querySelectorAll('.sp-track').forEach(r => r.classList.remove('playing'));
  document.querySelectorAll('.sp-track').forEach(r => {
    const t = r.querySelector('.sp-track-title');
    if (t && t.textContent === track.trackName) r.classList.add('playing');
  });
}

function spUpdatePlayBtn(){
  const btn = document.getElementById('spPlayBtn');
  if (btn) btn.textContent = spPlaying ? '❚❚' : '▶';
}

function spTogglePlay(){
  const audio = document.getElementById('spAudio');
  if (!audio || !audio.src) return;
  if (audio.paused){
    audio.play().then(() => { spPlaying = true; spUpdatePlayBtn(); }).catch(()=>{});
  } else {
    audio.pause();
    spPlaying = false;
    spUpdatePlayBtn();
  }
}

function spNext(){
  if (!spQueue.length) return;
  spIndex = (spIndex + 1) % spQueue.length;
  spLoadTrack(spQueue[spIndex]);
}

function spPrev(){
  if (!spQueue.length) return;
  spIndex = (spIndex - 1 + spQueue.length) % spQueue.length;
  spLoadTrack(spQueue[spIndex]);
}

function spRenderRecent(){
  const main = document.getElementById('spMain');
  if (!main) return;
  if (!spRecent.length){
    main.innerHTML = '<div class="sp-empty"><b>Nothing played yet</b><span>Play a track and it will show up here.</span></div>';
    return;
  }
  spRenderTracks(spRecent);
}

function spDoSearch(term){
  const main = document.getElementById('spMain');
  if (!main) return;
  if (!term.trim()) { spRenderRecent(); return; }
  localStorage.setItem(SP_STORAGE_LAST, term);
  main.innerHTML = '<div class="sp-loading">Searching…</div>';
  fetch(spSearchUrl(term))
    .then(r => r.json())
    .then(data => {
      const tracks = (data.results || []).map(spNormalize);
      spRenderTracks(tracks);
    })
    .catch(() => {
      main.innerHTML = '<div class="sp-empty"><b>Could not reach the music service</b><span>Check your connection and try again.</span></div>';
    });
}

function wireSpotify(win){
  spLoadStorage();

  const search = win.querySelector('#spSearch');
  const audio = win.querySelector('#spAudio');
  const playBtn = win.querySelector('#spPlayBtn');
  const prevBtn = win.querySelector('#spPrev');
  const nextBtn = win.querySelector('#spNext');
  const seek = win.querySelector('#spSeek');
  const vol = win.querySelector('#spVol');
  const time = win.querySelector('#spTime');
  const dur = win.querySelector('#spDur');

  // Restore volume
  const savedVol = parseFloat(localStorage.getItem(SP_STORAGE_VOL) || '0.8');
  if (vol) vol.value = savedVol;
  if (audio) audio.volume = savedVol;

  // Initial view: recent if any, otherwise empty prompt
  if (spRecent.length) spRenderRecent();

  if (search){
    let t = null;
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => spDoSearch(search.value), 400);
    });
    search.addEventListener('keydown', e => {
      if (e.key === 'Enter'){ clearTimeout(t); spDoSearch(search.value); }
    });
  }

  win.querySelectorAll('.sp-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      win.querySelectorAll('.sp-nav').forEach(b => b.classList.toggle('active', b === btn));
      const tab = btn.dataset.spTab;
      if (tab === 'recent') spRenderRecent();
      else {
        const last = localStorage.getItem(SP_STORAGE_LAST) || '';
        if (last){ spDoSearch(last); } else {
          const main = win.querySelector('#spMain');
          if (main) main.innerHTML = '<div class="sp-empty"><b>Search for a song</b><span>Type in the box above to find music.</span></div>';
        }
      }
    });
  });

  if (playBtn) playBtn.onclick = spTogglePlay;
  if (nextBtn) nextBtn.onclick = spNext;
  if (prevBtn) prevBtn.onclick = spPrev;

  if (audio){
    audio.addEventListener('timeupdate', () => {
      if (time) time.textContent = spFmtTime(audio.currentTime);
      if (seek && audio.duration) seek.value = audio.currentTime;
    });
    audio.addEventListener('loadedmetadata', () => {
      if (dur) dur.textContent = spFmtTime(audio.duration);
      if (seek) seek.max = audio.duration || 30;
    });
    audio.addEventListener('ended', spNext);
    audio.addEventListener('play', () => { spPlaying = true; spUpdatePlayBtn(); });
    audio.addEventListener('pause', () => { spPlaying = false; spUpdatePlayBtn(); });
  }

  if (seek){
    seek.addEventListener('input', () => {
      if (audio && audio.duration) audio.currentTime = parseFloat(seek.value);
    });
  }

  if (vol){
    vol.addEventListener('input', () => {
      const v = parseFloat(vol.value);
      if (audio) audio.volume = v;
      localStorage.setItem(SP_STORAGE_VOL, String(v));
    });
  }
}
/* === END NOVA SPOTIFY === */
/* === NOVA WINDOW FULLSCREEN (auto-generated) === */
const wmFullscreenPrev = new WeakMap();

function wmToggleFullscreen(win){
  if (!win) return;
  const isFs = win.classList.contains('fullscreen');
  if (isFs){
    wmExitFullscreen(win);
  } else {
    wmEnterFullscreen(win);
  }
}

function wmEnterFullscreen(win){
  // Save geometry for restore
  wmFullscreenPrev.set(win, {
    left: win.style.left,
    top: win.style.top,
    width: win.style.width,
    height: win.style.height,
    zIndex: win.style.zIndex,
  });
  win.classList.add('fullscreen');
  document.body.classList.add('has-window-fullscreen');

  // Reflect button state
  const btn = win.querySelector('[data-action="fullscreen"]');
  if (btn){
    btn.textContent = '⤡';
    btn.title = 'Exit fullscreen';
  }

  // Request browser fullscreen, if available.
  const el = document.documentElement;
  if (!document.fullscreenElement && el.requestFullscreen){
    el.requestFullscreen().catch(() => { /* ignore: user gesture required, or blocked */ });
  }
}

function wmExitFullscreen(win){
  const prev = wmFullscreenPrev.get(win);
  win.classList.remove('fullscreen');
  document.body.classList.remove('has-window-fullscreen');

  if (prev){
    win.style.left = prev.left || '';
    win.style.top = prev.top || '';
    win.style.width = prev.width || '';
    win.style.height = prev.height || '';
    if (prev.zIndex) win.style.zIndex = prev.zIndex;
  }

  const btn = win.querySelector('[data-action="fullscreen"]');
  if (btn){
    btn.textContent = '⤢';
    btn.title = 'Fullscreen';
  }

  if (document.fullscreenElement && document.exitFullscreen){
    document.exitFullscreen().catch(() => {});
  }
}

// Escape key handling: exit the fullscreen window, if any.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const fs = document.querySelector('.window.fullscreen');
  if (fs) wmExitFullscreen(fs);
});

// If the user exits browser fullscreen via browser UI (F11), sync our state.
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement){
    const fs = document.querySelector('.window.fullscreen');
    if (fs) wmExitFullscreen(fs);
  }
});
/* === END NOVA WINDOW FULLSCREEN === */
/* === NOVA SNOWFALL (auto-generated) === */
/* NOVA SNOWFALL FIX v2 — canvas sizing handled via ResizeObserver */
(function(){
  let canvas = null;
  let ctx = null;
  let raf = null;
  let flakes = [];
  const FLAKE_COUNT = 60;
  const MIN_SIZE = 50;   // don't draw until the canvas is at least this big

  function enabled(){
    try { return localStorage.getItem('nova-snowfall') === '1'; } catch(e){ return false; }
  }

  function ensureCanvas(){
    if (canvas && document.body.contains(canvas)) return canvas;
    const wall = document.getElementById('wallpaper');
    if (!wall) return null;
    canvas = document.getElementById('snowCanvas');
    if (!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'snowCanvas';
      const shade = wall.querySelector('.wallpaper-shade');
      if (shade && shade.parentNode === wall){
        shade.insertAdjacentElement('afterend', canvas);
      } else {
        wall.insertBefore(canvas, wall.firstChild);
      }
    }
    ctx = canvas.getContext('2d');
    resize();
    return canvas;
  }

  function resize(){
    if (!canvas) return;
    const wall = canvas.parentElement;
    if (!wall) return;
    const r = wall.getBoundingClientRect();
    const w = Math.floor(r.width);
    const h = Math.floor(r.height);
    if (w < 1 || h < 1) return;
    // Only update the backing store if it actually changed.
    if (canvas.width !== w || canvas.height !== h){
      canvas.width  = w;
      canvas.height = h;
      // Force a fresh seed at the new size.
      flakes = [];
    }
  }

  function canDraw(){
    return canvas && canvas.width >= MIN_SIZE && canvas.height >= MIN_SIZE;
  }

  function seed(){
    flakes = [];
    if (!canDraw()) return;
    for (let i = 0; i < FLAKE_COUNT; i++){
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: 0.25 + Math.random() * 0.55,
        a: 0.35 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(){
    if (!ctx || !canvas){ raf = requestAnimationFrame(draw); return; }
    if (!canDraw()){
      // Don't touch the canvas at all if it's too small — this prevents
      // the "stretched 1px canvas covers the screen" bug.
      raf = requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (enabled()){
      if (!flakes.length) seed();
      for (let i = 0; i < flakes.length; i++){
        const f = flakes[i];
        f.phase += 0.02;
        f.x += f.vx + Math.sin(f.phase) * 0.28;
        f.y += f.vy;
        if (f.y > canvas.height + 4){ f.y = -4; f.x = Math.random() * canvas.width; }
        if (f.x < -6) f.x = canvas.width + 6;
        if (f.x > canvas.width + 6) f.x = -6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,' + f.a.toFixed(2) + ')';
        ctx.fill();
      }
    } else {
      flakes = [];
    }
    raf = requestAnimationFrame(draw);
  }

  window.novaSnowInit = function(){
    ensureCanvas();
    if (!canvas) return;
    // ResizeObserver keeps the canvas sized correctly even if the wallpaper
    // becomes visible later (which is what caused the original bug).
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement){
      const ro = new ResizeObserver(function(){ resize(); });
      ro.observe(canvas.parentElement);
    }
    // Belt-and-suspenders: re-measure a few times early on.
    setTimeout(resize, 100);
    setTimeout(resize, 500);
    setTimeout(resize, 1500);
    if (!raf) raf = requestAnimationFrame(draw);
  };

  window.novaWireSnow = function(win){
    const toggle = win.querySelector('#snowToggle');
    if (!toggle) return;
    toggle.classList.toggle('on', enabled());
    toggle.onclick = function(e){
      e.currentTarget.classList.toggle('on');
      const on = e.currentTarget.classList.contains('on');
      try { localStorage.setItem('nova-snowfall', on ? '1' : '0'); } catch(err){}
      flakes = [];
      if (typeof toast === 'function') toast('Snowfall ' + (on ? 'enabled' : 'disabled'));
    };
  };

  window.addEventListener('resize', function(){ resize(); });

  function boot(){
    novaSnowInit();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
/* === END NOVA SNOWFALL === */

/* === NOVA PINNED APPS (auto-generated) === */
(function(){
  const STORAGE_KEY = 'nova-dock-pinned';
  const DEFAULT_PINS = ['files', 'gamelib', 'music', 'store', 'settings'];

  function novaGetPins(){
    try {
      const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(v)) return v.slice();
    } catch(e){}
    return DEFAULT_PINS.slice();
  }

  function novaSetPins(arr){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch(e){}
    if (typeof renderTaskbar === 'function') renderTaskbar();
    novaRenderPinsGrid();
  }

  function novaRenderPinsGrid(){
    const grid = document.getElementById('pinnedAppsGrid');
    if (!grid) return;
    const current = novaGetPins();
    const allApps = Object.keys(appMeta);
    grid.innerHTML = allApps.map(id => {
      const a = appMeta[id];
      const pinned = current.includes(id);
      const icon = (a.icon === '✦')
        ? '<img src="NovaOsLogo.png" alt="" style="width:16px;height:16px">'
        : a.icon;
      return '<button class="pin-chip ' + (pinned ? 'pinned' : '') +
        '" data-pin-app="' + id + '"><span class="pin-icon">' + icon +
        '</span><span>' + a.name + '</span></button>';
    }).join('');
    grid.querySelectorAll('[data-pin-app]').forEach(b => {
      b.onclick = function(){
        const id = b.dataset.pinApp;
        let pins = novaGetPins();
        if (pins.includes(id)) pins = pins.filter(x => x !== id);
        else pins = pins.concat(id);
        novaSetPins(pins);
        if (typeof toast === 'function'){
          toast((pins.includes(id) ? 'Pinned ' : 'Unpinned ') + (appMeta[id] ? appMeta[id].name : id));
        }
      };
    });
  }

  function novaWirePins(win){
    if (!win) return;
    novaRenderPinsGrid();
  }

  window.novaGetPins = novaGetPins;
  window.novaSetPins = novaSetPins;
  window.novaRenderPinsGrid = novaRenderPinsGrid;
  window.novaWirePins = novaWirePins;

  // Re-render the taskbar once on boot so pinned apps show up immediately.
  function boot(){
    if (typeof renderTaskbar === 'function') renderTaskbar();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
/* === END NOVA PINNED APPS === */

/* === NOVA WIDGETS (auto-generated) === */
/* NOVA WIDGET TOGGLES v2 */
(function(){
  const POS_KEY = 'nova-widgets';
  const LOCK_KEY = 'nova-widgets-locked';
  const ENABLED_KEY = 'nova-widgets-enabled';

  const WIDGETS = [
    { id: 'w-clock',    cls: 'w-clock',    key: 'clock',    render: null },
    { id: 'w-calendar', cls: 'w-calendar', key: 'calendar', render: null },
    { id: 'w-notes',    cls: 'w-notes',    key: 'notes',    render: null },
    { id: 'w-quick',    cls: 'w-quick',    key: 'quick',    render: null },
  ];

  function locked(){
    try { return localStorage.getItem(LOCK_KEY) === '1'; } catch(e){ return false; }
  }
  function enabledMap(){
    try {
      const v = JSON.parse(localStorage.getItem(ENABLED_KEY) || 'null');
      if (v && typeof v === 'object') return v;
    } catch(e){}
    return {};
  }
  function setEnabled(key, on){
    const m = enabledMap();
    m[key] = !!on;
    try { localStorage.setItem(ENABLED_KEY, JSON.stringify(m)); } catch(e){}
  }
  function isEnabled(w){
    const m = enabledMap();
    return m[w.key] !== false;   // default = enabled
  }

  function defaultPositions(){
    const vw = window.innerWidth;
    return {
      'w-clock':    { x: Math.max(20, vw - 300), y: 84 },
      'w-calendar': { x: Math.max(20, vw - 300), y: 232 },
      'w-notes':    { x: Math.max(20, vw - 300), y: 456 },
      'w-quick':    { x: Math.max(20, vw - 580), y: 84 },
    };
  }
  function savedPositions(){
    try {
      const v = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
      if (v && typeof v === 'object') return v;
    } catch(e){}
    return null;
  }
  function savePositions(obj){
    try { localStorage.setItem(POS_KEY, JSON.stringify(obj)); } catch(e){}
  }
  function positions(){ return savedPositions() || defaultPositions(); }
  function setPosition(id, x, y){
    const p = positions(); p[id] = { x, y }; savePositions(p);
  }
  function clampToViewport(el){
    const r = el.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    let x = r.left, y = r.top;
    if (x + r.width > vw - 6) x = vw - r.width - 6;
    if (x < 6) x = 6;
    if (y < 62) y = 62;
    if (y + r.height > vh - 14) y = vh - r.height - 14;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    setPosition(el.dataset.wid, x, y);
  }
  function pad2(n){ return (n < 10 ? '0' : '') + n; }

  function renderClock(el){
    const d = new Date();
    let h = d.getHours(); const m = pad2(d.getMinutes());
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    const dateStr = d.toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' });
    el.innerHTML = '<div class="widget-title">Clock</div>' +
      '<div class="wclock-time">' + h + ':' + m + ' <span style="font-size:14px;color:#b6bedd">' + ampm + '</span></div>' +
      '<div class="wclock-date">' + dateStr + '</div>';
  }
  function renderCalendar(el){
    const now = new Date(), year = now.getFullYear(), month = now.getMonth();
    const monthName = now.toLocaleDateString([], { month:'long' });
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();
    const dows = ['S','M','T','W','T','F','S'];
    let html = '<div class="widget-title">Calendar</div>';
    html += '<div class="wcal-head"><span class="wcal-month">' + monthName + '</span><span class="wcal-year">' + year + '</span></div>';
    html += '<div class="wcal-grid">';
    dows.forEach(d => { html += '<span class="wcal-dow">' + d + '</span>'; });
    for (let i = 0; i < firstDow; i++) html += '<span></span>';
    for (let d = 1; d <= daysInMonth; d++){
      const cls = d === today ? 'wcal-today' : '';
      html += '<span class="' + cls + '">' + d + '</span>';
    }
    html += '</div>';
    el.innerHTML = html;
  }
  function renderNotes(el){
    let text = ''; try { text = localStorage.getItem('nova-notes') || ''; } catch(e){}
    const trimmed = text.trim();
    const preview = trimmed.length > 400 ? trimmed.slice(0, 400) + '…' : trimmed;
    el.innerHTML = '<div class="widget-title">Notes</div>' +
      '<div class="wnotes-body">' + (preview ? preview.replace(/</g,'&lt;') : '') + '</div>';
  }
  function renderQuick(el){
    el.innerHTML = '<div class="widget-title">Quick Actions</div>' +
      '<div class="wquick-grid">' +
        '<button class="wquick-btn no-drag" data-open-app="settings"><span>⚙</span><span>Settings</span></button>' +
        '<button class="wquick-btn no-drag" data-open-app="files"><span>▰</span><span>Files</span></button>' +
        '<button class="wquick-btn no-drag" data-open-app="gamelib"><span>♞</span><span>Games</span></button>' +
        '<button class="wquick-btn no-drag" data-open-app="music"><span>♫</span><span>Spotify</span></button>' +
      '</div>';
    el.querySelectorAll('[data-open-app]').forEach(b => {
      b.addEventListener('click', function(ev){
        ev.stopPropagation();
        if (typeof openApp === 'function') openApp(b.dataset.openApp);
      });
    });
  }
  WIDGETS[0].render = renderClock;
  WIDGETS[1].render = renderCalendar;
  WIDGETS[2].render = renderNotes;
  WIDGETS[3].render = renderQuick;

  function renderAll(){
    const layer = document.getElementById('widgetLayer');
    if (!layer) return;
    const pos = positions();
    WIDGETS.forEach(w => {
      let el = layer.querySelector('[data-wid="' + w.id + '"]');
      if (!isEnabled(w)){
        if (el) el.style.display = 'none';
        return;
      }
      if (!el){
        el = document.createElement('div');
        el.className = 'widget ' + w.cls;
        el.dataset.wid = w.id;
        layer.appendChild(el);
      }
      el.style.display = '';
      const p = pos[w.id] || { x: 40, y: 80 };
      el.style.left = p.x + 'px';
      el.style.top  = p.y + 'px';
      el.classList.toggle('locked', locked());
      w.render(el);
    });
  }

  function refreshTick(){
    const now = new Date();
    const clock = document.querySelector('.widget.w-clock');
    if (clock) renderClock(clock);
    const cal = document.querySelector('.widget.w-calendar');
    if (cal && cal.dataset.day !== String(now.getDate())){
      cal.dataset.day = String(now.getDate());
      renderCalendar(cal);
    }
    const notes = document.querySelector('.widget.w-notes');
    if (notes){
      const t = (localStorage.getItem('nova-notes') || '').slice(0,400);
      if (notes.dataset.hash !== t){ notes.dataset.hash = t; renderNotes(notes); }
    }
  }

  function attachDrag(el){
    if (el.dataset.dragWired) return;
    el.dataset.dragWired = '1';
    el.addEventListener('pointerdown', function(e){
      if (locked()) return;
      if (e.target.closest('.no-drag')) return;
      if (e.button !== 0) return;
      e.preventDefault();
      const startX = e.clientX, startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const ox = rect.left, oy = rect.top;
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
      function move(ev){
        let x = ox + (ev.clientX - startX);
        let y = oy + (ev.clientY - startY);
        const r = el.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight;
        if (x < 6) x = 6;
        if (x + r.width > vw - 6) x = vw - r.width - 6;
        if (y < 62) y = 62;
        if (y + r.height > vh - 14) y = vh - r.height - 14;
        el.style.left = x + 'px';
        el.style.top  = y + 'px';
      }
      function end(){
        el.classList.remove('dragging');
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', end);
        el.removeEventListener('pointercancel', end);
        const r = el.getBoundingClientRect();
        setPosition(el.dataset.wid, r.left, r.top);
      }
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    });
  }
  function wireAll(){
    document.querySelectorAll('.widget').forEach(attachDrag);
  }
  function resetPositions(){
    try { localStorage.removeItem(POS_KEY); } catch(e){}
    renderAll(); wireAll(); refreshTick();
  }
  function syncToggles(win){
    const map = [
      ['wToggleClock',    'clock'],
      ['wToggleCalendar', 'calendar'],
      ['wToggleNotes',    'notes'],
      ['wToggleQuick',    'quick'],
    ];
    map.forEach(([id, key]) => {
      const el = win.querySelector('#' + id);
      if (!el) return;
      const on = enabledMap()[key] !== false;
      el.classList.toggle('on', on);
      el.onclick = function(e){
        e.currentTarget.classList.toggle('on');
        const nowOn = e.currentTarget.classList.contains('on');
        setEnabled(key, nowOn);
        renderAll(); wireAll();
        if (typeof toast === 'function') toast(key.charAt(0).toUpperCase() + key.slice(1) + ' widget ' + (nowOn ? 'shown' : 'hidden'));
      };
    });
  }

  window.novaWidgetsInit = function(){
    renderAll(); wireAll(); refreshTick();
    if (!window.__novaWidgetsTicker){
      window.__novaWidgetsTicker = setInterval(refreshTick, 15000);
      refreshTick();
    }
    window.addEventListener('resize', function(){
      document.querySelectorAll('.widget').forEach(clampToViewport);
    });
  };

  window.novaWireWidgets = function(win){
    syncToggles(win);
    const lock = win.querySelector('#widgetLockToggle');
    const reset = win.querySelector('#widgetReset');
    if (lock){
      lock.classList.toggle('on', locked());
      lock.onclick = function(e){
        e.currentTarget.classList.toggle('on');
        const on = e.currentTarget.classList.contains('on');
        try { localStorage.setItem(LOCK_KEY, on ? '1' : '0'); } catch(err){}
        document.querySelectorAll('.widget').forEach(el => el.classList.toggle('locked', on));
        if (typeof toast === 'function') toast('Widgets ' + (on ? 'locked' : 'unlocked'));
      };
    }
    if (reset){
      reset.onclick = function(){
        resetPositions();
        if (typeof toast === 'function') toast('Widget positions reset');
      };
    }
  };

  function boot(){
    try { novaWidgetsInit(); } catch(e){}
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
/* === END NOVA WIDGETS === */
/* === NOVA LOCK SCREEN (auto-generated) === */
(function(){
  const KEY = 'nova-lockscreen';
  let ticker = null;
  let unlocked = false;

  function enabled(){
    try { return localStorage.getItem(KEY) !== '0'; } catch(e){ return true; }
  }

  function wallpaperClass(){
    let key = 'mountains';
    try { key = localStorage.getItem('nova-wallpaper') || 'mountains'; } catch(e){}
    return 'wp-' + key;
  }

  function applyWallpaper(){
    const bg = document.getElementById('lockBg');
    if (!bg) return;
    // Remove any previous wp-* class
    bg.className = 'lock-bg';
    bg.classList.add(wallpaperClass());
  }

  function pad2(n){ return (n < 10 ? '0' : '') + n; }

  function refreshClock(){
    const now = new Date();
    const timeEl = document.getElementById('lockTime');
    const dateEl = document.getElementById('lockDate');
    if (timeEl){
      let h = now.getHours();
      const m = pad2(now.getMinutes());
      const ampm = h >= 12 ? 'AM' : 'AM';
      const isPm = h >= 12;
      h = h % 12; if (h === 0) h = 12;
      timeEl.textContent = h + ':' + m + ' ' + (isPm ? 'PM' : 'AM');
    }
    if (dateEl){
      dateEl.textContent = now.toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' });
    }
  }

  function unlock(){
    if (unlocked) return;
    unlocked = true;
    const el = document.getElementById('lockScreen');
    if (!el) return;
    el.classList.add('unlocking');
    // Stop listening
    document.removeEventListener('keydown', onKey, true);
    el.removeEventListener('click', unlock);
    el.removeEventListener('touchstart', unlock);
    if (ticker) { clearInterval(ticker); ticker = null; }
    setTimeout(function(){
      el.classList.add('hidden');
      el.classList.remove('unlocking');
    }, 460);
  }

  function onKey(e){
    // Prevent any key from reaching the desktop until unlocked
    e.preventDefault();
    e.stopPropagation();
    unlock();
  }

  function novaInitLockscreen(){
    const el = document.getElementById('lockScreen');
    if (!el) return;
    if (!enabled()){
      el.classList.add('hidden');
      return;
    }
    unlocked = false;
    applyWallpaper();
    refreshClock();
    if (ticker) clearInterval(ticker);
    ticker = setInterval(refreshClock, 1000);
    el.classList.remove('hidden');
    el.classList.remove('unlocking');
    el.addEventListener('click', unlock);
    el.addEventListener('touchstart', unlock, { passive: true });
    document.addEventListener('keydown', onKey, true);
  }

  window.novaInitLockscreen = novaInitLockscreen;

  window.novaWireLockscreen = function(win){
    const toggle = win.querySelector('#lockToggle');
    if (!toggle) return;
    toggle.classList.toggle('on', enabled());
    toggle.onclick = function(e){
      e.currentTarget.classList.toggle('on');
      const on = e.currentTarget.classList.contains('on');
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch(err){}
      if (typeof toast === 'function') toast('Lock screen ' + (on ? 'enabled' : 'disabled'));
    };
  };

  // Init at DOM ready — the boot layer (z 9999) is above us, so we'll be
  // revealed when it fades out. When boot is disabled, we appear immediately.
  function boot(){
    try { novaInitLockscreen(); } catch(e){}
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
/* === END NOVA LOCK SCREEN === */
function wireSettingsRefresh(win){win.querySelectorAll('[data-accent]').forEach(b=>b.style.borderColor=b.dataset.accent===appState.accent?'white':'transparent')}
function wireCalc(win){const display=win.querySelector('#calcDisplay');win.querySelectorAll('[data-calc]').forEach(b=>b.onclick=()=>{const k=b.dataset.calc;if(k==='C')calcExpr='0';else if(k==='⌫')calcExpr=calcExpr.length>1?calcExpr.slice(0,-1):'0';else if(k==='±')calcExpr=String(Number(calcExpr)*-1);else if(k==='='){try{let exp=calcExpr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/%/g,'/100');if(!/^[0-9+\-*/(). ]+$/.test(exp))throw 0;calcExpr=String(Function('"use strict";return ('+exp+')')());if(!Number.isFinite(Number(calcExpr)))calcExpr='Error'}catch{calcExpr='Error'}}else{if(calcExpr==='0'||calcExpr==='Error')calcExpr='';calcExpr+=k}display.textContent=calcExpr})}
function wireStore(win){win.querySelectorAll('[data-install]').forEach(b=>b.onclick=()=>{const id=b.dataset.install;if(!appState.installed.includes(id)){appState.installed.push(id);localStorage.setItem('nova-installed',JSON.stringify(appState.installed));b.textContent='Open';toast(appMeta[id].name+' installed')}else openApp(id)});win.querySelectorAll('[data-store-open]').forEach(b=>b.onclick=()=>openApp(b.dataset.storeOpen))}
function renderTaskbar(){
  // Pinned apps on the left, running-only apps on the right.
  const host = document.getElementById('taskbarApps');
  if (!host) return;
  const pins = novaGetPins();
  const runningIds = $$('.window').map(w => w.dataset.app);
  const runningOnly = runningIds.filter(id => !pins.includes(id));

  const btn = (id, isRunning) => {
    const m = appMeta[id];
    if (!m) return '';
    return '<button class="task-app ' + (isRunning ? 'running' : '') +
      '" data-task="' + id + '" title="' + m.name + '">' + m.icon + '</button>';
  };

  host.innerHTML =
    pins.map(id => btn(id, runningIds.includes(id))).join('') +
    (runningOnly.length ? '<span class="tray-sep" style="height:22px;margin:0 6px"></span>' : '') +
    runningOnly.map(id => btn(id, true)).join('');

  host.querySelectorAll('.task-app').forEach(b => {
    b.onclick = () => openApp(b.dataset.task);
  });
}
function initSnake(win){
 const canvas=win.querySelector('#snakeCanvas'),ctx=canvas.getContext('2d');const cell=13,cols=Math.floor(canvas.width/cell),rows=Math.floor(canvas.height/cell);
 snakeState={snake:[{x:8,y:9},{x:7,y:9},{x:6,y:9}],dir:{x:1,y:0},next:{x:1,y:0},food:{x:17,y:9},score:0,running:false,over:false,win};
 function food(){let f;do{f={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}while(snakeState.snake.some(p=>p.x===f.x&&p.y===f.y));return f}
 function draw(){ctx.fillStyle='#071226';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.strokeStyle='#ffffff09';for(let x=0;x<cols;x++)for(let y=0;y<rows;y++)ctx.strokeRect(x*cell,y*cell,cell,cell);ctx.fillStyle='#ff628a';ctx.shadowColor='#ff628a';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(snakeState.food.x*cell+cell/2,snakeState.food.y*cell+cell/2,cell*.36,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;snakeState.snake.forEach((p,i)=>{ctx.fillStyle=i?'#38d6a2':'#8effd6';ctx.beginPath();ctx.roundRect(p.x*cell+1,p.y*cell+1,cell-2,cell-2,3);ctx.fill()})}
 function tick(){if(!snakeState.running)return;snakeState.dir=snakeState.next;const head={x:snakeState.snake[0].x+snakeState.dir.x,y:snakeState.snake[0].y+snakeState.dir.y};if(head.x<0||head.y<0||head.x>=cols||head.y>=rows||snakeState.snake.some(p=>p.x===head.x&&p.y===head.y)){snakeState.running=false;snakeState.over=true;win.querySelector('#snakeStatus').textContent='Game over';win.querySelector('#snakeStart').textContent='Try again';stopSnake();return}snakeState.snake.unshift(head);if(head.x===snakeState.food.x&&head.y===snakeState.food.y){snakeState.score++;win.querySelector('#snakeScore').textContent=snakeState.score;let best=Number(localStorage.getItem('nova-snake-best')||0);if(snakeState.score>best){localStorage.setItem('nova-snake-best',snakeState.score);win.querySelector('#snakeBest').textContent=snakeState.score}snakeState.food=food()}else snakeState.snake.pop();draw()}
 function start(){if(snakeState.over)reset();snakeState.running=true;win.querySelector('#snakeStatus').textContent='Playing';win.querySelector('#snakeStart').textContent='Restart';clearInterval(snakeTimer);snakeTimer=setInterval(tick,115)}
 function reset(){snakeState.snake=[{x:8,y:9},{x:7,y:9},{x:6,y:9}];snakeState.dir={x:1,y:0};snakeState.next={x:1,y:0};snakeState.score=0;snakeState.over=false;snakeState.running=false;snakeState.food=food();win.querySelector('#snakeScore').textContent='0';win.querySelector('#snakeStatus').textContent='Ready';win.querySelector('#snakeStart').textContent='Start game';clearInterval(snakeTimer);draw()}
 win.querySelector('#snakeStart').onclick=start;win.querySelector('#snakePause').onclick=()=>{snakeState.running=!snakeState.running;win.querySelector('#snakeStatus').textContent=snakeState.running?'Playing':'Paused';if(snakeState.running){clearInterval(snakeTimer);snakeTimer=setInterval(tick,115)}else clearInterval(snakeTimer)};win.querySelector('#snakeReset').onclick=reset;win.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>setDir(b.dataset.dir));
 function setDir(d){const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};const v=dirs[d];if(v&&!(v.x===-snakeState.dir.x&&v.y===-snakeState.dir.y))snakeState.next=v}
 win._snakeKey=e=>{const map={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};if(map[e.key]&&$('.window.active')===win){e.preventDefault();setDir(map[e.key])}};window.addEventListener('keydown',win._snakeKey);draw();
}
function stopSnake(){clearInterval(snakeTimer);$$('.window[data-app="snake"]').forEach(w=>{if(w._snakeKey)window.removeEventListener('keydown',w._snakeKey)})}
function openStart(){ $('#startMenu').classList.toggle('hidden');$('#profileMenu').classList.add('hidden');renderPinned($('#startSearch').value||'')}
function renderPinned(filter=''){const host=$('#pinnedGrid');host.innerHTML='';Object.keys(appMeta).filter(id=>appMeta[id].name.toLowerCase().includes(filter.toLowerCase())).slice(0,9).forEach(id=>{const b=document.createElement('button');b.innerHTML=glyph(id)+`<span>${appMeta[id].name}</span>`;b.onclick=()=>openApp(id);host.appendChild(b)})}
$('#startButton').onclick=openStart;$('#startSearch').addEventListener('input',e=>renderPinned(e.target.value));$('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.toLowerCase();const id=Object.keys(appMeta).find(k=>k.includes(q)||appMeta[k].name.toLowerCase().includes(q));if(id)openApp(id);else toast('No app found for “'+e.target.value+'”')}});$('#globalSearch').addEventListener('focus',()=>$('#startMenu').classList.add('hidden'));
$$('.desktop-icon').forEach(b=>b.onclick=()=>openApp(b.dataset.app));
$('#profileButton').onclick=()=>{$('#profileMenu').classList.toggle('hidden');$('#startMenu').classList.add('hidden');$('#profileInput').value=appState.profile.name;$('#initialInput').value=appState.profile.initial};
$('#editProfile').onclick=()=>{$('#startMenu').classList.add('hidden');$('#profileMenu').classList.remove('hidden');$('#profileInput').value=appState.profile.name;$('#initialInput').value=appState.profile.initial};
$('#saveProfile').onclick=()=>{appState.profile.name=$('#profileInput').value.trim()||'Nova User';appState.profile.initial=($('#initialInput').value.trim()||appState.profile.name[0]).slice(0,2).toUpperCase();localStorage.setItem('nova-profile',JSON.stringify(appState.profile));applyPrefs();$('#profileMenu').classList.add('hidden');toast('Profile saved')};
$('#themeQuick').onclick=()=>{const themes=['#9a7bff','#4e8cff','#28c5c7','#ff6488'];appState.accent=themes[(themes.indexOf(appState.accent)+1)%themes.length];localStorage.setItem('nova-accent',appState.accent);applyPrefs();toast('Accent switched')};
$('#wifiButton').onclick=()=>toast('You are connected to your browser ✦');$('#soundButton').onclick=()=>toast('System sounds are currently muted');$('#powerButton').onclick=()=>{if(confirm('Restart NOVA OS? Your notes and preferences are saved on this device.'))location.reload()};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#startMenu')&&!e.target.closest('#startButton'))$('#startMenu').classList.add('hidden');if(!e.target.closest('#profileMenu')&&!e.target.closest('#profileButton')&&!e.target.closest('#editProfile'))$('#profileMenu').classList.add('hidden')});
window.addEventListener('resize',()=>$$('.window.maximized').forEach(w=>{w.style.width='calc(100% - 24px)';w.style.height='calc(100% - 20px)'}));
function boot(){
 const b=$('#boot');
 const show=localStorage.getItem('nova-boot')!=='0';
 const finish=()=>{
   b.classList.add('fade-out');
   setTimeout(()=>{
     b.classList.add('hidden');
     const d=$('#desktop');
     d.classList.remove('hidden');
     d.classList.add('fade-in');
     setTimeout(()=>d.classList.remove('fade-in'),500);
   },420);
 };
 // Rebuild boot DOM so the new layout is guaranteed even on an old index.html.
 b.innerHTML = `
   <img src="NovaOsLogo.png" alt="" class="nova-boot-logo">
   <div class="nova-boot-title">NOVA <span>OS</span></div>
   <div class="nova-boot-sub">Starting up</div>
   <div class="nova-boot-track"><i></i></div>
   <div class="nova-boot-ver">v1.0</div>
   <button class="boot-skip" id="skipBoot">Skip</button>
 `;
 const skip=()=>{
   document.removeEventListener('keydown',onKey);
   finish();
 };
 const onKey=(e)=>{ if(e.key==='Escape') skip(); };
 b.querySelector('#skipBoot').onclick=skip;
 document.addEventListener('keydown',onKey);
 if(!show){ skip(); return; }
 setTimeout(finish,3000);
 if(localStorage.getItem('nova-icons')==='0'){
   const icons=$('#desktopIcons');
   if(icons) icons.style.display='none';
 }
}
boot();renderPinned();renderTaskbar();
/* === NOVA DOCK RESTYLE (auto-generated) === */
(function(){
  function wireDock(){
    const power = document.getElementById('dockPower');
    if (power && !power.dataset.wired){
      power.dataset.wired = '1';
      power.onclick = function(){
        if (confirm('Restart NOVA OS? Your notes and preferences are saved on this device.')){
          location.reload();
        }
      };
    }
    const topBtn = document.getElementById('topbarAppName');
    const menu = document.getElementById('startMenu');
    if (topBtn && menu && !topBtn.dataset.startWired){
      topBtn.dataset.startWired = '1';
      topBtn.addEventListener('click', function(e){
        e.stopPropagation();
        const wasHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        if (wasHidden){
          const r = topBtn.getBoundingClientRect();
        }
      });
      document.addEventListener('click', function(e){
        if (menu.classList.contains('hidden')) return;
        if (menu.contains(e.target)) return;
        if (e.target === topBtn) return;
        menu.classList.add('hidden');
      });
    }
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', wireDock);
  } else {
    setTimeout(wireDock, 0);
  }
})();
/* === END NOVA DOCK RESTYLE === */
})();
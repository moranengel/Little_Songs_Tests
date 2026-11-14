'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const audio = $('audio');
  const PL = LittleSongsPlaylists;
  let playlists = [], activePlaylistId = 'all', librarySort = 'manual';
  let queueIds = [], queuePlaylistId = 'all', shuffle = false, repeat = 'off';
  let playlistEditingId = null, draftTrackIds = new Set(), importTargetId = 'all';
  const icons = ['🐻','🐰','🐸','🐳','🦁','🦋','🐥','🐼','🐶','🐱','🐘','🦄','🚂','🚗','⭐','🌈','🌙','☀️','🌸','🎵'];
  const colors = ['#ffe3cd','#f7dde9','#ddeed5','#d9edf8','#fff0be','#e8dff8'];
  let db, tracks = [], currentId = null, objectURL = null, editing = false;
  let editingId = null, pickedIcon = '', operation = false, shellReady = false, scrubbing = false;
  let noticeTimer, playToken = 0;
  let backupState = {revision:0,savedRevision:0,lastConfirmedAt:0};
  let preparedBackup = null, offeredBackup = null, preparationTimer, preparationToken = 0, preparing = false, backupError = '';
  const visible = () => PL.select(tracks,null,librarySort);
  const activePlaylist = () => playlists.find(p=>p.id===activePlaylistId);
  const listed = () => PL.select(tracks,activePlaylist(),librarySort);
  const playlistName = id => id==='all' ? 'כל השירים' : playlists.find(p=>p.id===id)?.name || 'פלייליסט שנמחק';
  function playableQueue() { const p = playlists.find(p=>p.id===queuePlaylistId); const allowed = new Set((queuePlaylistId==='all' ? visible() : p ? PL.select(tracks,p) : []).map(t=>t.id)); return queueIds.filter(id=>allowed.has(id)); }
  const searchKey = text => text.normalize('NFKD').replace(/[\u0591-\u05c7]/g,'').toLocaleLowerCase('he').trim();
  const matchesSearch = track => searchKey(track.title).includes(searchKey($('song-search').value));
  const current = () => tracks.find(t => t.id === currentId);
  const hash = str => [...str].reduce((h,c) => (h*31+c.codePointAt(0))>>>0,0);
  const iconFor = t => t.icon || icons[hash(t.id)%8];
  const time = n => { n = Number.isFinite(n) && n > 0 ? Math.floor(n) : 0; return Math.floor(n/60)+':'+String(n%60).padStart(2,'0'); };
  const message = error => error?.name === 'QuotaExceededError' ? 'אין מספיק מקום פנוי לשמירה. פנו מקום באייפון ונסו שוב.' : error?.message || String(error);
  function notify(text) { clearTimeout(noticeTimer); $('notice').textContent = text; $('notice').hidden = false; noticeTimer = setTimeout(() => $('notice').hidden = true,6000); }
  function openDB() {
    return new Promise((resolve,reject) => {
      const request = indexedDB.open('little-songs-test-v1',1);
      request.onupgradeneeded = () => { request.result.createObjectStore('tracks',{keyPath:'id'}); request.result.createObjectStore('meta',{keyPath:'key'}); };
      request.onsuccess = () => { const result = request.result; result.onversionchange = () => result.close(); resolve(result); };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('סגרי חלונות אחרים של הנגן ונסי שוב.'));
    });
  }
  function read(store, key) {
    return new Promise((resolve,reject) => {
      const tx = db.transaction(store,'readonly'); const request = key === undefined ? tx.objectStore(store).getAll() : tx.objectStore(store).get(key);
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
  }
  function write(store, entries, deletions = [], changed = false, extraMeta = []) {
    return new Promise((resolve,reject) => {
      const tx = db.transaction(changed || extraMeta.length ? [...new Set([store,'meta'])] : store,'readwrite'); const table = tx.objectStore(store);
      if (changed) {
        const meta = tx.objectStore('meta'); const stateRequest = meta.get('backupState');
        stateRequest.onsuccess = () => {
          const old = stateRequest.result?.value || {revision:0,savedRevision:0,lastConfirmedAt:0};
          meta.put({key:'backupState',value:{...old,revision:old.revision+1}});
        };
      }
      entries.forEach(entry => table.put(entry)); deletions.forEach(key => table.delete(key));
      if (extraMeta.length) extraMeta.forEach(entry=>tx.objectStore('meta').put(entry));
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('השמירה לא הושלמה.'));
    });
  }
  async function reload() {
    tracks = await read('tracks');
    playlists = PL.validate((await read('meta','playlists'))?.value || []);
    librarySort = (await read('meta','librarySort'))?.value === 'name' ? 'name' : 'manual';
    if (activePlaylistId!=='all' && !activePlaylist()) activePlaylistId='all';
    const stored = await read('meta','backupState');
    backupState = stored?.value || {revision:tracks.length ? 1 : 0,savedRevision:0,lastConfirmedAt:0};
    if (!stored && tracks.length) await write('meta',[{key:'backupState',value:backupState}]);
    if (preparedBackup && preparedBackup.revision !== backupState.revision) preparedBackup = null;
    render(); scheduleBackup();
  }
  async function busy(task) {
    if (operation) return;
    operation = true; document.querySelectorAll('.parent-actions button,#import,#edit-form button,#backup-import,#playlist-form button,#song-sort,#manage-current,#manage-playlists,#create-playlist').forEach(b => b.disabled = true);
    try { await task(); } catch(error) { if ($('parents').open) backupError = message(error); notify(message(error)); }
    finally { operation = false; document.querySelectorAll('.parent-actions button,#import,#edit-form button,#backup-import,#playlist-form button,#song-sort,#manage-current,#manage-playlists,#create-playlist').forEach(b => b.disabled = false); renderBackup(); }
  }
  function validateCatalog(data) {
    if (!data || !Array.isArray(data.songs)) throw new Error('רשימת השירים באתר אינה תקינה.');
    const seen = new Set();
    return data.songs.map((s,index) => {
      if (typeof s.id !== 'string' || !s.id || seen.has(s.id) || typeof s.file !== 'string' || typeof s.title !== 'string') throw new Error('פרטי השירים באתר אינם תקינים.');
      const url = new URL(s.file, location.href); const base = new URL('./',location.href);
      if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname+'songs/')) throw new Error('קובץ שיר חייב להיות בתיקיית songs של האתר.');
      seen.add(s.id);
      return {id:'catalog:'+s.id,title:s.title.slice(0,180),url:url.href,source:'catalog',defaultIcon: typeof s.icon === 'string' ? s.icon : '',duration:Number(s.duration)||0,order:index};
    });
  }
  async function refreshCatalog(silent = false) {
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(),10000);
    try {
      const response = await fetch('./songs.json',{cache:'no-cache',signal:controller.signal});
      if (!response.ok) throw new Error('לא ניתן לטעון את רשימת השירים מהאתר.');
      const catalog = validateCatalog(await response.json()); const previous = new Map((await read('tracks')).map(t => [t.id,t]));
      const updates = catalog.map(t => {
        const old = previous.get(t.id);
        return old ? {...old,url:t.url,order:Number.isFinite(old.order) ? old.order : t.order,duration:t.duration,title:old.renamed ? old.title : t.title} : {...t,icon:t.defaultIcon,hidden:false};
      });
      const changed = updates.some(t => {const old=previous.get(t.id);return !old || t.title!==old.title || t.icon!==old.icon || t.order!==old.order;});
      await write('tracks',updates,[],changed); await write('meta',[{key:'catalogUpdated',value:Date.now()}]);
      await reload(); if (!silent) notify('רשימת השירים עודכנה. השינויים האישיים שלך נשמרו.');
    } catch(error) {
      if (!tracks.length) notify('לא ניתן לבדוק שירים באתר כרגע. אפשר להוסיף שירים מהמכשיר.');
      else if (!silent) notify('אין חיבור לאתר כרגע. הספרייה המקומית נשארה זמינה.');
    } finally { clearTimeout(timeout); }
  }
  function setMediaInfo(track) {
    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
      try { navigator.mediaSession.metadata = new MediaMetadata({title:track.title,artist:'השירים הקטנים שלנו',artwork:[{src:new URL('./icons/icon-512.png',location.href).href,sizes:'512x512',type:'image/png'}]}); } catch {}
    }
  }
  function resetPlayer() {
    playToken++; audio.pause(); audio.removeAttribute('src'); audio.load(); currentId = null;
    if (objectURL) { URL.revokeObjectURL(objectURL); objectURL = null; }
    syncPlayer();
  }
  async function playSong(id, toggle = true, fromQueue = false) {
    const track = tracks.find(t => t.id === id && !t.hidden); if (!track) return;
    if (!fromQueue) { queuePlaylistId = activePlaylistId; queueIds = PL.queue(listed().map(t=>t.id),id,shuffle); }
    const token = ++playToken;
    try {
      if (currentId === id && audio.getAttribute('src')) {
        if (toggle && !audio.paused) { audio.pause(); return; }
        if (audio.ended) audio.currentTime = 0;
      } else {
        if (!track.blob && navigator.onLine === false) { notify('השיר הזה עדיין לא נשמר לאופליין. התחברי לאינטרנט ושמרי אותו דרך האזור להורים.'); return; }
        audio.pause();
        if (objectURL) { URL.revokeObjectURL(objectURL); objectURL = null; }
        currentId = id;
        if (track.blob) { objectURL = URL.createObjectURL(track.blob); audio.src = objectURL; }
        else audio.src = track.url;
        setMediaInfo(track); render();
      }
      await audio.play();
    } catch(error) { if (token === playToken && error.name !== 'AbortError') notify('לא ניתן לנגן את השיר. בדקי את החיבור או נסי קובץ שמע אחר.'); }
    syncPlayer();
  }
  function moveSong(offset, ended = false) {
    if (ended && repeat==='one' && current() && !current().hidden) { audio.currentTime=0; return playSong(currentId,false,true); }
    const next = PL.adjacent(playableQueue(),currentId,offset,repeat);
    if (next) return playSong(next,false,true);
    if (ended) { audio.pause(); syncPlayer(); }
  }
  function syncPlayer() {
    const track = current(); const list = listed();
    $('now-title').textContent = track?.title || 'בוחרים ומקשיבים';
    $('now-icon').textContent = track ? iconFor(track) : '🧸';
    $('now-label').textContent = track ? 'השיר שבחרנו' : 'איזה שיר נשמע היום?';
    const isPlaying = !!track && !audio.paused && !audio.ended;
    $('play').textContent = isPlaying ? 'Ⅱ' : '▶︎'; $('play').setAttribute('aria-label',isPlaying ? 'השהיה' : 'ניגון'); $('play').disabled = !track && !list.length;
    $('play-state').textContent = !track ? 'קצת מוזיקה, המון שמחה' : audio.error ? 'לא ניתן לנגן את הקובץ' : audio.ended ? 'איזה כיף לשיר ביחד' : isPlaying ? 'שרים ביחד 🎶' : 'מוכנים להמשיך?';
    const duration = Number.isFinite(audio.duration) ? audio.duration : track?.duration || 0;
    $('elapsed').textContent = time(audio.currentTime); $('duration').textContent = time(duration);
    $('seek').disabled = !track || !duration; $('seek').max = String(Math.max(1,duration));
    if (!scrubbing) $('seek').value = String(Math.min(audio.currentTime || 0,Math.max(1,duration)));
    const queue = playableQueue(); $('previous').disabled = !PL.adjacent(queue,currentId,-1,repeat); $('next').disabled = !PL.adjacent(queue,currentId,1,repeat);
    $('shuffle').setAttribute('aria-pressed',String(shuffle));
    const repeatLabel = repeat==='one' ? 'חזרה על שיר אחד' : repeat==='all' ? 'חזרה על הפלייליסט' : 'חזרה כבויה';
    $('repeat').textContent = (repeat==='one' ? '↻ 1 ' : '↻ ')+repeatLabel; $('repeat').setAttribute('aria-label',repeatLabel); $('repeat').classList.toggle('repeat-active',repeat!=='off');
    $('queue-label').textContent = track ? 'מנגנים מתוך: '+playlistName(queuePlaylistId) : 'בחירת שיר תתחיל את הרשימה';
    document.querySelectorAll('.song-card').forEach(card => {
      const active = card.dataset.id === currentId; card.classList.toggle('active',active);
      const button = card.querySelector('.song-main'); button.querySelector('.song-play').textContent = active && isPlaying ? 'Ⅱ' : '▶︎';
      const item = tracks.find(t => t.id === card.dataset.id);
      if (item) button.setAttribute('aria-label',(active && isPlaying ? 'השהיית ' : 'ניגון ')+item.title);
    });
  }
  function render() {
    const library = visible(); const all = listed(); const list = all.filter(matchesSearch); $('song-list').replaceChildren(); $('empty').hidden = !!all.length; $('no-results').hidden = !all.length || !!list.length; $('count').textContent = list.length === all.length ? all.length+' שירים' : list.length+' מתוך '+all.length;
    $('list-title').textContent = (activePlaylist()?.icon || '🎶')+' '+playlistName(activePlaylistId);
    $('manage-current').hidden = activePlaylistId==='all'; $('song-sort').value = activePlaylist()?.sortMode || librarySort;
    $('finish-editing').hidden = !editing; $('manual-order-help').hidden = !editing;
    $('empty-title').textContent = activePlaylistId==='all' ? 'כאן יגורו השירים שלכם' : 'הפלייליסט הזה עדיין ריק';
    $('empty-hint').textContent = activePlaylistId==='all' ? 'אפשר להוסיף קובצי שירים או לשחזר גיבוי בהגדרות.' : 'בחרו שירים מהספרייה או הוסיפו קובצי שירים ישירות לפלייליסט.';
    $('empty-choose').hidden = activePlaylistId==='all';
    renderDrawer();
    for (const track of list) {
      const card = document.createElement('div'); card.className = 'song-card'; card.dataset.id = track.id; card.style.backgroundColor = colors[hash(track.id)%colors.length];
      const button = document.createElement('button'); button.className = 'song-main'; button.type = 'button';
      const animal = document.createElement('span'); animal.className = 'song-animal'; animal.textContent = iconFor(track); animal.setAttribute('aria-hidden','true');
      const copy = document.createElement('span'); copy.className = 'song-copy';
      const name = document.createElement('span'); name.className = 'song-name'; name.textContent = track.title;
      const caption = document.createElement('span'); caption.className = 'song-caption'; caption.textContent = track.blob ? '✓ שמור באייפון' : '☁ להאזנה דרך האינטרנט';
      copy.append(name,caption); const play = document.createElement('span'); play.className = 'song-play'; play.textContent = '▶︎'; play.setAttribute('aria-hidden','true');
      button.append(animal,copy,play); button.addEventListener('click',() => editing ? editSong(track.id) : playSong(track.id)); card.append(button);
      if (editing) { const edit = document.createElement('button'); edit.className = 'edit-song'; edit.textContent = '✎'; edit.setAttribute('aria-label','עריכת '+track.title); edit.addEventListener('click',() => editSong(track.id)); card.append(edit); }
      if (editing) {
        const order = listed(); const pos=order.findIndex(t=>t.id===track.id); const controls=document.createElement('div'); controls.className='order-controls';
        for (const [delta,label] of [[-1,'הזזה למעלה'],[1,'הזזה למטה']]) { const b=document.createElement('button'); b.textContent=delta<0?'↑':'↓'; b.setAttribute('aria-label',label+' '+track.title); b.disabled=delta<0?pos===0:pos===order.length-1; b.addEventListener('click',()=>reorderTrack(track.id,delta)); controls.append(b); }
        if(activePlaylist()) { const b=document.createElement('button');b.textContent='−';b.setAttribute('aria-label','הסרה מהפלייליסט '+track.title);b.addEventListener('click',()=>removeFromPlaylist(track.id));controls.append(b); }
        card.append(controls);
      }
      $('song-list').append(card);
    }
    $('restore').hidden = !tracks.some(t => t.hidden);
    $('edit-toggle').textContent = editing ? 'סיום עריכה' : 'עריכת שירים'; $('edit-toggle').setAttribute('aria-pressed',String(editing));
    const saved = library.filter(t => t.blob).length;
    $('offline-status').textContent = (shellReady ? '✓ הממשק מוכן לאופליין' : 'הממשק עדיין לא אושר לאופליין')+' · '+saved+' מתוך '+library.length+' שירים שמורים';
    syncPlayer(); renderBackup();
  }
  async function requestPersistence() { try { if (navigator.storage?.persist) await navigator.storage.persist(); } catch {} }
  async function importFiles(files) {
    const targetId = importTargetId; importTargetId='all';
    if (!files.length) return;
    await busy(async () => {
      await requestPersistence(); let added = 0; const failed = [];
      for (const file of files) {
        try {
          if (!(file.type.startsWith('audio/') || /\.(mp3|m4a|aac|wav|aif|aiff|flac|caf|ogg|mp4)$/i.test(file.name))) throw new Error('סוג קובץ לא נתמך');
          if (!file.size) throw new Error('הקובץ ריק');
          const id = 'local:'+(crypto.randomUUID ? crypto.randomUUID() : Date.now()+'-'+Math.random().toString(36).slice(2));
          const nextPlaylists=playlists.map(p=>p.id===targetId ? {...p,trackIds:[...p.trackIds,id]} : p);
          await write('tracks',[{id,title:file.name.replace(/\.[^.]+$/,'').slice(0,180),source:'local',blob:file,hidden:false,order:Date.now()+added}],[],true,[{key:'playlists',value:nextPlaylists}]); playlists=nextPlaylists; added++;
        } catch(error) { failed.push(file.name+': '+message(error)); }
      }
      await reload(); notify('נוספו '+added+' שירים לאייפון'+(failed.length ? '. חלק מהקבצים לא נשמרו.' : ''));
      $('download-progress').textContent = failed.join(' | '); $('files').value = '';
    });
  }
  async function downloadAll() {
    await busy(async () => {
      await requestPersistence();
      if (!shellReady) throw new Error('חכי להכנת הממשק לאופליין ונסי שוב. נדרש אתר מאובטח ב־HTTPS.');
      const pending = visible().filter(t => t.source === 'catalog' && !t.blob); let done = 0; const failures = [];
      for (const track of pending) {
        $('download-progress').textContent = 'שומרים '+(done+failures.length+1)+' מתוך '+pending.length+' · '+track.title;
        try {
          const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(),90000);
          let response, blob;
          try { response = await fetch(track.url,{signal:controller.signal}); if (!response.ok) throw new Error('ההורדה נכשלה'); blob = await response.blob(); } finally { clearTimeout(timeout); }
          if (!blob.size || blob.type.includes('text/html')) throw new Error('קובץ שמע לא תקין');
          const latest = await read('tracks',track.id); if (!latest || latest.hidden) continue;
          await write('tracks',[{...latest,blob}],[],true); done++; await reload();
        } catch(error) { failures.push(track.title+': '+message(error)); }
      }
      $('download-progress').textContent = failures.length ? failures.join(' | ') : pending.length ? 'השמירה הסתיימה. אפשר לבדוק במצב טיסה 🎉' : 'כל השירים הגלויים כבר שמורים באייפון ✓';
      notify(failures.length ? 'חלק מהשירים לא נשמרו. אפשר לנסות שוב — שירים שכבר נשמרו לא יורדו מחדש.' : 'השירים מוכנים להאזנה ללא אינטרנט');
    });
  }
  function markIcon(value) { pickedIcon = value; $('custom-icon').value = value; document.querySelectorAll('.icon-option').forEach(b => { const selected = b.textContent === value; b.classList.toggle('selected',selected); b.setAttribute('aria-pressed',String(selected)); }); }
  function editSong(id) {
    const track = tracks.find(t => t.id === id); if (!track) return;
    editingId = id; $('song-name').value = track.title; $('icon-options').replaceChildren();
    for (const icon of icons) { const b = document.createElement('button'); b.type = 'button'; b.className = 'icon-option'; b.textContent = icon; b.setAttribute('aria-label','בחירת '+icon); b.addEventListener('click',() => markIcon(icon)); $('icon-options').append(b); }
    markIcon(iconFor(track)); $('song-playlist-options').replaceChildren();
    for (const p of playlists) { const row=document.createElement('label');row.className='check-row';const check=document.createElement('input');check.type='checkbox';check.value=p.id;check.checked=p.trackIds.includes(id);const text=document.createElement('span');text.textContent=p.icon+' '+p.name;row.append(check,text);$('song-playlist-options').append(row); }
    if (!playlists.length) $('song-playlist-options').textContent='אפשר ליצור פלייליסט דרך תו הנגינה למעלה.';
    $('edit-dialog').showModal();
  }
  async function saveEdit(event) {
    event.preventDefault(); await busy(async () => {
      const track = await read('tracks',editingId); if (!track) throw new Error('השיר אינו נמצא עוד בספרייה.');
      const title = $('song-name').value.trim(); const icon = $('custom-icon').value.trim() || pickedIcon;
      if (!title) throw new Error('הזיני שם לשיר.');
      if ([...icon].length > 24) throw new Error('בחרי אימוג׳י אחד או סמל קצר.');
      const assigned=new Set([...$('song-playlist-options').querySelectorAll('input:checked')].map(c=>c.value));
      const nextPlaylists=playlists.map(p=>({...p,trackIds:assigned.has(p.id) ? p.trackIds.includes(track.id)?p.trackIds:[...p.trackIds,track.id] : p.trackIds.filter(id=>id!==track.id)}));
      await write('tracks',[{...track,title,icon,renamed:true}],[],title!==track.title || icon!==iconFor(track) || JSON.stringify(nextPlaylists)!==JSON.stringify(playlists),[{key:'playlists',value:nextPlaylists}]); await reload();
      if (currentId === track.id) setMediaInfo({...track,title}); $('edit-dialog').close(); notify('השם והאייקון נשמרו');
    });
  }
  async function deleteSong() {
    const track = tracks.find(t => t.id === editingId); if (!track || !confirm('למחוק את ״'+track.title+'״ מהספרייה ומכל הפלייליסטים במכשיר הזה? קובץ המקור נשאר במקומו.')) return;
    await busy(async () => {
      if (currentId === track.id) resetPlayer();
      const meta=[{key:'playlists',value:playlists.map(p=>({...p,trackIds:p.trackIds.filter(id=>id!==track.id)}))}];
      if (track.source === 'local') await write('tracks',[],[track.id],true,meta);
      else { const record = {...track,hidden:true}; delete record.blob; await write('tracks',[record],[],true,meta); }
      await reload(); $('edit-dialog').close(); notify('השיר הוסר מהמכשיר');
    });
  }
  function renderBackup() {
    const dirty = backupState.revision > backupState.savedRevision;
    const all = visible(); const missing = all.filter(t => !t.blob).length;
    $('backup-shortcut').disabled = !dirty || operation || preparing;
    $('backup-shortcut').classList.toggle('needs-backup',dirty);
    const shortcutLabel = !dirty ? 'אין שינויים שממתינים לגיבוי' : preparing ? 'מכינים את קובץ הגיבוי' : operation ? 'ממתינים לסיום הפעולה' : 'שמירת גיבוי — יש שינויים שלא גובו';
    $('backup-shortcut').setAttribute('aria-label',shortcutLabel); $('backup-shortcut').title=shortcutLabel;
    $('backup-status').textContent = dirty ? 'יש שינויים מאז הגיבוי האחרון שאישרת.' : backupState.lastConfirmedAt ? 'אישרת שמירת גיבוי ב־'+new Date(backupState.lastConfirmedAt).toLocaleString('he-IL') : 'עדיין לא אושרה שמירת גיבוי בקובץ.';
    const ready = preparedBackup?.revision === backupState.revision;
    $('backup-save').textContent = !all.length && !playlists.length && !dirty ? 'אין שירים לגיבוי' : operation ? 'ממתינים לסיום הפעולה…' : preparing ? 'מכינים את קובץ הגיבוי…' : ready ? 'שמירת קובץ הגיבוי' : missing ? 'הורדת השירים והכנת גיבוי' : 'הכנת גיבוי';
    $('backup-save').disabled = operation || preparing || (!all.length && !playlists.length && !dirty);
    $('backup-cancel').hidden = !preparing;
    $('backup-confirm').hidden = !offeredBackup;
    $('backup-confirm').disabled = operation;
    if (backupError) $('backup-progress').textContent = backupError;
    else if (missing) $('backup-progress').textContent = missing+' שירים עדיין לא שמורים במכשיר. לחצי על הכפתור להורדתם והכנת גיבוי. נדרש אינטרנט להשלמת ההורדה.';
    else if (ready && !offeredBackup) $('backup-progress').textContent = 'הקובץ מוכן: '+all.length+' שירים · '+(preparedBackup.file.size/1024/1024).toFixed(1)+' MB. לחצי לשמירה ובחרי ״שמירה בקבצים״.';
    else if (!preparing && !offeredBackup) $('backup-progress').textContent = all.length ? 'הגיבוי נשמר כקובץ עם הסיומת little-songs. לאחר שמירתו אפשר לשחזר גם ללא אינטרנט.' : 'הוסיפי שירים כדי ליצור גיבוי.';
  }
  function scheduleBackup() {
    clearTimeout(preparationTimer);
    // Only prepare locally while the app is open; never launch downloads automatically.
    if (backupState.revision <= backupState.savedRevision || visible().some(t => !t.blob) || preparedBackup?.revision === backupState.revision) return;
    preparationTimer = setTimeout(() => prepareBackup(),700);
  }
  async function prepareBackup() {
    clearTimeout(preparationTimer);
    const token = ++preparationToken; const revision = backupState.revision;
    preparing = true; backupError = ''; renderBackup();
    try {
      const all = visible().map(t => {
        let file = '';
        if (t.source === 'catalog') {
          const url = new URL(t.url || t.file,location.href); const base = new URL('./',location.href);
          if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname+'songs/')) throw new Error('כתובת השיר אינה תקינה.');
          file = url.pathname.slice(base.pathname.length);
        }
        return {...t,icon:iconFor(t),file};
      });
      const backupPlaylists = PL.validate(playlists.map(p=>({...p,trackIds:p.trackIds.filter(id=>all.some(t=>t.id===id))})),all.map(t=>t.id));
      const blob = await LittleSongsBackup.encode(all,(done,total) => {
        if (token !== preparationToken || revision !== backupState.revision) throw new DOMException('הספרייה השתנתה','AbortError');
        $('backup-progress').textContent = 'מכינים גיבוי: '+done+' מתוך '+total+' שירים';
      },{playlists:backupPlaylists,librarySort});
      if (token !== preparationToken || revision !== backupState.revision) return;
      preparedBackup = {revision,file:new File([blob],'Little-Songs-Backup.little-songs',{type:'application/octet-stream'})};
    } catch(error) { if (token === preparationToken && error.name !== 'AbortError') backupError = 'לא ניתן להכין גיבוי: '+message(error); }
    finally { if (token === preparationToken) { preparing = false; renderBackup(); } }
  }
  async function saveBackup(event) {
    const direct = event?.currentTarget?.id === 'backup-shortcut';
    if (operation || preparing) return;
    if (!visible().length && !playlists.length && backupState.revision<=backupState.savedRevision) { notify('הוסיפי שירים או פלייליסט לפני יצירת גיבוי.'); return; }
    if (visible().some(t => !t.blob)) {
      backupError = '';
      if (visible().some(t => !t.blob && t.source !== 'catalog')) {
        backupError = 'חסר קובץ שמע מקומי. הוסיפי אותו מחדש דרך ״הוספת שירים מהאייפון״ כדי לכלול אותו בגיבוי.'; renderBackup(); if (direct) notify(backupError); return;
      }
      if (navigator.onLine === false) { backupError = 'חלק מהשירים עדיין לא הורדו. התחברי לאינטרנט ולחצי שוב על הכנת גיבוי.'; renderBackup(); if(direct)notify(backupError); return; }
      await downloadAll();
      if (visible().some(t => !t.blob)) { backupError = 'חלק מהשירים לא הורדו. בדקי את החיבור ונסי שוב. לא נוצר גיבוי חלקי.'; renderBackup(); if(direct)notify(backupError); return; }
    }
    if (!preparedBackup || preparedBackup.revision !== backupState.revision) { await prepareBackup(); if (direct) notify(backupError || 'הגיבוי מוכן. לחצי שוב על אייקון השמירה כדי לבחור היכן לשמור.'); return; }
    // This runs directly from the user's click, so Safari can open its share sheet.
    const snapshot = preparedBackup;
    try {
      if (navigator.canShare?.({files:[snapshot.file]}) && navigator.share) {
        await navigator.share({files:[snapshot.file],title:'גיבוי השירים שלנו'});
      } else {
        const url = URL.createObjectURL(snapshot.file); const link = document.createElement('a');
        link.href = url; link.download = snapshot.file.name; document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url),60000);
      }
      offeredBackup = snapshot;
      if (direct) $('backup-saved-dialog').showModal();
      $('backup-progress').textContent = 'בחרי ״שמירה בקבצים״, באותה תיקייה, ואז ״החלפה״ אם מתבקשת. רק לאחר שהקובץ נשמר לחצי ״שמרתי את הקובץ״.';
      renderBackup();
    } catch(error) { if (error.name !== 'AbortError') { backupError = 'לא ניתן לפתוח שמירה: '+message(error); renderBackup(); if (direct) notify(backupError); } }
  }
  async function confirmBackup() {
    if (!offeredBackup) return;
    const revision = offeredBackup.revision;
    await busy(async () => {
      await new Promise((resolve,reject) => {
        const tx = db.transaction('meta','readwrite'); const table = tx.objectStore('meta'); const request = table.get('backupState');
        request.onsuccess = () => {
          const latest = request.result?.value || backupState;
          table.put({key:'backupState',value:{...latest,savedRevision:Math.max(latest.savedRevision,revision),lastConfirmedAt:Date.now()}});
        };
        tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
      });
      offeredBackup = null; $('backup-saved-dialog').close(); await reload(); notify('אישור שמירת הגיבוי נרשם');
    });
  }
  async function restoreBackup(file) {
    if (!file) return;
    await busy(async () => {
      backupError = '';
      $('backup-progress').textContent = 'בודקים את קובץ הגיבוי…';
      const archive = await LittleSongsBackup.decodeLibrary(file,(done,total) => { $('backup-progress').textContent = 'בדיקת הגיבוי: '+done+' מתוך '+total+' שירים'; });
      const restored=archive.tracks;
      if (!restored.length && !archive.playlists.length) throw new Error('קובץ הגיבוי אינו מכיל שירים או פלייליסטים.');
      if (!confirm('לשחזר '+restored.length+' שירים ו־'+archive.playlists.length+' פלייליסטים מהגיבוי? שירים עם אותו מזהה יעודכנו, כולל השם והאייקון. שירים אחרים שכבר קיימים בנגן יישארו.')) return;
      await requestPersistence();
      const entries = restored.map(t => t.source === 'catalog' ? {...t,url:new URL(t.file,new URL('./',location.href)).href} : t);
      // All bytes and checksums have been validated before this single atomic write.
      const incoming=new Map(archive.playlists.map(p=>[p.id,p]));
      const merged=[...playlists.filter(p=>!incoming.has(p.id)),...archive.playlists];
      const meta=[{key:'playlists',value:merged}];if(archive.hasPlaylists)meta.push({key:'librarySort',value:archive.librarySort});
      await write('tracks',entries,[],true,meta); resetPlayer();
      offeredBackup = null; preparedBackup = null; $('song-search').value = ''; await reload();
      notify('שוחזרו '+entries.length+' שירים ו־'+archive.playlists.length+' פלייליסטים');
    });
    $('backup-file').value = '';
  }
  async function setupOffline() {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) { $('download-progress').textContent = 'להתקנה ולאופליין יש לפתוח את האתר דרך כתובת HTTPS, ולא כקובץ מקומי.'; return; }
    try {
      const existing = await navigator.serviceWorker.getRegistration('./');
      if (existing?.active) { shellReady = true; render(); }
      await navigator.serviceWorker.register('./sw.js',{scope:'./'});
      await navigator.serviceWorker.ready; shellReady = true; render();
    } catch { if (!shellReady) $('download-progress').textContent = 'הממשק לא נשמר לאופליין. נסי לרענן כשהאינטרנט מחובר.'; }
  }
  function choosePlaylist(id) {
    activePlaylistId = id; $('song-search').value='';
    $('playlists-drawer').close(); render(); document.querySelector('.library-scroll').scrollTop=0;
  }
  function renderDrawer() {
    const nav=$('playlist-nav');nav.replaceChildren();
    for (const p of [{id:'all',name:'כל השירים',icon:'🎶',color:'#eee5fa'},...playlists]) {
      const row=document.createElement('div');row.className='playlist-nav-row';
      const button=document.createElement('button');button.className='playlist-choice';button.style.backgroundColor=p.color;button.setAttribute('aria-current',String(p.id===activePlaylistId));button.setAttribute('aria-label','בחירת '+p.name);
      const icon=document.createElement('span');icon.textContent=p.icon;const copy=document.createElement('span');const name=document.createElement('strong');name.textContent=p.name;const count=document.createElement('small');count.textContent=(p.id==='all'?visible():PL.select(tracks,p)).length+' שירים';copy.append(name,count);button.append(icon,copy);button.addEventListener('click',()=>choosePlaylist(p.id));row.append(button);
      if(p.id!=='all'){const edit=document.createElement('button');edit.className='playlist-nav-edit';edit.textContent='✎';edit.setAttribute('aria-label','עריכת הפלייליסט '+p.name);edit.addEventListener('click',()=>editPlaylist(p.id));row.append(edit);}nav.append(row);
    }
  }
  function openDrawer() { if(operation)return; $('parents').close();renderDrawer();$('playlists-drawer').showModal();$('playlists-toggle').setAttribute('aria-expanded','true'); }
  function editPlaylist(id=null) {
    if(operation)return;
    const p=playlists.find(p=>p.id===id);playlistEditingId=p?.id || null;draftTrackIds=new Set(p?.trackIds || []);
    $('playlists-drawer').close();$('parents').close();
    $('playlist-editor-title').textContent=p?'עריכת הפלייליסט':'פלייליסט חדש';$('playlist-name').value=p?.name || '';
    $('playlist-icon').value=p?.icon || '🎵';$('playlist-color').value=p?.color || '#eee5fa';$('playlist-song-search').value='';$('delete-playlist').hidden=!p;$('playlist-editor-status').textContent='';
    renderPlaylistChoices();$('playlist-editor').showModal();
  }
  function renderPlaylistChoices() {
    const root=$('playlist-track-options');root.replaceChildren();
    const query=PL.normalize($('playlist-song-search').value);const all=visible();const filtered=all.filter(t=>PL.normalize(t.title).includes(query));
    for(const t of filtered){const row=document.createElement('label');row.className='check-row';const box=document.createElement('input');box.type='checkbox';box.value=t.id;box.checked=draftTrackIds.has(t.id);box.addEventListener('change',()=>{box.checked?draftTrackIds.add(t.id):draftTrackIds.delete(t.id);$('selection-count').textContent=draftTrackIds.size+' נבחרו';});const label=document.createElement('span');label.textContent=iconFor(t)+' '+t.title;row.append(box,label);root.append(row);}
    if(!filtered.length){const p=document.createElement('p');p.className='hint';p.textContent=all.length?'לא נמצאו שירים לחיפוש הזה.':'הספרייה ריקה. אפשר לשמור את הפלייליסט ולהוסיף אליו שירים בהמשך.';root.append(p);}
    $('selection-count').textContent=draftTrackIds.size+' נבחרו';
  }
  async function savePlaylist(event) {
    event.preventDefault();
    await busy(async()=>{
      try{
        const old=playlists.find(p=>p.id===playlistEditingId);const selected=new Set([...draftTrackIds].filter(id=>visible().some(t=>t.id===id)));
        const ids=[...(old?.trackIds || []).filter(id=>selected.has(id)),...[...selected].filter(id=>!old?.trackIds.includes(id))];
        const p={id:old?.id || 'playlist:'+crypto.randomUUID(),name:$('playlist-name').value.trim(),icon:$('playlist-icon').value.trim(),color:$('playlist-color').value,trackIds:ids,sortMode:old?.sortMode || 'manual'};
        const next=PL.validate([...playlists.filter(q=>q.id!==p.id),p]);
        // Preserve the sidebar order of an existing playlist when renaming it.
        const ordered=old?playlists.map(q=>q.id===p.id?next.find(n=>n.id===p.id):q):next;
        await write('meta',[{key:'playlists',value:ordered}],[],true);activePlaylistId=p.id;await reload();$('playlist-editor').close();notify('הפלייליסט נשמר');
      }catch(error){$('playlist-editor-status').textContent=message(error);throw error;}
    });
  }
  async function deletePlaylist() {
    const p=playlists.find(p=>p.id===playlistEditingId);if(!p||!confirm('למחוק את הפלייליסט ״'+p.name+'״? כל השירים יישארו בספרייה.'))return;
    await busy(async()=>{await write('meta',[{key:'playlists',value:playlists.filter(q=>q.id!==p.id)}],[],true);if(activePlaylistId===p.id)activePlaylistId='all';await reload();$('playlist-editor').close();notify('הפלייליסט נמחק. השירים נשארו בספרייה.');});
  }
  async function removeFromPlaylist(id) {
    const p=activePlaylist();if(!p||!confirm('להסיר את השיר מהפלייליסט ״'+p.name+'״ בלבד? השיר יישאר בספרייה ובפלייליסטים האחרים.'))return;
    await busy(async()=>{await write('meta',[{key:'playlists',value:playlists.map(q=>q.id===p.id?{...q,trackIds:q.trackIds.filter(t=>t!==id)}:q)}],[],true);await reload();notify('השיר הוסר מהפלייליסט בלבד');});
  }
  async function reorderTrack(id,delta) {
    await busy(async()=>{
      const order=listed();const i=order.findIndex(t=>t.id===id);const j=i+delta;if(i<0||j<0||j>=order.length)return;
      [order[i],order[j]]=[order[j],order[i]];
      if(activePlaylist()) { const p=activePlaylist();await write('meta',[{key:'playlists',value:playlists.map(q=>q.id===p.id?{...q,sortMode:'manual',trackIds:order.map(t=>t.id)}:q)}],[],true); }
      else await write('tracks',order.map((t,i)=>({...t,order:i})),[],true,[{key:'librarySort',value:'manual'}]);
      await reload();
    });
  }
  $('playlists-toggle').addEventListener('click',openDrawer);
  $('drawer-close').addEventListener('click',()=>$('playlists-drawer').close());
  $('playlists-drawer').addEventListener('close',()=>$('playlists-toggle').setAttribute('aria-expanded','false'));
  $('manage-playlists').addEventListener('click',openDrawer);
  $('create-playlist').addEventListener('click',()=>editPlaylist());
  $('manage-current').addEventListener('click',()=>editPlaylist(activePlaylistId));
  $('playlist-editor-close').addEventListener('click',()=>$('playlist-editor').close());
  $('playlist-form').addEventListener('submit',savePlaylist);
  $('delete-playlist').addEventListener('click',deletePlaylist);
  $('playlist-song-search').addEventListener('input',renderPlaylistChoices);
  $('select-all-tracks').addEventListener('click',()=>{const query=PL.normalize($('playlist-song-search').value);visible().filter(t=>PL.normalize(t.title).includes(query)).forEach(t=>draftTrackIds.add(t.id));renderPlaylistChoices();});
  $('clear-tracks').addEventListener('click',()=>{draftTrackIds.clear();renderPlaylistChoices();});
  $('empty-choose').addEventListener('click',()=>editPlaylist(activePlaylistId));
  $('empty-import').addEventListener('click',()=>{importTargetId=activePlaylistId;$('files').click();});
  $('finish-editing').addEventListener('click',()=>{editing=false;render();});
  $('song-sort').addEventListener('change',()=>busy(async()=>{const value=$('song-sort').value==='name'?'name':'manual';const p=activePlaylist();await write('meta',p?[{key:'playlists',value:playlists.map(q=>q.id===p.id?{...q,sortMode:value}:q)}]:[{key:'librarySort',value}],[],true);await reload();}));
  $('shuffle').addEventListener('click',()=>{shuffle=!shuffle;const p=playlists.find(p=>p.id===queuePlaylistId);if(currentId)queueIds=PL.queue(PL.select(tracks,p,librarySort).map(t=>t.id),currentId,shuffle);syncPlayer();});
  $('repeat').addEventListener('click',()=>{repeat=repeat==='off'?'one':repeat==='one'?'all':'off';syncPlayer();});

  $('backup-save').addEventListener('click',saveBackup);
  $('backup-cancel').addEventListener('click',() => {
    clearTimeout(preparationTimer); preparationToken++; preparing = false;
    backupError = 'ההכנה בוטלה. אפשר ללחוץ שוב על הכנת גיבוי.'; renderBackup();
  });
  $('backup-confirm').addEventListener('click',confirmBackup);
  $('backup-import').addEventListener('click',() => { if (!operation) $('backup-file').click(); });
  $('backup-file').addEventListener('change',() => restoreBackup($('backup-file').files[0]));
  $('backup-shortcut').addEventListener('click',saveBackup);
  $('backup-saved-yes').addEventListener('click',confirmBackup);
  $('backup-saved-later').addEventListener('click',() => $('backup-saved-dialog').close());
  $('play').addEventListener('click',() => { const t = current() || listed()[0]; if (t) playSong(t.id,true,!!current()); });
  $('previous').addEventListener('click',() => moveSong(-1)); $('next').addEventListener('click',() => moveSong(1));
  $('seek').addEventListener('input',() => { scrubbing = true; $('elapsed').textContent = time(Number($('seek').value)); });
  $('seek').addEventListener('change',() => { if (current() && Number.isFinite(audio.duration)) audio.currentTime = Math.min(audio.duration,Math.max(0,Number($('seek').value))); scrubbing = false; syncPlayer(); });
  for (const name of ['play','pause','ended','timeupdate','loadedmetadata','durationchange','emptied']) audio.addEventListener(name,syncPlayer);
  audio.addEventListener('ended',()=>moveSong(1,true));
  audio.addEventListener('error',() => { if (currentId) { syncPlayer(); notify('לא ניתן לנגן את השיר. נסי להוריד אותו לאופליין או לבחור קובץ אחר.'); } });
  $('parents-toggle').addEventListener('click',() => { $('parents').showModal(); $('parents-toggle').setAttribute('aria-expanded','true'); });
  $('parents-close').addEventListener('click',() => $('parents').close());
  $('parents').addEventListener('close',() => $('parents-toggle').setAttribute('aria-expanded','false'));
  $('search-toggle').addEventListener('click',() => {
    const open = $('search-box').hidden; $('search-box').hidden = !open;
    $('search-toggle').setAttribute('aria-expanded',String(open));
    if (open) $('song-search').focus();
    else { $('song-search').value = ''; render(); }
  });
  $('song-search').addEventListener('input',() => { render(); document.querySelector('.library-scroll').scrollTop = 0; });
  $('search-clear').addEventListener('click',() => { $('song-search').value = ''; render(); $('song-search').focus(); });
  $('edit-toggle').addEventListener('click',() => { editing = !editing; render(); if (editing) $('parents').close(); });
  $('import').addEventListener('click',() => {importTargetId=activePlaylistId;$('files').click();}); $('files').addEventListener('change',() => importFiles([...$('files').files]));
  $('download-all').addEventListener('click',downloadAll); $('refresh').addEventListener('click',() => busy(() => refreshCatalog()));
  $('restore').addEventListener('click',() => busy(async () => { await write('tracks',tracks.filter(t => t.hidden).map(t => ({...t,hidden:false})),[],true); await reload(); notify('השירים חזרו לרשימה. להאזנה אופליין יש לשמור אותם שוב.'); }));
  $('edit-form').addEventListener('submit',saveEdit); $('delete-song').addEventListener('click',deleteSong); $('edit-close').addEventListener('click',() => $('edit-dialog').close());
  $('custom-icon').addEventListener('input',() => { pickedIcon = $('custom-icon').value; });
  if ('mediaSession' in navigator) { for (const [action,handler] of Object.entries({play:() => {const t=current();if(t)playSong(t.id,false,true);},pause:()=>audio.pause(),previoustrack:()=>moveSong(-1),nexttrack:()=>moveSong(1),seekto:details=>{if(Number.isFinite(details.seekTime)) audio.currentTime=details.seekTime;}})) try { navigator.mediaSession.setActionHandler(action,handler); } catch {} }
  window.addEventListener('online',() => { notify('החיבור חזר. אפשר לשמור עוד שירים לאופליין.'); });
  async function start() {
    try { db = await openDB(); await reload(); setupOffline(); await refreshCatalog(true); }
    catch(error) { $('fatal').hidden = false; $('fatal').textContent = 'לא ניתן לפתוח את האחסון המקומי. נסי לפתוח בספארי מחוץ לגלישה פרטית. '+message(error); }
  }
  start();
})();

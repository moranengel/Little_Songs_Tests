'use strict';
(() => {
  const normalize = text => String(text).normalize('NFKD').replace(/[\u0591-\u05c7]/g,'').toLocaleLowerCase('he').trim();
  function validate(value, allowedIds) {
    if (!Array.isArray(value) || value.length > 1000) throw new Error('רשימת הפלייליסטים אינה תקינה.');
    const seen = new Set(); const allowed = allowedIds && new Set(allowedIds);
    return value.map(p => {
      if (!p || typeof p.id!=='string' || !p.id || p.id==='all' || p.id.length>240 || seen.has(p.id) || typeof p.name!=='string' || !p.name.trim() || p.name.length>80 || typeof p.icon!=='string' || !p.icon || [...p.icon].length>24 || typeof p.color!=='string' || !/^#[a-f0-9]{6}$/i.test(p.color) || !Array.isArray(p.trackIds) || p.trackIds.length>10000 || p.trackIds.some(id=>typeof id!=='string'||!id||id.length>240) || new Set(p.trackIds).size!==p.trackIds.length || (allowed && p.trackIds.some(id=>!allowed.has(id))) || !['manual','name'].includes(p.sortMode || 'manual')) throw new Error('פרטי הפלייליסט אינם תקינים.');
      seen.add(p.id); return {id:p.id,name:p.name.trim(),icon:p.icon,color:p.color,trackIds:[...p.trackIds],sortMode:p.sortMode || 'manual'};
    });
  }
  function select(tracks, playlist, sortMode='manual') {
    const all = tracks.filter(t=>!t.hidden); const map = new Map(all.map(t=>[t.id,t]));
    const result = playlist ? playlist.trackIds.map(id=>map.get(id)).filter(Boolean) : [...all].sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
    return (playlist?.sortMode || sortMode)==='name' ? result.sort((a,b)=>a.title.localeCompare(b.title,'he')) : result;
  }
  function shuffled(ids, random=Math.random) {
    const out=[...ids]; for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;
  }
  function queue(ids,startId,shuffle=false,random=Math.random) {
    if (!ids.includes(startId)) return [];
    return shuffle ? [startId,...shuffled(ids.filter(id=>id!==startId),random)] : [...ids];
  }
  function adjacent(ids,currentId,offset,repeat='off') {
    if (!ids.length) return null; const i=ids.indexOf(currentId);if(i<0)return null;
    const next=i+offset;
    return next>=0 && next<ids.length ? ids[next] : repeat==='all' ? ids[(next+ids.length)%ids.length] : null;
  }
  const api={validate,select,normalize,shuffled,queue,adjacent};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.LittleSongsPlaylists=api;
})();

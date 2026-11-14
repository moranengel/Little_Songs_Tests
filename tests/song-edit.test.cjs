const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const fields=Object.fromEntries(['song-name','custom-icon','edit-status','edit-dialog','song-playlist-options'].map(id=>[id,{value:'',textContent:'',focus(){},querySelectorAll(){return [{value:'p'}]},close(){closed++}}]));
let record={id:'a',title:'Original',icon:'🐻',blob:new Blob(['audio']),fingerprint:'keep',order:5},closed=0,fail=false,hold;
const ctx={document:{querySelectorAll:()=>[]},$:id=>fields[id],operation:false,editingId:'a',pickedIcon:'🐻',playlists:[{id:'p',trackIds:['a']}],currentId:'a',iconFor:t=>t.icon,message:e=>e.message,notify(){},setMediaInfo(){},async read(){if(hold)await hold;if(fail)throw Error('write unavailable');return record},async write(_s,entries){record=entries[0]},async reload(){},async busy(task){try{await task()}catch{}}};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('  function markIcon('),source.indexOf('  function editSong('))+source.slice(source.indexOf('  async function saveEdit('),source.indexOf('  async function deleteSong(')),ctx);
const save=()=>ctx.saveEdit({preventDefault(){}});
(async()=>{
 fields['song-name'].value='Renamed';ctx.markIcon('🦁');await save();assert.equal(record.icon,'🦁');assert.equal(record.title,'Renamed');assert.equal(closed,1);assert.equal(record.fingerprint,'keep');
 ctx.markIcon('🦋');await save();assert.equal(record.icon,'🦋');assert.equal(closed,2,'Repeated saves do not require leaving edit mode');
 fail=true;ctx.markIcon('🐳');await save();assert.equal(closed,2);assert.match(fields['edit-status'].textContent,/write unavailable/);fail=false;await save();assert.equal(record.icon,'🐳');assert.equal(closed,3,'Retry succeeds without closing editor');
 fields['song-name'].value='';await save();assert.equal(closed,3);assert.match(fields['edit-status'].textContent,/שם/);
 fields['song-name'].value='Captured';ctx.markIcon('⭐');let release;hold=new Promise(r=>release=r);const pending=save();ctx.markIcon('🌸');fields['song-name'].value='Later';release();await pending;hold=null;assert.equal(record.icon,'⭐');assert.equal(record.title,'Captured','Submitted fields are captured before async reads');
 console.log('PASS: repeated icon/name saves, preserved audio metadata, inline failure and retry, validation, immutable submitted draft.');
})().catch(e=>{console.error(e);process.exitCode=1});

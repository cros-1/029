// main.js - reads links, ads, honor from Realtime DB (namespaced v8)
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

function safeKeyFromEmail(email){
  return email.replace(/[.#$\[\]]/g,'_').replace(/@/g,'_');
}

function renderLinks(obj){
  var el = document.getElementById('links');
  if(!el) return;
  el.innerHTML = '';
  if(!obj) return;
  Object.keys(obj).forEach(function(k){ var l = obj[k]; var a = document.createElement('a'); a.className='btn'; a.href = l.url||'#'; a.textContent = l.title||'—'; el.appendChild(a); });
}

function renderAds(obj){
  var sec = document.getElementById('adsSection'); var box = document.getElementById('adsBox'); if(!box) return;
  box.innerHTML='';
  if(!obj){ sec.classList.add('hidden'); return; } sec.classList.remove('hidden');
  Object.keys(obj).forEach(function(k){ var a = obj[k]; var d = document.createElement('div'); d.textContent = a.text||''; if(a.imageUrl){ var img = document.createElement('img'); img.src = a.imageUrl; img.style.maxWidth='420px'; img.style.display='block'; d.insertBefore(img,d.firstChild); } box.appendChild(d); });
}

function renderHonors(obj){
  var sec = document.getElementById('honors'); var grid = document.getElementById('honorsGrid'); if(!grid) return;
  grid.innerHTML='';
  if(!obj){ document.getElementById('honorsSection').classList.add('hidden'); return; } document.getElementById('honorsSection').classList.remove('hidden');
  Object.keys(obj).forEach(function(k){ var h = obj[k]; var c = document.createElement('div'); c.className='section'; c.innerHTML = (h.imageUrl? '<img src="'+h.imageUrl+'" style="max-width:100%;border-radius:8px"/>':'') + '<div style="font-weight:800">'+(h.title||'')+'</div><div style="opacity:.7">'+(h.center||'')+'</div>'; grid.appendChild(c); });
}

db.ref('links').on('value', function(s){ renderLinks(s.val()); });
db.ref('ads').on('value', function(s){ renderAds(s.val()); });
db.ref('honor').on('value', function(s){ renderHonors(s.val()); });

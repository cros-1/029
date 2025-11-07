/* control.js - admin panel write operations (namespaced v8) */
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.database();
var storage = firebase.storage();

// redirect to login if not signed in
auth.onAuthStateChanged(function(user){
  if(!user){
    // not signed-in, go to login
    window.location.href = 'login.html';
  }
});

function safeKey(email){ return email.replace(/[.#$\[\]]/g,'_').replace(/@/g,'_'); }

// links
document.getElementById('addLink').addEventListener('click', function(){
  var t = document.getElementById('linkTitle').value.trim();
  var u = document.getElementById('linkUrl').value.trim();
  if(!t||!u) return alert('ادخل العنوان والرابط');
  db.ref('links').push({title:t,url:u,order:Date.now()});
  document.getElementById('linkTitle').value='';
});

// ads - upload file to storage then push
document.getElementById('addAd').addEventListener('click', function(){
  var txt = document.getElementById('adText').value.trim();
  var f = document.getElementById('adFile').files[0];
  if(!txt && !f) return alert('ادخل نصاً أو صورة');
  if(f){
    var path = 'ads/' + Date.now() + '_' + f.name;
    var refSt = storage.ref(path);
    refSt.put(f).then(function(snapshot){
      snapshot.ref.getDownloadURL().then(function(url){
        db.ref('ads').push({text:txt,imageUrl:url,ts:Date.now()});
        document.getElementById('adText').value=''; document.getElementById('adFile').value='';
      });
    }).catch(function(err){ alert('خطأ رفع الصورة: ' + err.message); });
  } else {
    db.ref('ads').push({text:txt,ts:Date.now()});
    document.getElementById('adText').value='';
  }
});

// honors
document.getElementById('addHonor').addEventListener('click', function(){
  var t = document.getElementById('hTitle').value.trim();
  var c = document.getElementById('hCenter').value.trim();
  var f = document.getElementById('hFile').files[0];
  if(!t) return alert('ادخل عنوان اللوحة');
  if(f){
    var path = 'honor/' + Date.now() + '_' + f.name;
    storage.ref(path).put(f).then(function(snap){
      snap.ref.getDownloadURL().then(function(url){
        db.ref('honor').push({title:t,center:c,imageUrl:url,ts:Date.now()});
        document.getElementById('hTitle').value=''; document.getElementById('hCenter').value=''; document.getElementById('hFile').value='';
      });
    }).catch(function(err){ alert('خطأ رفع الصورة: ' + err.message); });
  } else {
    db.ref('honor').push({title:t,center:c,ts:Date.now()});
    document.getElementById('hTitle').value=''; document.getElementById('hCenter').value='';
  }
});

// list current items
db.ref('links').on('value', function(s){ var el = document.getElementById('linksList'); el.innerHTML=''; var obj = s.val() || {}; Object.keys(obj).forEach(function(id){ var item = obj[id]; var d = document.createElement('div'); d.textContent = item.title + ' — ' + (item.url||''); var btn = document.createElement('button'); btn.textContent='حذف'; btn.onclick = function(){ db.ref('links/' + id).remove(); }; d.appendChild(btn); el.appendChild(d); }); });

db.ref('ads').on('value', function(s){ var el = document.getElementById('adsList'); el.innerHTML=''; var obj = s.val() || {}; Object.keys(obj).forEach(function(id){ var a = obj[id]; var d = document.createElement('div'); d.textContent = a.text || '(صورة)'; var btn = document.createElement('button'); btn.textContent='حذف'; btn.onclick = function(){ db.ref('ads/' + id).remove(); }; d.appendChild(btn); el.appendChild(d); }); });

db.ref('honor').on('value', function(s){ var el = document.getElementById('honorList'); el.innerHTML=''; var obj = s.val() || {}; Object.keys(obj).forEach(function(id){ var h = obj[id]; var d = document.createElement('div'); d.innerHTML = (h.imageUrl? '<img src="'+h.imageUrl+'" style="max-width:120px;border-radius:6px"/>':'') + '<div style="font-weight:800">'+(h.title||'')+'</div><div style="opacity:.7">'+(h.center||'')+'</div>'; var btn = document.createElement('button'); btn.textContent='حذف'; btn.onclick = function(){ db.ref('honor/' + id).remove(); }; d.appendChild(btn); el.appendChild(d); }); });

document.getElementById('signOut').addEventListener('click', function(){ auth.signOut().then(function(){ window.location.href = 'login.html'; }); });

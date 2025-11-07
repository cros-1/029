/* auth.js - signIn and check admins node (namespaced v8) */
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.database();

function safeKeyFromEmail(email){
  return email.replace(/[.#$\[\]]/g,'_').replace(/@/g,'_');
}

document.getElementById('loginBtn').addEventListener('click', function(){
  var email = document.getElementById('email').value.trim();
  var pass = document.getElementById('pass').value;
  document.getElementById('msg').textContent = 'جارٍ تسجيل الدخول...';
  auth.signInWithEmailAndPassword(email, pass).then(function(userCredential){
    // check admins node using safe key
    var key = safeKeyFromEmail(email);
    db.ref('admins/' + key).once('value').then(function(snap){
      if(snap.exists() && snap.val() === true){
        // redirect to control panel
        window.location.href = 'control.html';
      } else {
        document.getElementById('msg').textContent = '';
        alert('هذا الحساب ليس مشرفا');
        auth.signOut();
      }
    }).catch(function(err){
      console.error(err);
      alert('خطأ في قراءة بيانات المشرفين: ' + err.message);
      auth.signOut();
    });
  }).catch(function(error){
    document.getElementById('msg').textContent = '';
    alert('فشل تسجيل الدخول: ' + error.message);
  });
});

// Firebase सेटअप
const auth = firebase.auth();
const db = firebase.firestore();

// Google Login फंक्शन
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    const user = result.user;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
    getMessages();
  }).catch((error) => {
    console.error(error);
  });
}

// Messages मिळवणे (Firebase वरून)
function getMessages() {
  db.collection('messages').orderBy('timestamp')
    .onSnapshot(snapshot => {
      document.getElementById('messages').innerHTML = '';
      snapshot.forEach(doc => {
        const msg = doc.data();
        const div = document.createElement('div');
        div.innerHTML = `${msg.user}: ${msg.text}`;
        document.getElementById('messages').appendChild(div);
      });
    });
}

// संदेश पाठवणे
function sendMessage() {
  const message = document.getElementById("message-input").value;
  if (message.trim() === "") return;

  // Firebase मध्ये संदेश सेव्ह करा
  db.collection('messages').add({
    text: message,
    user: auth.currentUser.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // कॅटचा आवाज वाजवा (send-sound.mp3)
  const sendSound = document.getElementById("send-sound");
  sendSound.play();

  // संदेश इनपुट बॉक्स साफ करा
  document.getElementById("message-input").value = "";
}

// संदेश प्राप्त करणे (कॅट पर्लिंग आवाज)
function receiveMessage() {
  const receiveSound = document.getElementById("receive-sound");
  receiveSound.play();
}
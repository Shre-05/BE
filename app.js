// Application State
const socket = io("http://localhost:5000");
let mediaRecorder;
let audioChunks = [];

let currentPage = 'home';
let currentUserType = 'hearing';
let cameraActive = false;
let isRecording = false;
let isProcessing = false;
let avatarAnimating = false;
let recognitionAccuracy = 0;

// ================= AVATAR LETTER ANIMATION STATE =================
let currentText = "";
let currentIndex = 0;
let prevChar = "";
let isPaused = false;
let timerId = null;

// ================= SAMPLE DATA =================
const sampleGestures = [
    { name: 'hello', text: 'Hello', confidence: 95 },
    { name: 'thank-you', text: 'Thank you', confidence: 92 },
    { name: 'please', text: 'Please', confidence: 88 },
    { name: 'yes', text: 'Yes', confidence: 97 },
    { name: 'no', text: 'No', confidence: 94 },
    { name: 'sorry', text: 'I am sorry', confidence: 89 },
    { name: 'help', text: 'Help me', confidence: 91 }
];

const userTypes = {
    hearing: {
        name: 'Hearing User',
        icon: 'fas fa-user',
        primaryInput: 'Speech/Text',
        primaryOutput: 'Audio/Visual'
    },
    deaf: {
        name: 'Deaf User',
        icon: 'fas fa-deaf',
        primaryInput: 'Sign Language',
        primaryOutput: 'Visual/Text'
    },
    mute: {
        name: 'Mute User',
        icon: 'fas fa-volume-mute',
        primaryInput: 'Sign Language/Text',
        primaryOutput: 'Visual/Text'
    },
    blind: {
        name: 'Blind User',
        icon: 'fas fa-low-vision',
        primaryInput: 'Speech/Text',
        primaryOutput: 'Audio/Tactile'
    }
};

// ================= AVATAR LETTER PLAYER =================
function playSignsAvatar(text) {
  const avatarImg = document.getElementById("avatarImg");
  if (!avatarImg) return;

  currentText = text.toUpperCase();
  currentIndex = 0;
  prevChar = "";
  isPaused = false;

  runAvatar();
}

function runAvatar() {
  const avatarImg = document.getElementById("avatarImg");
  if (!avatarImg || isPaused) return;

  if (currentIndex >= currentText.length) return;

  const char = currentText[currentIndex];

  // SPACE
  if (char === " ") {
    avatarImg.src = "avatars/space.jpg";
    prevChar = "";

    timerId = setTimeout(() => {
      currentIndex++;
      runAvatar();
    }, 900);
    return;
  }

  // DOUBLE LETTER BLINK
  if (char === prevChar) {
    avatarImg.src = "avatars/space.jpg";
    prevChar = "";

    timerId = setTimeout(() => {
      runAvatar();
    }, 400);
    return;
  }

  // NORMAL LETTER
  if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char)) {
    avatarImg.src = `avatars/${char}.jpg`;
    prevChar = char;
  }

  timerId = setTimeout(() => {
    currentIndex++;
    runAvatar();
  }, 1100);
}

// ================= AVATAR CONTROLS =================
document.getElementById("pause-animation")?.addEventListener("click", () => {
  isPaused = true;
  clearTimeout(timerId);
});

document.getElementById("play-animation")?.addEventListener("click", () => {
  if (!currentText) return;
  isPaused = false;
  runAvatar();
});

document.getElementById("replay-animation")?.addEventListener("click", () => {
  if (!currentText) return;
  clearTimeout(timerId);
  currentIndex = 0;
  prevChar = "";
  isPaused = false;
  runAvatar();
});

// ================= TRANSLATE TO SIGN =================
function translateToSign() {
    const text = elements.textInput.value.trim();
    if (!text) return;

    if (elements.currentTranslation) {
        elements.currentTranslation.textContent = text;
    }

    // START SIGN AVATAR
    playSignsAvatar(text);
}

// ================= VOICE RECORDING (KEEP ONLY ONE) =================
function toggleVoiceRecording() {
  isRecording = !isRecording;
  const voiceBtn = elements.recordVoiceBtn;
  const voiceStatus = document.querySelector(".voice-status");

  if (isRecording) {
    voiceBtn.classList.add("recording");
    voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
    if (voiceStatus) voiceStatus.textContent = "Recording... Click to stop";

    setTimeout(() => {
      if (isRecording) simulateVoiceTranscription();
    }, 2000);
  } else {
    voiceBtn.classList.remove("recording");
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    if (voiceStatus) voiceStatus.textContent = "Click to start recording";
  }
}

// Application State
let currentPage = 'home';
let currentUserType = 'hearing';
let cameraActive = false;
let isRecording = false;
let isProcessing = false;
let avatarAnimating = false;
let recognitionAccuracy = 0;

let currentText = "";
let currentIndex = 0;
let prevChar = "";
let isPaused = false;
let timerId = null;
let letterShown = false;

document.addEventListener("DOMContentLoaded", () => {

  const availableLetters = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M",
    "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
  ];

  const translateBtn = document.getElementById("translate-to-sign");
  const avatarImg = document.getElementById("avatarImg");
  const textField = document.getElementById("text-input");

  // ✅ CRITICAL SAFETY CHECK
  if (!translateBtn || !avatarImg || !textField) {
    console.warn("Avatar elements not found — avatar module not initialized yet");
    return;
  }

});

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
    }, 900); // ⏳ slower
    return;
  }

  // DOUBLE LETTER BLINK
  if (char === prevChar) {
    avatarImg.src = "avatars/space.jpg";
    prevChar = "";

    timerId = setTimeout(() => {
      runAvatar(); // ⛔ no index change
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
  }, 1100); // ⏳ readable speed
}

document.getElementById("replay-animation").addEventListener("click", () => {
  if (!currentText) return;

  clearTimeout(timerId);
  currentIndex = 0;
  prevChar = "";
  isPaused = false;
  runAvatar();
});

// DOM Elements
let elements = {};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeNavigation();
    updateUserProfile();
});

function initializeElements() {
    elements = {
        // Navigation
        navItems: document.querySelectorAll('.nav-item'),
        pages: document.querySelectorAll('.page'),
        
        // Sign Recognition
        cameraFeed: document.getElementById('camera-feed'),
        startCameraBtn: document.getElementById('start-camera'),
        toggleCameraBtn: document.getElementById('toggle-camera'),
        translationText: document.getElementById('translation-text'),
        confidenceValue: document.getElementById('confidence-value'),
        confidenceFill: document.getElementById('confidence-fill'),
        processingStatus: document.getElementById('processing-status'),
        gestureItems: document.querySelectorAll('.gesture-item'),
        
        // Speech to Sign
        inputMethods: document.querySelectorAll('.input-method'),
        textInputArea: document.getElementById('text-input-area'),
        voiceInputArea: document.getElementById('voice-input-area'),
        textInput: document.getElementById('text-input'),
        translateBtn: document.getElementById('translate-to-sign'),
        recordVoiceBtn: document.getElementById('record-voice'),
        voiceTranscript: document.getElementById('voice-transcript'),
        avatarDisplay: document.getElementById('avatar-display'),
        playAnimationBtn: document.getElementById('play-animation'),
        pauseAnimationBtn: document.getElementById('pause-animation'),
        replayAnimationBtn: document.getElementById('replay-animation'),
        currentTranslation: document.getElementById('current-translation'),
        signSequence: document.getElementById('sign-sequence'),
        
        // Chat
        chatMessages: document.getElementById('chat-messages'),
        chatInputField: document.getElementById('chat-input-field'),
        sendMessageBtn: document.getElementById('send-message'),
        inputOptions: document.querySelectorAll('.input-option'),
        changeProfileBtn: document.getElementById('change-profile'),
        currentUserType: document.getElementById('current-user-type'),
        
        // Settings
        userTypeSetting: document.getElementById('user-type-setting'),
        saveSettingsBtn: document.getElementById('save-settings'),
        resetSettingsBtn: document.getElementById('reset-settings'),
        sensitivitySlider: document.getElementById('sensitivity-slider'),
        speedSlider: document.getElementById('speed-slider'),
        
        // Modal
        profileModal: document.getElementById('profile-modal'),
        closeProfileModal: document.getElementById('close-profile-modal'),
        profileOptions: document.querySelectorAll('.profile-option'),
        
        // Feature cards
        featureCards: document.querySelectorAll('.feature-card')
    };
}

function initializeEventListeners() {
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => navigateToPage(item.dataset.page));
    });
    
    // Feature card navigation
    elements.featureCards.forEach(card => {
        if (card.dataset.navigate) {
            card.addEventListener('click', () => navigateToPage(card.dataset.navigate));
        }
    });
    
    // Sign Recognition
    /*if (elements.startCameraBtn) {
        elements.startCameraBtn.addEventListener('click', startCamera);
    }
    if (elements.toggleCameraBtn) {
        elements.toggleCameraBtn.addEventListener('click', toggleCamera);
    }
    if (elements.gestureItems) {
        elements.gestureItems.forEach(item => {
            item.addEventListener('click', () => simulateGestureRecognition(item.dataset.gesture, true));
        });
    }
    */
    // Speech to Sign
    if (elements.inputMethods) {
        elements.inputMethods.forEach(method => {
            method.addEventListener('click', () => switchInputMethod(method.dataset.method));
        });
    }
    if (elements.translateBtn) {
        elements.translateBtn.addEventListener('click', translateToSign);
    }
    if (elements.recordVoiceBtn) {
        elements.recordVoiceBtn.addEventListener('click', toggleVoiceRecording);
    }
    if (elements.playAnimationBtn) {
        elements.playAnimationBtn.addEventListener('click', playAvatarAnimation);
    }
    if (elements.pauseAnimationBtn) {
        elements.pauseAnimationBtn.addEventListener('click', pauseAvatarAnimation);
    }
    if (elements.replayAnimationBtn) {
        elements.replayAnimationBtn.addEventListener('click', replayAvatarAnimation);
    }
    
    // Chat
    if (elements.sendMessageBtn) {
        elements.sendMessageBtn.addEventListener('click', sendChatMessage);
    }
    if (elements.chatInputField) {
        elements.chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }
    if (elements.inputOptions) {
        elements.inputOptions.forEach(option => {
            option.addEventListener('click', () => switchChatInputMethod(option.dataset.input));
        });
    }
    if (elements.changeProfileBtn) {
        elements.changeProfileBtn.addEventListener('click', openProfileModal);
    }
    
    // Settings
    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
    }
    if (elements.resetSettingsBtn) {
        elements.resetSettingsBtn.addEventListener('click', resetSettings);
    }
    if (elements.sensitivitySlider) {
        elements.sensitivitySlider.addEventListener('input', updateSliderValue);
    }
    if (elements.speedSlider) {
        elements.speedSlider.addEventListener('input', updateSliderValue);
    }
    if (elements.userTypeSetting) {
        elements.userTypeSetting.addEventListener('change', (e) => {
            currentUserType = e.target.value;
            updateUserProfile();
        });
    }
    
    // Modal
    if (elements.closeProfileModal) {
        elements.closeProfileModal.addEventListener('click', closeProfileModal);
    }
    if (elements.profileOptions) {
        elements.profileOptions.forEach(option => {
            option.addEventListener('click', () => selectUserProfile(option.dataset.type));
        });
    }
    if (elements.profileModal) {
        elements.profileModal.addEventListener('click', (e) => {
            if (e.target === elements.profileModal) closeProfileModal();
        });
    }
}

function initializeNavigation() {
    // Set initial active nav item
    const homeNavItem = document.querySelector('.nav-item[data-page="home"]');
    if (homeNavItem) {
        homeNavItem.classList.add('active');
    }
}

// Navigation Functions
function navigateToPage(pageName) {
    // Update active nav item
    elements.navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });
    
    // Show selected page
    elements.pages.forEach(page => {
        page.classList.toggle('active', page.id === pageName);
    });
    
    currentPage = pageName;
    
    // Page-specific initialization
    if (pageName === 'sign-recognition') {
        initializeSignRecognition();
    } else if (pageName === 'speech-to-sign') {
        initializeSpeechToSign();
    } else if (pageName === 'chat') {
        initializeChat();
    } else if (pageName === 'settings') {
        initializeSettings();
    }
}

// Sign Recognition Functions
function initializeSignRecognition() {
    resetSignRecognition();
}

function resetSignRecognition() {
    cameraActive = false;
    if (elements.translationText) {
        elements.translationText.textContent = 'Perform a gesture to see translation...';
    }
    updateConfidenceDisplay(0);
    updateProcessingStatus('standby');
}

function startCamera() {
    cameraActive = true;
    if (elements.cameraFeed) {
        elements.cameraFeed.innerHTML = `
            <div style="color: var(--color-success); text-align: center;">
                <i class="fas fa-video" style="font-size: 48px; margin-bottom: 16px;"></i>
                <p>Camera Active</p>
                <div style="font-size: 12px; color: var(--color-text-secondary);">
                    MediaPipe Hand Detection: ON
                </div>
            </div>
        `;
    }
    if (elements.toggleCameraBtn) {
        elements.toggleCameraBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
    updateProcessingStatus('processing');
    
    // Simulate continuous gesture recognition
    startGestureSimulation();
}

function toggleCamera() {
    if (cameraActive) {
        pauseCamera();
    } else {
        startCamera();
    }
}

function pauseCamera() {
    cameraActive = false;
    if (elements.cameraFeed) {
        elements.cameraFeed.innerHTML = `
            <i class="fas fa-video camera-icon"></i>
            <p>Camera Paused</p>
            <button class="btn btn--primary" onclick="startCamera()">Resume Camera</button>
        `;
    }
    if (elements.toggleCameraBtn) {
        elements.toggleCameraBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
    updateProcessingStatus('standby');
    stopGestureSimulation();
}

function startGestureSimulation() {
    if (!cameraActive) return;
    
    setTimeout(() => {
        if (cameraActive) {
            const randomGesture = sampleGestures[Math.floor(Math.random() * sampleGestures.length)];
            simulateGestureRecognition(randomGesture.name, false);
            
            // Continue simulation
            setTimeout(() => startGestureSimulation(), 3000 + Math.random() * 4000);
        }
    }, 2000 + Math.random() * 3000);
}

function stopGestureSimulation() {
    // Simulation stops naturally when cameraActive becomes false
}

function simulateGestureRecognition(gestureName, isManual = false) {
    // Allow manual gestures or camera-based gestures
    if (!isManual && !cameraActive) return;
    
    const gesture = sampleGestures.find(g => g.name === gestureName) || sampleGestures[0];
    
    updateProcessingStatus('processing');
    
    setTimeout(() => {
        if (elements.translationText) {
            elements.translationText.textContent = gesture.text;
            elements.translationText.classList.add('success');
            setTimeout(() => elements.translationText.classList.remove('success'), 1000);
        }
        
        updateConfidenceDisplay(gesture.confidence);
        updateProcessingStatus('success');
        
        // Add to chat if in demo mode
        addSystemMessage(`Detected gesture: "${gesture.text}" (${gesture.confidence}% confidence)`);
        
        setTimeout(() => {
            if (cameraActive) {
                updateProcessingStatus('processing');
            } else {
                updateProcessingStatus('standby');
            }
        }, 2000);
    }, 500 + Math.random() * 1000);
}

function updateConfidenceDisplay(confidence) {
    recognitionAccuracy = confidence;
    if (elements.confidenceValue) {
        elements.confidenceValue.textContent = confidence + '%';
    }
    if (elements.confidenceFill) {
        elements.confidenceFill.style.width = confidence + '%';
    }
}

function updateProcessingStatus(status) {
    const statusMap = {
        'standby': { text: 'Standby', class: 'standby' },
        'processing': { text: 'Processing...', class: 'processing' },
        'success': { text: 'Recognized!', class: 'success' }
    };
    
    const statusInfo = statusMap[status];
    if (elements.processingStatus && statusInfo) {
        const statusIndicator = elements.processingStatus.querySelector('.status-indicator');
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = statusIndicator.querySelector('span');
        
        statusDot.className = `status-dot ${statusInfo.class}`;
        statusText.textContent = statusInfo.text;
    }
}

// Speech to Sign Functions
function initializeSpeechToSign() {
    // Reset to text input method
    switchInputMethod('text');
}

function switchInputMethod(method) {
    elements.inputMethods.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === method);
    });
    
    if (method === 'text') {
        elements.textInputArea.classList.remove('hidden');
        elements.voiceInputArea.classList.add('hidden');
    } else {
        elements.textInputArea.classList.add('hidden');
        elements.voiceInputArea.classList.remove('hidden');
    }
}

function translateToSign() {
    const text = elements.textInput.value.trim();
    if (!text) return;

    // Update UI text (keep your existing UI logic)
    if (elements.currentTranslation) {
        elements.currentTranslation.textContent = text;
    }

    // 🚀 START REAL SIGN PLAYBACK
    playSignsAvatar(text);
}



function toggleVoiceRecording() {
    isRecording = !isRecording;
    
    const voiceBtn = elements.recordVoiceBtn;
    const voiceStatus = document.querySelector('.voice-status');
    
    if (isRecording) {
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        voiceStatus.textContent = 'Recording... Click to stop';
        
        // Simulate speech recognition
        setTimeout(() => {
            if (isRecording) {
                simulateVoiceTranscription();
            }
        }, 2000 + Math.random() * 3000);
    } else {
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceStatus.textContent = 'Click to start recording';
    }
}

function simulateVoiceTranscription() {
    const sampleTexts = [
        "Hello, how are you today?",
        "Thank you for your help.",
        "Can you please help me?",
        "I am learning sign language.",
        "Have a wonderful day!"
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    if (elements.voiceTranscript) {
        elements.voiceTranscript.textContent = randomText;
    }
    
    // Auto-translate
    setTimeout(() => {
        if (elements.currentTranslation) {
            elements.currentTranslation.textContent = randomText;
        }
        updateAvatarDisplay('ready', randomText);
        playAvatarAnimation();
    }, 500);
    
    // Stop recording
    isRecording = false;
    const voiceBtn = elements.recordVoiceBtn;
    const voiceStatus = document.querySelector('.voice-status');
    voiceBtn.classList.remove('recording');
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceStatus.textContent = 'Click to start recording';
}

function updateAvatarDisplay(state, text) {
    if (!elements.avatarDisplay) return;
    
    const stateDisplays = {
        'idle': `
            <div class="avatar-placeholder">
                <i class="fas fa-user-tie avatar-icon"></i>
                <p>3D Avatar</p>
                <p class="avatar-status">Ready to perform signs</p>
            </div>
        `,
        'ready': `
            <div class="avatar-placeholder">
                <i class="fas fa-user-tie avatar-icon" style="color: var(--color-success);"></i>
                <p>3D Avatar</p>
                <p class="avatar-status">Ready: "${text}"</p>
            </div>
        `,
        'animating': `
            <div class="avatar-placeholder">
                <i class="fas fa-user-tie avatar-icon" style="color: var(--color-primary); animation: pulse 1s infinite;"></i>
                <p>3D Avatar</p>
                <p class="avatar-status">Performing signs...</p>
            </div>
        `
    };
    
    elements.avatarDisplay.innerHTML = stateDisplays[state] || stateDisplays['idle'];
}
/*
function playAvatarAnimation() {
    if (avatarAnimating) return;
    
    avatarAnimating = true;
    const currentText = elements.currentTranslation.textContent;
    updateAvatarDisplay('animating', currentText);
    
    // Simulate animation duration based on text length
    const duration = Math.max(2000, currentText.split(' ').length * 800);
    
    setTimeout(() => {
        avatarAnimating = false;
        updateAvatarDisplay('ready', currentText);
    }, duration);
}

function pauseAvatarAnimation() {
    if (!avatarAnimating) return;
    
    avatarAnimating = false;
    const currentText = elements.currentTranslation.textContent;
    updateAvatarDisplay('ready', currentText);
}

function replayAvatarAnimation() {
    pauseAvatarAnimation();
    setTimeout(() => playAvatarAnimation(), 100);
}*/
document.getElementById("pause-animation").addEventListener("click", () => {
  isPaused = true;
  clearTimeout(timerId);
});

document.getElementById("play-animation").addEventListener("click", () => {
  if (!currentText) return;
  isPaused = false;
  runAvatar();
});

document.getElementById("replay-animation").addEventListener("click", () => {
  if (!currentText) return;
  clearTimeout(timerId);
  currentIndex = 0;
  prevChar = "";
  isPaused = false;
  runAvatar();
});


// Chat Functions
function initializeChat() {
    // Chat is already initialized with sample messages
}

function switchChatInputMethod(method) {
    elements.inputOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.input === method);
    });
    
    // Update input placeholder based on method
    const placeholders = {
        'text': 'Type your message...',
        'voice': 'Click microphone to record...',
        'sign': 'Use camera for sign input...'
    };
    
    if (elements.chatInputField) {
        elements.chatInputField.placeholder = placeholders[method] || placeholders['text'];
    }
}

function sendChatMessage() {
    const message = elements.chatInputField.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage('You', currentUserType, message, 'outgoing');
    
    // Clear input
    elements.chatInputField.value = '';
    
    // Simulate response from another user
    setTimeout(() => {
        const responses = [
            "That's great to hear!",
            "Thank you for sharing.",
            "I understand completely.",
            "Let me help you with that.",
            "That sounds wonderful!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const otherUserTypes = Object.keys(userTypes).filter(type => type !== currentUserType);
        const randomUserType = otherUserTypes[Math.floor(Math.random() * otherUserTypes.length)];
        
        addChatMessage('Sarah', randomUserType, randomResponse, 'incoming');
    }, 1000 + Math.random() * 2000);
}

function addChatMessage(sender, userType, message, direction) {
    if (!elements.chatMessages) return;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userInfo = userTypes[userType];
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${direction}`;
    
    const translationInfo = direction === 'outgoing' 
        ? `<i class="fas fa-user-tie"></i> Translated to sign language`
        : `<i class="fas fa-hands"></i> Translated from sign language`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${userType}">
            <i class="${userInfo.icon}"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="sender">${sender} (${userInfo.name})</span>
                <span class="timestamp">${timestamp}</span>
            </div>
            <div class="message-text">${message}</div>
            <div class="message-translation">${translationInfo}</div>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function addSystemMessage(message) {
    if (!elements.chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.innerHTML = `
        <div class="message-content" style="text-align: center; font-style: italic; color: var(--color-text-secondary); margin: 8px 0;">
            ${message}
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Settings Functions
function initializeSettings() {
    // Update current values
    if (elements.userTypeSetting) {
        elements.userTypeSetting.value = currentUserType;
    }
    
    // Update slider values
    updateSliderDisplays();
}

function updateSliderValue(event) {
    const slider = event.target;
    const value = slider.value;
    const sliderValue = slider.parentNode.querySelector('.slider-value');
    
    if (slider.id === 'sensitivity-slider') {
        sliderValue.textContent = value + '/10';
    } else if (slider.id === 'speed-slider') {
        sliderValue.textContent = value + 'x';
    }
}

function updateSliderDisplays() {
    const sensitivitySlider = elements.sensitivitySlider;
    const speedSlider = elements.speedSlider;
    
    if (sensitivitySlider) {
        const value = sensitivitySlider.value;
        const display = sensitivitySlider.parentNode.querySelector('.slider-value');
        if (display) display.textContent = value + '/10';
    }
    
    if (speedSlider) {
        const value = speedSlider.value;
        const display = speedSlider.parentNode.querySelector('.slider-value');
        if (display) display.textContent = value + 'x';
    }
}

function saveSettings() {
    // Simulate saving settings
    showNotification('Settings saved successfully!', 'success');
    
    // Update user type if changed
    if (elements.userTypeSetting) {
        currentUserType = elements.userTypeSetting.value;
        updateUserProfile();
    }
}

function resetSettings() {
    // Reset to default values
    if (elements.userTypeSetting) {
        elements.userTypeSetting.value = 'hearing';
    }
    if (elements.sensitivitySlider) {
        elements.sensitivitySlider.value = 7;
    }
    if (elements.speedSlider) {
        elements.speedSlider.value = 1;
    }
    
    updateSliderDisplays();
    showNotification('Settings reset to default', 'info');
}

// Modal Functions
function openProfileModal() {
    if (elements.profileModal) {
        elements.profileModal.classList.remove('hidden');
    }
}

function closeProfileModal() {
    if (elements.profileModal) {
        elements.profileModal.classList.add('hidden');
    }
}

function selectUserProfile(userType) {
    currentUserType = userType;
    updateUserProfile();
    closeProfileModal();
    showNotification(`Switched to ${userTypes[userType].name}`, 'success');
}

function updateUserProfile() {
    const userInfo = userTypes[currentUserType];
    
    // Update current user type display
    if (elements.currentUserType) {
        elements.currentUserType.textContent = userInfo.name;
    }
    
    // Update profile avatar in chat
    const profileAvatar = document.querySelector('.user-profile .profile-avatar i');
    if (profileAvatar) {
        profileAvatar.className = userInfo.icon;
    }
    
    // Update settings dropdown
    if (elements.userTypeSetting) {
        elements.userTypeSetting.value = currentUserType;
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: 16px 20px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Set colors based on type
    const colors = {
        'success': 'var(--color-success)',
        'error': 'var(--color-error)',
        'warning': 'var(--color-warning)',
        'info': 'var(--color-info)'
    };
    
    notification.style.borderColor = colors[type] || colors['info'];
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; color: ${colors[type] || colors['info']};">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Accessibility Functions
function announceForScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Initialize keyboard navigation
document.addEventListener('keydown', function(event) {
    // ESC key to close modals
    if (event.key === 'Escape') {
        closeProfileModal();
    }
    
    // Enter key for various actions
    if (event.key === 'Enter' && !event.shiftKey) {
        const activeElement = document.activeElement;
        
        // Send chat message if focused on chat input
        if (activeElement === elements.chatInputField) {
            event.preventDefault();
            sendChatMessage();
        }
        
        // Translate if focused on text input
        if (activeElement === elements.textInput) {
            event.preventDefault();
            translateToSign();
        }
    }
});

// Export functions for global access
window.navigateToPage = navigateToPage;
window.simulateGestureRecognition = simulateGestureRecognition;
window.startCamera = startCamera;
/* ==============================
   1. UI Interactions (Chatbot Logic)
============================== */

// Chatbot UI Toggle Elements
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');

chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatToggle.style.transform = 'scale(0)';
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    chatToggle.style.transform = 'scale(1)';
});

// Chatbot Core Logic
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatBody = document.getElementById('chatBody');
const typingIndicator = document.getElementById('typingIndicator');

const botResponses = [
    { keywords: ["what", "project"], reply: "This is a Sign Language Detection web application that uses Machine Learning to translate hand gestures into text and speech." },
    { keywords: ["how", "work"], reply: "It uses your webcam to track hand landmarks in real-time via Google's MediaPipe API. A simulated ML logic translates these landmarks into alphabets based on predefined gestures." },
    { keywords: ["use", "demo"], reply: "Go to the Demo section, click 'Start Camera', grant permission, and show your hand to the camera to see the real-time translation!" },
    { keywords: ["hello", "hi"], reply: "Hi there! How can I assist you with this project today?" },
    { keywords: ["who", "creator"], reply: "I am a virtual assistant integrated into this single-file HTML project!" }
];

function processUserMessage(msg) {
    let lowerMsg = msg.toLowerCase();
    let response = "I'm a simple assistant. Try asking: 'What is this project?', 'How does it work?', or 'How to use?'.";
    
    for (let item of botResponses) {
        if (item.keywords.some(kw => lowerMsg.includes(kw))) {
            response = item.reply;
            break;
        }
    }
    return response;
}

function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message msg-${type}`;
    msgDiv.innerText = text;
    // Insert before typing indicator
    chatBody.insertBefore(msgDiv, typingIndicator);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    typingIndicator.style.display = 'block';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        typingIndicator.style.display = 'none';
        const reply = processUserMessage(text);
        appendMessage(reply, 'bot');
    }, 1000);
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

/* ==============================
   2. Web Speech API (Text-to-Speech)
============================== */
const formedWordEl = document.getElementById('formedWord');
const speakBtn = document.getElementById('speakBtn');
const clearBtn = document.getElementById('clearBtn');

speakBtn.addEventListener('click', () => {
    const text = formedWordEl.innerText;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
});

clearBtn.addEventListener('click', () => {
    formedWordEl.innerText = '';
    document.getElementById('currentLetter').innerText = '-';
    document.getElementById('confidenceLabel').innerText = 'Confidence: 0%';
});

/* ==============================
   3. MediaPipe & Webcam Logic
============================== */
const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const startBtn = document.getElementById('startBtn');
const loader = document.getElementById('loader');
const currentLetterEl = document.getElementById('currentLetter');
const confidenceLabel = document.getElementById('confidenceLabel');

let cameraActive = false;
let detectionCounter = 0;
let lastDetectedLetter = '';

// Mock Sequence of Letters to simulate word formation
const demoSequence = "HELLO WORLD";
let sequenceIndex = 0;

function onResults(results) {
    // Setup canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#8b5cf6', lineWidth: 4});
            drawLandmarks(canvasCtx, landmarks, {color: '#10b981', lineWidth: 2, radius: 4});
        }

        // Simulate ML Detection Logic
        detectionCounter++;
        // Update prediction every ~30 frames (about 1 second)
        if (detectionCounter >= 30) {
            let letter = demoSequence[sequenceIndex];
            
            // Display UI
            currentLetterEl.innerText = letter;
            // Randomize confidence between 85% and 99%
            let conf = Math.floor(Math.random() * (99 - 85 + 1) * 1 + 85);
            confidenceLabel.innerText = `Confidence: ${conf}%`;

            // Append letter
            formedWordEl.innerText += letter;
            
            sequenceIndex = (sequenceIndex + 1) % demoSequence.length;
            detectionCounter = 0; // reset
        }
    } else {
        // No hand detected
        detectionCounter = 0;
        currentLetterEl.innerText = '-';
        confidenceLabel.innerText = 'Confidence: 0%';
    }
    canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});

startBtn.addEventListener('click', () => {
    if (!cameraActive) {
        loader.style.display = 'flex';
        // Adjust canvas size to match video wrapper ratio
        canvasElement.width = videoElement.clientWidth || 640;
        canvasElement.height = videoElement.clientHeight || 480;

        camera.start()
            .then(() => {
                loader.style.display = 'none';
                startBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Camera';
                startBtn.style.background = 'var(--danger)';
                cameraActive = true;
            })
            .catch((err) => {
                loader.style.display = 'none';
                alert('Error accessing webcam. Please grant permission.');
                console.error(err);
            });
    } else {
        camera.stop();
        startBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> Start Camera & Detection';
        startBtn.style.background = 'var(--gradient)';
        cameraActive = false;
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        currentLetterEl.innerText = '-';
        confidenceLabel.innerText = 'Confidence: 0%';
    }
});

// Resize canvas on window resize to keep landmarks aligned
window.addEventListener('resize', () => {
    if (cameraActive) {
        canvasElement.width = videoElement.clientWidth;
        canvasElement.height = videoElement.clientHeight;
    }
});
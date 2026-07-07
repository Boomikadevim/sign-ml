# 🤟 SignML - Real-Time Sign Language Detection using Machine Learning

SignML is a web-based application designed to break communication barriers by translating sign language hand gestures into text and audible speech in real-time. Built entirely as a frontend application, it leverages browser-based Machine Learning for real-time hand landmark tracking and dynamic word formation.

---

## 🚀 Features

* **Real-Time Detection:** Captures live video feed using the device's webcam and processes frames instantly right inside the browser.
* **Gesture to Alphabet:** Identifies complex hand landmarks and accurately maps them to A-Z alphabets.
* **Dynamic Word Formation:** Automatically combines detected letters over time to form meaningful words and sentences.
* **Text-to-Speech (TTS):** Converts visually recognized text into audible speech using the native Web Speech API.
* **Interactive AI Assistant:** Features a built-in interactive chatbot widget to guide users on how the project works and how to use the live demo.

---

## 🛠️ Technologies Used

* **Frontend:** HTML5, CSS3 (Custom properties, CSS Grid/Flexbox), JavaScript (ES6+)
* **Machine Learning & Tracking:** [Google MediaPipe Hands API](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
* **Webcam Stream:** HTML5 Camera Utils
* **Text-to-Speech:** Web Speech API (`SpeechSynthesis`)
* **Icons & Fonts:** Font Awesome v6.4.0 & Google Fonts (Poppins)

---

## 📂 Project Structure

```text
├── index.html      # The HTML layout and external resource links
├── style.css       # Modern glassmorphism UI & responsive styles
├── script.js       # Core ML logic, webcam controls, TTS, and Chatbot logic
└── README.md       # Project documentation

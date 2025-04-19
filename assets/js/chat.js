// Get Firebase auth from global scope
const auth = window.auth;

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatContainer = document.getElementById('chat-container');
    const startChatBtn = document.getElementById('start-chat-btn');
    const logoutButton = document.getElementById('logout-button');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const messagesContainer = document.getElementById('messages-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // App state
    let isAIResponding = false;
    let isDarkMode = localStorage.getItem('cozyAiDarkMode') === 'true';
    
    // Gemini API configuration
    const GEMINI_API_KEY = "AIzaSyDbCmeR-d99fFfPJmLnzAr-SvMWBa8sLcA";
    const GEMINI_MODEL = "gemini-1.5-pro-latest";
    
    // Conversation history
    let conversationHistory = [
        { 
            role: "user", 
            parts: [{ 
                text: "You are Cozy AI, a helpful AI assistant with a premium, professional tone. Provide concise, accurate responses. Keep responses relatively short for mobile display." 
            }] 
        },
        { 
            role: "model", 
            parts: [{ 
                text: "Understood! I'm Cozy AI, your helpful assistant. I'll provide concise, professional responses tailored for mobile. How may I assist you today?" 
            }] 
        }
    ];

    // Initialize UI based on auth state
    function initializeUI() {
        auth.onAuthStateChanged(user => {
            if (user) {
                // User is logged in - show chat immediately
                showChatInterface();
            } else {
                // User not logged in - redirect to auth
                window.location.href = 'auth.html';
            }
        });
    }

    function showChatInterface() {
        welcomeScreen.style.display = 'none';
        chatContainer.style.display = 'flex';
        
        if (messagesContainer.children.length === 0) {
            addBotMessage(conversationHistory[1].parts[0].text);
        }
        
        setTimeout(() => userInput.focus(), 300);
    }

    // Start Chat button click handler
    startChatBtn.addEventListener('click', showChatInterface);

    // Dark mode toggle
    darkModeBtn.addEventListener('click', toggleDarkMode);
    
    // Logout button
    logoutButton.addEventListener('click', logoutUser);
    
    // Send message
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    
    // Initialize
    initializeUI();
    applyDarkMode();
    
    // Functions
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode');
        darkModeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('cozyAiDarkMode', isDarkMode);
    }
    
    function applyDarkMode() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    async function logoutUser() {
        try {
            await auth.signOut();
            // Clear chat history when logging out
            messagesContainer.innerHTML = '';
            conversationHistory = [
                { 
                    role: "user", 
                    parts: [{ 
                        text: "You are Cozy AI, a helpful AI assistant with a premium, professional tone. Provide concise, accurate responses. Keep responses relatively short for mobile display." 
                    }] 
                },
                { 
                    role: "model", 
                    parts: [{ 
                        text: "Hello Sir I'm Cozy AI, your helpful assistant. I'll provide concise, professional responses tailored for mobile. How may I assist you today?" 
                    }] 
                }
            ];
            window.location.href = 'auth.html';
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
    
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            ${text}
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            ${text}
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async function typeBotMessage(text) {
        removeTypingIndicator();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messagesContainer.appendChild(messageDiv);
        
        let i = 0;
        const typingSpeed = 20; // milliseconds per character
        
        function typeWriter() {
            if (i < text.length) {
                messageDiv.innerHTML = `
                    ${text.substring(0, i + 1)}
                    <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                `;
                i++;
                setTimeout(typeWriter, typingSpeed);
                scrollToBottom();
            }
        }
        
        await new Promise(resolve => {
            typeWriter();
            setTimeout(resolve, text.length * typingSpeed);
        });
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    async function sendMessage() {
        if (isAIResponding) return;
        
        const message = userInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        userInput.value = '';
        sendButton.disabled = true;
        
        // Add to conversation history
        conversationHistory.push({ role: "user", parts: [{ text: message }] });
        
        showTypingIndicator();
        isAIResponding = true;
        
        try {
            const response = await fetchGeminiResponse(conversationHistory);
            await typeBotMessage(response);
            conversationHistory.push({ role: "model", parts: [{ text: response }] });
        } catch (error) {
            removeTypingIndicator();
            addBotMessage("Sorry, I'm having some technical difficulties. Please try again later.");
            console.error("Error calling Gemini API:", error);
        } finally {
            isAIResponding = false;
            sendButton.disabled = false;
        }
    }
    
    async function fetchGeminiResponse(messages) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
        
        const requestBody = {
            contents: messages,
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 1000,
                stopSequences: []
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch response from Gemini API');
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
});
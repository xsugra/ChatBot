
/**
 * Zora Chatbot Widget
 * 
 * This script injects a self-contained chatbot widget into a host page.
 * It handles UI creation, state management, and communication with a backend API.
 * 
 * @version 1.5.0
 * @author Gemini
 */
(function() {
    // --- Configuration ---
    const currentScript = document.currentScript;
    const BASE_URL = currentScript.getAttribute('data-backend-url') || 'http://127.0.0.1:8000';

    // 1. Define the HTML and CSS for the widget.
    const widgetCSS = `
        /**
         * CSS Variables for theming.
         * The widget defaults to a light theme.
         * A .dark-mode class on the #zora-chat-window container will apply the dark theme.
         */
        :root {
            --background-color: #F0F2F5;
            --chat-background: #FFFFFF;
            --user-message-bg: #E9E9EB;
            --bot-message-bg: #F0F2F5;
            --input-bg: #FFFFFF;
            --text-color: #050505;
            --header-start-color: #007BFF;
            --header-end-color: #00C6FF;
            --send-btn-color: #007BFF;
            --code-bg: #F0F2F5;
            --link-color: #0056b3;
        }

        #zora-chat-window.dark-mode {
            --background-color: #1A1A1A;
            --chat-background: #282828;
            --user-message-bg: #4A4A4A;
            --bot-message-bg: #3A3A3A;
            --input-bg: #3A3A3A;
            --text-color: #FFFFFF;
            --code-bg: #222222;
            --link-color: #8ab4f8;
        }

        #zora-launcher-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(90deg, var(--header-start-color), var(--header-end-color));
            color: white;
            border-radius: 50%;
            border: none;
            font-size: 2em;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9998;
            transition: transform 0.2s ease-in-out;
        }

        #zora-launcher-btn:hover {
            transform: scale(1.1);
        }

        #zora-chat-window {
            position: fixed;
            bottom: 90px; /* Position above the launcher */
            right: 20px;
            width: 400px;
            height: 600px;
            display: flex;
            flex-direction: column;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            background: var(--chat-background);
            color: var(--text-color);
            z-index: 9999;
            transform-origin: bottom right;
            transition: transform 0.3s ease-in-out, opacity 0.3s;
            transform: scale(0);
            opacity: 0;
        }

        #zora-chat-window.zora-chat-open {
            transform: scale(1);
            opacity: 1;
        }

        #zora-chat-header {
            background: linear-gradient(90deg, var(--header-start-color), var(--header-end-color));
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 25px;
            font-size: 1.3em;
            font-weight: 600;
        }

        #zora-clear-btn, #zora-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.2em;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        #zora-clear-btn:hover, #zora-close-btn:hover {
            opacity: 1;
        }

        #zora-chat-box {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .zora-message-container {
            display: flex;
            gap: 10px;
            max-width: 85%;
            animation: zora-fadeIn 0.5s ease-in-out;
        }

        .zora-message {
            padding: 8px 12px;
            border-radius: 18px;
            word-wrap: break-word;
            white-space: pre-wrap;
            line-height: 1.3;
            color: var(--text-color);
        }

        .zora-user-message-container {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .zora-bot-message-container {
            align-self: flex-start;
        }

        .zora-message.zora-user-message {
            background-color: var(--user-message-bg);
            border-bottom-right-radius: 4px;
        }

        .zora-message.zora-bot-message {
            background-color: var(--bot-message-bg);
            border-bottom-left-radius: 4px;
        }
        
        .zora-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #4A4A4A;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 600;
            flex-shrink: 0;
            color: white;
        }

        #zora-input-container {
            display: flex;
            padding: 20px;
            border-top: 1px solid #dedede;
            background: var(--input-bg);
        }

        #zora-chat-window.dark-mode #zora-input-container {
            border-top-color: #333;
        }

        #zora-user-input {
            flex-grow: 1;
            border: 1px solid #ccc;
            padding: 12px 15px;
            font-size: 1em;
            outline: none;
            background: var(--background-color);
            color: var(--text-color);
            border-radius: 10px;
        }

        #zora-send-btn {
            background: var(--send-btn-color);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 0 20px;
            margin-left: 10px;
            cursor: pointer;
            font-size: 1.2em;
            transition: background 0.3s;
        }

        #zora-send-btn:hover {
            filter: brightness(1.2);
        }

        #zora-chat-window pre {
            background-color: var(--code-bg);
            color: var(--text-color);
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
        }

        #zora-chat-window code {
            font-family: 'Courier New', Courier, monospace;
        }

        .zora-message a {
            color: var(--link-color);
            text-decoration: underline;
        }

        .zora-typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .zora-typing-indicator span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #888;
            animation: zora-bounce 1.4s infinite both;
        }

        .zora-typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .zora-typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes zora-bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1.0); }
        }

        @keyframes zora-fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    const widgetHTML = `
        <div id="zora-chat-window">
            <div id="zora-chat-header">
                <span>Zora</span>
                <div>
                    <button id="zora-clear-btn" title="Clear Chat">&#128465;</button>
                    <button id="zora-close-btn" title="Close Chat">&times;</button>
                </div>
            </div>
            <div id="zora-chat-box">
                <!-- Messages will be dynamically inserted here -->
            </div>
            <form id="zora-input-container">
                <input type="text" id="zora-user-input" placeholder="Napíšte správu..." autocomplete="off">
                <button id="zora-send-btn" type="submit">&#9658;</button>
            </form>
        </div>
        <button id="zora-launcher-btn">&#128172;</button>
    `;

    // 2. Inject the CSS and HTML into the host page.
    const styleTag = document.createElement('style');
    styleTag.innerHTML = widgetCSS;
    document.head.appendChild(styleTag);

    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'zora-widget-container';
    widgetContainer.innerHTML = widgetHTML;
    document.body.appendChild(widgetContainer);

    // 3. Get references to all the new DOM elements.
    const chatWindow = document.getElementById('zora-chat-window');
    const chatBox = document.getElementById('zora-chat-box');
    const userInput = document.getElementById('zora-user-input');
    const inputForm = document.getElementById('zora-input-container');
    const sendButton = document.getElementById('zora-send-btn');
    const clearButton = document.getElementById('zora-clear-btn');
    const launcherButton = document.getElementById('zora-launcher-btn');
    const closeButton = document.getElementById('zora-close-btn');

    const converter = new showdown.Converter();

    /**
     * Toggles the visibility of the chat window.
     */
    function toggleChatWindow() {
        chatWindow.classList.toggle('zora-chat-open');
    }

    /**
     * Displays a typing indicator in the chat box.
     */
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'zora-message-container zora-bot-message-container zora-typing-indicator-container';
        indicator.innerHTML = `
            <div class="zora-avatar">Z</div>
            <div class="zora-message zora-bot-message zora-typing-indicator">
                <span></span><span></span><span></span>
            </div>`;
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    /**
     * Removes the typing indicator from the chat box.
     */
    function hideTypingIndicator() {
        const indicator = document.querySelector('.zora-typing-indicator-container');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Appends a message to the chat box.
     * @param {string} message - The message content (text or Markdown).
     * @param {'user' | 'bot'} sender - The sender of the message.
     */
    function appendMessage(message, sender) {
        const messageContainerClass = sender === 'user' ? 'zora-user-message-container' : 'zora-bot-message-container';
        const messageClass = sender === 'user' ? 'zora-user-message' : 'zora-bot-message';
        const avatarText = sender === 'user' ? 'Ty' : 'Z';

        let messageContent = message;
        // Convert Markdown to HTML for bot messages.
        if (sender === 'bot') {
            messageContent = converter.makeHtml(message);
        }

        const avatar = document.createElement('div');
        avatar.className = 'zora-avatar';
        avatar.textContent = avatarText;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'zora-message ' + messageClass;
        messageDiv.innerHTML = messageContent;

        const messageContainer = document.createElement('div');
        messageContainer.className = 'zora-message-container ' + messageContainerClass;
        messageContainer.appendChild(avatar);
        messageContainer.appendChild(messageDiv);

        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    /**
     * Fetches a response from the chatbot backend.
     * @param {string} userMessage - The user's message.
     */
    function getBotResponse(userMessage) {
        showTypingIndicator();
        userInput.disabled = true;
        sendButton.disabled = true;

        fetch(`${BASE_URL}/chatbot_response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideTypingIndicator();
            appendMessage(data.response, 'bot');
        })
        .catch(error => {
            hideTypingIndicator();
            console.error('Fetch error:', error);
            appendMessage("Ospravedlňujeme sa, vyskytla sa chyba.", 'bot');
        })
        .finally(() => {
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        });
    }

    /**
     * Handles the submission of the user's input.
     */
    function handleUserInput() {
        const userMessage = userInput.value.trim();

        if(userMessage !== ''){
            appendMessage(userMessage, 'user');
            userInput.value = '';
            getBotResponse(userMessage);
        }
    }

    /**
     * Clears the chat history by sending a request to the backend.
     */
    function clearChat() {
        fetch(`${BASE_URL}/clear_chat`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    chatBox.innerHTML = '';
                    appendMessage("Ahoj! Som Zora, ako ti dnes môžem pomôcť?", 'bot');
                } else {
                    console.error('Failed to clear chat history.');
                }
            })
            .catch(error => console.error('Error clearing chat:', error));
    }

    /**
     * Synchronizes the widget's theme with the host page's theme.
     * Looks for a .dark-mode class on the host's body element.
     */
    function syncTheme() {
        if (document.body.classList.contains('dark-mode')) {
            chatWindow.classList.add('dark-mode');
        } else {
            chatWindow.classList.remove('dark-mode');
        }
    }

    // --- Event Listeners & Initialization ---

    // Create an observer to watch for theme changes on the host page.
    const themeObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                syncTheme();
            }
        });
    });
    themeObserver.observe(document.body, { attributes: true });
    syncTheme(); // Initial theme check

    // Handle user input submission.
    inputForm.addEventListener('submit', function(e){
        e.preventDefault();
        handleUserInput();
        return false;
    });

    sendButton.addEventListener('click', function(e){
        e.preventDefault();
        handleUserInput();
        return false;
    });

    // Handle widget visibility.
    launcherButton.addEventListener('click', toggleChatWindow);
    closeButton.addEventListener('click', toggleChatWindow);

    // Handle chat clearing.
    clearButton.addEventListener('click', clearChat);

    // --- Initial Load ---

    // Display the initial greeting.
    appendMessage("Ahoj! Som Zora, ako ti dnes môžem pomôcť?", 'bot');

    // Load chat history from the template.
    if (typeof chat_history !== 'undefined') {
        chat_history.forEach(item => {
            appendMessage(item.user_message, 'user');
            appendMessage(item.bot_response, 'bot');
        });
        // Scroll to the bottom after loading history.
        chatBox.scrollTop = chatBox.scrollHeight;
    }

})();

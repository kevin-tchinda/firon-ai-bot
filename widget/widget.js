(function () {
    const globalConfig = window.FironChatConfig || {};
    const config = {
        apiUrl: globalConfig.apiUrl || "http://localhost:8000",
        botName: globalConfig.botName || "Firon AI Assistant",
        welcomeMessage: globalConfig.welcomeMessage || "Hello! I am the Firon Roofing AI. How can I help you today?",
    };

    let isOpen = false;
    let currentTab = 'home';
    let conversationHistory = [];
    let messageElements = [];
    let handoffCompleted = false;

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        if (seconds < 30) return "now";
        return Math.floor(seconds) + "s";
    }

    setInterval(() => {
        messageElements.forEach(msg => {
            if (msg.dateEl) msg.dateEl.innerText = timeAgo(msg.timestamp);
        });
    }, 30000);

    const root = document.createElement('div');
    root.className = 'firon-chat-container firon-tab-home';
    document.body.appendChild(root);

    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'firon-chat-toggle';
    const chatIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
    const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    toggleBtn.innerHTML = chatIcon;
    root.appendChild(toggleBtn);

    const proactiveAlert = document.createElement('div');
    proactiveAlert.className = 'firon-proactive-popup';
    proactiveAlert.innerHTML = `
        <div class="firon-proactive-popup-close" id="firon-close-popup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        Hi! Need help with your roofing? Let's chat.
    `;
    root.appendChild(proactiveAlert);

    let proactiveTimer = setTimeout(() => {
        if (!isOpen) proactiveAlert.classList.add('firon-show');
    }, 15000);

    proactiveAlert.querySelector('#firon-close-popup').onclick = (e) => {
        e.stopPropagation();
        proactiveAlert.classList.remove('firon-show');
    };

    const chatWindow = document.createElement('div');
    chatWindow.className = 'firon-chat-window';
    chatWindow.innerHTML = `
        <div class="firon-chat-header">
            <div class="firon-home-header-content" style="display:none;">
                <div class="firon-home-logo">
                    <img src="widget/firon-logo.webp" alt="Firon Roofing">
                </div>
                <div class="firon-home-welcome" style="margin-top:10px; font-weight:500;">Trusted Ottawa Roofing Experts</div>
            </div>

            <div class="firon-chat-header-content" style="display:none; padding: 12px 16px;">
                <div class="firon-chat-header-left">
                    <div class="firon-icon-btn firon-back-btn" title="Back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </div>
                    <div class="firon-chat-header-agent">
                        <div class="firon-bot-avatar">
                            <svg viewBox="0 0 24 24" fill="#1e3a8a"><path d="M12 2a2 2 0 012 2h4a2 2 0 012 2v2h2a1 1 0 011 1v4a1 1 0 01-1 1h-2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2H2a1 1 0 01-1-1v-4a1 1 0 011-1h2V6a2 2 0 012-2h4a2 2 0 012-2zM9 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>
                            <div class="firon-status-dot"></div>
                        </div>
                        <div class="firon-chat-header-info">
                            <span class="firon-chat-title">${config.botName}</span>
                            <span class="firon-chat-subtitle">Online</span>
                        </div>
                    </div>
                </div>
                <div class="firon-chat-header-right">
                    <button class="firon-icon-btn" id="firon-menu-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                    </button>
                    <button class="firon-icon-btn" id="firon-close-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div class="firon-dropdown-menu" id="firon-menu-dropdown">
                        <div class="firon-dropdown-item" id="firon-menu-faq">Ask FAQ</div>
                        <div class="firon-dropdown-item" id="firon-menu-print">Print Chat</div>
                        <div class="firon-dropdown-item" id="firon-menu-clear">Clear History</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="firon-tab-content">
            <div class="firon-home-view">
                <div class="firon-home-body">
                    <p style="color: #64748b; font-size: var(--firon-font-sm); text-align: center;">Welcome. How can we help?</p>
                    <div class="firon-quick-actions">
                        <div class="firon-action-card" data-action="chat">
                            <span class="firon-action-text">Talk to AI Assistant</span>
                            <div class="firon-action-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg></div>
                        </div>
                        <div class="firon-action-card" data-action="quote">
                            <span class="firon-action-text">Request a Free Quote</span>
                            <div class="firon-action-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="firon-chat-view">
                <div class="firon-chat-messages"></div>
                <div class="firon-chat-input-area">
                    <div class="firon-chat-input-row">
                        <div class="firon-input-container">
                            <input type="text" placeholder="Type message..." id="firon-input" autocomplete="off">
                        </div>
                        <button class="firon-chat-send" id="firon-send" disabled>
                            <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                    <div class="firon-rich-actions">
                        <button class="firon-rich-btn" id="firon-emoji-btn" title="Emojis">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                        </button>
                        <button class="firon-rich-btn" id="firon-attach-btn" title="Attach file">
                            <input type="file" id="firon-file-input" style="display:none">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                        </button>
                        <button class="firon-rich-btn" id="firon-tts-btn" title="Voice Input">
                            <svg id="firon-mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 18.4v3.3M8 22h8"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="firon-emoji-picker" id="firon-emoji-picker"></div>
        </div>
    `;
    root.appendChild(chatWindow);

    const homeHeader = chatWindow.querySelector('.firon-home-header-content');
    const chatHeader = chatWindow.querySelector('.firon-chat-header-content');
    const bckBtn = chatWindow.querySelector('.firon-back-btn');
    const messagesContainer = chatWindow.querySelector('.firon-chat-messages');
    const inputField = chatWindow.querySelector('#firon-input');
    const sendBtn = chatWindow.querySelector('#firon-send');
    const menuBtn = chatWindow.querySelector('#firon-menu-btn');
    const closeBtn = chatWindow.querySelector('#firon-close-btn');
    const dropdownMenu = chatWindow.querySelector('#firon-menu-dropdown');
    const emojiMenuBtn = chatWindow.querySelector('#firon-emoji-btn');
    const emojiPicker = chatWindow.querySelector('#firon-emoji-picker');
    const attachBtn = chatWindow.querySelector('#firon-attach-btn');
    const ttsBtn = chatWindow.querySelector('#firon-tts-btn');

    const emoticons = ['😊','😂','❤️','👍','🙌','🏠','🔨','🛠️','😎','🤔','🎉','✨','💯','💡','👋','🔨','🔩','📏'];
    emoticons.forEach(em => {
        const btn = document.createElement('button');
        btn.className = 'firon-emoji-btn';
        btn.innerText = em;
        btn.onclick = () => {
            inputField.value += em;
            inputField.dispatchEvent(new Event('input'));
            emojiPicker.classList.remove('firon-show');
            inputField.focus();
        };
        emojiPicker.appendChild(btn);
    });

    function switchTab(tab) {
        currentTab = tab;
        root.className = 'firon-chat-container';
        if (tab === 'home') {
            root.classList.add('firon-tab-home');
            homeHeader.style.display = 'block';
            chatHeader.style.display = 'none';
        } else {
            root.classList.add('firon-tab-chat');
            homeHeader.style.display = 'none';
            chatHeader.style.display = 'flex';
        }
    }
    switchTab('home');

    function setOpen(open) {
        isOpen = open;
        proactiveAlert.classList.remove('firon-show');
        clearTimeout(proactiveTimer);
        toggleBtn.innerHTML = isOpen ? closeIcon : chatIcon;
        if (isOpen) {
            chatWindow.classList.add('firon-is-open');
            if (currentTab === 'chat') setTimeout(() => inputField.focus(), 300);
        } else {
            chatWindow.classList.remove('firon-is-open');
            emojiPicker.classList.remove('firon-show');
        }
    }

    toggleBtn.addEventListener('click', () => setOpen(!isOpen));
    proactiveAlert.onclick = () => setOpen(true);
    closeBtn.addEventListener('click', () => setOpen(false));
    bckBtn.addEventListener('click', () => switchTab('home'));
    
    chatWindow.querySelectorAll('.firon-action-card').forEach(card => {
        card.addEventListener('click', () => {
            switchTab('chat');
            if(card.dataset.action === 'quote' && !handoffCompleted) {
                setTimeout(() => addHandoffForm(), 500);
            }
        });
    });

    inputField.addEventListener('input', () => {
        sendBtn.disabled = !inputField.value.trim();
    });

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendBtn.disabled) handleSend();
    });

    menuBtn.onclick = (e) => { e.stopPropagation(); dropdownMenu.classList.toggle('firon-show'); };
    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('firon-show');
        if (!isOpen) emojiPicker.classList.remove('firon-show');
    });

    emojiMenuBtn.onclick = (e) => { e.stopPropagation(); emojiPicker.classList.toggle('firon-show'); };
    emojiPicker.onclick = (e) => e.stopPropagation();

    chatWindow.querySelector('#firon-menu-clear').onclick = () => {
        conversationHistory = [];
        messagesContainer.innerHTML = '';
        messageElements = [];
        addMessage(config.welcomeMessage, false, false);
    };

    chatWindow.querySelector('#firon-menu-print').onclick = () => {
        const printContent = conversationHistory.map(m => `<b>${m.role}:</b> ${m.content}`).join('<br>');
        const win = window.open('','Transcript','width=600,height=600');
        win.document.write(`<html><body><h2>Firon Transcript</h2>${printContent}</body></html>`);
        win.document.close(); win.print();
    };

    chatWindow.querySelector('#firon-menu-faq').onclick = () => {
        inputField.value = "What are your FAQs?";
        inputField.dispatchEvent(new Event('input'));
        handleSend();
    };

    attachBtn.onclick = () => chatWindow.querySelector('#firon-file-input').click();
    chatWindow.querySelector('#firon-file-input').onchange = (e) => {
        if(e.target.files.length > 0) addMessage(`Attached: ${e.target.files[0].name}`, true);
    };

    let recognition = null;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.onresult = (e) => {
            inputField.value = e.results[0][0].transcript;
            inputField.dispatchEvent(new Event('input'));
        };
        recognition.onend = () => chatWindow.querySelector('#firon-mic-icon').style.color = '';
    }

    ttsBtn.onclick = () => {
        if (!recognition) return alert("Not supported");
        recognition.start();
        chatWindow.querySelector('#firon-mic-icon').style.color = '#e31837';
    };

    function addMessage(text, isUser, saveToHistory = true) {
        const wrapper = document.createElement('div');
        wrapper.className = `firon-msg-wrapper ${isUser ? 'firon-user' : 'firon-bot'}`;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'firon-chat-message';
        msgDiv.innerText = text;
        const tsDate = new Date();
        const timeDiv = document.createElement('div');
        timeDiv.className = 'firon-timestamp';
        timeDiv.innerText = timeAgo(tsDate);
        wrapper.appendChild(msgDiv); wrapper.appendChild(timeDiv);
        messagesContainer.appendChild(wrapper); scrollToBottom();
        messageElements.push({ el: wrapper, dateEl: timeDiv, timestamp: tsDate });
        if (saveToHistory) conversationHistory.push({ role: isUser ? 'user' : 'assistant', content: text });
    }
    addMessage(config.welcomeMessage, false, false);

    function addHandoffForm() {
        if (handoffCompleted) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'firon-msg-wrapper firon-bot';
        wrapper.innerHTML = `
            <div class="firon-handoff-form" style="padding:12px; border:1px solid var(--firon-border); width:100%;">
                <h4 class="firon-handoff-title">Get a Quote</h4>
                <input type="text" class="firon-handoff-input" id="firon-n" placeholder="Name" style="width:100%; margin:4px 0;" />
                <input type="email" class="firon-handoff-input" id="firon-e" placeholder="Email" style="width:100%; margin:4px 0;" />
                <button class="firon-handoff-submit" id="firon-s" style="width:100%; margin-top:4px;">Submit</button>
            </div>
        `;
        messagesContainer.appendChild(wrapper); scrollToBottom();
        wrapper.querySelector('#firon-s').onclick = async () => {
            const n = wrapper.querySelector('#firon-n').value;
            const e = wrapper.querySelector('#firon-e').value;
            if(!n || !e) return alert("Fill all");
            wrapper.querySelector('#firon-s').innerText = "...";
            const res = await fetch(`${config.apiUrl}/lead`, { method: 'POST', body: JSON.stringify({ name:n, email:e, history:conversationHistory }), headers:{'Content-Type':'application/json'} });
            if(res.ok) { wrapper.remove(); handoffCompleted = true; addMessage("Thanks! We'll call you.", false, false); }
        };
    }

    let typingIndicator = null;
    function showTyping() {
        if (typingIndicator) return;
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'firon-msg-wrapper firon-bot';
        typingIndicator.innerHTML = `<div class="firon-typing-indicator"><div class="firon-typing-dot"></div><div class="firon-typing-dot"></div><div class="firon-typing-dot"></div></div>`;
        messagesContainer.appendChild(typingIndicator); scrollToBottom();
    }
    function hideTyping() { if(typingIndicator) typingIndicator.remove(); typingIndicator = null; }
    function scrollToBottom() { messagesContainer.scrollTop = messagesContainer.scrollHeight; }

    async function handleSend() {
        const text = inputField.value.trim(); if (!text) return;
        inputField.value = ''; inputField.dispatchEvent(new Event('input'));
        addMessage(text, true); showTyping();
        try {
            const res = await fetch(`${config.apiUrl}/chat`, { method: 'POST', body: JSON.stringify({ message: text, history: conversationHistory }), headers:{'Content-Type':'application/json'} });
            const data = await res.json(); hideTyping(); addMessage(data.answer, false);
            if (data.handoff_required && !handoffCompleted) setTimeout(addHandoffForm, 600);
        } catch (e) {
            hideTyping(); addMessage("Error connecting.", false, false);
        }
    }
})();
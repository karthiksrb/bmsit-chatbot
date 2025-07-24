// BMSIT&M Chatbot - Fixed Version (No Multiple Welcome Messages)

// Global protection against multiple execution
if (window.bmsitChatbotLoaded) {
  console.log("⚠️ Chatbot already loaded, skipping...");
} else {
  window.bmsitChatbotLoaded = true;
  
  console.log("🚀 Loading BMSIT&M Chatbot...");

  // Core variables
  let isVoiceInput = false;
  let chatHistory = [];
  let isTyping = false;
  let initialized = false;
  
  // Configuration: Set to true to always start with a fresh chat
  const ALWAYS_START_FRESH = true; // Always start fresh - only welcome message

  // Wait for QA data to be available
  function waitForQAData() {
    if (typeof window !== 'undefined' && window.qaData) {
      console.log("✅ QA Data loaded:", window.qaData.length, "items");
      return window.qaData;
    } else if (typeof qaData !== 'undefined') {
      console.log("✅ QA Data loaded:", qaData.length, "items");
      return qaData;
    }
    return null;
  }
  
  // Get QA data reference
  const getQAData = () => {
    return (typeof window !== 'undefined' && window.qaData) ? window.qaData : 
           (typeof qaData !== 'undefined') ? qaData : null;
  };
  
  console.log("🔄 Checking QA Data availability...");
  const initialData = waitForQAData();
  if (initialData) {
    console.log("✅ QA Data ready:", initialData.length, "items");
  } else {
    console.log("⏳ QA Data will be loaded when available");
  }

  function appendMessage(message, sender, skipSave = false) {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) {
      console.error("chat-messages element not found");
      return;
    }
    
    const messageDiv = document.createElement("div");
    messageDiv.className = "message mb-4";
    
    const timestamp = new Date().toLocaleTimeString();
    
    if (sender === "user") {
      messageDiv.innerHTML = `
        <div class="flex justify-end">
          <div class="bg-blue-500 text-white text-sm p-3 rounded-2xl user-bubble max-w-xs">${formatMessage(message)}</div>
        </div>
      `;
      
      if (!skipSave) {
        chatHistory.push({
          message: message,
          sender: "user",
          timestamp: timestamp
        });
      }
    } else {
      messageDiv.innerHTML = `
        <div class="flex items-start space-x-2">
          <img src="assets/bot.png" alt="Bot" class="bot-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="bot-avatar" style="display: none;">🤖</div>
          <div class="bg-blue-100 dark:bg-blue-800 text-sm p-3 rounded-2xl bot-bubble max-w-xs">${formatMessage(message)}</div>
        </div>
      `;
      
      if (!skipSave) {
        chatHistory.push({
          message: message,
          sender: "bot",
          timestamp: timestamp
        });
      }
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    if (!skipSave) {
      saveChatHistory();
    }
  }

  function formatMessage(message) {
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '• ')
      .replace(/(\d+\.)/g, '<strong>$1</strong>')
      .replace(/🎓|📚|💰|🏠|📊|🎉|📍|☎️|🌟|✅|❌|⚠️|🔍|💡|🚀|🎯|📈|🏆|🎨|🔧|📋|✨|🎪|🎭|💻|🌙|☀️/g, '<span style="font-size: 1.1em;">$&</span>');
  }

  function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const chatMessages = document.getElementById("chat-messages");
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.className = "message mb-4";
    typingDiv.innerHTML = `
      <div class="flex items-start space-x-2">
        <img src="assets/bot.png" alt="Bot" class="bot-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="bot-avatar" style="display: none;">🤖</div>
        <div class="typing-indicator bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
          <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
    isTyping = false;
  }

  // Enhanced similarity calculation using Levenshtein distance
  function calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;
    
    const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));
    
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = Math.min(
            matrix[j - 1][i - 1] + 1,
            matrix[j][i - 1] + 1,
            matrix[j - 1][i] + 1
          );
        }
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len2][len1]) / maxLen;
  }

  // Enhanced fuzzy matching with spell correction
  function fuzzyMatch(text, keyword) {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerText.includes(lowerKeyword) || lowerKeyword.includes(lowerText)) return true;
    
    const variations = {
      'cse': ['computer science', 'cs', 'comp sci', 'computer science engineering'],
      'ise': ['information science', 'is', 'info sci', 'information science engineering'],
      'ece': ['electronics', 'communication', 'ec', 'electronics communication'],
      'fees': ['fee', 'cost', 'price', 'tuition', 'charges', 'amount', 'money'],
      'hostel': ['accommodation', 'residence', 'housing', 'stay', 'room'],
      'placement': ['job', 'career', 'recruitment', 'company', 'hiring', 'employment'],
      'admission': ['admissions', 'join', 'entry', 'enroll', 'apply']
    };
    
    for (const [key, values] of Object.entries(variations)) {
      if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
        if (values.some(v => lowerText.includes(v) || v.includes(lowerText))) {
          return true;
        }
      }
    }
    
    const textWords = lowerText.split(' ');
    const keywordWords = lowerKeyword.split(' ');
    
    for (const textWord of textWords) {
      for (const keywordWord of keywordWords) {
        if (textWord.length > 2 && keywordWord.length > 2) {
          const similarity = calculateSimilarity(textWord, keywordWord);
          if (similarity > 0.75) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  function findAnswer(userText) {
    const lowerText = userText.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;
    
    // Get current QA data
    const currentQAData = getQAData();
    
    // Debug logging
    console.log("🔍 Searching for:", lowerText);
    console.log("📊 QA Data available:", currentQAData ? currentQAData.length : 0, "items");
    
    if (!currentQAData || !Array.isArray(currentQAData)) {
      console.error("❌ QA Data not loaded properly");
      console.error("Available data:", typeof currentQAData, currentQAData);
      return "⚠️ Sorry, I'm having trouble accessing my knowledge base. Please refresh the page and try again.\n\n**Debug Info:** QA Data not available - check browser console for details.";
    }
    
    for (const item of currentQAData) {
      if (!item || !item.keywords || !Array.isArray(item.keywords)) {
        continue;
      }
      
      let score = 0;
      let matches = 0;
      
      for (const keyword of item.keywords) {
        const keywordLower = keyword.toLowerCase();
        
        // Exact match or contains
        if (lowerText.includes(keywordLower) || keywordLower.includes(lowerText)) {
          matches += 2;
          score += 1.0;
        } 
        // Fuzzy match
        else if (fuzzyMatch(lowerText, keyword)) {
          matches++;
          score += calculateSimilarity(lowerText, keywordLower);
        }
      }
      
      if (matches > 0) {
        const avgScore = score / Math.max(matches, 1);
        if (avgScore > bestScore) {
          bestScore = avgScore;
          bestMatch = item.answer;
        }
      }
    }
    
    console.log("🎯 Best score:", bestScore, "Match found:", !!bestMatch);
    
    if (bestMatch && bestScore > 0.3) {
      return bestMatch;
    }
    
    return "🤔 I'm not sure about that. Try asking about:\n• **Courses** - programs offered\n• **Admissions** - how to apply\n• **Fees** - cost structure\n• **Hostel** - accommodation\n• **Placements** - career opportunities\n• **Campus** - facilities and location";
  }

  async function handleSend() {
    const input = document.getElementById("user-input");
    const userText = input.value.trim();
    
    if (!userText) return;
    
    input.value = "";
    appendMessage(userText, "user");
    showTypingIndicator();
    
    setTimeout(() => {
      hideTypingIndicator();
      const botResponse = findAnswer(userText);
      appendMessage(botResponse, "bot");
      // Only speak if voice input was used
      if (isVoiceInput) {
        setTimeout(() => speakResponse(botResponse), 100);
        isVoiceInput = false; // Reset flag
      }
    }, Math.random() * 1000 + 500);
  }

  function speakResponse(text) {
    if (!('speechSynthesis' in window)) return;
    
    // Only speak if voice toggle is ON
    const voiceToggle = document.getElementById("voice-toggle");
    if (!voiceToggle || !voiceToggle.checked) return;
    
    speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/[🎓📚💰🏠📊🎉📍☎️🌟✅❌⚠️🔍💡🚀🎯📈🏆🎨🔧📋✨🎪🎭💻🌙☀️]/g, '')
      .replace(/\n/g, '. ')
      .replace(/•/g, '')
      .trim();
    
    if (cleanText) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  function toggleDark() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    
    const toggleBg = document.getElementById('toggle-bg');
    const toggleDot = document.getElementById('toggle-dot');
    const toggleInput = document.getElementById('dark-toggle');
    
    if (isDark) {
      if (toggleBg) toggleBg.classList.add('dark');
      if (toggleDot) {
        toggleDot.classList.add('moved');
        toggleDot.textContent = '🌙';
      }
      if (toggleInput) toggleInput.checked = true;
    } else {
      if (toggleBg) toggleBg.classList.remove('dark');
      if (toggleDot) {
        toggleDot.classList.remove('moved');
        toggleDot.textContent = '☀️';
      }
      if (toggleInput) toggleInput.checked = false;
    }
    
    localStorage.setItem("chat-theme", isDark ? "dark" : "light");
    showNotification(`${isDark ? "🌙" : "☀️"} ${isDark ? "Dark" : "Light"} mode activated!`, "success");
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    let bgColor = '#3b82f6'; // info
    if (type === 'success') bgColor = '#10b981';
    if (type === 'error') bgColor = '#ef4444';
    if (type === 'warning') bgColor = '#f59e0b';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  function saveChatHistory() {
    try {
      localStorage.setItem("bmsit-chat-history", JSON.stringify(chatHistory));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }

  function loadChatHistory() {
    try {
      const saved = localStorage.getItem("bmsit-chat-history");
      if (saved) {
        chatHistory = JSON.parse(saved);
        const recentMessages = chatHistory.slice(-5); // Only last 5 messages
        recentMessages.forEach(entry => {
          appendMessage(entry.message, entry.sender, true);
        });
        return true; // Has history
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      chatHistory = [];
    }
    return false; // No history
  }

  function clearChat() {
    chatHistory = [];
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
      chatMessages.innerHTML = "";
    }
    localStorage.removeItem("bmsit-chat-history");
    showNotification("Chat cleared successfully!", "success");
    
    // Show welcome message after clearing
    setTimeout(() => {
      showWelcomeMessage();
    }, 500);
  }

  // Start completely fresh - clears everything and reloads
  function startFresh() {
    // Clear all chat data
    chatHistory = [];
    localStorage.removeItem("bmsit-chat-history");
    
    // Clear the chat display
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
      chatMessages.innerHTML = "";
    }
    
    showNotification("🔄 Starting fresh chat...", "info");
    
    // Show welcome message for fresh start
    setTimeout(() => {
      showWelcomeMessage();
    }, 800);
  }

  function showWelcomeMessage() {
    console.log("👋 Showing welcome message");
    appendMessage("👋 **Welcome to BMSIT&M Smart Chatbot!**\n\nI'm here to help you with:\n• 🎓 Academic programs & courses\n• 📝 Admissions & eligibility\n• 💰 Fees & scholarships\n• 🏠 Hostel facilities\n• 📊 Placements & careers\n• 🎉 Campus life & events\n• 📍 Location & contact info\n\nWhat would you like to know about BMSIT&M?", "bot");
  }

  // Initialize chatbot
  function initializeChatbot() {
    if (initialized) {
      console.log("⚠️ Already initialized");
      return;
    }
    
    console.log("🚀 Initializing chatbot...");
    initialized = true;
    
    // Clear any existing messages
    const chatMessages = document.getElementById("chat-messages");
    if (chatMessages) {
      chatMessages.innerHTML = "";
    }
    
    // Load theme
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      const toggleBg = document.getElementById('toggle-bg');
      const toggleDot = document.getElementById('toggle-dot');
      const toggleInput = document.getElementById('dark-toggle');
      
      if (toggleBg) toggleBg.classList.add('dark');
      if (toggleDot) {
        toggleDot.classList.add('moved');
        toggleDot.textContent = '🌙';
      }
      if (toggleInput) toggleInput.checked = true;
    }
    
    // Check if we should always start fresh
    if (ALWAYS_START_FRESH) {
      console.log("🔄 Starting fresh (ALWAYS_START_FRESH = true)");
      localStorage.removeItem("bmsit-chat-history");
      chatHistory = [];
      setTimeout(showWelcomeMessage, 1000);
    } else {
      // Load history and show welcome if needed
      const hasHistory = loadChatHistory();
      if (!hasHistory) {
        setTimeout(showWelcomeMessage, 1000);
      }
    }
    
    // Setup keyboard events
    const userInput = document.getElementById('user-input');
    if (userInput) {
      userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      });
    }
    
    console.log("✅ Chatbot initialized");
  }

  // Quick reply function
  function quickReply(topic) {
    const queries = {
      'courses': 'Tell me about the courses offered',
      'admissions': 'How can I get admission?',
      'fees': 'What are the fees?',
      'hostel': 'Tell me about hostel facilities'
    };
    
    const query = queries[topic] || topic;
    document.getElementById('user-input').value = query;
    handleSend();
  }

  // Voice input function
  function toggleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showNotification("Voice recognition not supported in this browser", "error");
      return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      document.getElementById("mic-btn").style.background = '#ef4444';
      showNotification("🎤 Listening... Speak now!", "info");
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById("user-input").value = transcript;
      showNotification(`Heard: "${transcript}"`, "success");
      isVoiceInput = true;
      
      // Auto-enable voice output when using voice input
      const voiceToggle = document.getElementById("voice-toggle");
      if (voiceToggle && !voiceToggle.checked) {
        voiceToggle.checked = true;
        toggleVoiceOutput();
      }
      
      handleSend();
    };
    
    recognition.onerror = (event) => {
      document.getElementById("mic-btn").style.background = '#3b82f6';
      showNotification(`Voice recognition error: ${event.error}`, "error");
    };
    
    recognition.onend = () => {
      document.getElementById("mic-btn").style.background = '#3b82f6';
    };
    
    recognition.start();
  }

  // Toggle voice output function
  function toggleVoiceOutput() {
    const voiceToggle = document.getElementById("voice-toggle");
    const voiceLabel = voiceToggle.parentElement.nextElementSibling;
    
    if (voiceToggle.checked) {
      voiceLabel.textContent = "ON";
      showNotification("🔊 Voice output enabled", "success");
    } else {
      voiceLabel.textContent = "OFF";
      showNotification("🔇 Voice output disabled", "info");
      // Stop any current speech
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }
  }

  // Export chat function
  async function exportChat() {
    if (chatHistory.length === 0) {
      showNotification("No chat history to export", "error");
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text("BMSIT&M Chatbot Conversation", 20, 20);
      doc.setFontSize(10);
      doc.text(`Exported on: ${new Date().toLocaleString()}`, 20, 30);
      
      let yPosition = 50;
      
      chatHistory.forEach((entry, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        const sender = entry.sender === 'user' ? 'You' : 'Bot';
        const time = entry.timestamp || 'Unknown time';
        
        doc.setFontSize(9);
        doc.text(`${sender} (${time}):`, 20, yPosition);
        yPosition += 7;
        
        const cleanMessage = entry.message.replace(/[🎓📚💰🏠📊🎉📍☎️🌟✅❌⚠️🔍💡🚀🎯📈🏆🎨🔧📋✨🎪🎭💻🌙☀️]/g, '');
        const lines = doc.splitTextToSize(cleanMessage, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 5;
      });
      
      doc.save('bmsit-chatbot-conversation.pdf');
      showNotification("Chat exported successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Export failed. Please try again.", "error");
    }
  }

  // Make functions global
  window.handleSend = handleSend;
  window.toggleDark = toggleDark;
  window.clearChat = clearChat;
  window.startFresh = startFresh;
  window.showNotification = showNotification;
  window.quickReply = quickReply;
  window.toggleVoiceInput = toggleVoiceInput;
  window.toggleVoiceOutput = toggleVoiceOutput;
  window.exportChat = exportChat;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait a bit for QA data to load
      setTimeout(initializeChatbot, 100);
    });
  } else {
    // Wait a bit for QA data to load
    setTimeout(initializeChatbot, 100);
  }
  
  console.log("✅ BMSIT&M Chatbot script loaded");
}
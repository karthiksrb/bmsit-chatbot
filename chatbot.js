// BMSIT&M Chatbot - English Only Version
let isVoiceInput = false;
let chatHistory = [];
let isTyping = false;

console.log("✅ QA Data loaded:", qaData.length, "items");

// Initialize chatbot
window.onload = () => {
  initializeChatbot();
  loadChatHistory();
  setupEventListeners();
  checkVoiceSupport();
  
  // Load saved theme
  if (localStorage.getItem("chat-theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("dark-toggle").checked = true;
  }
};

function initializeChatbot() {
  updateOnlineStatus();
}

function setupEventListeners() {
  const userInput = document.getElementById("user-input");
  
  // Enter key handler
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });
  
  // Focus input on page load
  userInput.focus();
}

function updateOnlineStatus() {
  // Simple online status indicator
  console.log("Chatbot is online and ready!");
}

function checkVoiceSupport() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    document.getElementById("mic-btn").style.display = "none";
    console.log("Voice recognition not supported");
  }
}

// Enhanced fuzzy matching with spell correction
function fuzzyMatch(text, keyword) {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  
  // Direct match
  if (lowerText.includes(lowerKeyword) || lowerKeyword.includes(lowerText)) return true;
  
  // Handle common variations and abbreviations
  const variations = {
    'cse': ['computer science', 'cs', 'comp sci', 'computer science engineering', 'cse dept', 'cse department'],
    'ise': ['information science', 'is', 'info sci', 'information science engineering', 'ise dept'],
    'ece': ['electronics', 'communication', 'ec', 'electronics communication', 'ece dept'],
    'eee': ['electrical', 'ee', 'electrical electronics', 'eee dept'],
    'ete': ['electronics telecommunication', 'telecommunication', 'ete dept'],
    'mech': ['mechanical', 'me', 'mechanical engineering', 'mech dept'],
    'civil': ['civil engineering', 'ce', 'civil dept'],
    'mca': ['master computer applications', 'computer applications', 'mca course', 'mca program'],
    'mba': ['master business administration', 'business administration', 'mba course'],
    'mtech': ['master technology', 'm tech', 'master of technology'],
    'fees': ['fee', 'cost', 'price', 'tuition', 'charges', 'amount', 'money'],
    'hostel': ['accommodation', 'residence', 'housing', 'stay', 'room'],
    'placement': ['job', 'career', 'recruitment', 'company', 'hiring', 'employment'],
    'admission': ['admissions', 'join', 'entry', 'enroll', 'apply'],
    'location': ['address', 'where', 'place', 'situated', 'located'],
    'contact': ['phone', 'email', 'call', 'reach', 'number'],
    'fest': ['festival', 'event', 'celebration', 'spectrum', 'cultural'],
    'library': ['books', 'study', 'reading', 'lib'],
    'sports': ['games', 'athletics', 'physical', 'gym', 'fitness']
  };
  
  // Check variations
  for (const [key, values] of Object.entries(variations)) {
    if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
      if (values.some(v => lowerText.includes(v) || v.includes(lowerText))) {
        return true;
      }
    }
  }
  
  // Spell correction for individual words
  const textWords = lowerText.split(' ');
  const keywordWords = lowerKeyword.split(' ');
  
  for (const textWord of textWords) {
    for (const keywordWord of keywordWords) {
      if (textWord.length > 2 && keywordWord.length > 2) {
        // Check for common spelling mistakes
        if (isSpellingVariation(textWord, keywordWord)) {
          return true;
        }
        
        // Levenshtein distance for spell correction
        const similarity = calculateSimilarity(textWord, keywordWord);
        if (similarity > 0.75) { // 75% similarity threshold
          return true;
        }
      }
    }
  }
  
  return false;
}

// Check for common spelling variations
function isSpellingVariation(word1, word2) {
  const commonMistakes = {
    'bmsit': ['bmsit&m', 'bmist', 'bmsitm', 'bms', 'bmset'],
    'college': ['colege', 'collage', 'colleg'],
    'engineering': ['engg', 'eng', 'enginering'],
    'computer': ['comp', 'compter', 'computr'],
    'science': ['sci', 'scince', 'sience'],
    'information': ['info', 'informaton', 'infomation'],
    'electronics': ['electronic', 'electrnics', 'elctronics'],
    'mechanical': ['mech', 'mechenical', 'machanical'],
    'placement': ['placment', 'placements', 'placemnt'],
    'admission': ['admision', 'admissions', 'admissn'],
    'hostel': ['hostl', 'hostels', 'hostle'],
    'fees': ['fee', 'fess', 'feess'],
    'address': ['adress', 'addres', 'adres'],
    'facilities': ['facility', 'facilites', 'facilties']
  };
  
  for (const [correct, variations] of Object.entries(commonMistakes)) {
    if ((word1 === correct && variations.includes(word2)) || 
        (word2 === correct && variations.includes(word1))) {
      return true;
    }
  }
  
  return false;
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

function findAnswer(userText) {
  const lowerText = userText.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;
  let exactMatch = false;
  
  // Handle single word queries
  if (lowerText.split(' ').length === 1) {
    for (const item of qaData) {
      if (item.keywords && Array.isArray(item.keywords)) {
        for (const keyword of item.keywords) {
          if (keyword.toLowerCase() === lowerText || 
              keyword.toLowerCase().includes(lowerText) ||
              lowerText.includes(keyword.toLowerCase())) {
            return item.answer;
          }
        }
      }
    }
  }
  
  for (const item of qaData) {
    // Direct question match
    if (item.question && lowerText.includes(item.question.toLowerCase())) {
      return item.answer;
    }
    
    // Enhanced keyword matching with multiple strategies
    if (item.keywords && Array.isArray(item.keywords)) {
      let score = 0;
      let matches = 0;
      let hasExactMatch = false;
      
      for (const keyword of item.keywords) {
        const keywordLower = keyword.toLowerCase();
        
        // Exact keyword match (highest priority)
        if (lowerText === keywordLower || 
            lowerText.includes(keywordLower) || 
            keywordLower.includes(lowerText)) {
          hasExactMatch = true;
          matches += 2; // Higher weight for exact matches
          score += 1.0;
        }
        // Fuzzy match with spell correction
        else if (fuzzyMatch(lowerText, keyword)) {
          matches++;
          score += calculateSimilarity(lowerText, keywordLower);
        }
        
        // Word-by-word matching for better partial matches
        const userWords = lowerText.split(' ');
        const keywordWords = keywordLower.split(' ');
        
        for (const userWord of userWords) {
          for (const keywordWord of keywordWords) {
            if (userWord.length > 2 && keywordWord.length > 2) {
              if (userWord === keywordWord) {
                matches++;
                score += 0.8;
              } else if (calculateSimilarity(userWord, keywordWord) > 0.8) {
                matches++;
                score += 0.6;
              }
            }
          }
        }
      }
      
      if (matches > 0) {
        const avgScore = score / Math.max(matches, 1);
        const finalScore = hasExactMatch ? avgScore + 0.5 : avgScore; // Boost exact matches
        
        if (finalScore > bestScore) {
          bestScore = finalScore;
          bestMatch = item.answer;
          exactMatch = hasExactMatch;
        }
      }
    }
  }
  
  // Lower threshold for better matching
  if (bestMatch && (bestScore > 0.2 || exactMatch)) {
    return bestMatch;
  }
  
  // Smart fallback with suggestions based on partial matches
  const suggestions = getSmartSuggestions(lowerText);
  
  const fallbackResponses = [
    `🤔 I'm not sure about "${userText}". ${suggestions}\n\nYou can ask me about:\n• Courses and admissions\n• Fees and scholarships\n• Campus facilities\n• Placements and careers\n• Hostel information`,
    `❓ I didn't quite understand "${userText}". ${suggestions}\n\nTry asking about BMSIT&M's departments, admission process, fees, placements, or campus facilities.`,
    `🔍 Let me help you find what you're looking for! ${suggestions}\n\nTry asking about specific topics like 'CSE department', 'admission process', or 'hostel facilities'.`
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Generate smart suggestions based on partial input
function getSmartSuggestions(userInput) {
  const suggestions = [];
  const commonTopics = {
    'cse': 'CSE department',
    'mca': 'MCA program',
    'fee': 'fees structure',
    'place': 'placement statistics',
    'host': 'hostel facilities',
    'addr': 'college address',
    'fest': 'college festivals',
    'lib': 'library information',
    'sport': 'sports facilities',
    'adm': 'admission process'
  };
  
  for (const [key, suggestion] of Object.entries(commonTopics)) {
    if (userInput.includes(key) || calculateSimilarity(userInput, key) > 0.6) {
      suggestions.push(suggestion);
    }
  }
  
  if (suggestions.length > 0) {
    return `Did you mean: ${suggestions.slice(0, 2).join(' or ')}?`;
  }
  
  return "Could you be more specific?";
}

async function handleSend() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  
  if (!userText) return;
  
  // Clear input
  input.value = "";
  
  // Add user message
  appendMessage(userText, "user");
  
  // Show typing indicator
  showTyping();
  
  // Simulate processing delay
  setTimeout(() => {
    hideTyping();
    
    // Get bot response
    const botReply = findAnswer(userText);
    
    // Add bot message
    appendMessage(botReply, "bot");
    
    // Speak if voice is enabled
    setTimeout(() => {
      if (document.getElementById("voice-toggle")?.checked) {
        speak(botReply);
      }
    }, 100);
    
    // Reset voice input flag
    if (isVoiceInput) {
      isVoiceInput = false;
    }
    
  }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
}

function quickReply(topic) {
  const input = document.getElementById("user-input");
  input.value = topic;
  handleSend();
}

function appendMessage(message, sender) {
  const chatMessages = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = "flex items-start space-x-2 message";
  
  const timestamp = new Date().toISOString();
  
  if (sender === "user") {
    messageDiv.className = "flex items-start space-x-2 message justify-end";
    messageDiv.innerHTML = `
      <div class="bg-blue-500 text-white text-sm p-3 rounded-2xl max-w-xs">${message}</div>
      <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">You</div>
    `;
    
    // Add to chat history
    chatHistory.push({
      message: message,
      sender: "user",
      timestamp: timestamp
    });
  } else {
    messageDiv.innerHTML = `
      <img src="assets/bot.png" alt="Bot" class="w-6 h-6 rounded-full" />
      <div class="bg-blue-100 dark:bg-blue-800 text-sm p-3 rounded-2xl bot-bubble max-w-xs">${formatMessage(message)}</div>
    `;
    
    // Add to chat history
    chatHistory.push({
      message: message,
      sender: "bot",
      timestamp: timestamp
    });
  }
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Save chat history
  saveChatHistory();
}

function formatMessage(message) {
  // Convert markdown-style formatting to HTML
  return message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function showTyping() {
  if (isTyping) return;
  
  isTyping = true;
  const chatMessages = document.getElementById("chat-messages");
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing-indicator";
  typingDiv.className = "flex items-start space-x-2 message";
  typingDiv.innerHTML = `
    <img src="assets/bot.png" alt="Bot" class="w-6 h-6 rounded-full" />
    <div class="bg-gray-200 dark:bg-gray-700 text-sm p-3 rounded-2xl">
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const typingIndicator = document.getElementById("typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
  isTyping = false;
}

function toggleVoiceInput() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showNotification("Voice recognition not supported in this browser", "error");
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  const micBtn = document.getElementById("mic-btn");
  micBtn.style.backgroundColor = "#ef4444";
  micBtn.textContent = "🔴";
  
  recognition.onstart = () => {
    showNotification("Listening... Speak now!", "info");
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    isVoiceInput = true;
    showNotification("Voice input captured!", "success");
    
    // Auto-send after voice input
    setTimeout(() => {
      handleSend();
    }, 500);
  };
  
  recognition.onerror = (event) => {
    showNotification("Voice recognition error: " + event.error, "error");
  };
  
  recognition.onend = () => {
    micBtn.style.backgroundColor = "#3b82f6";
    micBtn.textContent = "🎤";
  };
  
  recognition.start();
}

function speak(text) {
  if ('speechSynthesis' in window) {
    // Clean text for speech
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emojis
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown
      .replace(/•/g, '') // Remove bullets
      .replace(/\n/g, ' '); // Replace newlines with spaces
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
  }
}

function toggleDark() {
  // Toggle dark mode
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  
  // Get toggle elements
  const toggleBg = document.getElementById('toggle-bg');
  const toggleDot = document.getElementById('toggle-dot');
  const toggleInput = document.getElementById('dark-toggle');
  
  if (isDark) {
    // Switching to dark mode
    if (toggleBg) toggleBg.classList.add('dark');
    if (toggleDot) {
      toggleDot.classList.add('moved');
      toggleDot.textContent = '🌙';
    }
    if (toggleInput) toggleInput.checked = true;
  } else {
    // Switching to light mode
    if (toggleBg) toggleBg.classList.remove('dark');
    if (toggleDot) {
      toggleDot.classList.remove('moved');
      toggleDot.textContent = '☀️';
    }
    if (toggleInput) toggleInput.checked = false;
  }
  
  // Save theme preference
  localStorage.setItem("chat-theme", isDark ? "dark" : "light");
  
  // Show notification
  const themeEmoji = isDark ? "🌙" : "☀️";
  const themeText = isDark ? "Dark" : "Light";
  showNotification(`${themeEmoji} ${themeText} mode activated!`, "success");
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function saveChatHistory() {
  try {
    localStorage.setItem("chat-history", JSON.stringify(chatHistory.slice(-50))); // Keep last 50 messages
  } catch (e) {
    console.warn("Could not save chat history:", e);
  }
}

function loadChatHistory() {
  try {
    const saved = localStorage.getItem("chat-history");
    if (saved) {
      chatHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load chat history:", e);
    chatHistory = [];
  }
}

function exportChat() {
  if (chatHistory.length === 0) {
    showNotification("No chat history to export", "error");
    return;
  }
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text("BMSIT&M Chatbot Conversation", 20, 20);
    doc.setFontSize(10);
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 20, 30);
    
    let yPosition = 45;
    const pageHeight = doc.internal.pageSize.height;
    
    chatHistory.forEach((entry, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      const sender = entry.sender === 'user' ? 'You' : 'Assistant';
      const time = new Date(entry.timestamp).toLocaleTimeString();
      
      doc.setFontSize(9);
      doc.text(`${sender} (${time}):`, 20, yPosition);
      yPosition += 7;
      
      // Clean message for PDF
      const cleanMessage = entry.message
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emojis
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown
        .replace(/•/g, '-'); // Replace bullets
      
      const lines = doc.splitTextToSize(cleanMessage, 170);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 5;
    });
    
    doc.save(`BMSIT_Chat_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification("Chat exported successfully!", "success");
    
  } catch (error) {
    console.error("Export failed:", error);
    showNotification("Export failed. Please try again.", "error");
  }
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', function() {
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
});
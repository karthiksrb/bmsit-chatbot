# BMSIT&M Smart Chatbot

A comprehensive chatbot for BMS Institute of Technology & Management that provides information about courses, admissions, fees, placements, hostel facilities, and more.

## 🌟 Features

- **Comprehensive Information**: Covers all aspects of BMSIT&M including courses, admissions, fees, placements, hostel, and campus facilities
- **Smart Search**: Fuzzy matching and keyword recognition for better user experience
- **Voice Support**: Voice input and text-to-speech output
- **Dark Mode**: Toggle between light and dark themes
- **Chat Export**: Export conversations to PDF
- **Responsive Design**: Works on desktop and mobile devices
- **Typing Indicators**: Realistic chat experience with typing animations
- **Chat History**: Saves conversation history locally

## 📁 Project Structure

```
bmsit-chatbot/
├── index.html          # Main chatbot interface
├── chatbot.js          # Core chatbot functionality
├── qa-data.js          # Question-answer database
├── style.css           # Additional styling
├── assets/             # Images and media files
│   ├── logo.png        # College logo (add your own)
│   ├── bot.png         # Bot avatar (add your own)
│   └── README.md       # Assets information
└── README.md           # This file
```

## 🚀 Getting Started

1. **Clone or Download** the project files
2. **Add Images**: Place college logo and bot avatar in the `assets/` folder
3. **Open**: Open `index.html` in a web browser
4. **Start Chatting**: Ask questions about BMSIT&M!

## 💬 Sample Questions

Try asking these questions:

- "Tell me about BMSIT"
- "What courses are offered?"
- "What are the fees?"
- "How is the placement record?"
- "Tell me about hostel facilities"
- "How to reach the college?"
- "What is the CSE department like?"

## 🎯 Topics Covered

### Academic Information
- About BMSIT&M
- Vision & Mission
- Accreditations (NAAC, NBA)
- Academic programs (UG/PG)
- Department details
- Admission process
- Fee structure

### Campus Life
- Hostel facilities
- Campus facilities
- Library information
- Transportation
- Student activities
- Clubs and events

### Career & Placement
- Placement statistics
- Top recruiters
- Package details
- Internship programs
- Industry connections

### Contact & Location
- Address and directions
- Contact information
- How to reach campus

## 🛠️ Technical Features

### Smart Matching
- Fuzzy keyword matching
- Similarity scoring
- Multiple keyword support
- Typo tolerance

### Voice Features
- Speech recognition (Chrome/Edge)
- Text-to-speech output
- Voice input indicator

### User Experience
- Typing indicators
- Smooth animations
- Dark/light mode
- Responsive design
- Chat history
- PDF export

## 🎨 Customization

### Adding New Questions
Edit `qa-data.js` and add new entries:

```javascript
{
  "keywords": ["your", "keywords", "here"],
  "answer": "Your detailed answer here with **bold** text and bullet points:\n• Point 1\n• Point 2"
}
```

### Styling
- Modify `style.css` for custom styling
- Update colors in the CSS variables
- Adjust animations and transitions

### Images
- Replace `assets/logo.png` with your college logo
- Replace `assets/bot.png` with your bot avatar
- Recommended size: 32x32 pixels

## 🌐 Browser Support

- **Chrome**: Full support (including voice features)
- **Firefox**: Full support (no voice input)
- **Safari**: Full support (limited voice features)
- **Edge**: Full support (including voice features)

## 📱 Mobile Support

The chatbot is fully responsive and works well on:
- Smartphones (iOS/Android)
- Tablets
- Desktop computers

## 🔧 Troubleshooting

### Voice Not Working
- Ensure you're using Chrome or Edge
- Check microphone permissions
- Make sure you're on HTTPS (for production)

### Images Not Loading
- Check that image files exist in `assets/` folder
- Verify file names match exactly
- Ensure proper file permissions

### Chat Export Issues
- Make sure jsPDF library is loaded
- Check browser console for errors
- Try refreshing the page

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to:
- Add more questions and answers
- Improve the UI/UX
- Fix bugs or issues
- Enhance features

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the code comments
3. Test in different browsers

---

**Made with ❤️ for BMSIT&M students and prospective students**
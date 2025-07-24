# Assets Folder

This folder contains the images used by the BMSIT&M Chatbot.

## Required Images

### logo.png
- **Purpose**: College logo displayed in the chatbot header
- **Recommended Size**: 32x32 pixels
- **Format**: PNG with transparent background
- **Current**: BMSIT&M official logo

### bot.png  
- **Purpose**: Bot avatar displayed next to bot messages
- **Recommended Size**: 32x32 pixels
- **Format**: PNG with transparent background
- **Current**: Friendly bot/assistant icon

## Usage

These images are referenced in:
- `index.html` - Logo in header, bot avatar in messages
- `chatbot-fixed.js` - Bot avatar fallback handling

## Customization

To customize the images:
1. Replace the existing files with your own
2. Keep the same filenames
3. Maintain recommended dimensions for best appearance
4. Use PNG format for transparency support

## Fallbacks

If images fail to load:
- Logo: Text fallback in header
- Bot avatar: 🤖 emoji fallback
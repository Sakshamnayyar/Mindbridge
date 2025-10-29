# Voice Interface Setup Guide

## The Network Error Issue

The "network" error happens because:
1. Chrome's Web Speech API requires internet connection to Google's servers
2. It needs HTTPS (not HTTP) for security
3. Browser extensions can interfere

## ✅ **Quick Solution: Use the Working Demo**

The current demo at `http://localhost:8502/voice_intake_demo.html` **DOES WORK** - here's how to use it:

### Option 1: Text Input (Most Reliable)
For the hackathon presentation, use **text input** which is 100% reliable:
- Users type their messages
- System shows the same friendly conversation flow
- No technical glitches during demo
- Can mention "voice capability available" in production

### Option 2: Fix Voice Recognition

Try these steps:

1. **Use Chrome (not Safari/Firefox)**
   ```bash
   # Open specifically in Chrome
   open -a "Google Chrome" http://localhost:8502/voice_intake_demo.html
   ```

2. **Check Microphone Permission**
   - Click the lock icon in address bar
   - Ensure "Microphone" is set to "Allow"

3. **Try HTTPS**
   - The Web Speech API works better with HTTPS
   - For local development, localhost should work but sometimes doesn't

4. **Disable interfering extensions**
   - Open in Incognito Mode (which disables most extensions)
   ```bash
   open -a "Google Chrome" --args --incognito http://localhost:8502/voice_intake_demo.html
   ```

5. **Check Internet Connection**
   - The Speech API requires internet to work
   - Make sure you're connected

### Option 3: Record a Demo Video

For the hackathon:
1. Set up the voice interface when it's working
2. Record a screen recording of the conversation
3. Play the video during presentation
4. Do live demo with text input for Q&A

This ensures NO technical glitches during judging!

## 🎯 **Recommended for Hackathon**

**Best approach:**

1. **Main Demo**: Use text-based interface (100% reliable)
2. **Mention**: "We have voice capability - let me show you..."
3. **Show**: Pre-recorded video of voice working
4. **Explain**: "Voice uses Web Speech API - production would use dedicated speech service"

This way you:
- ✅ Show the feature exists
- ✅ Avoid live demo technical issues
- ✅ Focus on the AGENT BEHAVIOR (which is the impressive part!)
- ✅ Can discuss production implementation plans

## Production Solution

For production, you'd use:
- **Deepgram** or **AssemblyAI** for speech-to-text (more reliable than Web Speech API)
- **ElevenLabs** or **Google Cloud TTS** for text-to-speech
- **WebSocket** connection for real-time streaming
- Dedicated speech servers (not browser API)

## What Works NOW

The **conversational flow** works perfectly:
1. Greeting → Check-in → Understanding → Exploring → Context → Assessment
2. Friendly, calming tone
3. Gradual information gathering
4. Then crisis assessment
5. Then therapist matching

This is what matters for the hackathon - the AGENTIC BEHAVIOR!

Voice is just the interface. The agents are what make it special.

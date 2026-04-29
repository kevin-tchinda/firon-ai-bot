# Firon Roofing AI Widget: Basic User & Testing Guide

This guide will walk you through how to use and verify the features of your new AI Assistant.

## 1. How to Start the Widget
1. Ensure your backend server is running (usually on `localhost:8000`).
2. Open `test.html` in any modern web browser.
3. You will see a **Deep Blue and Red message icon** at the bottom right of the screen.

## 2. Using the Widget

### Home Tab (The Portal)
- **Open**: Click the floating button. The icon will morph into an 'X'.
- **Quick Actions**:
    - Click **"Talk to AI Assistant"** to enter the chat environment.
    - Click **"Request a Free Quote"** to skip directly to the contact form.

### Chat Tab (The Conversation)
- **Send a Message**: Type in the box and press `Enter` or click the `Send` icon. The Send icon only lights up when you've typed something.
- **Timestamps**: Look at the bottom of each message to see when it was sent (e.g., "now", "2m").

## 3. How to Test Premium Features

### Voice Input (Speech-to-Text)
- Click the **Microphone** icon. 
- It will glow **Red** once it starts listening.
- Speak clearly into your mic. Your voice will automatically turn into text in the input box.

### Attachments
- Click the **Paperclip** icon.
- Select any file from your computer.
- A confirmation message "Attached: filename" will appear in the chat.

### Emojis
- Click the **Smiley Face** icon to open the picker.
- Click an emoji to insert it instantly into your message.

### Chat Menu (Three Dots)
- Click the **⋮** icon in the header to:
    - **Clear History**: Resets the chat to clean.
    - **Print Chat**: Opens a beautiful, printable transcript window.
    - **Ask FAQ**: Triggers a pre-set list of roofing questions.

## 4. Testing the Lead Handoff
1. Type: *"I'd like to get a new roof quoted"* or click the **Request Quote** button in the Home tab.
2. An inline form will appear. 
3. Fill in a dummy Name and Email.
4. Click **Submit**. 
5. Verify the AI thanks you and the form disappears after a successful submission.

## 5. Testing Responsiveness
1. Right-click the page and select **Inspect**.
2. Click the **Device Toolbar icon** (mobile/tablet icon).
3. Switch between **iPhone SE**, **iPad**, and **Desktop** views. 
4. Verify the widget stays easy to use and looks sharp on all sizes.

---
*Kev's Standard - Advanced Agentic Coding Services*

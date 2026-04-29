# Firon Roofing AI Chat Widget: Technical Documentation & User Manual

## 1. Technical Overview

The Firon Roofing AI Chat Widget is a premium, lightweight, zero-dependency frontend application designed to provide a high-end AI assistant experience on the web. It is built using a "Vanilla-First" approach, ensuring maximum compatibility and performance without the overhead of heavy frameworks.

### Tech Stack
- **Engine**: Vanilla JavaScript (ES6+).
- **Styling**: Modern CSS with CSS Custom Properties (Variables).
- **Icons**: Optimized Inline SVGs for zero-latency rendering.
- **Assets**: High-quality WebP images for optimal loading.

---

## 2. Technical Documentation

### File Structure
- `widget.js`: Encapsulates all application logic, DOM generation, and state management.
- `widget.css`: Contains the entire design system, responsive breakpoints, and animations.
- `firon-logo.webp`: Brand secondary asset used in the Home Tab.

### Architecture & Design Patterns
The widget uses an **IIFE (Immediately Invoked Function Expression)** to encapsulate the codebase, preventing global namespace pollution.

#### State Management
The widget maintains a local state for:
- `isOpen`: Boolean controlling the visibility of the chat window.
- `currentTab`: String (`home` | `chat`) determining the active view.
- `conversationHistory`: Array of message objects for context-aware AI interactions.
- `handoffCompleted`: Boolean tracking if lead capture has already occurred.

#### Responsive Engine
The design uses **Fluid Typography** via the CSS `clamp()` function. This allows the widget to resize perfectly between a 13" laptop and a 6.7" mobile device without hard-coded media query jumps for every element.

### ⚙️ API Integration
The widget communicates with the backend via standard `fetch` POST requests.

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/chat` | POST | `{ message, history }` | Sends user query and receives AI response. |
| `/lead` | POST | `{ name, email, history }` | Submits captured contact info for business follow-up. |

---

## 3. Technical User Manual

### Installation
To embed the widget on any website, include the CSS and JS files in your HTML:

```html
<!-- 1. Add the stylesheet to your <head> -->
<link rel="stylesheet" href="path/to/widget/widget.css">

<!-- 2. Configuration (Optional) -->
<script>
    window.FironChatConfig = {
        apiUrl: "https://your-api-url.com", // Your backend location
        botName: "Firon AI Assistant",
        welcomeMessage: "Hi! How can our roofing experts help you today?"
    };
</script>

<!-- 3. Add the script before the closing </body> tag -->
<script src="path/to/widget/widget.js"></script>
```

### Personalization (CSS Variables)
You can override the primary brand colors without touching the core CSS file by adding these to your site's stylesheet:

```css
:root {
    --firon-primary: #1e3a8a; /* Deep Blue */
    --firon-red: #e31837;     /* Bright Red */
    --firon-radius: 12px;     /* Roundedness */
}
```

### Feature Guide

#### 1. Proactive Notifications
The widget is programmed to "tap the user on the shoulder" after 15 seconds of inactivity.
- **Behavior**: A tooltip appears above the button.
- **Logic**: This is handled via `setTimeout` in the JavaScript and can be adjusted by changing the `15000` ms value in `widget.js`.

#### 2. Speech-to-Text
Users can click the microphone icon to dictate messages.
- **Requirements**: Requires a secure `https` environment and a browser supporting the `Web Speech API` (Chrome, Edge, Safari).

#### 4. Lead Capture (Handoff)
When the AI detects a "Quote Request" or high intent, it triggers an inline form.
- **Flow**: User enters Name/Email → Data is sent to `/lead` → Chat continues.
- **Ux**: The input area is temporarily disabled during submission to prevent duplicate leads.

### Troubleshooting
- **Icons not showing**: Ensure SVGs are not being blocked by content security policies.
- **API Errors**: Verify that `apiUrl` in `FironChatConfig` matches your backend endpoint and that CORS is enabled on the server.
- **Mobile scaling**: Ensure your site has the `<meta name="viewport" content="width=device-width, initial-scale=1">` tag.

---
*Developed for Firon Roofing - Kev's Standard AI agentic services*

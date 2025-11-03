# Zora Chatbot Widget: Implementation Guide

This document provides a comprehensive guide on how to embed and configure the Zora Chatbot widget on any website.

---

## 1. How It Works

The Zora Chatbot consists of two main parts:

1.  **The Django Backend:** A server application responsible for:
    -   Serving the widget's JavaScript file.
    -   Processing user messages.
    -   Communicating with an AI service (Perplexity AI) to generate responses.
    -   Storing and retrieving conversation history from a database.

2.  **The Frontend Widget:** A single, self-contained JavaScript file (`zora-widget.js`) that:
    -   Injects the chatbot's UI (HTML and CSS) into your webpage.
    -   Handles all user interactions within the chat window.
    -   Communicates with the Django backend via API calls.
    -   Is designed to be universally embeddable and configurable.

---

## 2. Backend Setup

Before you can use the widget on your website, the Django backend server must be running and accessible online.

For detailed instructions on how to set up, configure, and run the backend server, please refer to the [**README.md**](README.md) file.

**IMPORTANT:** The server must be hosted on a publicly accessible URL for the widget to work on a live website. For development, `http://127.0.0.1:8000` is sufficient.

---

## 3. Frontend Implementation

Adding the Zora Chatbot to your website requires adding just **one line of code** to your HTML.

### Step 1: Add the Script Tag

Place the following `<script>` tag just before the closing `</body>` tag of your HTML file.

```html
<script src="https://your-backend-domain.com/static/chatbot_app/zora-widget.js" data-backend-url="https://your-backend-domain.com" defer></script>
```

### Step 2: Configure the Script Tag

You **must** customize two parts of this script tag:

1.  **`src="..."`**
    -   Replace `https://your-backend-domain.com` with the actual URL where your Django backend is hosted.
    -   This URL tells the browser where to download the `zora-widget.js` file from.

2.  **`data-backend-url="..."`**
    -   Replace `https://your-backend-domain.com` with the same URL.
    -   This `data-` attribute tells the widget which base URL to use for its API calls (e.g., fetching responses, clearing chat).

**Example for Local Development:**

If you are running the Django server locally, your script tag would look like this:

```html
<script src="http://127.0.0.1:8000/static/chatbot_app/zora-widget.js" data-backend-url="http://127.0.0.1:8000" defer></script>
```

---

## 4. Customization & Features

### Hiding and Showing the Widget

The widget is hidden by default. A circular launcher button (💬) will appear in the bottom-right corner of your page. Clicking this button will open and close the chat window.

### Theme Synchronization (Dark Mode)

The widget defaults to a light (white) theme.

It will **automatically switch to a dark theme** if it detects a class named `dark-mode` on the `<body>` tag of your website.

**Example:**

If your website's HTML looks like this, the widget will automatically render in dark mode.

```html
<body class="dark-mode">
    <!-- Your website content -->

    <script src=".../zora-widget.js" ...></script>
</body>
```

### Clearing Chat History

Inside the chat window's header, there is a trash can icon (🗑️). Clicking this will send a request to the backend to delete the entire conversation history for all users and will reset the chat window to its initial state.

---

## 5. Technology Stack

-   **Backend:**
    -   **Framework:** Django (Python)
    -   **AI Integration:** Perplexity AI via the `perplexity-ai` Python library.
    -   **Database:** SQLite (default, configurable in Django settings).

-   **Frontend:**
    -   **Language:** Vanilla JavaScript (ES6+)
    -   **Styling:** CSS-in-JS (CSS is embedded within the JavaScript file).
    -   **Markdown Parsing:** [Showdown.js](https://github.com/showdownjs/showdown) (loaded from a CDN).

This concludes the implementation guide. The widget is now ready for universal deployment.

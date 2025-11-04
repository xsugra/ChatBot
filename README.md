# ChatBot Zora - Backend

This is the Django backend for the Zora Chatbot widget. It provides a simple API for receiving user messages, communicating with the Perplexity AI, and storing conversation history.

## Backend Setup Guide

This guide is for developers who want to run, modify, or deploy the backend server.

### 1. Prerequisites

- Python 3.8+
- Pip (Python package installer)

### 2. Installation

**Clone the repository:**
```bash
git clone https://github.com/xsugra/ChatBot.git
cd ChatBot
```

**Create and activate a virtual environment:**

*On macOS/Linux:*
```bash
python3 -m venv venv
source venv/bin/activate
```

*On Windows:*
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

### 3. Configuration

**Create an environment file:**

Create a file named `.env` in the root of the project directory (`ChatBot/.env`).

**Add your API Key:**

Open the `.env` file and add your Perplexity API key. The file should contain:

```
PERPLEXITY_API_KEY="your_perplexity_api_key_here"
```

### 4. Running the Server

**Apply database migrations:**

This command sets up the database schema required for storing chat history.
```bash
python manage.py migrate
```

**Start the development server:**
```bash
python manage.py runserver
```

The backend server will now be running at `http://127.0.0.1:8000/`.

### 5. API Endpoints

- `POST /chatbot_response`: The main endpoint that receives user messages and returns the bot's response.
- `POST /clear_chat`: Clears all conversation history from the database.
- `GET /static/chatbot_app/zora-widget.js`: Serves the JavaScript widget file.

---

For instructions on how to embed the widget on a website, see [DOCUMENTATION.md](DOCUMENTATION.md).
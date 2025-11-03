import os
import json
import re
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from perplexity import Perplexity
from .models import ChatMessage


def chat_view(request):
    """
    Renders the main chat page.
    This view fetches all existing chat messages from the database and passes them
    to the template, where they are used to populate the initial chat history.
    """
    messages = list(ChatMessage.objects.all().values('user_message', 'bot_response'))
    return render(request, 'chatbot_app/index.html', {'messages': messages})


@csrf_exempt
def chatbot_response(request):
    """
    Handles the incoming POST request from the frontend, gets a response from the Perplexity API,
    and saves the conversation to the database.

    This view is exempt from CSRF protection to allow simple AJAX calls from the
    frontend widget without needing complex token handling.
    """
    if request.method == 'POST':
        # Fetch the API key from environment variables.
        api_key = os.environ.get("PERPLEXITY_API_KEY")
        if not api_key:
            return JsonResponse({'error': 'PERPLEXITY_API_KEY not configured'}, status=500)

        # Initialize the Perplexity client.
        client = Perplexity(api_key=api_key)

        # Decode the incoming request body.
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user_message = body.get('message', '')
        
        try:
            # Construct the message payload for the Perplexity API.
            messages = [
                {
                    "role": "system",
                    "content": "You are Zora, a friendly and helpful AI assistant. Your primary language for interaction is Slovak. Always respond in the same language as the user's question. If the language is unclear (e.g., a short greeting), default to Slovak. Keep your answers as brief as possible, aiming for one to two sentences, and format them using Markdown. Do not include any legends, disclaimers, or source citations in your responses.",
                },
                {"role": "user", "content": user_message},
            ]

            # Call the Perplexity API.
            response = client.chat.completions.create(
                model="sonar",
                messages=messages,
            )
            bot_response = response.choices[0].message.content
            
            # Post-process the response to remove citation markers like [1], [2], etc.
            bot_response = re.sub(r'\[\d+\]', '', bot_response).strip()

        except Exception as e:
            bot_response = f"Sorry, an error occurred: {e}"

        # Save the conversation to the database.
        ChatMessage.objects.create(
            user_message=user_message,
            bot_response=bot_response
        )
            
        return JsonResponse({'response': bot_response})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def clear_chat_history(request):
    """
    Handles a POST request to delete all chat messages from the database.
    """
    if request.method == 'POST':
        ChatMessage.objects.all().delete()
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)
from django.db import models


class ChatMessage(models.Model):
    """
    Represents a single user-bot interaction in the chat.
    Stores the user's message, the bot's generated response, and a timestamp.
    """
    id = models.AutoField(primary_key=True)
    user_message = models.TextField()
    bot_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """String representation of the ChatMessage model."""
        return f"User: {self.user_message[:50]} | Bot: {self.bot_response[:50]}"
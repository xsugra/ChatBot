from django.test import TestCase
from django.urls import reverse

class ChatBotAppTests(TestCase):
    def test_chat_view_status_code(self):
        """Test that the chat view returns a 200 OK status code."""
        response = self.client.get(reverse('chat'))
        self.assertEqual(response.status_code, 200)

    def test_chat_view_uses_correct_template(self):
        """Test that the chat view uses the correct template."""
        response = self.client.get(reverse('chat'))
        self.assertTemplateUsed(response, 'chatbot_app/index.html')
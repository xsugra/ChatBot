from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_view, name='chat'),
    path('chatbot_response', views.chatbot_response, name='chatbot_response'),
    path('clear_chat', views.clear_chat_history, name='clear_chat'),
]
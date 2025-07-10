from django.shortcuts import render
from rest_framework import generics
from .serializer import RegistrationSerializer
from django.contrib.auth import get_user_model


User = get_user_model()
class RegistrationView(generics.CreateAPIView):
    
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

    def perform_create(self, serializer):
        
        serializer.save()

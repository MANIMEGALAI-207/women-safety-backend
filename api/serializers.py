from rest_framework import serializers
from .models import SOSRequest

class SOSRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    audio_url = serializers.SerializerMethodField()

    class Meta:
        model = SOSRequest
        fields = ('id', 'user_name', 'lat', 'lng', 'status', 'created_at', 'audio_url')

    def get_audio_url(self, obj):
        if obj.audio:
            return f"https://women-safety-backend-1-34sx.onrender.com{obj.audio.url}"
        return None
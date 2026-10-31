from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import SOSRequest, User
from .serializers import SOSRequestSerializer
import requests


@api_view(['GET'])
def sos_list(request):
    alerts = SOSRequest.objects.filter(status='pending').order_by('-created_at')
    serializer = SOSRequestSerializer(alerts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def sos_create(request):
    try:
        username = request.data.get('username')
        user = None
        
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                pass
        
        sos = SOSRequest.objects.create(
            user=user,
            lat=request.data.get('lat', 0.0),
            lng=request.data.get('lng', 0.0),
            status='pending'
        )

        # UltraMsg WhatsApp API
        instance_id = 'instance195825'
        token = 'xjh2ioq07cf1otfg'
        phone = '918015047743'  # <-- Unga family number
        message = f"🚨 SOS Alert! I need help. Location: https://maps.google.com/?q={sos.lat},{sos.lng}"

        url = f"https://api.ultramsg.com/{instance_id}/messages/chat"
        payload = {
            "token": token,
            "to": phone,
            "body": message
        }
        
        # API call (error vandhalum, SOS alert block aagaadhu)
        try:
            requests.post(url, data=payload, timeout=5)
        except Exception as whatsapp_error:
            print(f"WhatsApp error: {whatsapp_error}")

        return Response({'id': sos.id, 'message': 'SOS Created'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['PATCH'])
def resolve_sos(request, sos_id):
    try:
        sos = SOSRequest.objects.get(id=sos_id)
        sos.status = 'resolved'
        sos.save()
        return Response({'message': 'Resolved successfully'})
    except SOSRequest.DoesNotExist:
        return Response({'error': 'SOS not found'}, status=404)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_audio(request, sos_id):
    try:
        sos = SOSRequest.objects.get(id=sos_id)
        if 'audio' in request.FILES:
            sos.audio = request.FILES['audio']
            sos.save()
            return Response({'message': 'Audio uploaded successfully'}, status=200)
        return Response({'error': 'No audio file'}, status=400)
    except SOSRequest.DoesNotExist:
        return Response({'error': 'SOS not found'}, status=404)


@api_view(['POST'])
def register_user(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        
        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {'id': user.id, 'username': user.username},
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({'error': 'Invalid username or password'}, status=401)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': {'id': user.id, 'username': user.username},
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
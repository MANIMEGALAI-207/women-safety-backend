from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import SOSRequest
from .serializers import SOSRequestSerializer


@api_view(['GET'])
def sos_list(request):
    alerts = SOSRequest.objects.filter(status='pending').order_by('-created_at')
    serializer = SOSRequestSerializer(alerts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def sos_create(request):
    try:
        sos = SOSRequest.objects.create(
            lat=request.data.get('lat', 0.0),
            lng=request.data.get('lng', 0.0),
            status='pending'
        )
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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SOSRequest
from .serializers import SOSRequestSerializer


@api_view(['GET'])
def sos_list(request):
    """
    Police Dashboard-ku pending SOS alerts list.
    Ithu Police page load aagumbodhu call aagum.
    """
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
    """
    Police 'Mark Resolved' click pannumbodhu, ithu call aagum.
    Status-ah 'resolved' ku maathum.
    """
    try:
        sos = SOSRequest.objects.get(id=sos_id)
        sos.status = 'resolved'
        sos.save()
        return Response({'message': 'Resolved successfully'})
    except SOSRequest.DoesNotExist:
        return Response({'error': 'SOS not found'}, status=404)
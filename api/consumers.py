import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import SOSRequest

class SOSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "sos_alerts"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data.get('type') == 'sos_alert':
            # Database-la save pannu (Async)
            sos = await self.save_sos(data)
            
            # Alert anuppu
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'sos_alert_message',
                    'message': {
                        'id': sos.id,  # <-- Ithu dhaan mukkiyam!
                        'user': data.get('user', 'Unknown'),
                        'lat': data.get('lat', 0.0),
                        'lng': data.get('lng', 0.0),
                        'timestamp': data.get('timestamp', ''),
                    }
                }
            )

    @database_sync_to_async
    def save_sos(self, data):
        # user_id=1 nu temporary-a kuduthirukkom. 
        # (Neenga login system add panna, adha maathunga)
        return SOSRequest.objects.create(
            user_id=1, 
            lat=data.get('lat', 0.0),
            lng=data.get('lng', 0.0),
            status='pending'
        )

    async def sos_alert_message(self, event):
        await self.send(text_data=json.dumps(event['message']))
import asyncio
import websockets

async def test_websocket():
    uri = "ws://127.0.0.1:8000/ws/sos/"
    async with websockets.connect(uri) as websocket:
        print("✅ WebSocket Connected!")
        await websocket.send('{"message": "Test SOS Alert"}')
        response = await websocket.recv()
        print(f"📩 Received: {response}")

asyncio.run(test_websocket())
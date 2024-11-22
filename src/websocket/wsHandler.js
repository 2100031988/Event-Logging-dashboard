import { WebSocket } from 'ws';

let wss;

export const setupWebSocket = (websocketServer) => {
  wss = websocketServer;
  
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    
    ws.on('error', console.error);
    
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to event logging system'
    }));
  });
};

export const broadcastEvent = (event) => {
  if (!wss) return;
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'newEvent',
        event
      }));
    }
  });
};
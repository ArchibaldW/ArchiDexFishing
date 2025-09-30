const WebSocketServer = require("websocket").server;

class WebsocketService {
  constructor(name, shouldPendMessage, onConnect) {
    this.name = name;
    this.onConnect = onConnect;
    this.shouldPendMessage = shouldPendMessage === true;
    this.activeConnections = [];

    this.messageToSend = []
  }

  start = (httpServer) => {
    this.wsServer = new WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: true,
    });

    this._setupListeners();

    console.log(`[WS][${this.name}] started`)
  };

  sendMessage = (message) => {

    if (this.activeConnections.length > 0) {
      this.activeConnections.forEach((con) => con.send(JSON.stringify(message)));
    } else if (this.shouldPendMessage) {
      console.log(`[WS][${this.name}] Pending message added`)
      this.messageToSend.push(message)
    }
    
  };
  
  _setupListeners = () => {
    this.wsServer.on("connect", (connection) => {
      this.activeConnections.push(connection);
      this.onConnect(connection);
      console.log(
        `[WS][${this.name}] Client connected (current active connections: ${this.activeConnections.length})`
      );
      
      if (this.messageToSend.length > 0) {
        console.log(
          `[WS][${this.name}] Sending : ${this.messageToSend.length} pending message)`
        );
        this.messageToSend.map( (msg) => {
          connection.send(JSON.stringify( msg))
        })

        setTimeout(() => {
          this.messageToSend.splice(0,this.messageToSend.length)
        }, 2000);
        
      }
      
    });

    this.wsServer.on("close", () => {
      this.activeConnections = this.activeConnections.filter(
        (con) => con.connected
      );
      console.log(
        `[WS][${this.name}] Client disconnected (current active connections: ${this.activeConnections.length})`
      );
    });
  };
}

module.exports = WebsocketService;

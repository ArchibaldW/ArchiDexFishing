const WebsocketService = require("../../component/websocket-service");
const express = require("express");
const config = require("../../config");

const port = config.port_WebSocket;
const appSpeech = express();
const serverSpeech = appSpeech.listen(port);
appSpeech.use(express.static(__dirname + "/public"));
console.log("→ WebSocket opening on : http://localhost:" + port);
let webSocketOpen;

// Utility Function
function sendMsgDebug(response) {
  webSocketOpen.sendMessage(response);
}

// ----------------------------------
// Exposed Function
module.exports.start = () => {
  webSocketOpen = new WebsocketService(
    "WS    🤖:" + port,
    false,
    () => {}
  );
  webSocketOpen.start(serverSpeech);
  return webSocketOpen;
};

// --
module.exports.sendMessage = (response) => {
  if (webSocketOpen == null) {
    return;
  }
  sendMsgDebug(response);
};

module.exports.WebSocket = () => {
  return webSocketOpen;
};

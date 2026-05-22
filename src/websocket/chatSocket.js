export function connectChatSocket(onMessage) {
  // TODO: replace mock socket with real WebSocket connection
  return {
    send: (message) => console.log('chat send', message),
    close: () => console.log('chat socket closed')
  };
}

export function connectNotificationSocket(onNotification) {
  return {
    close: () => console.log('notification socket closed')
  };
}

export async function sendMessage(message) {
  return { id: Date.now(), text: message, author: 'Agent' };
}

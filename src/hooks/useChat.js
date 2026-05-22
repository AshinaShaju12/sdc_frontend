import { useState } from 'react';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  const sendMessage = (message) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: message, author: 'User' }]);
    setDraft('');
  };

  return { messages, draft, setDraft, sendMessage };
}

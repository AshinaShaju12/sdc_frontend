function ChatMessage({ author, text }) {
  return (
    <div className="mb-3 rounded-2xl bg-slate-950 p-4 text-slate-100">
      <div className="text-xs uppercase tracking-wide text-slate-500">{author}</div>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  );
}

export default ChatMessage;

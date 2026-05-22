function ChatWindow({ children }) {
  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-3xl border border-slate-800 bg-slate-900 p-4">
      {children}
    </div>
  );
}

export default ChatWindow;

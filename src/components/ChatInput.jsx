function ChatInput({ value, onChange, onSend }) {
  return (
    <div className="mt-auto flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 p-3">
      <input
        value={value}
        onChange={onChange}
        placeholder="Type a message"
        className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-brand-500"
      />
      <button
        type="button"
        onClick={onSend}
        className="rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;

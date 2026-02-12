"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  getCrewMessages,
  sendMessage,
  subscribeToCrewMessages,
  getCrewMembers,
} from "@/lib/crew-service";
import type { Crew, CrewMessage, CrewMember } from "@/lib/types";
import { format } from "date-fns";

interface CrewChatProps {
  crew: Crew;
  currentUserId: string;
  displayName: string;
  memberIdMap: Record<string, string>;
}

export function CrewChat({ crew, currentUserId, displayName, memberIdMap }: CrewChatProps) {
  const [messages, setMessages] = useState<CrewMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCrewMessages(crew.id).then((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
  }, [crew.id]);

  useEffect(() => {
    const unsub = subscribeToCrewMessages(crew.id, (msg) => {
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
    });
    return unsub;
  }, [crew.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    try {
      const msg = await sendMessage(crew.id, text);
      if (msg) setMessages((prev) => [...prev, msg]);
    } catch {
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const getName = (userId: string | null) => {
    if (!userId) return "Summit";
    return memberIdMap[userId] ?? "Climber";
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-8">
            No messages yet. Say hi to your crew! 🏔️
          </p>
        )}
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${
              msg.type === "level_up"
                ? "max-w-full items-center"
                : `max-w-[85%] ${msg.user_id === currentUserId ? "ml-auto items-end" : "mr-auto items-start"}`
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-2 ${
                msg.type === "level_up"
                  ? "bg-emerald-500/20 border border-emerald-500/40"
                  : msg.user_id === currentUserId
                    ? "bg-emerald-500/20 text-zinc-100"
                    : "bg-zinc-800/80 text-zinc-100"
              }`}
            >
              {msg.type === "level_up" ? (
                <>
                  <p className="text-emerald-400 text-sm font-medium">{msg.content}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {getName(msg.user_id ?? null)} • {format(new Date(msg.created_at), "h:mm a")}
                  </p>
                </>
              ) : msg.type === "spelunking" ? (
                <>
                  <p className="text-amber-400 text-sm font-medium">{msg.content}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {format(new Date(msg.created_at), "h:mm a")}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {format(new Date(msg.created_at), "h:mm a")}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2 pb-4 safe-bottom">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message your crew…"
          className="flex-1 h-12 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
          disabled={sending}
          maxLength={500}
        />
        <Button type="submit" disabled={sending || !input.trim()} size="md">
          Send
        </Button>
      </form>
    </div>
  );
}

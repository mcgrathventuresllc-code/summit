"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createCrew } from "@/lib/crew-service";
import type { Crew } from "@/lib/types";

interface CrewCreateProps {
  displayName: string;
  onCreated: (crew: Crew) => void;
  onBack: () => void;
}

export function CrewCreate({ displayName, onCreated, onBack }: CrewCreateProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const crew = await createCrew(name.trim() || "My Crew", displayName);
      if (crew) onCreated(crew);
      else setError("Could not create crew. Make sure you're signed in.");
    } catch (err) {
      const msg = (err as { message?: string })?.message || (err instanceof Error ? err.message : String(err));
      if (msg.includes("relation") && msg.includes("does not exist")) {
        setError("Database tables missing. Run supabase/migrations/001_crew.sql in Supabase SQL Editor.");
      } else if (msg.includes("fetch") || msg.includes("Failed to fetch")) {
        setError("Network error. Check your connection and that Supabase project is active.");
      } else {
        setError(msg || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button type="button" onClick={onBack} className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Back
      </button>
      <Input
        label="Crew name"
        placeholder="e.g. Morning Lifters"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Creating…" : "Create crew"}
      </Button>
    </form>
  );
}

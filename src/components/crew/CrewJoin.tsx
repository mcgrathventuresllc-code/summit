"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { joinCrew } from "@/lib/crew-service";
import type { Crew } from "@/lib/types";

interface CrewJoinProps {
  displayName: string;
  onJoined: (crew: Crew) => void;
  onBack: () => void;
}

export function CrewJoin({ displayName, onJoined, onBack }: CrewJoinProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await joinCrew(code.trim(), displayName);
      if ("crew" in result) onJoined(result.crew);
      else setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
        label="Invite code"
        placeholder="e.g. ABC123"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        disabled={loading}
        maxLength={6}
      />
      <p className="text-zinc-500 text-xs">
        Ask your crew lead for the 6-character code
      </p>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" fullWidth disabled={loading || code.length < 4}>
        {loading ? "Joining…" : "Join crew"}
      </Button>
    </form>
  );
}

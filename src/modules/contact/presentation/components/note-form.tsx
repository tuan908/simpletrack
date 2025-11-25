"use client";

import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Textarea } from "@/core/components/ui/textarea";
import { useState } from "react";

interface NoteFormProps {
  contactId: string;
  onSave: (contactId: string, type: string, content: string) => void;
  loading: boolean;
}

export function NoteForm({ contactId, onSave, loading }: NoteFormProps) {
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("Call"); // Default type

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
      onSave(contactId, noteType, noteContent);
      setNoteContent(""); // Clear input after saving
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <Label htmlFor="note-type">Note Type</Label>
        <Select onValueChange={setNoteType} value={noteType} disabled={loading}>
          <SelectTrigger
            aria-label="Note Type"
            id="note-type"
            className="w-full"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Call">Call</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="note-content">Note</Label>
        <Textarea
          id="note-content"
          placeholder="Add a note..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          disabled={loading}
          rows={4}
        />
      </div>
      <Button type="submit" disabled={loading} className="self-end">
        Save Note
      </Button>
    </form>
  );
}

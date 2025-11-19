"use client";

import { useState } from 'react';
import { Entry } from "@/api/type";
import EntryCard from "@/components/EntryCard";
import { moveAPI } from "@/api/moveAPI";

export default function EntryTable({entries}: { entries: Entry[] }) {
  const [ expandedId, setExpandedId ] = useState<number | null>(null);
  const [ localEntries, setLocalEntries ] = useState<Entry[]>(entries || []);

  const handleDelete = async (id: number) => {
    const target = localEntries.find(e => e.id === id);
    if (!target) return;

    try {
      const isHold = 'started_at' in target && 'ended_at' in target;
      if (isHold) {
        await moveAPI.deleteHoldEntry(id);
      } else {
        await moveAPI.deleteRepsEntry(id);
      }
      setLocalEntries(prev => prev.filter(e => e.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error('Failed to delete entry', err);
    }
  };

  return (
    <>
      {localEntries.map((entry) => {
        const isHold = 'started_at' in entry && 'ended_at' in entry;
        const isExpanded = expandedId === entry.id;
        return (
          <div key={entry.id}>
            <EntryCard
              entry={entry}
              isHold={isHold}
              isExpanded={isExpanded}
              toggleExpand={() => setExpandedId(isExpanded ? null : entry.id)}
              onDelete={() => handleDelete(entry.id)}
            />
          </div>
        );
      })}
    </>
  );
}

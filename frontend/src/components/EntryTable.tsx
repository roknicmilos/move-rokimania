"use client";

import { useState } from 'react';
import { Entry } from "@/type";
import EntryCard from "@/components/EntryCard";

export default function EntryTable({entries}: { entries: Entry[] }) {
  const [ expandedId, setExpandedId ] = useState<number | null>(null);

  return (
    <>
      {entries.map((entry) => {
        const isHold = 'started_at' in entry && 'ended_at' in entry;
        const isExpanded = expandedId === entry.id;
        return (
          <EntryCard
            key={entry.id}
            entry={entry}
            isHold={isHold}
            isExpanded={isExpanded}
            toggleExpand={() => setExpandedId(isExpanded ? null : entry.id)}/>
        );
      })}
    </>
  );
}

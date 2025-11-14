"use client";

import { useState } from 'react';
import { Entry } from "@/type";
import { formatTime, getDurationSec } from "@/utils";

export default function ClientEntries({entries}: { entries: Entry[] }) {
  const [ expandedId, setExpandedId ] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {entries.map((entry) => {
        const isHold = 'started_at' in entry && 'ended_at' in entry;
        const isExpanded = expandedId === entry.id;

        return (
          <div
            key={entry.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
          >
            {/* Collapsed Card */}
            <button
              onClick={() => toggleExpand(entry.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    isHold ? 'text-indigo-600' : 'text-green-600'
                  }`}
                >
                  {entry.exercise}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {isHold
                    ? `${getDurationSec(entry.started_at, entry.ended_at)}s`
                    : `${entry.reps} reps`}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                {isHold ? (
                  <>
                    <div className="flex justify-between">
                      <span>Started:</span>
                      <span className="font-medium">
                        {formatTime(entry.started_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ended:</span>
                      <span className="font-medium">{formatTime(entry.ended_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium text-indigo-600">
                        {getDurationSec(entry.started_at, entry.ended_at)} seconds
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Reps:</span>
                      <span className="font-medium text-green-600">{entry.reps}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-xs text-gray-500 pt-1">
                  <span>ID: {entry.id}</span>
                  <span>Created: {formatTime(entry.created_at)}</span>
                </div>
                {entry.updated_at && (
                  <div className="text-xs text-gray-500">
                    Updated: {formatTime(entry.updated_at)}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

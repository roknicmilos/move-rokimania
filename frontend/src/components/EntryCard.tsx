import { formatTime, getDurationSec } from "@/utils";
import { Entry, HoldEntry, RepsEntry } from "@/type";
import { Trash2 } from "lucide-react";

type EntryCardProps = {
  entry: Entry;
  isHold: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
  onDelete: () => void;
};

export default function EntryCard(props: EntryCardProps) {
  const {entry, isHold, isExpanded, toggleExpand, onDelete} = props;

  const holdEntry = entry as HoldEntry;
  const repsEntry = entry as RepsEntry;

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Collapsed Header */}
      <button
        onClick={toggleExpand}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        type="button"
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isHold ? "text-indigo-600" : "text-green-600"}`}>
            {entry.exercise}
          </span>
          <span className="text-sm font-semibold text-gray-700">
            {isHold
              ? `${getDurationSec(holdEntry.started_at, holdEntry.ended_at)}s`
              : `${repsEntry.reps} reps`}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 text-sm text-gray-600 space-y-3">
          {/* Main Details */}
          {isHold ? (
            <>
              <div className="flex justify-between">
                <span>Started:</span>
                <span className="font-medium">{formatTime(holdEntry.started_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ended:</span>
                <span className="font-medium">{formatTime(holdEntry.ended_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-indigo-600 font-semibold">
                  {getDurationSec(holdEntry.started_at, holdEntry.ended_at)} seconds
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span>Reps:</span>
              <span className="text-green-600 font-semibold">{repsEntry.reps}</span>
            </div>
          )}

          {/* Load (if any) */}
          {entry.load > 0 && (
            <div className="flex justify-between">
              <span>Load:</span>
              <span className="font-medium">+{entry.load} kg</span>
            </div>
          )}

          {/* Footer Info + Delete Button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 space-y-1">
              <div>ID: {entry.id}</div>
              <div>Created: {formatTime(entry.created_at)}</div>
              {entry.updated_at && <div>Updated: {formatTime(entry.updated_at)}</div>}
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggleExpand
                onDelete?.();
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
              aria-label="Delete entry"
              title="Delete entry"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform cursor-pointer"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

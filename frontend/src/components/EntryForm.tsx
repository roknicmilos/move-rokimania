"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { X } from "lucide-react";
import EntryTypeSelect from "@/components/EntryTypeSelect";
import RepsEntryForm from "@/components/RepsEntryForm";
import HoldEntryForm from "@/components/HoldEntryForm";


export default function EntryForm() {
  const [ entryType, setEntryType ] = useState<"reps" | "hold">(null);

  const handleSuccess = (message: string = "Entry created successfully!") => {
    toast.custom(
      (t) => (
        <div
          className={
            "flex items-center justify-between bg-green-100 border border-green-300" +
            " text-green-900 px-6 py-4 rounded-lg shadow-lg max-w-md w-full animate-slide-down" +
            ` ${t.visible ? 'animate-enter' : 'animate-leave'}`
          }
        >
          <span className="font-medium">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-green-700 hover:text-green-900 transition"
          >
            <X size={20}/>
          </button>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );

    // Reset form state
    setEntryType(null);
  };

  const handleError = (message: string = 'Failed to create entry. Please try again.') => {
    toast.custom(
      (t) => (
        <div
          className={
            "flex items-center justify-between bg-red-100 border border-red-300" +
            " text-red-900 px-6 py-4 rounded-lg shadow-lg max-w-md w-full animate-slide-down" +
            ` ${t.visible ? 'animate-enter' : 'animate-leave'}`
          }
        >
          <span className="font-medium">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-red-700 hover:text-red-900 transition"
          >
            <X size={20} className="cursor-pointer"/>
          </button>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  };

  const handleBack = () => {
    setEntryType(null);
  };

  return (
    <>
      <Toaster/>

      {!entryType ? (
        <EntryTypeSelect onSelect={setEntryType}/>
      ) : (
        <div className="py-8 md:p-8 md:bg-white md:rounded-xl md:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {entryType === 'reps' ? 'Reps Entry Form' : 'Hold Entry Form'}
            </h2>
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              {"<<"} Back
            </button>
          </div>

          {entryType === "reps" ? (
            <RepsEntryForm onSuccess={handleSuccess} onError={handleError}/>
          ) : (
            <HoldEntryForm onSuccess={handleSuccess} onError={handleError}/>
          )}
        </div>
      )}
    </>
  );
}

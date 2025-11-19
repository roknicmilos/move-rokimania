"use client";

import { useState } from "react";
import RepsEntryForm from "@/components/RepsEntryForm";
import HoldEntryForm from "@/components/HoldEntryForm";
import { toast, Toaster } from "react-hot-toast";
import { X } from "lucide-react";

type EntryType = "reps" | "hold" | null;

export default function AddEntryPage() {
  const [ entryType, setEntryType ] = useState<EntryType>(null);

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

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Add New Exercise Entry
          </h1>

          {!entryType ? (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Select Entry Type
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setEntryType('reps')}
                  className={
                    "group p-8 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600" +
                    " hover:to-blue-700 text-white rounded-lg shadow-lg transform transition-all" +
                    " duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                  }
                >
                  <div className="text-5xl mb-4">💪</div>
                  <h3 className="text-2xl font-bold mb-2">Reps Entry</h3>
                  <p className="text-blue-100">
                    For exercises counted by repetitions
                  </p>
                </button>

                <button
                  onClick={() => setEntryType('hold')}
                  className={
                    "group p-8 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600" +
                    " hover:to-purple-700 text-white rounded-lg shadow-lg transform transition-all" +
                    " duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
                  }
                >
                  <div className="text-5xl mb-4">⏱️</div>
                  <h3 className="text-2xl font-bold mb-2">Hold Entry</h3>
                  <p className="text-purple-100">
                    For isometric holds with duration
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8">
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
                <RepsEntryForm
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              ) : (
                <HoldEntryForm
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

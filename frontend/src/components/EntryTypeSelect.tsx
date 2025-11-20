type EntryTypeSelectProps = {
  onSelect: (type: "reps" | "hold") => void;
}

export default function EntryTypeSelect({ onSelect }: EntryTypeSelectProps) {
  return (
    <div className="py-8 md:p-8 md:bg-white md:rounded-xl md:shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Select Entry Type
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect("reps")}
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
          onClick={() => onSelect("hold")}
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
  );
}

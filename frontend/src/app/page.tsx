import { formatDate } from "@/utils";
import { Entry } from "@/type";
import ClientEntries from "@/components/ClientEntries";
import { moveAPI } from "@/api/moveAPI";

export default async function Home() {
  const entries = await moveAPI.getEntries();

  // Group entries by date (using created_at)
  const grouped = entries.reduce((acc: Record<string, Entry[]>, entry: Entry) => {
    const dateKey = formatDate(entry.created_at);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Exercise Log</h1>

        {sortedDates.length === 0 && (
          <p className="text-center text-gray-500">No entries found.</p>
        )}

        {sortedDates.map((date) => (
          <div key={date} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">{date}</h2>
            <div className="space-y-2">
              <ClientEntries entries={grouped[date]}/>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

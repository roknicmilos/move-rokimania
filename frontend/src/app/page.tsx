import { formatDate } from "@/utils";
import { Entry } from "@/type";
import ClientEntries from "@/components/ClientEntries";

async function getEntries(): Promise<Entry[]> {
  const url = process.env.INTERNAL_API_URL + '/entries/';
  const res = await fetch(url, {cache: 'no-store'});
  if (!res.ok) {
    throw new Error(`Failed to fetch entries: ${res.statusText}`);
  }
  return res.json();
}

export default async function Home() {
  const entries = await getEntries();

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

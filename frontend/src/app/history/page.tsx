import { redirect } from "next/navigation";
import { formatDate } from "@/core/utils";
import { Entry } from "@/api/type";
import EntryTable from "@/components/EntryTable";
import { getValidUserTokenOrRedirect } from "@/core/serverUtils";
import { moveAPI } from "@/api/moveAPI";


export default async function History() {
  const userToken = await getValidUserTokenOrRedirect();
  const entries = await moveAPI.getEntries(userToken);

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
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Exercise Log</h1>

        {sortedDates.length === 0 && (
          <p className="text-center text-gray-500">No entries found.</p>
        )}

        {sortedDates.map((date) => (
          <div key={date} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">{date}</h2>
            <div className="space-y-2">
              <EntryTable entries={grouped[date]}/>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

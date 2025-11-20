import EntryForm from "@/components/EntryForm";
import { getValidUserTokenOrRedirect } from "@/core/serverUtils";

export default async function AddEntryPage() {
  await getValidUserTokenOrRedirect();

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Add New Exercise Entry
        </h1>
        <EntryForm/>
      </div>
    </main>
  );
}

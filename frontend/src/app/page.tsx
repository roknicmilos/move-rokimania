async function getEntries() {
  const url = process.env.INTERNAL_API_URL + '/entries/';
  console.log(url);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch entries: ${ res.statusText }`);
  }
  return res.json();
}

export default async function Home() {
  const entries = await getEntries();

  return (
      <main>
        <h1>Entries:</h1>
        <pre>{ JSON.stringify(entries, null, 2) }</pre>
      </main>
  );
}

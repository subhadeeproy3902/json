import { JsonConverter } from "@/components/json-converter";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24">
      <JsonConverter />
    </main>
  );
}

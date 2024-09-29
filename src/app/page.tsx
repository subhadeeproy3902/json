import EndSection from "@/components/end-section";
import { JsonConverter } from "@/components/json-converter";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <>
    <main className="flex min-h-screen flex-col items-center justify-between">
      <JsonConverter />
      <a
        href="https://github.com/subhadeeproy3902/json"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 right-2 md:right-8 z-40"
      >
        <button
          type="button"
          className="px-6 backdrop-blur hover:px-8 py-2 rounded-full relative text-xs md:text-sm hover:shadow-xl hover:shadow-green-600/[0.2] transition-all duration-300 border border-green-300 "
        >
          <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <span className="relative z-20">
            <Github size={16} className="inline-block mr-2" />
            Github code
          </span>
        </button>
      </a>
      <EndSection />
    </main>
    </>
  );
}

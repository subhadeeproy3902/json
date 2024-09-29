import Image from "next/image";

export default function EndSection() {
  return (
    <>
      <section className="bg-green-100 grainy-light w-full">
        <div className="flex flex-col max-w-6xl mx-auto py-6 mt-8">
          <h2 className="text-5xl font-bold pb-6 text-center bg-gradient-to-r from-zinc-900 to-zinc-600 max-w-md mx-auto bg-clip-text text-transparent">
            Made Using :
          </h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center p-4 mx-4 sm:mx-24">
            <Image
              alt="NextJS"
              loading="lazy"
              width={150}
              height="150"
              src="/nlogo.svg"
            />
            <Image
              alt="Gemini"
              width={400}
              height={100}
              loading="lazy"
              src="/glogo.png"
            />
            <Image
              alt="Vercel"
              width={250}
              height={200}
              loading="lazy"
              src="/vlogo.svg"
            />
            <Image
              alt="ts"
              loading="lazy"
              width={150}
              height={100}
              src="/tslogo.svg"
            />
          </div>
        </div>
      </section>
      <footer className="bg-blue-50 w-full">
        <div className="p-6 bg-white mx-auto relative z-10 overflow-hidden border border-b-0 border-gray-200">
          <div className="flex flex-col items-center gap-4 text-center">
            <a href="/"></a>
            <p className="max-w-md text-sm text-gray-500">
              Made with ❤️ by{" "}
              <a
                href="http://mvp-subha.me/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-green-600 hover:underline"
              >
                Subhadeep
              </a>
            </p>
            <p className="text-sm leading-5 text-gray-400">
              © {new Date().getFullYear()} JSONAPI
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://x.com/mvp_Subha"
                target="_blank"
                rel="noreferrer noopener"
                className="group rounded-full border border-gray-200 p-2 transition-colors hover:bg-gray-100"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter h-4 w-4 text-gray-600 transition-colors group-hover:text-black"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="https://github.com/subhadeeproy3902"
                target="_blank"
                rel="noreferrer noopener"
                className="group rounded-full border border-gray-200 p-2 transition-colors hover:bg-gray-100"
              >
                <span className="sr-only">Github</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github h-4 w-4 text-gray-600 transition-colors group-hover:text-black"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/subhadeep3902/"
                target="_blank"
                rel="noreferrer noopener"
                className="group rounded-full border border-gray-200 p-2 transition-colors hover:bg-gray-100"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin h-4 w-4 text-gray-600 transition-colors group-hover:text-black"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, ArrowRight, MoveRight, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { oneDark, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import CodeEditor from "@uiw/react-textarea-code-editor";

const FetchCodeJavaScript = `await fetch("https://json.mvp-subha.me/api/json", {
  method: "POST",
  body: JSON.stringify({
    data: "This phones battery life lasts a whole day!",
    format: {
      batteryLifeHrs: { type: "number" },
    },
  }),
})`;

const FetchCodeCurl = `curl -X POST "https://json.mvp-subha.me/api/json" \
-H "Content-Type: application/json" \
-d '{
  "data": "This phones battery life lasts a whole day!",
  "format": {
    "batteryLifeHrs": { "type": "number" }
  }
}'
`;

export function JsonConverter() {
  const [input, setInput] = useState<string>(
    "This phones battery life lasts a whole day!"
  );
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState<string | undefined>(`{
  "batteryLifeHrs": { "type": "number" }
}`);
  const [output, setOutput] = useState("Your JSON output will appear here");
  const [error, setError] = useState("");

  const determineSchemaType = (schema: any): string => {
    if (!schema.hasOwnProperty("type")) {
      if (Array.isArray(schema)) {
        return "array";
      } else {
        return typeof schema;
      }
    }
    return schema.type;
  };

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    try {
      if (!jsonInput) {
        throw new Error("JSON format is required");
      }
      const parsedJson = JSON.parse(jsonInput);

      if (typeof parsedJson !== "object" || parsedJson === null) {
        throw new Error("Invalid JSON format");
      }

      // type check the input data
      Object.keys(parsedJson).forEach((key) => {
        if (!parsedJson[key].hasOwnProperty("type")) {
          throw new Error("Type is required for each key");
        }
      });

      const demoOutput: Record<string, number | string> = {};
      Object.keys(parsedJson).forEach((key) => {
        if (parsedJson[key].type === "number") {
          demoOutput[key] = 24; // Mock value
        } else {
          demoOutput[key] = input; // Use the input text for non-number types
        }
      });

      // Call the api now
      const response = await fetch("/api/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: input,
          format: parsedJson,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert data to JSON");
      }

      const data = await response.json();
      setLoading(false);
      setOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const [language, setLanguage] = useState("javascript");

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4 pb-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold pb-4">
          Convert{" "}
          <span className="bg-green-500 text-white px-3 py-2 rounded-lg">
            any data
          </span>{" "}
          to JSON
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
          Working with unstructured data is a nightmare. JSONapi helps you
          extract information from any source, like html, and convert it to
          JSON.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center justify-center">
            <CheckIcon className="text-green-500 mr-2" />
            <span>Web scraping</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckIcon className="text-green-500 mr-2" />
            <span>Data extraction</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckIcon className="text-green-500 mr-2" />
            <span>Email processing</span>
          </div>
        </div>
      </div>

      <Card className="text-white relative max-w-3xl w-full mx-auto border-none outline-none bg-transparent">
        <div className="absolute -top-8 -left-8 bg-yellow-300 text-black p-2 px-3 rounded-md transform -rotate-6 text-xs md:text-sm">
          <span className="font-bold">It&apos;s this Simple</span>
          <ArrowRight className="inline-block ml-2" />
        </div>
        <CardContent className="h-full w-full p-0">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{ borderRadius: "1rem" }}
          >
            {language === "javascript" ? FetchCodeJavaScript : FetchCodeCurl}
          </SyntaxHighlighter>
          <div className="absolute right-2 bottom-2 text-[12px] font-medium text-white rounded-sm bg-green-500 flex">
            {/* Two button switch between javascript and curl */}
            <button
              className={`w-full px-2 py-0.5 rounded-l-sm
                  ${
                    language === "javascript"
                      ? "bg-transparent"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }
                `}
              onClick={() => setLanguage("javascript")}
            >
              JavaScript
            </button>
            <button
              className={`w-full px-2.5 py-0.5 rounded-r-sm
                ${
                  language === "bash"
                    ? "bg-transparent"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }
              `}
              onClick={() => setLanguage("bash")}
            >
              cURL
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Input Text</h2>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-40 mb-4 resize-none"
            placeholder="Enter your data here..."
          />
        </div>
        <div className="flex md:flex-row flex-col w-full justify-between gap-4 items-center col-span-3">
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4">JSON Format</h2>
            <div className="relative rounded-lg">
              <CodeEditor
                value={jsonInput}
                language="json"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 16,
                  overflow: "auto",
                }}
                className="h-64 rounded-lg"
                onChange={(v) => setJsonInput(v.target.value)}
              />
              <span className="absolute right-1.5 top-1.5 text-[9px] text-white px-2 py-0.5 rounded-lg bg-yellow-500">
                JSON
              </span>
            </div>
          </div>
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Output</h2>
            <Card className="p-0 pt-0 h-64 overflow-auto resize-none">
              <SyntaxHighlighter
                language="json"
                style={vs}
                customStyle={{
                  height: "100%",
                  margin: 0,
                  borderRadius: "0.5rem",
                  whiteSpace: "pre-wrap",
                  fontSize: "1rem",
                }}
              >
                {output}
              </SyntaxHighlighter>
            </Card>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle
            className="
            text-red-800
            font-bold
            text-lg
            md:text-xl
          "
          >
            Error
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="w-full flex justify-center items-center">
        <Button
          onClick={handleConvert}
          className="bg-green-500 hover:bg-green-600 mx-auto"
        >
          Convert to JSON
          {loading ? (
            <Loader className="ml-2 animate-spin" />
          ) : (
            <MoveRight className="ml-2" />
          )}
        </Button>
      </div>

      <Card className="bg-green-100 p-4 md:p-6 rounded-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-4">API Route</h2>
        <pre className="bg-white rounded-md overflow-x-auto text-xs md:text-sm max-h-96 overflow-y-scroll">
          <SyntaxHighlighter
            language="json"
            style={oneDark}
            customStyle={{ margin: 0 }}
          >
            {`POST /api/json
Content-Type: application/json
                
{
  "data": "${input}",
  "format": ${jsonInput}
}`}
          </SyntaxHighlighter>
        </pre>
      </Card>
    </div>
  );
}

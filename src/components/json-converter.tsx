"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const FetchCode = `await fetch("http://json.mvp-subha.me/api/json", {
  method: "POST",
  body: JSON.stringify({
    data: "This phones battery life lasts a whole day!",
    format: {
      batteryLifeHrs: { type: "number" },
    },
  }),
})`;

export function JsonConverter() {
  const [input, setInput] = useState<string>(
    "This phones battery life lasts a whole day!"
  );
  const [jsonInput, setJsonInput] = useState(`{
  "batteryLifeHrs": { "type": "number" }
}`);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = async () => {
    setError("");
    try {
      const parsedJson = JSON.parse(jsonInput);

      if (typeof parsedJson !== "object" || parsedJson === null) {
        throw new Error("Invalid JSON format");
      }

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
      setOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4 pb-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold pb-4">
          Convert{" "}
          <span className="bg-blue-600 text-white px-3 py-2 rounded-lg">
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
            language="javascript"
            style={oneDark}
            customStyle={{ borderRadius: "1rem" }}
          >
            {FetchCode}
          </SyntaxHighlighter>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Input Text</h2>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-64 mb-4"
            placeholder="Enter your data here..."
          />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">JSON Format</h2>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="h-64 mb-4 font-mono"
            placeholder="Enter JSON format here..."
          />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Output</h2>
          <Card className="bg-gray-100 p-4 h-64 overflow-auto">
            <pre className="text-sm">{output}</pre>
          </Card>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleConvert} className="w-full">
        Convert to JSON
      </Button>

      <Card className="bg-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">API Route</h2>
        <pre className="bg-white p-2 md:p-4 rounded-md overflow-x-auto text-xs md:text-sm">
          <code>{`POST /api/json
Content-Type: application/json

{
  "data": "This phones battery life lasts a whole day!",
  "format": {
    "batteryLifeHrs": { "type": "number" }
  }
}`}</code>
        </pre>
      </Card>
    </div>
  );
}

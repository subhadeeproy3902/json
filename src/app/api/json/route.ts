import { NextRequest, NextResponse } from "next/server"
import { ZodTypeAny, z } from "zod"
import { EXAMPLE_ANSWER1, EXAMPLE_PROMPT1, EXAMPLE_ANSWER2, EXAMPLE_PROMPT2, EXAMPLE_PROMPT3, EXAMPLE_ANSWER3 } from "@/lib/example";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Helper function to track the schema path
const determineSchemaType = (schema: any, path: string): string => {
  if (!schema.hasOwnProperty("type")) {
    if (Array.isArray(schema)) {
      return "array";
    } else if (typeof schema === "object") {
      return "object";
    } else {
      throw new Error(`Schema is missing a 'type' key at path: ${path}`);
    }
  }
  return schema.type;
}

const jsonSchemaToZod = (schema: any, path = ''): ZodTypeAny => {
  const type = determineSchemaType(schema, path);

  switch (type) {
    case "string":
      return z.string().nullable();
    case "number":
      return z.number().nullable();
    case "boolean":
      return z.boolean().nullable();
    case "array":
      if (!schema.items) {
        throw new Error(`Array schema must have 'items' defined at path: ${path}`);
      }
      return z.array(jsonSchemaToZod(schema.items, `${path}.items`)).nullable();
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema) {
        if (key !== "type") {
          shape[key] = jsonSchemaToZod(schema[key], `${path}.${key}`);
        }
      }
      return z.object(shape);
    default:
      throw new Error(`Unsupported schema type at path: ${path}`);
  }
};

type PromiseExecutor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void

class RetryablePromise<T> extends Promise<T> {
  static async retry<T>(
    retries: number,
    executor: PromiseExecutor<T>
  ): Promise<T> {
    return new RetryablePromise<T>(executor).catch((error) => {
      if (retries > 0) {
        console.log(`Retrying... Attempts left: ${retries}`);
        return RetryablePromise.retry(retries - 1, executor);
      }
      return RetryablePromise.reject(error);
    });
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const genericSchema = z.object({
      data: z.string(),
      format: z.object({}).passthrough(),
    });

    const { data, format } = genericSchema.parse(body);

    console.log(format);

    // Convert format schema to Zod
    const dynamicSchema = jsonSchemaToZod(format);

    const content = `DATA: \n"${data}"\n\nExpected JSON format: ${JSON.stringify(
      format)}`;

    const validationResult = await RetryablePromise.retry<string>(
      5,
      async (resolve, reject) => {
        try {
          const SYSTEM = "You are the best text data to attached JSON format converter. You respond with valid JSON only. You will begin right with the opening curly brace and end with the closing curly brace. Do not include type specified in the format in the output for any of the items in the format. Only if you absolutely cannot determine a field, use the value null. No comma should be there after the last item in the JSON\n\n"

          const GenerateJSON = model.startChat({
            generationConfig,
            history: [
              {
                role: "user",
                parts: [
                  {
                    text: SYSTEM + EXAMPLE_PROMPT1,
                  },
                ],
              },
              {
                role: "model",
                parts: [
                  {
                    text: EXAMPLE_ANSWER1,
                  }
                ],
              },
              {
                role: "user",
                parts: [
                  {
                    text: SYSTEM + EXAMPLE_PROMPT2,
                  },
                ],
              },
              {
                role: "model",
                parts: [
                  {
                    text: EXAMPLE_ANSWER2,
                  }
                ],
              },
              {
                role: "user",
                parts: [
                  {
                    text: SYSTEM + EXAMPLE_PROMPT3,
                  },
                ],
              },
              {
                role: "model",
                parts: [
                  {
                    text: EXAMPLE_ANSWER3,
                  }
                ],
              },
            ],
          });

          const res = await GenerateJSON.sendMessage(SYSTEM + content);

          const text = await res.response.text();
          console.log(text);

          // Validate the JSON
          const parsedJson = JSON.parse(text);

          resolve(parsedJson);
        } catch (err) {
          reject(err);
        }
      }
    );

    return NextResponse.json(validationResult, { status: 200 });
  } catch (err: any) {
    // Catch the error thrown by jsonSchemaToZod and return it in the response
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

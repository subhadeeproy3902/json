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

const determineSchemaType = (schema: any): string => {
  if (!schema.hasOwnProperty("type")) {
    if (Array.isArray(schema)) {
      return "array"
    } else {
      return typeof schema
    }
  }
  return schema.type
}

const jsonSchemaToZod = (schema: any, path: string = ''): ZodTypeAny => {
  const type = determineSchemaType(schema);

  switch (type) {
    case "string":
      // Ensure no additional keys
      if (Object.keys(schema).length > 1) {
        throw new Error(`Extra keys not allowed for type 'string' at path '${path}'`);
      }
      return z.string().nullable();
    case "number":
      // Ensure no additional keys
      if (Object.keys(schema).length > 1) {
        throw new Error(`Extra keys not allowed for type 'number' at path '${path}'`);
      }
      return z.number().nullable();
    case "boolean":
      // Ensure no additional keys
      if (Object.keys(schema).length > 1) {
        throw new Error(`Extra keys not allowed for type 'boolean' at path '${path}'`);
      }
      return z.boolean().nullable();
    case "array":
      if (!schema.items.hasOwnProperty("type")) {
        throw new Error(`Missing type specification for array items at path '${path}'`);
      }
      return z.array(jsonSchemaToZod(schema.items, `${path}[]`)).nullable(); // Add array notation for path
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema) {
        if (key === "type") continue;

        const currentPath = path ? `${path}.${key}` : key; // Update the current path

        if (typeof schema[key] === "object") {
          if (!schema[key].hasOwnProperty("type")) {
            throw new Error(`Missing type specification for ${key} at path '${currentPath}'`);
          }

          // Check for primitive types that should not have additional keys
          const itemType = schema[key].type;
          if (["number", "string", "boolean"].includes(itemType)) {
            if (Object.keys(schema[key]).length > 1) {
              throw new Error(`Extra keys not allowed for type '${itemType}' at path '${currentPath}'`);
            }
            shape[key] = jsonSchemaToZod({ type: itemType }, currentPath);
          } else {
            shape[key] = jsonSchemaToZod(schema[key], currentPath);
          }
        } else {
          // If the schema is not an object, it should have a type
          throw new Error(`Missing type specification for ${key} at path '${currentPath}'`);
        }
      }
      return z.object(shape);
    default:
      throw new Error(`Unsupported schema type: ${type} at path '${path}'`);
  }
}

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

    // Convert the JSON schema to Zod schema
    const dynamicSchema = jsonSchemaToZod(format);

    const content = `DATA: \n"${data}"\n\nExpected JSON format: ${JSON.stringify(
      format
    )}`;

    const validationResult = await RetryablePromise.retry<string>(
      5,
      async (resolve, reject) => {
        try {
          const SYSTEM = "You are the best text data to attached JSON format converter. You respond with valid JSON only. You will begin right with the opening curly brace and end with the closing curly brace. Do not include type specified in the format in the output for any of the items in the format. Only if you absolutely cannot determine a field, use the value null. No comma should be there after the last item in the JSON\n\n";

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
    // Catch errors thrown by jsonSchemaToZod
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
};

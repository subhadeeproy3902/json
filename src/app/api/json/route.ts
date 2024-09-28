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

const jsonSchemaToZod = (schema: any): ZodTypeAny => {
  const type = determineSchemaType(schema);

  switch (type) {
    case "string":
      return z.string().nullable();
    case "number":
      return z.number().nullable();
    case "boolean":
      return z.boolean().nullable();
    case "array":
      if (!schema.items.hasOwnProperty("type")) {
        throw new Error(`Missing type specification for array items`);
      }
      return z.array(jsonSchemaToZod(schema.items)).nullable();
    case "object":
      const shape: Record<string, ZodTypeAny> = {};
      for (const key in schema) {
        if (key === "type") continue;

        if (typeof schema[key] === "object" && !schema[key].hasOwnProperty("type")) {
          throw new Error(`Missing type specification for ${key}`);
        }

        if (schema[key].hasOwnProperty("type")) {
          // If the type is specified, we can use it to build the Zod schema
          const itemType = schema[key].type;
          if (itemType !== "object" && itemType !== "array") {
            shape[key] = jsonSchemaToZod({ type: itemType });
          } else {
            shape[key] = jsonSchemaToZod(schema[key]);
          }
        } else {
          // If no type is specified for an object, throw an error
          throw new Error(`Missing type specification for ${key}`);
        }
      }
      return z.object(shape);
    default:
      throw new Error(`Unsupported schema type: ${type}`);
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

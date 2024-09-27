//meta/llama-3.1-8b-instruct

import { NextRequest, NextResponse } from "next/server"
import { ZodTypeAny, z } from "zod"
import { EXAMPLE_ANSWER1, EXAMPLE_PROMPT1, EXAMPLE_ANSWER2, EXAMPLE_PROMPT2 } from "@/lib/example";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
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
  const type = determineSchemaType(schema)

  switch (type) {
    case "string":
      return z.string().nullable()
    case "number":
      return z.number().nullable()
    case "boolean":
      return z.boolean().nullable()
    case "array":
      return z.array(jsonSchemaToZod(schema.items)).nullable()
    case "object":
      const shape: Record<string, ZodTypeAny> = {}
      for (const key in schema) {
        if (key !== "type") {
          shape[key] = jsonSchemaToZod(schema[key])
        }
      }
      return z.object(shape)
    default:
      throw new Error(`Unsupported schema type: ${type}`)
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
      return retries > 0
        ? RetryablePromise.retry(retries - 1, executor)
        : RetryablePromise.reject(error)
    })
  }
}

export const POST = async (req: NextRequest) => {
  const body = await req.json()

  const genericSchema = z.object({
    data: z.string(),
    format: z.object({}).passthrough(),
  })

  const { data, format } = genericSchema.parse(body)

  const dynamicSchema = jsonSchemaToZod(format)

  const content = `DATA: \n"${data}"\n\nExpected JSON format: ${JSON.stringify(
    format)}\n\nValid JSON output in expected format:`

  const validationResult = await RetryablePromise.retry<string>(
    3,
    async (resolve, reject) => {
      try {

        const SYSTEM = "You are an AI that converts text data into the attached JSON format 100% of the time or returns NULL in JSON. You respond with nothing but valid JSON based on the input data or format specified is NULL. Your output should DIRECTLY be valid JSON, nothing added before or after. You will begin right with the opening curly brace and end with the closing curly brace. Only if you absolutely cannot determine a field, use the value null. No comma should be there after the last item in the JSON\n\n"

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
                  text: EXAMPLE_PROMPT2,
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
          ],
        });

        const res = await GenerateJSON.sendMessage(
          SYSTEM + content
        )

        const text = res.response.text()
        console.log(text)

        const validationResult = dynamicSchema.parse(JSON.parse(text || ""))

        return resolve(validationResult)
      } catch (err) {
        reject(err)
      }
    }
  )

  return NextResponse.json(validationResult, { status: 200 })
}
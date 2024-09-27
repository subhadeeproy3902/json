//meta/llama-3.1-8b-instruct

import { NextRequest, NextResponse } from "next/server"
import { ZodTypeAny, z } from "zod"
import OpenAI from 'openai';
import { EXAMPLE_ANSWER1, EXAMPLE_PROMPT1, EXAMPLE_ANSWER2, EXAMPLE_PROMPT2 } from "@/lib/example";

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY!,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

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
        const res = await openai.chat.completions.create({
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            {
              role: "assistant",
              content:
                "You are an AI that converts text data into the attached JSON format 100% of the time or returns NULL in JSON. You respond with nothing but valid JSON based on the input data or format specified is NULL. Your output should DIRECTLY be valid JSON, nothing added before or after. You will begin right with the opening curly brace and end with the closing curly brace. Only if you absolutely cannot determine a field, use the value null. No comma should be there after the last item in the JSON",
            },
            {
              role: "user",
              content: EXAMPLE_PROMPT1,
            },
            {
              role: "system",
              content: EXAMPLE_ANSWER1,
            },
            {
              role: "user",
              content: EXAMPLE_PROMPT2,
            },
            {
              role: "system",
              content: EXAMPLE_ANSWER2,
            },
            {
              role: "user",
              content,
            },
          ],
        })

        const text = res.choices[0].message.content

        console.log("Response from LLAMA:", text)

        const validationResult = dynamicSchema.parse(JSON.parse(text || ""))

        return resolve(validationResult)
      } catch (err) {
        reject(err)
      }
    }
  )

  return NextResponse.json(validationResult, { status: 200 })
}
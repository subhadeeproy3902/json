export const EXAMPLE_PROMPT1 = `DATA: \n"John is 25 years old and studies computer science at university"\n\nExpected JSON format: 
{
  name: { type: "string" },
  age: { type: "number" },
  isStudent: { type: "boolean" },
  courses: {
    type: "array",
    items: { type: "string" },
  }
}
\n\nValid JSON output in expected format:`

export const EXAMPLE_ANSWER1 = `{
name: "John",
age: 25,
isStudent: true,
courses: ["computer science"]
}`

export const EXAMPLE_PROMPT2 = `DATA: \n"Hello I am Subhadeep Roy"\n\nExpected JSON format: 
{
  age: { type: "string" }
}
\n\nValid JSON output in expected format:`

export const EXAMPLE_ANSWER2 = `{
age: null
}`

export const EXAMPLE_PROMPT3 = `DATA:
There are two 40 kilowatt bulbs and 3 fans

Expected JSON format:
{
  bulbs: { type: "object" },
  fans: { type: "number" }
}
`

export const EXAMPLE_ANSWER3 = `{
  bulbs: null,
  fans: 3
}
`
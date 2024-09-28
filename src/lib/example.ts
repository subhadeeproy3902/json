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
The 'EchoSound' headphones were launched in October 2021, featuring active noise cancellation, 30 hours of battery life, and Bluetooth 5.0 connectivity. They are priced at $199.

Expected JSON format:
{
"productName": { "type": "string" },
"launchDate": { "type": "string" },
"features": {
"type": "array",
"items": { "type": "string" }
},
"batteryLife": {
"type": "object",
"properties": {
"duration": { "type": "number" },
"unit": { "type": "string" }
}
},
"connectivity": { "type": "string" },
"price": {
"type": "object",
"properties": {
"amount": { "type": "number" },
"currency": { "type": "string" }
}
}
}`

export const EXAMPLE_ANSWER3 = `{
"productName": "EchoSound",
"launchDate": "October 2021",
"features": [
"active noise cancellation",
"30 hours of battery life",
"Bluetooth 5.0 connectivity"
],
"batteryLife": {
"duration": 30,
"unit": "hours"
},
"connectivity": "Bluetooth 5.0",
"price": {
"amount": 199,
"currency": "$"
}
}`
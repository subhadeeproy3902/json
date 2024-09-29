![Image](https://i.postimg.cc/R0dZHqmj/914-1x-shots-so.png)

# Any Data to JSON Converter API

This API converts any input data into JSON format based on the format you specify. You can define the desired structure and data types for the output JSON by sending a POST request to the API.

## API Endpoint

**Base URL:**  
`https://json.mvp-subha.me/api/json`

## HTTP Method

`POST`

## Request Headers

- `Content-Type: application/json`

## Request Body Format

The request body should be in JSON format with the following structure:

```json
{
  "data": "<input data to convert>",
  "format": {
    "<key>": { "type": "<data type>" }
  }
}
```

## Parameters:

- `data` (string): The raw input data you want to convert.

- `format` (object): Defines the structure and types of the expected JSON output. The keys represent the desired JSON fields, and the `type` specifies the data type (e.g., `number`, `string`, `boolean`, etc.).

## Example Request Body

JavaScript (using fetch):

```javascript
await fetch("https://json.mvp-subha.me/api/json", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    data: "This phones battery life lasts a whole day!",
    format: {
      batteryLifeHrs: { type: "number" }
    },
  }),
})
```

cURL:

```bash
curl -X POST "https://json.mvp-subha.me/api/json" -H "Content-Type: application/json" -d '{
  "data": "This phones battery life lasts a whole day!",
  "format": {
    "batteryLifeHrs": { "type": "number" }
  }
}'
```

## Explanation:

In this example, the raw input data (`"This phones battery life lasts a whole day!"`) is converted to JSON format, where the field `batteryLifeHrs` is expected to be a number.

## Response

The API will return a JSON response in the format specified in the request.

## Example Response:

```json
{
  "batteryLifeHrs": 24
}
```

Here, the API extracted the value of the battery life from the text data and formatted it as a number.

## Error Handling

In case of an error (e.g., invalid input format or type mismatch), the API will return an error message in JSON format:

```json
{
  "error": "Invalid format or type"
}
```

## License
This project is licensed under the [MIT License](https://github.com/subhadeeproy3902/json/blob/main/LICENSE).

## Contributing

We welcome contributions to enhance and improve the Any Data to JSON Converter API! To contribute, please follow these steps:

### How to Contribute:

1. **Fork the repository** to your own GitHub account.
2. **Clone** the forked repository to your local machine:
    ```bash
    git clone https://github.com/subhadeeproy3902/json.git
    ```
3. **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b <your-name>-new-feature
    ```
4. **Make your changes** and commit them:
    ```bash
    git add .
    git commit -m "Add a feature or fix description"
    ```
5. **Push your changes** to your forked repository:
    ```bash
    git push origin <your-name>-new-feature
    ```
6. **Submit a Pull Request** to the main repository. Be sure to provide a clear description of the changes and link any relevant issues.

### Guidelines:

- Ensure your code follows the existing style of the project.
- Write clear and concise commit messages.
- Make sure to add/update relevant tests for any new features or changes.
- Keep your Pull Requests small and focused to make them easier to review.
- Document any new functionality in the `README.md` if applicable.

We appreciate all contributions and will review your Pull Request as soon as possible.

### Reporting Issues:

If you encounter any bugs or issues, please feel free to open an issue [here](https://github.com/subhadeeproy3902/json/issues). Provide detailed steps to reproduce the problem and any relevant information.

--- 

## Author

**Subhadeep Roy**  
GitHub: [subhadeeproy3902](https://github.com/subhadeeproy3902)  
Linkedin: [@subhadeep3902](https://www.linkedin.com/in/subhadeep3902/)

If you found this project helpful or interesting, please consider giving a star! ⭐
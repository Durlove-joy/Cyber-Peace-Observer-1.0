# Web App with MongoDB

This project is a web application that integrates MongoDB to store and retrieve reported issues. It is built using Node.js, Express, and TypeScript.

## Project Structure

```
web-app-with-mongodb
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers             # Contains controllers for handling requests
│   │   └── issueController.ts  # Controller for issue-related operations
│   ├── models                  # Contains Mongoose models
│   │   └── issueModel.ts       # Model for the Issue schema
│   ├── routes                  # Contains route definitions
│   │   └── issueRoutes.ts      # Routes for issue-related endpoints
│   ├── services                # Contains services for database interactions
│   │   └── dbService.ts        # Service for MongoDB operations
│   └── types                   # Contains TypeScript type definitions
│       └── index.ts            # Type definitions for the application
├── package.json                # NPM configuration file
├── tsconfig.json               # TypeScript configuration file
├── .env                        # Environment variables
└── README.md                   # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd web-app-with-mongodb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage

- The application provides endpoints to create and retrieve reported issues.
- Use tools like Postman or cURL to interact with the API.

## License

This project is licensed under the MIT License.
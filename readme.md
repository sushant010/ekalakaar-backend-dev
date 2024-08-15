# eKalakaar APIs Documentation

Welcome to the documentation for eKalakaar's REST APIs. This document provides details on various API endpoints and their functionalities.

## Getting Started

To set up and run the application, follow these steps:

1. Install Dependencies: Run `npm run install-deps` to install required dependencies.

2. Development Mode: Run `npm run dev` to start the application in development mode.

3. Production Mode: Run `npm start` to start the application in production mode.

To setup and run only the backend/apis part (for android developers) -

1. Install Dependencies: Run `npm i` to install required dependencies.

2. Start: Run `npm run server:prod` to stsrt the server or apis.

3. Visit Documentation: Once the server is started, visit the `http://localhost:4000/api-docs` from your browser.

## Import Postman Collection and Environment (recommended)

Follow these steps to import your collection and environment into Postman:

1. **Open Postman:** Launch the Postman application on your system.

2. **Access Collections:** Click on the "Collections" tab in the left-hand sidebar.

3. **Import Collection:**

   - Click on the "Import" button, usually located in the top-left corner of the Collections tab.
   - Select the collection file (`*.postman_collection.json`) from the `postman` directory.
   - Click the "Import" button.

4. **Access Environments:** Click on the "Environments" tab in the left-hand sidebar.

5. **Import Environment:**

   - Click on the "Import" button, usually located in the top-left corner of the Environments tab.
   - Select the environment file (`*.postman_environment.json`) from the `postman` directory.
   - Click the "Import" button.

## Access Swagger Documentation

For a detailed view of the API documentation, visit the Swagger documentation page:

- Swagger URL: `/api-docs`

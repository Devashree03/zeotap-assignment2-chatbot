# CDP Support Chatbot

CDP Support Chatbot is an interactive support agent designed to answer "how-to" questions related to four Customer Data Platforms (CDPs): **Segment**, **mParticle**, **Lytics**, and **Zeotap**. It leverages Natural Language Processing (NLP) with [node-nlp](https://www.npmjs.com/package/node-nlp) to classify user queries and dynamically extracts relevant information from official documentation pages using [axios](https://www.npmjs.com/package/axios) and [cheerio](https://www.npmjs.com/package/cheerio).

The frontend is built with React and Material-UI (MUI), featuring a modern chat interface with a loader displayed while responses are being fetched.

## Features

- **NLP Integration:**  
  Classifies user queries into predefined intents (e.g., setting up a new source in Segment, creating a user profile in mParticle).

- **Dynamic Documentation Extraction:**  
  Fetches and parses live content from official documentation pages to provide contextual guidance.

- **Professional UI:**  
  A clean, responsive chat interface built with React and Material-UI, featuring a centered layout and a loading spinner during response fetches.

- **Cross-CDP Comparisons:**  
  Handles questions that compare functionalities between different CDPs.

## Project Structure

```
cdp-chatbot/
├── server/
│   ├── package.json
│   └── server.js         // Express server with NLP and dynamic documentation extraction
└── client/
    ├── package.json
    └── src/
        ├── App.js        // React component with Material-UI integration
        ├── App.css       // Custom styles for the chat interface
        └── index.js      // React app entry point
```

## Installation

### Prerequisites

- Node.js (v12+ recommended)
- npm or yarn

### Backend Setup

1. **Navigate to the server directory:**

   ```bash
   cd cdp-chatbot/server
   ```

2. **Install dependencies:**

   ```bash
   npm install express cors body-parser node-nlp axios cheerio
   ```

3. **Start the backend server:**

   ```bash
   node server.js
   ```

   The server runs at [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. **Navigate to the client directory:**

   ```bash
   cd cdp-chatbot/client
   ```

2. **Create a React app (if not already created):**

   ```bash
   npx create-react-app .
   ```

3. **Install Material-UI dependencies:**

   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/styles
   ```

4. **Replace the default files:**
   
   - Update `src/App.js` with the provided React component code.
   - Update `src/App.css` with the provided styling.
   - Ensure `src/index.js` renders the App component as shown.

5. **Start the React development server:**

   ```bash
   npm start
   ```

   The app runs at [http://localhost:3000](http://localhost:3000).

## Usage

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Type a how‑to question related to one of the CDPs (e.g., "How do I set up a new source in Segment?").
3. The chatbot will process your query using NLP and attempt to extract additional context from the official documentation.
4. A loading spinner is displayed while the response is being fetched.
5. The final answer is displayed in the chat interface.

## Technologies Used

- **Backend:**
  - Node.js
  - Express
  - node-nlp
  - axios
  - cheerio

- **Frontend:**
  - React
  - Material-UI (MUI)
  - Create React App

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your improvements or bug fixes.

## Disclaimer

Before using automated content extraction, please review and comply with the official documentation websites' terms of service.

# AI Chat (React + TypeScript + Google Gemini)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains a web-based AI chatbot built using React, TypeScript, and the Google Gemini LLM (Language Model). It provides a user-friendly interface for interacting with the AI model and generating conversational responses.

## Features

- **Conversational AI:** Engage in interactive conversations with an AI powered by the Google Gemini LLM.
- **Customizable Prompt:** The initial prompt used to instruct the LLM can be configured, tailoring the chatbot's personality and behavior.
- **Persistent Chat History:** The chat history is maintained throughout the session, allowing for context-aware responses.
- **Automated title creation for each conversation:** A 5-word summary of the conversation is used as the conversation's title
- **TypeScript:** Codebase written in TypeScript for improved maintainability and type safety.
- **Google Gemini Integration:** Utilizes the Google Gemini API for generating text and engaging in conversations.
- **Easy Setup:** Simple installation and setup process using npm or yarn and environment variables.

## Prerequisites

- **Node.js (version 16 or higher)**
- **npm or yarn package manager**
- **Google Gemini API Key:** You'll need a Google Gemini API key to use the chatbot. [https://ai.google.dev/](https://ai.google.dev/) is a good place to start.

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/angeloilardi/AI-chat.git
    cd AI-chat
    ```

2.  Install the dependencies:

    ```bash
    npm install  # or yarn install
    ```

## Configuration

1.  **Set up your Google Gemini API key:** You need to set your Google Gemini API key as an environment variable. This is typically done using an `.env` file at the root of the project or directly in your system's environment variables. Use the variable name `REACT_APP_GEMINI_API_KEY`.

    - **Using `.env` file (recommended):**

      Create a file named `.env.local` in the root directory of the project and add your API key:

      ```
      REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
      ```

      **Important Considerations for React:**

      - Prefix your environment variable with `REACT_APP_` to make it accessible in your React components. React uses special handling for environment variables.
      - `.env.local` is typically the preferred name for local development environment variables in React projects.
      - Ensure that `.env.local` is added to your `.gitignore` to prevent accidentally committing your API key.

## Running the Application

1.  Start the development server:

    ```bash
    npm start  # or yarn start
    ```

2.  Open your web browser and navigate to the address provided by the development server (usually `http://localhost:3000`).

3.  Start chatting with your AI assistant!

## Customization

- **Styling and UI:** Customize the look and feel of the chatbot by modifying the React components and CSS/styling files.

- **Adding Features:** Extend the chatbot's functionality by adding new components, implementing features like image generation, or integrating with other services.

- **Exploring Gemini API Options:** Experiment with different parameters and features available in the Google Gemini API to fine-tune the chatbot's behavior and capabilities. Consult the official Gemini API documentation for details.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) - For providing a utility-first CSS framework.
- [Google Gemini API](https://ai.google.dev/) - For powering the conversational AI capabilities.

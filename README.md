# ai-rate-my-professor

![Professor Image](./client/static/images/templates/templates-images/professor.png)

An AI-powered system for professor ratings and recommendations. This project is built to assist users in evaluating professors using data stored in Pinecone. Features include:

- Sentiment analysis of professor reviews
- Trend analysis over time
- User testimonials
- Integration with social media platforms

## Table of Contents

- [ai-rate-my-professor](#ai-rate-my-professor)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Features](#features)
  - [Usage](#usage)
    - [Sentiment Analysis](#sentiment-analysis)
    - [Adding Professor Data](#adding-professor-data)
  - [API Endpoints](#api-endpoints)
    - [Query Sentiment Trends](#query-sentiment-trends)
    - [Add Professor Data](#add-professor-data)
  - [Environment Variables](#environment-variables)
  - [Authors](#authors)
  - [Troubleshooting](#troubleshooting)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
  - [License](#license)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/addymwenda12/ai-rate-my-professor.git
    ```
2. Navigate to the project directory:
    ```sh
    cd ai-rate-my-professor
    ```
3. Install dependencies for both client and server:
    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```

### Running the Application

1. Start the server:
   ```sh
    npm start
    ```
2. Start the client:
    ```sh
    cd ../client
    npm run dev
    ```

## Project Structure

```text
ai-rate-my-professor/
├── client/
│   ├── .env
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── app/
│   │   ├── api/
│   │   ├── chat/
│   │   ├── components/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── profile/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── getLPTheme.js
│   ├── jsconfig.json
│   ├── middleware.js
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public/
│   ├── README.md
│   ├── static/
│   │   └── images/
│   └── tailwind.config.js
├── README.md
└── server/
    ├── .env
    ├── .gitignore
    ├── api/
    │   └── geminiApi.js
    ├── config/
    │   ├── googleCloud.js
    │   └── pinecone.js
    ├── db/
    │   └── professorDataStore.js
    ├── index.js
    ├── package.json
    ├── routes/
    │   └── chat.js
    └── service/
```

## Features

- **Sentiment Analysis**: Analyze the sentiment of professor reviews using Pinecone.
- **Trend Analysis**: Track sentiment trends over time.
- **User Testimonials**: Display user testimonials on the client side.
- **Social Media Integration**: Links to social media profiles in the footer.

## Usage

### Sentiment Analysis

The sentiment analysis is performed using `querySentimentTrends` function in `server/service/pineconeService.js`

### Adding Professor Data

To add professor data to Pinecone, use the `addProfessorToPinecone` function in `server/service/pineconeService.js`

## API Endpoints

### Query Sentiment Trends

- **Endpoint**: `/api/querySentimentTrends`
- **Method**: `POST`
- **Description**: Query sentiment trends for a professor.
- **Request Body**:
    ```json
    {
      "professorName": "John Doe"
    }
    ```

### Add Professor Data

- **Endpoint**: `/api/addProfessor`
- **Method**: `POST`
- **Description**: Add professor data to Pinecone.
- **Request Body**:
    ```json
    {
      "name": "John Doe",
      "department": "Computer Science",
      "rating": 4.5,
      "review": "Great professor!"
    }
    ```

## Environment Variables

The following environment variables need to be set in the `.env` files:

- `PINECONE_API_KEY`: Your Pinecone API key.
- `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID.

## Authors

- **Addy Mutuiri** - *Backend Development* - [YourGitHubUsername](https://github.com/addymwenda12)
- **Tracy Karanja** - *Frontend Development* - [ContributorGitHubUsername](https://github.com/TracyK10)

## Troubleshooting

If you encounter any issues while setting up or running the project, please check the following:

1. Ensure all dependencies are installed correctly
2. Verify that your environment variables are set properly
3. Check the console for any error messages

If problems persist, please open an issue in the GitHub repository.

## Roadmap

- [ ] Implement user authentication
- [ ] Add more advanced sentiment analysis features
- [ ] Develop a mobile app version
- [ ] Integrate with more data sources

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
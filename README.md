# FastAPI Chat App

This project is a real-time chat application built with **FastAPI**, **MongoDB**, and **WebSockets**. It includes a backend API, a frontend interface, and WebSocket support for real-time messaging.

---

## Features

- User registration and login with hashed passwords.
- Real-time messaging using WebSockets.
- MongoDB integration for storing users, chats, and messages.
- Dockerized setup for easy deployment.
- Frontend built with HTML, CSS, and JavaScript.

---

## Prerequisites

Before running the application, ensure you have the following installed:

- **Docker** and **Docker Compose**
- (Optional) **Python 3.9+** if running locally without Docker
- A **MongoDB database** (local or cloud-based, e.g., MongoDB Atlas)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/fastapi-chat-app.git
cd fastapi-chat-app
```

### 2. Configure the Environment Variables

Create a `.env` file in the root directory with the following content:

```properties
MONGO_URI="your-mongodb-connection-string"
SECRET_KEY="your-secret-key" # Replace with a secure key for JWT
```

- Replace `your-mongodb-connection-string` with your MongoDB URI. For example:
  ```
  mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `your-secret-key` with a secure key for JWT token generation.

---

### 3. Run with Docker

#### Build and Start the Containers

Run the following commands to build and start the application using Docker:

```bash
docker-compose up --build
```

This will:

- Build the backend FastAPI service.
- Build the frontend service using Nginx.
- Start both services and expose them on the following ports:
  - Backend: `http://localhost:8765`
  - Frontend: `http://localhost:8080`

#### Stop the Containers

To stop the containers, run:

```bash
docker-compose down
```

---

### 4. Run Locally (Without Docker)

If you prefer to run the application locally without Docker, follow these steps:

#### Backend

1. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Start the FastAPI server:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8765
   ```

   The backend will be available at `http://localhost:8765`.

#### Frontend

1. Serve the frontend files using any static file server. For example, with Python:

   ```bash
   python -m http.server 8080 --directory frontend
   ```

   The frontend will be available at `http://localhost:8080`.

---

## MongoDB Setup

To use your own MongoDB database:

1. Create a new database in your MongoDB instance (e.g., `chat_db`).
2. Ensure the following collections are created automatically when the app runs:
   - `users`: Stores user credentials.
   - `chats`: Stores chat metadata (e.g., members).
   - `messages`: Stores chat messages.

If you're using **MongoDB Atlas**, follow these steps:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Create a database user with a username and password.
3. Obtain the connection string from the Atlas dashboard.
4. Replace the `MONGO_URI` in your `.env` file with the connection string.

---

## API Endpoints

### Authentication

- **POST** `/auth/signup`: Register a new user.
- **POST** `/auth/login`: Log in and receive a JWT token.
- **GET** `/auth/users`: List all registered users.

### Chat

- **POST** `/chat/create`: Create a new chat.
- **GET** `/chat/my_chats/{username}`: Get all chats for a user.
- **GET** `/chat/history/{chat_id}`: Get the message history of a chat.
- **POST** `/chat/send`: Send a message to a chat.

### WebSocket

- **WebSocket** `/ws/chat/{chat_id}`: Connect to a chat for real-time messaging.

---

## Frontend Usage

1. Open the frontend in your browser at `http://localhost:8080`.
2. Register a new user or log in with an existing account.
3. Create a new chat by selecting a user from the dropdown.
4. Start sending messages in real-time!

---

## Troubleshooting

### 1. Environment Variables Not Loaded

Ensure the `.env` file is correctly configured and located in the root directory. If using Docker, verify the `env_file` directive in `docker-compose.yml`.

### 2. MongoDB Connection Issues

- Verify your `MONGO_URI` is correct.
- Ensure your MongoDB instance is running and accessible.
- If using MongoDB Atlas, ensure your IP is whitelisted in the Atlas dashboard.

### 3. WebSocket Not Connecting

- Ensure the backend is running on `http://localhost:8765`.
- Check the browser console for WebSocket errors.

---

## Project Structure

```
fastapi-chat-app/
├── app/
│   ├── auth.py          # Authentication logic
│   ├── chat.py          # Chat-related endpoints
│   ├── database.py      # MongoDB connection
│   ├── main.py          # FastAPI app entry point
│   ├── schemas.py       # Pydantic models
│   ├── websockets.py    # WebSocket logic
├── frontend/
│   ├── index.html       # Frontend HTML
│   ├── style.css        # Frontend CSS
│   ├── main.js          # Frontend JavaScript
│   ├── Dockerfile       # Dockerfile for frontend
├── .env                 # Environment variables
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Dockerfile for backend
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
```

---

## License

This project is licensed under the MIT License.
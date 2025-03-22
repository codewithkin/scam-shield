# ScamShield - Technical Documentation

## Overview
ScamShield is an AI-powered scam detection tool that helps users identify potential scam messages. Built with Next.js 15, it leverages OpenAI's API to analyze text and provide scam likelihood scores. The frontend is hosted on **Vercel**, while the backend database runs on **Neon**.

## Tech Stack
- **Frontend**: Next.js 15 (App Router, Server Actions, React Server Components)
- **Backend**: Next.js API routes, Neon (PostgreSQL)
- **Authentication**: Google OAuth via BetterAuth
- **State Management**: React Query
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Networking**: Axios
- **Virtualization**: react-virtual for efficient message rendering

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon)
- Vercel account
- OpenAI API key
- Google OAuth credentials

### Clone the Repository
```bash
git clone https://github.com/your-repo/scamshield.git
cd scamshield
```

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory and configure the following:
```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
DATABASE_URL=your-neon_database_url
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_URL=https://your-vercel-app-url.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Running the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## Authentication
ScamShield uses **Google OAuth** as the sole authentication method, managed via **BetterAuth**.

### Sign-in Flow
1. User clicks "Sign in with Google."
2. They are redirected to Google's OAuth consent screen.
3. Upon successful authentication, BetterAuth creates a session and stores the user profile in the database.
4. The session token is used to authenticate requests.

---

## API Endpoints

### **Scam Detection**
#### `POST /api/scam`
- **Description**: Analyzes a given message and returns scam likelihood.
- **Request Body**:
  ```json
  {
    "message": "You won a million dollars! Click here to claim."
  }
  ```
- **Response**:
  ```json
  {
    "scamScore": 85,
    "scam_words": ["won", "million dollars", "claim"],
    "reason": "The message contains common scam phrases."
  }
  ```

### **Authentication**
#### `GET /api/auth/session`
- **Description**: Retrieves the authenticated user's session details.
- **Response**:
  ```json
  {
    "user": {
      "name": "John Doe",
      "email": "johndoe@gmail.com",
      "image": "https://avatar.url"
    }
  }
  ```

### **User Logout**
#### `POST /api/auth/signout`
- **Description**: Logs out the current user and clears the session.

---

## Security Measures
- **CORS Handling**: Configured in `next.config.ts` to allow requests from Vercel frontend.
- **Rate Limiting**: Prevents abuse of the scam detection API.
- **Session Management**: BetterAuth handles user session security.
- **Input Sanitization**: Ensures safe processing of user input.

---

## Deployment
ScamShield is deployed on **Vercel** with the backend running on **Neon PostgreSQL**.

### Deploying to Vercel
1. Push your code to GitHub.
2. Link the repository to Vercel.
3. Configure environment variables in Vercel.
4. Deploy 🚀

---

## Contribution
Want to improve ScamShield? Feel free to fork the repo and submit a pull request!

---

## License
MIT License © 2025 ScamShield Team


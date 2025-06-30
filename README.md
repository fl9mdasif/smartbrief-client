## SmartBrief AI - Frontend Client

This is the frontend client for SmartBrief AI, built with React. It provides a clean, modern, and role-aware user interface for interacting with the AI summarization service.

## Frontend [Client LIVE WEBSITE](https://master.d3mia3lbsm9fsq.amplifyapp.com/)

### Features

- `User Authentication:` Clean and secure login and registration forms.

- `State Management:` Centralized state management using Redux Toolkit and RTK Query for efficient data fetching and caching.

- `Role-Aware UI:` The user interface dynamically adapts based on the logged-in user's role. Buttons, links, and data displays change to match the user's permissions.

- `Interactive Dashboard:` A two-column layout featuring a history sidebar and a main content area for a seamless user experience.

- `AI Summarization Form:` Users can submit text to be summarized and receive the result in real-time.

- `Re-prompting:` Users with permission can edit their original prompts to regenerate and refine summaries.

- `Admin Panel:` A dedicated "User Management" page, accessible only to admins, for viewing all users and managing their roles and credit balances.

## Tech Stack

- Framework: React

- State Management: Redux Toolkit with RTK Query

- Routing: React Router DOM

- Styling: Tailwind CSS

- Form Handling: React Hook Form

- HTTP Client: Axios

- Deployment: `AWS Amplify`

### Environment Variables

To run this project, you will need to create a .env file in the root of the client directory. This file should contain the base URL of your backend server.

## The URL of your deployed or local backend server

- BaseApi Url use in`src>redux/api/baseApi.js`
  Use

```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### or use my live ServerApi

```
REACT_APP_API_URL=https://smart-breaf.vercel.app

```

### Setup and Installation

1. Clone the repository:

```
git clone [your-repo-url]
cd smartbrief-client
```

2. Install dependencies:

```
npm install
```

3. Set up your .env file as described above.

4. Start the development server:

```
npm run dev
```

## The app will open on http://localhost:5173 (or another available port).

## Sample Login Credentials

You can use the following credentials to test the different user roles.

Password for all roles: `123456`

1. Regular User:(create and view summary)

Username: user

2. Admin User (Full Access):

Username: admin

3. Editor User (Can edit/delete any summary):

Username: editor

Note: Make sure to create these users in your database with the specified roles for the credentials to work.

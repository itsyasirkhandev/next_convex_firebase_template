# Nextjs Convex Firebase Template — Starter Template

Convention-heavy starter template with Next.js, Convex, Firebase Auth, Effect-TS, and Zustand.

## Tech Stack

| Technology | Purpose | Description |
| :--- | :--- | :--- |
| **Next.js** | Frontend Framework | React-based framework for page routing and server-side rendering. |
| **Convex** | Backend Database & Server | Real-time cloud database and serverless functions backend. |
| **Firebase Auth** | Client Authentication | Manages user sign-in flows (like Google Sign-In) on the client side. |
| **Effect-TS** | Functional Programming | Used for robust error handling, config parsing, and standard services. |
| **Zustand** | Client State Management | Minimalist, client-side React state management. |
| **TailwindCSS** | Component Styling | Utility-first CSS framework for modern responsive styles. |

## Getting Started

Follow these steps to set up the template:

1. Run the command:
   ```bash
   pnpm dev
   ```
2. Set up Convex when prompted. Authenticate and connect an existing project or create a new project from scratch. 
3. Visit the [Firebase Console](https://console.firebase.com/), set up a new project, and create a Web App.
4. Copy the Firebase environment variables into the `.env.local` (this file is created automatically in the project root during Step 2). Refer to `.env.example` for the correct variable names.
5. setup the `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in your convex dashboard.
5. Enable the desired authentication providers (such as Google Sign-In) under **Build > Authentication > Sign-in method** in the Firebase Console.
6. You are all set up with Convex, Next.js, and Firebase Auth! working


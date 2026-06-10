const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable. Please check your Convex environment variables or .env.local file."
  );
}

const authConfig = {
  providers: [
    {
      domain: `https://securetoken.google.com/${projectId}`,
      applicationID: projectId,
    },
  ],
};

export default authConfig;

import { Context, Effect, Layer } from "effect";

/** @expected-unused */
export class ClientConfig extends Context.Service<
  ClientConfig,
  {
    readonly convexUrl: string;
    readonly firebaseApiKey: string;
    readonly firebaseAuthDomain: string;
    readonly firebaseProjectId: string;
    readonly firebaseStorageBucket: string;
    readonly firebaseMessagingSenderId: string;
    readonly firebaseAppId: string;
  }
>()("@app/ClientConfig") {
  static readonly layer = Layer.effect(
    ClientConfig,
    Effect.gen(function* () {
      const envVars = {
        convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
        firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const missing = Object.entries(envVars)
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missing.length > 0) {
        return yield* Effect.fail(
          new Error(`Missing environment variables: ${missing.join(", ")}`)
        );
      }

      return envVars as Record<keyof typeof envVars, string>;
    })
  );
}

// Helper to run the config service effect on-demand
const getConfig = () =>
  Effect.runSync(ClientConfig.pipe(Effect.provide(ClientConfig.layer)));

export const clientConfig = {
  get convexUrl() {
    return getConfig().convexUrl;
  },
  get firebaseApiKey() {
    return getConfig().firebaseApiKey;
  },
  get firebaseAuthDomain() {
    return getConfig().firebaseAuthDomain;
  },
  get firebaseProjectId() {
    return getConfig().firebaseProjectId;
  },
  get firebaseStorageBucket() {
    return getConfig().firebaseStorageBucket;
  },
  get firebaseMessagingSenderId() {
    return getConfig().firebaseMessagingSenderId;
  },
  get firebaseAppId() {
    return getConfig().firebaseAppId;
  },
};

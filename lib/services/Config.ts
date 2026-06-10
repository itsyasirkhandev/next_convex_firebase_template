import { Context, Effect, Layer } from "effect";

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
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
      const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const firebaseMessagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
      const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

      if (
        !convexUrl ||
        !firebaseApiKey ||
        !firebaseAuthDomain ||
        !firebaseProjectId ||
        !firebaseStorageBucket ||
        !firebaseMessagingSenderId ||
        !firebaseAppId
      ) {
        const missing: string[] = [];
        if (!convexUrl) missing.push("NEXT_PUBLIC_CONVEX_URL");
        if (!firebaseApiKey) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
        if (!firebaseAuthDomain) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
        if (!firebaseProjectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
        if (!firebaseStorageBucket) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
        if (!firebaseMessagingSenderId) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
        if (!firebaseAppId) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");

        return yield* Effect.fail(
          new Error(`Missing environment variables: ${missing.join(", ")}`)
        );
      }

      return {
        convexUrl,
        firebaseApiKey,
        firebaseAuthDomain,
        firebaseProjectId,
        firebaseStorageBucket,
        firebaseMessagingSenderId,
        firebaseAppId,
      };
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

import {
  onIdTokenChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  getRedirectResult,
} from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getFirebaseAuth } from "../lib/auth";
import { toast } from "sonner";
import { Effect, Schema } from "effect";

/** @expected-unused */
export class FirebaseAuthError extends Schema.TaggedErrorClass<FirebaseAuthError>()(
  "FirebaseAuthError",
  {
    code: Schema.String,
    message: Schema.String,
    rawError: Schema.Unknown,
  }
) {}

const signInWithGoogleEffect = Effect.tryPromise({
  try: () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  },
  catch: (e) => {
    const error = e as { code?: unknown; message?: unknown };
    const code = error?.code ? String(error.code) : "auth/unknown";
    const message = error?.message || String(error);
    return new FirebaseAuthError({ code, message, rawError: error });
  },
});

export default function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();

    // Capture and handle the result of the redirect flow on mount
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Successfully logged in via redirect:", result.user);
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error finalizing redirect sign-in:", error);
      });

    // onIdTokenChanged is critical for Convex auth syncing handshakes
    return onIdTokenChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) return null;
      return await user.getIdToken(forceRefreshToken);
    },
    [user]
  );

  const loginWithGoogle = useCallback(async () => {
    const program = signInWithGoogleEffect.pipe(
      Effect.catchTag("FirebaseAuthError", (error) => {
        console.error("Error signing in with Google popup:", error.rawError);
        const errStr = `${error.code} ${error.message}`.toLowerCase();
        if (errStr.includes("configuration-not-found") || errStr.includes("operation-not-allowed")) {
          toast.error("please enable the authentification in firebase and enable the login providers");
        }
        return Effect.void;
      })
    );
    await Effect.runPromise(program);
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated: !!user,
      user,
      fetchAccessToken,
      loginWithGoogle,
      logout,
    }),
    [isLoading, user, fetchAccessToken, loginWithGoogle, logout]
  );
}


import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    type Auth,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

let app;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let githubProvider: GithubAuthProvider;

if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope("email");
    googleProvider.addScope("profile");
    githubProvider = new GithubAuthProvider();
    githubProvider.addScope("repo");
    githubProvider.addScope("read:user");
    githubProvider.addScope("read:org");
} else {
    console.warn("Firebase API key missing. Authentication will fail.");
    // Provide a mocked auth object to prevent the entire React app from crashing
    // when components import `auth` and attempt to read `auth.currentUser`.
    auth = {} as Auth;
    googleProvider = {} as GoogleAuthProvider;
    githubProvider = {} as GithubAuthProvider;
}

const isFirebaseConfigured = !!firebaseConfig.apiKey;

export { auth, googleProvider, githubProvider, isFirebaseConfigured };


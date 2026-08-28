import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  auth = getAuth(app);
  // Use custom database ID from config if present
  const dbId = (firebaseConfig as any).firestoreDatabaseId || undefined;
  db = dbId ? getFirestore(app, dbId) : getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization note (using safe fallback):', error);
  // @ts-ignore
  app = {} as FirebaseApp;
  // @ts-ignore
  auth = {} as Auth;
  // @ts-ignore
  db = {} as Firestore;
}

export { app, auth, db };

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    if (auth && typeof fbSignOut === 'function') {
      await fbSignOut(auth);
    }
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
}

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with the specific databaseId per Firebase skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Test connection per skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline or connecting:', error.message);
    }
  }
}
testConnection();

// Structured Firestore error handling as mandated by SKILL.md
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Signs in with Google using Firebase Authentication popup.
 * Also synchronizes the user profile into Firestore /users/{userId}.
 */
export async function signInWithGooglePopup() {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;

  const userDocRef = doc(db, 'users', fbUser.uid);
  let userProfile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    photoURL: string;
    role: string;
    createdAt?: string;
    updatedAt: string;
  } = {
    id: fbUser.uid,
    name: fbUser.displayName || 'Patron',
    email: fbUser.email || '',
    phone: fbUser.phoneNumber || '',
    photoURL: fbUser.photoURL || '',
    role: (fbUser.email?.toLowerCase() === 'aarubymoni@admin.co.in' || fbUser.email?.toLowerCase() === 'mettapavan622@gmail.com') ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data();
      userProfile = {
        ...userProfile,
        name: data.name || userProfile.name,
        phone: data.phone || userProfile.phone,
        role: data.role || userProfile.role,
        createdAt: data.createdAt || new Date().toISOString()
      };
      await setDoc(userDocRef, userProfile, { merge: true });
    } else {
      const newRecord = {
        ...userProfile,
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, newRecord);
    }
  } catch (err) {
    console.warn('Could not sync user document to Firestore:', err);
  }

  return { fbUser, userProfile };
}

export { firebaseSignOut, onAuthStateChanged };
export type { FirebaseUser };

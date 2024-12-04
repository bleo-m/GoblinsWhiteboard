import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
  type User,
} from 'firebase/auth';

import auth from '../config/firebase';

type AuthProviderProps = {
  children: ReactNode;
};

interface AuthContextType {
  currentUser: User | null;
  register:
    | null
    | ((
        name: string,
        email: string,
        password: string,
      ) => Promise<UserCredential>);
  signInUser:
    | null
    | ((email: string, password: string) => Promise<UserCredential>);
  signOutUser: null | (() => Promise<void>);
  updateUserDisplayName: null | ((user: User, name: string) => Promise<void>);
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  register: null,
  signInUser: null,
  signOutUser: null,
  updateUserDisplayName: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userUid = userCredential.user?.uid;

      // Set the user's display name in the auth profile and store their name and email in the database
      if (userUid) {
        const userCreationResponse = await fetch(`/api/users`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ name, email, userID: userUid }),
        });
        if (userCreationResponse.ok) {
          await updateUserDisplayName(userCredential.user, name);
        } else {
          throw new Error('Failed to create user');
        }
      }
      return userCredential;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  // Update the display name of the user on their firebase auth profile
  const updateUserDisplayName = async (user: User, name: string) => {
    try {
      await updateProfile(user, { displayName: name });
    } catch (e) {
      console.log('error when updating display name', e);
      throw e;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    signInUser,
    signOutUser,
    updateUserDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

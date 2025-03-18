import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 

const FirestoreAuthContext = createContext();

const useUserAuth = () => {
  return useContext(FirestoreAuthContext);
};

const FirestoreAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const firestore = getFirestore();

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ uid: firebaseUser.uid, isAdmin: userData.role === "admin" });
          } else {
            setUser({ uid: firebaseUser.uid, isAdmin: false });
          }
        } catch (error) {
          setUser({ uid: firebaseUser.uid, isAdmin: false });
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <FirestoreAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </FirestoreAuthContext.Provider>
  );
};

export { FirestoreAuthProvider, useUserAuth };

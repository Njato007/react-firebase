import { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase-config'

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState({});

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signout = () => {
        return signOut(auth);
    }
    
    const signin = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(user);
        });
        return () => { unsubscribe() }
    }, []);
 
    return (
        <AuthContext.Provider value={{ signup, user, signout, signin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}
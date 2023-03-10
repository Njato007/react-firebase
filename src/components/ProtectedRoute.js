import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../contexts/AuthContext'

export const ProtectedRouteNotLoggedIn = ({ children }) => {
    const { user } = UserAuth();

    if (user) {
        return <Navigate to='/' />
    }
    return children;
}

export const ProtectedRouteLoggedIn = ({ children }) => {
    const { user } = UserAuth();

    if (!user) {
        return <Navigate to='/signin' />
    }
    return children;
}

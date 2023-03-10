import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Users } from "./components/Users/Users";
import { Signin } from "./components/Signin";
import { Adduser } from "./components/Users/NewUser";
import { List } from "./components/Users/List";
import { EditUser } from "./components/Users/EditUser";
import { NotFound } from "./components/NotFound";
import { Signup } from "./components/Signup";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ProtectedRouteLoggedIn, ProtectedRouteNotLoggedIn } from "./components/ProtectedRoute";
// const List = React.lazy(() => import("./components/Users/List"));

const App = () => {
    return (
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={
                    <ProtectedRouteLoggedIn>
                        <Home />
                    </ProtectedRouteLoggedIn>
                } />
                <Route path="users" element={
                    <ProtectedRouteLoggedIn>
                        <Users />
                    </ProtectedRouteLoggedIn>
                    }>
                    <Route index element={<List />} />
                    <Route path="list" element={<List />} />
                    <Route path="add" element={<Adduser />} />
                    <Route path="edit/:userId" element={<EditUser />} />
                </Route>
                <Route path="signin" element={
                    <ProtectedRouteNotLoggedIn>
                        <Signin />
                    </ProtectedRouteNotLoggedIn>
                } />
                <Route path="signup" element={
                    <ProtectedRouteNotLoggedIn>
                        <Signup />
                    </ProtectedRouteNotLoggedIn>
                }/>
                <Route path="*" element={
                    <ProtectedRouteLoggedIn>
                        <NotFound />
                    </ProtectedRouteLoggedIn>}
                />
            </Routes>
        </AuthContextProvider>
    );
}

export default App;
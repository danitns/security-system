import React, { useContext, useEffect, useState } from "react";
import CameraPage from "./pages/CameraPage";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { supabase } from "./utils/supabase";
import { CurrentUserContext } from "./components/ReactContexts/currentUserContext";
import SubmenuAndContent from "./components/Layout/SubmenuAndContent";

function App() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser({ ...currentUser, session: session });
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newcurrentUser = {
        session: session,
      };
      setCurrentUser(newcurrentUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <SubmenuAndContent>
                <HomePage />
              </SubmenuAndContent>
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/camera"
          element={
            <SubmenuAndContent>
              <CameraPage />
            </SubmenuAndContent>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

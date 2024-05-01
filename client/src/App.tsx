import React, { useContext, useEffect, useState } from "react";
import CameraPage from "./pages/CameraPage";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { supabase } from "./utils/supabase";
import { CurrentUserContext } from "./components/ReactContexts/currentUserContext";

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
    return null; // or render a loading indicator
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/camera"
          element={
            <PrivateRoute>
              <CameraPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

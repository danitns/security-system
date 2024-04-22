import { useEffect, useState } from "react";
import React from "react";
import { supabase } from "./utils/supabase";
import { Session } from "@supabase/supabase-js";
import CameraPage from "./pages/CameraPage";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ChakraProvider>
      <PrivateRoute>
        <CameraPage />
      </PrivateRoute>
    </ChakraProvider>
  );
}

export default App;

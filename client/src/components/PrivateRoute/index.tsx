import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import LoginPage from "../../pages/LoginPage";

const PrivateRoute = (props) => {
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
  return session ? props.children : <LoginPage></LoginPage>;
};

export default PrivateRoute;

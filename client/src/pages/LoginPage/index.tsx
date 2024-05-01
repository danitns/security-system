import { Auth } from "@supabase/auth-ui-react";
import React, { useContext } from "react";
import { supabase } from "../../utils/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { CurrentUserContext } from "../../components/ReactContexts/currentUserContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { currentUser } = useContext(CurrentUserContext);

  return currentUser.session ? (
    <Navigate to={"/"} />
  ) : (
    <div>
      LoginPage
      <div style={{ width: 300 }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        ></Auth>
      </div>
    </div>
  );
};

export default LoginPage;

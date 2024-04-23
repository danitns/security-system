import { Auth } from "@supabase/auth-ui-react";
import React from "react";
import { supabase } from "../../utils/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const LoginPage = () => {
  return (
    <div>
      LoginPage
      <div style={{ width: 300 }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
        ></Auth>
      </div>
    </div>
  );
};

export default LoginPage;

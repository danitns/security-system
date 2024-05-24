import { Auth } from "@supabase/auth-ui-react";
import React, { useContext } from "react";
import { supabase } from "../../utils/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { CurrentUserContext } from "../../components/ReactContexts/currentUserContext";
import { Navigate } from "react-router-dom";
import { Container, Flex, Heading, Text, Stack } from "@chakra-ui/react";
import UnauthHeader from "../../components/Layout/UnauthHeader";

const LoginPage = () => {
  const { currentUser } = useContext(CurrentUserContext);

  return currentUser.session ? (
    <Navigate to={"/"} />
  ) : (
    <div>
      <UnauthHeader />
      <Stack direction={"row"}>
        <Stack direction={"column"} w={"40%"}>
          <Container width={560} paddingTop={"40px"}>
            <Heading>Welcome to GateGuard!</Heading>
            <Text paddingTop={4} paddingBottom={30}>
              Sign in or register to continue
            </Text>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
            ></Auth>
          </Container>
        </Stack>
        <Stack direction={"column"} w={"60%"}></Stack>
      </Stack>
    </div>
  );
};

export default LoginPage;

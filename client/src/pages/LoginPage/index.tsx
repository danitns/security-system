import { Auth } from "@supabase/auth-ui-react";
import React, { useContext } from "react";
import { supabase } from "../../utils/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { CurrentUserContext } from "../../components/ReactContexts/currentUserContext";
import { Navigate } from "react-router-dom";
import {
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Box,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import UnauthHeader from "../../components/Layout/UnauthHeader";
import LandingPage from "../../components/Layout/LandingPage";

const LoginPage = () => {
  const { currentUser } = useContext(CurrentUserContext);

  return currentUser.session ? (
    <Navigate to={"/"} />
  ) : (
    <div>
      {/* <UnauthHeader /> */}
      <Grid templateColumns="repeat(4, 1fr)" height="100vh">
        <GridItem colSpan={1} className="shadow-right">
          <Container width={560} paddingTop={"40px"} paddingX={"30px"}>
            <Heading>Welcome to GateGuard!</Heading>
            <Text paddingY={20} paddingBottom={30}>
              Sign in or register to continue
            </Text>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
            />
          </Container>
        </GridItem>
        <GridItem colSpan={3} overflowY="auto">
          <Box height="100vh">
            <LandingPage />
          </Box>
        </GridItem>
      </Grid>
    </div>
  );
};

export default LoginPage;

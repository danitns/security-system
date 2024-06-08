import React from "react";
import Feature from "../../components/Widgets/Feature";
import { Box, Flex, Stack, chakra } from "@chakra-ui/react";
import { LuGlobe } from "react-icons/lu";
import { FiPhone } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { FiWifi } from "react-icons/fi";

const HomePage = () => {
  return (
    <Flex
      bg="#edf3f8"
      _dark={{ bg: "#3e3e3e" }}
      p={20}
      w="auto"
      justifyContent="center"
      alignItems="center"
    >
      <Box py={12} bg="white" _dark={{ bg: "gray.800" }} rounded="xl">
        <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }}>
          <Box textAlign={{ lg: "center" }}>
            <chakra.h2
              _light={{ color: "brand.600" }}
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              GateGuard
            </chakra.h2>
            <chakra.p
              mt={2}
              fontSize={{ base: "3xl", sm: "4xl" }}
              lineHeight="8"
              fontWeight="extrabold"
              letterSpacing="tight"
              _light={{ color: "gray.900" }}
            >
              Revolutionizing Home Security
            </chakra.p>
            <chakra.p
              mt={4}
              maxW="2xl"
              fontSize="xl"
              mx={{ lg: "auto" }}
              color="gray.500"
              _dark={{ color: "gray.400" }}
            >
              Enhance your home's security and convenience with gateGuard, the
              smart doorbell system designed for modern living.
            </chakra.p>
          </Box>

          <Box mt={10}>
            <Stack
              spacing={{ base: 10, md: 0 }}
              display={{ md: "grid" }}
              gridTemplateColumns={{ md: "repeat(2,1fr)" }}
              gridColumnGap={{ md: 8 }}
              gridRowGap={{ md: 10 }}
            >
              <Feature title="Advanced Motion Detection" icon={LuGlobe}>
                Be instantly aware of any activity at your door with
                cutting-edge motion sensors that detect movement in real-time,
                ensuring your safety.
              </Feature>

              <Feature title=" Two-Way Communication" icon={FiPhone}>
                Communicate seamlessly with visitors through high-definition
                video and audio, allowing for clear two-way conversations from
                anywhere.
              </Feature>

              <Feature title="Instant Alerts" icon={FiBell}>
                Receive immediate notifications on your smartphone whenever
                motion is detected, keeping you informed and in control at all
                times.
              </Feature>

              <Feature title="Remote Door Control" icon={FiWifi}>
                Lock and unlock your door remotely with ease. gateGuard
                integrates with your smart home system, giving you full control
                over your door's security from anywhere.
              </Feature>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default HomePage;

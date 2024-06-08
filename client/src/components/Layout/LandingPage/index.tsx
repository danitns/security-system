import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import BoxImage from "../../../assets/images/cutie_fata.jpeg";
import BoxImage2 from "../../../assets/images/cutie_stanga.jpeg";
import ComponentsImage from "../../../assets/images/componente_in_cutie.jpeg";
import VideoDemo from "../../../assets/videos/demovideo.mp4";
import Logo from "../../../assets/logo.svg";

const LandingPage = () => {
  return (
    <Flex
      bg="#edf3f8"
      _dark={{ bg: "#3e3e3e" }}
      justifyContent="center"
      alignItems="center"
      pos="absolute"
      height={"100%"}
      overflow={"auto"}
    >
      <Box px={8} py={10} mx="auto" height={"100%"}>
        <Box display={"flex"} flexDir={"row"} pb={20}>
          <img src={Logo} alt="" style={{ height: "40px" }} />
          <span
            style={{ fontSize: "36px", fontWeight: "800", marginLeft: "10px" }}
          >
            Key Features
          </span>
        </Box>

        <SimpleGrid
          alignItems="start"
          columns={{ base: 1, md: 2 }}
          mb={24}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="#246355"
              _dark={{ color: "gray.400" }}
              lineHeight={{ md: "shorter" }}
              textShadow="2px 0 currentcolor"
            >
              Motivation
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color="gray.700"
              _dark={{ color: "gray.400" }}
              fontSize={{ md: "lg" }}
            >
              The purpose of this project is to create a device, equipped with
              advanced motion sensors, that is capable of notifying the user
              about the activity taking place outside the door, allowing two-way
              communication with visitors via built-in speakers and a
              microphone. I chose this project because of the learning
              opportunity it provides. I was able to improve my knowledge about
              IoT and networking, subjects I was interested in before. Also I
              had the possibility to integrate a machine leaning model and to
              deepen my robotics capability.
            </chakra.p>
          </Box>
          <Box
            w="full"
            h="full"
            py={48}
            bg="gray.200"
            _dark={{ bg: "gray.700" }}
            backgroundPosition={"center"}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"contain"}
            backgroundImage={BoxImage}
          ></Box>
        </SimpleGrid>
        <SimpleGrid
          alignItems="center"
          columns={{ base: 1, md: 2 }}
          flexDirection="column-reverse"
          mb={24}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10 }}
        >
          <Box order={{ base: "initial", md: 2 }}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="#246355"
              _dark={{ color: "gray.400" }}
              lineHeight={{ md: "shorter" }}
            >
              Realtime Comunication
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color="gray.700"
              _dark={{ color: "gray.400" }}
              fontSize={{ md: "lg" }}
            >
              My prototype aims to reshape the basic security systems by
              enabling a remote two-way communication, using WebRTC, a
              technology that uses both TCP and UDP protocols to establish
              real-time communication. To achieve this type of connection on the
              Raspberry Pi, without using a browser, I chose to use{" "}
              <Link
                href="https://github.com/aiortc/aiortc"
                color={"hsl(154 54.8% 45.1%)"}
                fontWeight={"600"}
              >
                aioRTC
              </Link>
              , a Python library built on top of asyncio.
            </chakra.p>
          </Box>
          <Box
            w="full"
            h="full"
            py={48}
            bg="gray.200"
            _dark={{ bg: "gray.700" }}
            backgroundImage={ComponentsImage}
            backgroundPosition={"center"}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"contain"}
          ></Box>
        </SimpleGrid>

        <SimpleGrid
          alignItems="start"
          columns={{ base: 1, md: 2 }}
          mb={24}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10, md: 24 }}
        >
          <Box>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="#246355"
              _dark={{ color: "gray.400" }}
              lineHeight={{ md: "shorter" }}
              textShadow="2px 0 currentcolor"
            >
              People detection
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color="gray.700"
              _dark={{ color: "gray.400" }}
              fontSize={{ md: "lg" }}
            >
              This component does use an infrared sensor in order to detect
              motion and it captures a picture of the subject. Then, the image
              is analyzed by an efficient computer vision model that is
              specially implemented for people detection.If the model positively
              detects human presence, the user will instantly receive a
              notification. This property is provided by the realtime servers
              integrated in the backend.
            </chakra.p>
          </Box>
          <Box
            w="full"
            h="full"
            py={48}
            bg="gray.200"
            _dark={{ bg: "gray.700" }}
            backgroundPosition={"center"}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"contain"}
            backgroundImage={BoxImage2}
          ></Box>
        </SimpleGrid>
        <SimpleGrid
          alignItems="center"
          columns={{ base: 1, md: 2 }}
          flexDirection="column-reverse"
          mb={24}
          spacingY={{ base: 10, md: 32 }}
          spacingX={{ base: 10 }}
        >
          <Box order={{ base: "initial", md: 2 }}>
            <chakra.h2
              mb={4}
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              color="#246355"
              _dark={{ color: "gray.400" }}
              lineHeight={{ md: "shorter" }}
            >
              Remote door control
            </chakra.h2>
            <chakra.p
              mb={5}
              textAlign={{ base: "center", sm: "left" }}
              color="gray.700"
              _dark={{ color: "gray.400" }}
              fontSize={{ md: "lg" }}
            >
              One of the revolutionary features is the remote door control
              option available on the web application, making it possible to
              open and close the door whenever you see fit.
            </chakra.p>
          </Box>
          <Box
            w="full"
            h="full"
            bg="gray.200"
            _dark={{ bg: "gray.700" }}
            marginBottom={"48px"}
          >
            <video src={VideoDemo} controls></video>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default LandingPage;

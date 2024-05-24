import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import NavItem from "../NavItem";
import { BsGearFill } from "react-icons/bs";
import { MdHome } from "react-icons/md";
import { GiCctvCamera } from "react-icons/gi";
import reactLogo from "../../../assets/logo.svg";

const SidebarContent = (props) => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{ bg: "gray.800" }}
      border
      color="inherit"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
      <Flex px="4" py="5" align="center">
        <Image src={reactLogo} w={"50px"} />
        <Text
          fontSize="2xl"
          ml="2"
          color="brand.500"
          _dark={{ color: "white" }}
          fontWeight="semibold"
        >
          GateGuard
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <NavItem icon={MdHome} path="/">
          Home
        </NavItem>
        <NavItem icon={GiCctvCamera} path="/camera">
          Camera
        </NavItem>
        <NavItem icon={BsGearFill} path="/">
          Settings
        </NavItem>
      </Flex>
    </Box>
  );
};

export default SidebarContent;

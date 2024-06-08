import { chakra, Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import SiteLogo from "../../../assets/logo.svg";

const UnauthHeader = () => {
  return (
    <React.Fragment>
      <chakra.header
        h="full"
        w="full"
        px={{
          base: 2,
          sm: 4,
        }}
        py={4}
        backgroundColor={"#d7e8d3"}
      >
        <Flex alignItems="center" justifyContent="flex-start" mx="auto">
          <Image src={SiteLogo} width={"60px"} />
          <Heading>GateGuard</Heading>
        </Flex>
      </chakra.header>
    </React.Fragment>
  );
};

export default UnauthHeader;

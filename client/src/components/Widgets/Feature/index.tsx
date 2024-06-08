import { Box, Flex, Icon, chakra } from "@chakra-ui/react";
import React from "react";

const Feature = (props) => {
  return (
    <Flex>
      <Flex shrink={0}>
        <Flex
          alignItems="center"
          justifyContent="center"
          h={12}
          w={12}
          rounded="md"
          _light={{ bg: "#246355" }}
          color="white"
        >
          <Icon
            boxSize={6}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            as={props.icon}
          ></Icon>
        </Flex>
      </Flex>
      <Box ml={4}>
        <chakra.dt
          fontSize="lg"
          fontWeight="medium"
          lineHeight="6"
          _light={{ color: "gray.900" }}
        >
          {props.title}
        </chakra.dt>
        <chakra.dd mt={2} color="gray.500" _dark={{ color: "gray.400" }}>
          {props.children}
        </chakra.dd>
      </Box>
    </Flex>
  );
};

export default Feature;

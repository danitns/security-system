import { Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";

interface INavItem {
  icon: any;
  path: string;
  children: ReactNode;
}

const NavItem: React.FC<INavItem> = (props) => {
  const color = useColorModeValue("gray.600", "gray.300");
  return (
    <Link as={ReactRouterLink} to={props.path}>
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color="inherit"
        _dark={{ color: "gray.400" }}
        _hover={{
          bg: "gray.100",
          _dark: { bg: "gray.900" },
          color: "gray.900",
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
      >
        {props.icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={props.icon}
          />
        )}
        {props.children}
      </Flex>
    </Link>
  );
};

export default NavItem;

import { Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, Link } from "@chakra-ui/react";
import Gnb from "./Gnb";

const Header = () => {
  return (
    <Box
      as="header"
      id="header"
      position={"fixed"}
      top={0}
      left={{ base: "-100%", xl: 0 }}
      bottom={0}
      zIndex={1000}
      transition={"left 0.3s"}
      w={150}
      bg={"bgDefault"}
    >
      <Heading
        as={"h1"}
        fontSize={25}
        fontWeight={400}
        pt={14}
        pb={9}
        textAlign={"center"}
        borderBottom={"1px solid"}
        borderColor={"lineDefault"}
      >
        <Link as={ReactRouterLink} to="/">
          <strong>DUST</strong>
          <br /> MUSIC
        </Link>
      </Heading>

      <Gnb />
    </Box>
  );
};

export default Header;
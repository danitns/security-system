import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import ClickOutside from "../../Widgets/ClickOutside";
import { CurrentUserContext } from "../../ReactContexts/currentUserContext";
import ProfileItem from "./profileItem";
import { PiSignOutLight } from "react-icons/pi";
import { supabase } from "../../../utils/supabase";

const Profile = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const iconRef = useRef<null | HTMLElement>(null);

  const signOut = async () => {
    debugger;
    await supabase.auth.signOut();
  };

  return (
    <div>
      <span
        className="button-notifications"
        onClick={() => setIsExpanded(!isExpanded)}
        ref={iconRef}
      >
        <Icon
          as={CgProfile}
          color="gray.500"
          ml="4"
          width={5}
          height={5}
          cursor="pointer"
        />
      </span>
      {isExpanded && (
        <ClickOutside
          onClickOutside={() => setIsExpanded(false)}
          ignoreComponentRef={iconRef}
        >
          <Card
            className="profile-container"
            borderColor={"gray.300"}
            borderWidth={"1px"}
          >
            <CardHeader>
              <Heading size="md">Welcome to GateGuard</Heading>
              <Text>{currentUser?.session?.user?.email}</Text>
            </CardHeader>
            <Divider></Divider>
            <CardBody
              maxHeight={400}
              overflow="auto"
              paddingLeft={0}
              paddingRight={0}
            >
              <Stack>
                <ProfileItem icon={PiSignOutLight} onClickHandler={signOut}>
                  Sign out
                </ProfileItem>
              </Stack>
            </CardBody>
          </Card>
        </ClickOutside>
      )}
    </div>
  );
};

export default Profile;

import React from "react";
import { Tables } from "../../../types/supabase";
import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import moment from "moment";
import { supabase } from "../../../utils/supabase";

interface INotification {
  notification: Tables<"notifications">;
}

const MyNotification: React.FC<INotification> = ({ notification }) => {
  const formatDate = () => {
    if (moment(notification.timestamp).isAfter(moment().subtract(1, "days"))) {
      return moment(notification.timestamp).fromNow();
    }
    return moment(notification.timestamp).format("DD-MM-YYYY hh:mm a");
  };

  const readNotification = async () => {
    if (!notification.isread) {
      await supabase
        .from("notifications")
        .update({ isread: true })
        .eq("id", notification.id);
    }
  };

  return (
    <Link
      as={ReactRouterLink}
      to="/notifications"
      onClick={readNotification}
      fontWeight={notification.isread ? "200" : "600"}
    >
      <Box paddingTop={2} paddingBottom={2} borderTop="1px solid #E5E5E5">
        <Flex justifyContent={"space-between"}>
          <Heading size="sm" fontWeight={notification.isread ? "200" : "600"}>
            {notification.title}
          </Heading>

          <Text>{formatDate()}</Text>
        </Flex>

        <Text>{notification.description}</Text>
      </Box>
    </Link>
  );
};

export default MyNotification;

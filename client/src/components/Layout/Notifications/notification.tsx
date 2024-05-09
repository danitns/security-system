import React from "react";
import { Tables } from "../../../types/supabase";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import moment from "moment";

interface INotification {
  notification: Tables<"notifications">;
}

const Notification: React.FC<INotification> = ({ notification }) => {
  const formatDate = () => {
    return moment(notification.timestamp).format("DD-MM-YYYY hh:mm a");
  };

  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Heading size="sm">{notification.title}</Heading>
        <Text>{formatDate()}</Text>
      </Flex>

      <Text>{notification.description}</Text>
    </Box>
  );
};

export default Notification;

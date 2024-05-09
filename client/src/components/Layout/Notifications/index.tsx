import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Icon,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { Tables } from "../../../types/supabase";
import { supabase } from "../../../utils/supabase";
import Notification from "./notification";

const Notifications = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>(
    []
  );

  useEffect(() => {
    const getNotifications = async () => {
      const { data } = await supabase.from("notifications").select();
      if (data) {
        setNotifications(data);
      }
    };
    getNotifications();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("schema-db-changes");

    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications" },
      (payload) => {
        console.log("Notification received:", payload);
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Icon
        color="gray.500"
        as={FaBell}
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <Card className="notification-container">
          <CardHeader>
            <Heading size="md">Notifications</Heading>
          </CardHeader>
          <Divider></Divider>
          <CardBody>
            <Stack>
              {notifications.map((notif) => {
                return <Notification notification={notif} />;
              })}
            </Stack>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Notifications;

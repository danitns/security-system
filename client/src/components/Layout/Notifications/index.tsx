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
import MyNotification from "./notification";

const Notifications = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>(
    []
  );
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  const notifyUser = (title: string, body: string) => {
    if (!("Notification" in window)) {
      alert("Browser does not support notifications");
    } else if (Notification.permission === "granted") {
      const notification = new Notification(title, { body });
    }
  };

  useEffect(() => {
    const getNotifications = async () => {
      const { data } = await supabase.from("notifications").select();
      if (data) {
        setNotifications(data);
        const numberOfUnreadNotif = data.filter((elem) => {
          return !elem.isread;
        }).length;
        setUnreadNotifications(numberOfUnreadNotif);
      }
    };
    getNotifications();
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission == "granted") {
          const notification = new Notification(
            "Your notifications are now enabled"
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    const channel = supabase.channel("schema-db-changes");

    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications" },
      (payload) => {
        if (payload.eventType == "INSERT") {
          const newNotification = payload.new as Tables<"notifications">;
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newNotification,
          ]);
          notifyUser(newNotification.title, newNotification.description);
        }
        debugger;
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
      <span
        className="button-notifications"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Icon color="gray.500" as={FaBell} cursor="pointer"></Icon>
        {unreadNotifications > 0 && (
          <span className="tab-number">
            {unreadNotifications > 9 ? +9 : unreadNotifications}
          </span>
        )}
      </span>

      {isExpanded && (
        <Card className="notification-container">
          <CardHeader>
            <Heading size="md">Notifications</Heading>
          </CardHeader>
          <Divider></Divider>
          <CardBody>
            <Stack>
              {notifications.map((notif) => {
                return <MyNotification notification={notif} key={notif.id} />;
              })}
            </Stack>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Notifications;

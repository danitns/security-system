import React, { useEffect, useRef, useState } from "react";
import { Tables } from "../../types/supabase";
import { supabase } from "../../utils/supabase";
import { Heading } from "@chakra-ui/react";
import ExpandedNotification from "../../components/Layout/Notifications/expandedNotification";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Tables<"notifications">[]>(
    []
  );
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  const getNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select()
      .order("timestamp", { ascending: false });
    if (data) {
      setNotifications(data);
      const numberOfUnreadNotif = data.filter((elem) => {
        return !elem.isread;
      }).length;
      setUnreadNotifications(numberOfUnreadNotif);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("schema-db-changes");

    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications" },
      (payload) => {
        getNotifications();
      }
    );
    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Heading>Your Notifications</Heading>
      {notifications.map((element) => {
        return <ExpandedNotification key={element.id} notification={element} />;
      })}
    </div>
  );
};

export default NotificationsPage;

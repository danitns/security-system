import React, { useEffect, useState } from "react";
import { Tables } from "../../../types/supabase";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { supabase } from "../../../utils/supabase";
import moment from "moment";

interface IExpandedNotification {
  notification: Tables<"notifications">;
}

const ExpandedNotification: React.FC<IExpandedNotification> = (props) => {
  const [pictureUrl, setPictureUrl] = useState<string>("");
  const getPicture = () => {
    const url = props.notification.imageurl;
    if (url) {
      const startIndex = url.lastIndexOf("imagesurl/") + "imagesurl/".length;

      let code = url.slice(0, startIndex) + "public/" + url.slice(startIndex);
      if (code) {
        setPictureUrl(code);
      }
    }
  };

  useEffect(() => {
    getPicture();
  }, []);

  const formatDate = () => {
    if (
      moment(props.notification.timestamp).isAfter(moment().subtract(1, "days"))
    ) {
      return moment(props.notification.timestamp).fromNow();
    }
    return moment(props.notification.timestamp).format("DD-MM-YYYY hh:mm a");
  };

  return (
    <Flex>
      <Box p={3} border={"1px solid #cfcfcf"} w={"full"} my={4}>
        <Grid templateColumns="repeat(5, 1fr)" columnGap={20} w="full">
          <GridItem colSpan={2} w={"full"} h="full">
            {pictureUrl ? (
              <Image src={pictureUrl}></Image>
            ) : (
              <Box width="100%" height="100%" backgroundColor={"cfcfcc"}>
                No picture available
              </Box>
            )}
          </GridItem>
          <GridItem colSpan={3}>
            <Flex justifyContent={"space-between"}>
              <Heading
                size="sm"
                fontWeight={props.notification.isread ? "200" : "600"}
              >
                {props.notification.title}
              </Heading>

              <Text>{formatDate()}</Text>
            </Flex>

            <Text>{props.notification.description}</Text>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
};

export default ExpandedNotification;

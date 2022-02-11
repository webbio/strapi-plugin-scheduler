import React from "react";
import { Box, Stack } from "@strapi/design-system";
import { Divider } from "@strapi/design-system/Divider";
import ScheduledPublish from "./publish";
import DePublishScheduler from "./depublish";

const scheduledPublish = () => {
  return (
    <div>
      <Box padding={4}>
        <Divider />
      </Box>
      <Stack vertical size={2}>
        <div>
          <ScheduledPublish />
        </div>
        <div>
          <DePublishScheduler />
        </div>
      </Stack>
    </div>
  );
};

export default scheduledPublish;
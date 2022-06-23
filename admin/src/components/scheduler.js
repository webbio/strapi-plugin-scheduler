import React from 'react';
import { Box, Stack } from '@strapi/design-system';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import ScheduledPublish from './publish';

const scheduledPublish = () => {
  return (
    <Box
      as="aside"
      aria-labelledby="scheduler"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      paddingBottom={4}
      paddingLeft={4}
      paddingRight={4}
      paddingTop={6}
      shadow="tableShadow"
    >
      <Typography variant="sigma" textColor="neutral600" id="scheduler">
        Scheduler
      </Typography>
      <Box padding={4}>
        <Divider />
      </Box>
      <Stack vertical size={2}>
        <ScheduledPublish />
      </Stack>
    </Box>
  );
};

export default scheduledPublish;

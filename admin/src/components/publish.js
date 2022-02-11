import React, { useState, useEffect, useMemo } from "react";
import { DatePicker } from "@strapi/design-system/DatePicker";
import { TimePicker } from "@strapi/design-system/TimePicker";
import { Button } from "@strapi/design-system/Button";
import get from "lodash/get";
import { Box, Stack } from "@strapi/design-system";
import { useCMEditViewDataManager, request } from "@strapi/helper-plugin";
import { useParams } from "react-router-dom";
import useAddStartDate from "../hooks/createDate";
import useUpdateStartDate from "../hooks/updateDate";

const ScheduledPublish = () => {
  const query = useCMEditViewDataManager();
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState(undefined);
  const [hasPublishDate, setHasPublishDate] = useState(false);
  const params = useParams();
  const id = get(params, "id", null);
  const uid = query.layout.uid;
  const { addStartDate } = useAddStartDate();
  const { updateStartDate } = useUpdateStartDate();

  const handlePublishClick = () => {
    let hours;
    let minutes;
    const selectedDate = new Date(date);
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    if (time) {
      const selectedTime = time.split(":");
      hours = selectedTime[0];
      minutes = selectedTime[1];
    } else {
      hours = "00";
      minutes = "00";
    }

    const finalDate = new Date(year, month, day, hours, minutes);
    
    if (hasPublishDate) {
      updateStartDate({
        date: finalDate,
        uid,
        contentId: id,
        scheduleType: "schedule",
      });
    }
    if (!hasPublishDate) {
      addStartDate({
        date: finalDate,
        uid,
        contentId: id,
        scheduleType: "schedule",
      });
      setHasPublishDate(true);
    }
  };

  const getScheduledDate = async () => {
    const data = await request(`/scheduler/${uid}/${id}`);
    data.forEach((element) => {
      if (element.scheduleType === "schedule") {
        const currentScheduledDate = new Date(element.scheduledDatetime);

        setDate(currentScheduledDate);
        const hours = currentScheduledDate.getHours();
        const minutes = currentScheduledDate.getMinutes();
        setTime(`${hours}:${minutes}`);
        setHasPublishDate(true);
      }
    });
  };

  useEffect(() => {
    getScheduledDate();
  }, []);

  const dateTimePickerButton = (name) => {
    if (id) {
      return <Button onClick={handlePublishClick}> Set {name} time </Button>;
    } else {
      return (
        <Button onClick={handlePublishClick} disabled>
          Save first
        </Button>
      );
    }
  };

  return (
    <div>
      <Stack horizontal size={2}>
        <DatePicker
          size="S"
          onChange={setDate}
          selectedDate={date}
          label={`Publish at`}
          name="datepicker"
          clearLabel={"Clear the datepicker"}
          onClear={() => setDate(undefined)}
          selectedDateLabel={(formattedDate) =>
            `Date picker, current is ${formattedDate}`
          }
        />
        <Box padding={1} />
        <TimePicker
          step={30}
          label={"Choose a time"}
          disabled={false}
          error={undefined}
          id={"tp-1"}
          size="S"
          onClear={() => setTime(undefined)}
          onChange={setTime}
          value={time}
          clearLabel={"Clear the selected time picker value"}
        />
      </Stack>
      <Box paddingTop={2} paddingBottom={2}>
        {dateTimePickerButton("publish")}
      </Box>
      <div></div>
    </div>
  );
};

export default ScheduledPublish;

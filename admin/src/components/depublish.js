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

const DePublishScheduler = () => {
  const query = useCMEditViewDataManager();
  const [Depublishdate, setDepublishDate] = useState(undefined);
  const [depublishTime, setDepublishTime] = useState(undefined);
  const [hasDepublishDate, setHasDepublishDate] = useState(false);
  const params = useParams();
  const id = get(params, "id", null);
  const uid = query.layout.uid;
  const { addStartDate } = useAddStartDate();
  const { updateStartDate } = useUpdateStartDate();

  const handleDepublishClick = () => {
    let hours;
    let minutes;
    const selectedDate = new Date(Depublishdate);
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    if (depublishTime) {
      const selectedTime = depublishTime.split(":");
      hours = selectedTime[0];
      minutes = selectedTime[1];
    } else {
      hours = "00";
      minutes = "00";
    }

    const finalDate = new Date(year, month, day, hours, minutes);
    if (hasDepublishDate) {
      updateStartDate({
        date: finalDate,
        uid,
        contentId: id,
        scheduleType: "depublish",
      });
    }
    if (!hasDepublishDate) {
      addStartDate({
        date: finalDate,
        uid,
        contentId: id,
        scheduleType: "depublish",
      });
      setHasDepublishDate(true);
    }
  };

  const getScheduledDate = async () => {
    const data = await request(`/scheduler/${uid}/${id}`);
    data.forEach((element) => {
      if (element.scheduleType === "depublish") {
        const currentScheduledDate = new Date(element.scheduledDatetime);

        setDepublishDate(currentScheduledDate);
        const hours = currentScheduledDate.getHours();
        const minutes = currentScheduledDate.getMinutes();
        setDepublishTime(`${hours}:${minutes}`);
        setHasDepublishDate(true);
      }
    });
  };

  useEffect(() => {
    getScheduledDate();
  }, []);

  const dateTimePickerButton = (name) => {
    if (id) {
      return <Button onClick={handleDepublishClick}> Set {name} time </Button>;
    } else {
      return (
        <Button onClick={handleDepublishClick} disabled>
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
          onChange={setDepublishDate}
          selectedDate={Depublishdate}
          label="Depublish at"
          name="datepicker"
          clearLabel={"Clear the datepicker"}
          onClear={() => setDepublishDate(undefined)}
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
          onClear={() => setDepublishTime(undefined)}
          onChange={setDepublishTime}
          value={depublishTime}
          clearLabel={"Clear the selected time picker value"}
        />
      </Stack>
      <Box paddingTop={2} paddingBottom={2}>
        {dateTimePickerButton("depublish")}
      </Box>
    </div>
  );
};

export default DePublishScheduler;

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
import "../styles.css";

const ScheduledPublish = () => {
  const query = useCMEditViewDataManager();
  const [publishDate, setPublishDate] = useState(undefined);
  const [publishTime, setPublishTime] = useState(undefined);
  const [unpublishDate, setUnpublishDate] = useState(undefined);
  const [unpublishTime, setUnpublishTime] = useState(undefined);
  const [hasPublishDate, setHasPublishDate] = useState(false);
  const [hasUnpublishDate, setHasUnpublishDate] = useState(false);
  const params = useParams();
  const id = get(params, "id", null);
  const uid = query.layout.uid;
  const { addStartDate } = useAddStartDate();
  const { updateStartDate } = useUpdateStartDate();

  const finalDate = (date, time) => {
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

    return new Date(year, month, day, hours, minutes);
  };

  const handlePublishClick = () => {
    if (hasPublishDate && publishDate) {
      updateStartDate({
        date: finalDate(publishDate, publishTime),
        uid,
        contentId: id,
        scheduleType: "schedule",
      });
    } else if (!hasPublishDate && publishDate) {
      addStartDate({
        date: finalDate(publishDate, publishTime),
        uid,
        contentId: id,
        scheduleType: "schedule",
      });
      setHasPublishDate(true);
    }

    if (hasUnpublishDate && unpublishDate) {
      updateStartDate({
        date: finalDate(unpublishDate, unpublishTime),
        uid,
        contentId: id,
        scheduleType: "depublish",
      });
    } else if (!hasUnpublishDate && unpublishDate) {
      addStartDate({
        date: finalDate(unpublishDate, unpublishTime),
        uid,
        contentId: id,
        scheduleType: "depublish",
      });
      setHasUnpublishDate(true);
    }
  };

  const getScheduledDate = async () => {
    const [data, config] = await Promise.all([request(`/scheduler/${uid}/${id}`), request(`/scheduler/config/${uid}`)]);
    console.log(config);
    data.forEach((element) => {
      if (element.scheduleType === "schedule") {
        const currentScheduledDate = new Date(element.scheduledDatetime);

        setPublishDate(currentScheduledDate);
        const hours = currentScheduledDate.getHours();
        const minutes = currentScheduledDate.getMinutes();
        setPublishTime(`${hours}:${minutes}`);
        setHasPublishDate(true);
      }
      if (element.scheduleType === "depublish") {
        const currentScheduledDate = new Date(element.scheduledDatetime);

        setUnpublishDate(currentScheduledDate);
        const hours = currentScheduledDate.getHours();
        const minutes = currentScheduledDate.getMinutes();
        setUnpublishTime(`${hours}:${minutes}`);
        setHasUnpublishDate(true);
      }
    });
  };

  useEffect(() => {
    getScheduledDate();
  }, []);

  const dateTimePickerButton = () => {
    if (
      (id && publishDate !== undefined && publishTime !== undefined) ||
      (unpublishDate !== undefined && unpublishTime !== undefined)
    ) {
      return (
        <Button fullWidth onClick={handlePublishClick}>
          {" "}
          Save{" "}
        </Button>
      );
    } else {
      return (
        <Button fullWidth onClick={handlePublishClick} disabled>
          Save
        </Button>
      );
    }
  };

  return (
    <div>
      <Box paddingBottom={4} className="responsiveStack">
        <span className="field">
          <DatePicker
            label={`Publish`}
            onChange={setPublishDate}
            selectedDate={publishDate}
            name="datepicker"
            clearLabel={"Clear the datepicker"}
            onClear={() => setPublishDate(undefined)}
            selectedDateLabel={(formattedDate) => `Date picker, current is ${formattedDate}`}
          />
        </span>
        <span className="field">
          <TimePicker
            step={30}
            label="&nbsp;"
            aria-label="Time picker"
            disabled={false}
            error={undefined}
            id={"tp-1"}
            onClear={() => setPublishTime(undefined)}
            onChange={setPublishTime}
            value={publishTime}
            clearLabel={"Clear the selected time picker value"}
          />
        </span>
      </Box>
      <Box paddingBottom={4} className="responsiveStack">
        <span className="field">
          <DatePicker
            label={`Unpublish`}
            onChange={setUnpublishDate}
            selectedDate={unpublishDate}
            name="datepicker"
            clearLabel={"Clear the datepicker"}
            onClear={() => setUnpublishDate(undefined)}
            selectedDateLabel={(formattedDate) => `Date picker, current is ${formattedDate}`}
          />
        </span>
        <span className="field">
          <TimePicker
            step={30}
            label="&nbsp;"
            aria-label="Time picker"
            disabled={false}
            error={undefined}
            id={"tp-1"}
            onClear={() => setUnpublishTime(undefined)}
            onChange={setUnpublishTime}
            value={unpublishTime}
            clearLabel={"Clear the selected time picker value"}
          />
        </span>
      </Box>
      <Box paddingTop={2} paddingBottom={2}>
        {dateTimePickerButton()}
      </Box>
      <div></div>
    </div>
  );
};

export default ScheduledPublish;

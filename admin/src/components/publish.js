import React, { useState, useEffect, useMemo } from "react";
import { DatePicker } from "@strapi/design-system/DatePicker";
import { TimePicker } from "@strapi/design-system/TimePicker";
import { Button } from "@strapi/design-system/Button";
import get from "lodash/get";
import { Box } from "@strapi/design-system";
import { useCMEditViewDataManager, request } from "@strapi/helper-plugin";
import { useParams } from "react-router-dom";
import useAddStartDate from "../hooks/createDate";
import useUpdateStartDate from "../hooks/updateDate";
import "../styles.css";

const ScheduledPublish = () => {
  const query = useCMEditViewDataManager();

  const [initialPublishDate, setInitialPublishDate] = useState(undefined);
  const [initialPublishTime, setInitialPublishTime] = useState(undefined);
  const [publishDate, setPublishDate] = useState(undefined);
  const [publishTime, setPublishTime] = useState(undefined);

  const [initialDePublishDate, setInitialDePublishDate] = useState(undefined);
  const [initialDePublishTime, setInitialDePublishTime] = useState(undefined);
  const [dePublishDate, setDePublishDate] = useState(undefined);
  const [dePublishTime, setDePublishTime] = useState(undefined);

  const [hasPublishDate, setHasPublishDate] = useState(false);
  const [hasDePublishDate, sethasDePublishDate] = useState(false);

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
    } else if (!hasPublishDate && (publishDate || initialPublishDate)) {
      addStartDate({
        date: finalDate(
          publishDate || initialPublishDate,
          publishTime || initialDePublishTime
        ),
        uid,
        contentId: id,
        scheduleType: "schedule",
      });
      setHasPublishDate(true);
    }

    if (hasDePublishDate && dePublishDate) {
      updateStartDate({
        date: finalDate(dePublishDate, dePublishTime),
        uid,
        contentId: id,
        scheduleType: "depublish",
      });
    } else if (!hasDePublishDate && (dePublishDate || initialDePublishDate)) {
      addStartDate({
        date: finalDate(
          dePublishDate || initialDePublishDate,
          dePublishTime || initialDePublishTime
        ),
        uid,
        contentId: id,
        scheduleType: "depublish",
      });
      setHasUnpublishDate(true);
    }
  };

  const getScheduledDate = async () => {
    const [data, config] = await Promise.all([
      request(`/scheduler/schedule/${uid}/${id}`),
      request(`/scheduler/config/${uid}`),
    ]);

    if (!data.schedule && config?.data?.initialScheduleDate) {
      const currentScheduledDate = new Date(config.data.initialScheduleDate);

      setInitialPublishDate(currentScheduledDate);
      const hours = currentScheduledDate.getHours();
      const minutes = currentScheduledDate.getMinutes();
      setInitialPublishTime(`${hours}:${minutes}`);
    }

    if (data.schedule) {
      const currentScheduledDate = new Date(data.schedule.scheduledDatetime);

      setPublishDate(currentScheduledDate);
      const hours = currentScheduledDate.getHours();
      const minutes = currentScheduledDate.getMinutes();
      setPublishTime(`${hours}:${minutes}`);
      setHasPublishDate(true);
    }

    if (!data.depublish && config?.data?.initialDePublishDate) {
      const currentScheduledDate = new Date(config.data.initialDePublishDate);

      setInitialDePublishDate(currentScheduledDate);
      const hours = currentScheduledDate.getHours();
      const minutes = currentScheduledDate.getMinutes();
      setInitialDePublishTime(`${hours}:${minutes}`);
    }

    if (data.depublish) {
      const currentScheduledDate = new Date(data.depublish.scheduledDatetime);

      setDePublishDate(currentScheduledDate);
      const hours = currentScheduledDate.getHours();
      const minutes = currentScheduledDate.getMinutes();
      setDePublishTime(`${hours}:${minutes}`);
      sethasDePublishDate(true);
    }
  };

  useEffect(() => {
    getScheduledDate();
  }, []);

  const dateTimePickerButton = () => {
    if (
      (id &&
        (publishDate !== undefined || initialPublishDate !== undefined) &&
        (publishTime !== undefined || initialPublishTime !== undefined)) ||
      ((dePublishDate !== undefined || initialDePublishDate !== undefined) &&
        (dePublishTime !== undefined || initialDePublishTime !== undefined))
    ) {
      return (
        <Button fullWidth onClick={handlePublishClick}>
          Save
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
            selectedDate={publishDate || initialPublishDate}
            name="datepicker"
            clearLabel={"Clear the datepicker"}
            onClear={() => setPublishDate(undefined)}
            selectedDateLabel={(formattedDate) =>
              `Date picker, current is ${formattedDate}`
            }
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
            value={publishTime || initialPublishTime}
            clearLabel={"Clear the selected time picker value"}
          />
        </span>
      </Box>
      <Box paddingBottom={4} className="responsiveStack">
        <span className="field">
          <DatePicker
            label={`Unpublish`}
            onChange={setDePublishDate}
            selectedDate={dePublishDate || initialDePublishDate}
            name="datepicker"
            clearLabel={"Clear the datepicker"}
            onClear={() => setDePublishDate(undefined)}
            selectedDateLabel={(formattedDate) =>
              `Date picker, current is ${formattedDate}`
            }
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
            onClear={() => setDePublishTime(undefined)}
            onChange={setDePublishTime}
            value={dePublishTime || initialDePublishTime}
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

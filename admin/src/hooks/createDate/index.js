import { request, useNotification } from '@strapi/helper-plugin';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import { CREATE_STARTDATE } from '../constants';

const addStartDate = async (dateData, toggleNotification, message) => {
  const scheduledDatetime = dateData.date;
  const uid = dateData.uid;
  const contentId = dateData.contentId;
  const scheduleType = dateData.scheduleType;
  const data = await request(`/scheduler/create`, {
    method: 'POST',
    body: {
      scheduledDatetime,
      uid,
      contentId,
      scheduleType
    }
  });

  toggleNotification({
    type: 'success',
    message
  });
  return data;
};

const useAddStartDate = () => {
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const intl = useIntl();

  const persistStartDate = async (dateData) => {
    const message = intl.formatMessage(
      {
        id: getTrad(`Settings.scheduler.${dateData.scheduleType}.success`)
      },
      { time: dateData.date.toLocaleString() }
    );

    try {
      const newDate = await addStartDate(dateData, toggleNotification, message);
      dispatch({ type: CREATE_STARTDATE, newDate });
    } catch (e) {
      toggleNotification({
        type: 'warning',
        message: { id: 'notification.error' }
      });
      throw e;
    }
  };

  return { addStartDate: persistStartDate };
};

export default useAddStartDate;

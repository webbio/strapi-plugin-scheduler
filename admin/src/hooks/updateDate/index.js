import { request, useNotification } from '@strapi/helper-plugin';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
import { UPDATE_STARTDATE } from '../constants';

const updateStartDate = async (dateData, toggleNotification, message) => {
  const scheduledDatetime = dateData.date;
  const uid = dateData.uid;
  const contentId = dateData.contentId;
  const scheduleType = dateData.scheduleType;
  const data = await request(`/scheduler/${uid}/${contentId}`, {
    method: 'PUT',
    body: {
      scheduledDatetime,
      scheduleType
    }
  });

  toggleNotification({
    type: 'success',
    message
  });
  return data;
};

const useUpdateStartDate = () => {
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const intl = useIntl();

  const persistUpdateDate = async (dateData) => {
    const message = intl.formatMessage(
      {
        id: getTrad(`Settings.scheduler.${dateData.scheduleType}.success`)
      },
      { time: dateData.date.toLocaleString() }
    );

    try {
      const newDate = await updateStartDate(dateData, toggleNotification, message);
      dispatch({ type: UPDATE_STARTDATE, newDate });
    } catch (e) {
      toggleNotification({
        type: 'warning',
        message: { id: 'notification.error' }
      });
      throw e;
    }
  };

  return { updateStartDate: persistUpdateDate };
};

export default useUpdateStartDate;

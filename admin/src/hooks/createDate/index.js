import { request, useNotification } from '@strapi/helper-plugin';
import { useDispatch } from 'react-redux';
import getTrad from '../../utils/getTrad'
import { CREATE_STARTDATE } from '../constants';

const addStartDate = async (dateData, toggleNotification) => {
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
    },
  });

  toggleNotification({
    type: 'success',
    message: { id: getTrad('Settings.scheduler.success') },
  });
  return data;
};

const useAddStartDate = () => {
  const dispatch = useDispatch();
  const toggleNotification = useNotification();

  const persistStartDate = async dateData => {
    try {
      const newDate = await addStartDate(dateData , toggleNotification);
      dispatch({ type: CREATE_STARTDATE, newDate });
    } catch (e) {
      toggleNotification({
        type: "warning",
        message: { id: "notification.error" },
      });
      throw e;
    }
  };

  return { addStartDate: persistStartDate };
};

export default useAddStartDate;
import produce from "immer";
import pluginId from "../pluginId";
import { CREATE_STARTDATE, UPDATE_STARTDATE } from "./constants";

export const initialState = {
  date: undefined,
};

const dateReducer = produce((draftState = initialState, action) => {
  switch (action.type) {
    case CREATE_STARTDATE: {
      draftState.date = action.date;
      break;
    }
    case UPDATE_STARTDATE: {
      draftState.date = action.date;
      break;
    }

    default:
      return draftState;
  }

  return draftState;
});

const reducers = {
  [`${pluginId}_date`]: dateReducer,
};

export default reducers;

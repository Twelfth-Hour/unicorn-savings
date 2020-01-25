import { combineReducers } from "redux";
import actions from "../actions/actions";

const userReducer = (state = { auth: false }, action) => {
  if (action.type === actions.AUTHENTICATE_USER) {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  user: userReducer
});

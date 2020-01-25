import actions from "./actions";

export const authenticateUser = user => {
  return {
    type: actions.AUTHENTICATE_USER,
    payload: user
  };
};

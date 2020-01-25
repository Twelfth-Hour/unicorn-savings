import actions from "./actions";

export const authenticateUser = user => {
  return {
    type: actions.AUTHENTICATE_USER,
    payload: user
  };
};

export const setPet = pet => {
  return {
    type: actions.SET_PET,
    payload: pet
  };
};

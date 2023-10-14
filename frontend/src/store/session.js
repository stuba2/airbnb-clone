import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const loginThunk = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } else {
    console.log('wrong: loginThunk')
  }
};

export const restoreUserThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } else {
    console.log('wrong: restoreUserThunk')
  }
};

export const signupThunk = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user
  const response = await csrfFetch('/api/users', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  })

  if (response.ok) {
    const data = await response.json()

    dispatch(setUser(data.user))
    return response
  } else {
    console.log('wrong: signupThunk')
  }
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;

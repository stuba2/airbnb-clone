import { csrfFetch } from "./csrf";
import { ValidationError } from "../utils/validationError";

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
  const { credential, password } = user
  try {
    const response = await csrfFetch(`/api/session`, {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    })


    // if (!response.ok) {
    //   let error;
    //   if (response.status >= 400) {
    //     error = await response.json()
    //     throw new ValidationError(error.errors, response.statusText)
    //   } else {
    //     let errorJSON;
    //     error = await response.text()
    //     try {
    //       errorJSON = JSON.parse(error)
    //     } catch {
    //       throw new Error(error)
    //     }
    //     throw new Error(`${errorJSON.title}: ${errorJSON.message}`)
    //   }
    // }

    const data = await response.json()
    dispatch(setUser(data.user))
    return response
  } catch (error) {
    // const hi = await error.json()
    // console.log('this is the error: ', await error.json())
    // // return await error.json()
    // // return hi
    return error
  }


  // const { credential, password } = user;
  // const response = await csrfFetch("/api/session", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     credential,
  //     password,
  //   }),
  // });

  // if (response.ok) {
  //   const data = await response.json();
  //   dispatch(setUser(data.user));
  //   return data;
  // } else {
  //   console.log('wrong: loginThunk')
  //   return Error(response)
  // }
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

export const logoutThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: "DELETE"
  })

  if (response.ok) {
    dispatch(removeUser())
    return response
  } else {
    console.log('wrong: logoutThunk')
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

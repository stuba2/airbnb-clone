import { csrfFetch } from "./csrf";
import { ValidationError } from "../utils/validationError";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  console.log('in setUser action: payload (user): ', user)
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
  console.log('inside loginThunk')
  const { credential, password } = user
  console.log('loginThunk: credential and typeof credential: ', credential, typeof credential)
  console.log('loginThunk: password and typeof password: ', password, typeof password)

  try {
    const response = await csrfFetch(`/api/session`, {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    })

    console.log('in loginThunk try block')
    console.log('loginThunk try: response: ', response)


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
    console.log('loginThunk try: data: ', data)
    dispatch(setUser(data.user))
    return response
  } catch (error) {
    // const hi = await error.json()
    // // return await error.json()
    // // return hi
    console.log('loginThunk catch: error: ', error)
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
  console.log('inside signupThunk')
  const { username, firstName, lastName, email, password } = user
  console.log('signupThunk: username and typeof username: ', username, typeof username)
  console.log('signupThunk: firstName and typeof firstName: ', firstName, typeof firstName)
  console.log('signupThunk: lastName and typeof lastName: ', lastName, typeof lastName)
  console.log('signupThunk: email and typeof email: ', email, typeof email)
  console.log('signupThunk: password and typeof password: ', password, typeof password)
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
  console.log('signupThunk: response: ', response)


  if (response.ok) {
    console.log('inside signupThunk if (response.ok) block')
    const data = await response.json()
    console.log('signupThunk if block: data: ', data)
    console.log('signupThunk if block: data.user: ', data.user)

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
      console.log('sessionReducer: SET_USER: newState before anything: ', newState)
      newState = Object.assign({}, state);
      console.log('sessionReducer: SET_USER: newState after assigning, before reassigning: ', newState)
      newState.user = action.payload;
      console.log('sessionReducer: SET_USER: newState after reassigning: ', newState)
      console.log('sessionReducer: SET_USER: newState.user after reassigning: ', newState.user)
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

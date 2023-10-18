import { csrfFetch } from "./csrf"

const GET_SPOTS = "spots/get"
const GET_SPOT = "spot/get"
const FIND_OWNER = "spot/get/owner"

const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    payload: spots
  }
}

const getASpot = (spot) => {
  return {
    type: GET_SPOT,
    payload: spot
  }
}

const findOwner = (data) => {
  // console.log('-------', data)
  return {
    type: FIND_OWNER,
    payload: data
  }
}

export const getSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots")

  if (response.ok) {
    const data = await response.json()
    dispatch(getSpots(data))
    return data
  } else {
    console.log('wrong: getSpotsThunk')
  }
}

export const getASpotThunk = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.id}`)

  if (response.ok) {
    const data = await response.json()
    console.log('this is data: ', data)
    dispatch(getASpot(data))
    return data
  } else {
    console.log('wrong: getASpotThunk')
  }
}

export const getOwnerDeetsThunk = (id) => async (dispatch) => {
  // console.log('hey its id' ,id)
const response = await csrfFetch(`/api/spots/${id}`)

if (response.ok) {
  const data = await response.json()
  dispatch(findOwner(data))
  return data
} else {
  console.log('wrong: getOwnerDeetsThunk')
}
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = {...state}
      const getArr = action.payload.Spots
      getArr.map((spotObj) => newState[spotObj.id] = spotObj)
      return newState
    case FIND_OWNER:
      newState = {...state}
      const spotObj = action.payload
      newState[spotObj.id] = spotObj
      return newState
    default:
      return state
  }
}

export default spotReducer

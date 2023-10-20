import { csrfFetch } from "./csrf"

const GET_SPOTS = "spots/get"
const GET_SPOT = "spot/get"
const FIND_OWNER = "spot/get/owner"
const POST_SPOT = "spot/post"
const ADD_IMAGE = "spot/post/image"
const OWNED_SPOTS = "spot/get/owned"

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

const createASpot = (spot) => {
  return {
    type: POST_SPOT,
    payload: spot
  }
}

const addImage = (data) => {
  return {
    type: ADD_IMAGE,
    payload: data
  }
}

const getOwnedSpots = (data) => {
  return {
    type: OWNED_SPOTS,
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
    dispatch(getASpot(data))
    return data
  } else {
    console.log('wrong: getASpotThunk')
  }
}

export const getOwnerDeetsThunk = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}`)

  if (response.ok) {
    const data = await response.json()
    dispatch(findOwner(data))
    return data
  } else {
    console.log('wrong: getOwnerDeetsThunk')
  }
}

export const createSpotThunk = (spotForm) => async (dispatch) => {
  const newSpot = await csrfFetch('/api/spots/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(spotForm)
  })

  if (newSpot.ok) {
    const createdSpot = await newSpot.json()
    dispatch(createASpot(createdSpot))
    return createdSpot
  } else {
    console.log('wrong: createSpotThunk')
  }
}

export const addImageThunk = (newSpotId, imageObj) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${+newSpotId}/images/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(imageObj)
  })

  const updatedSpot = await csrfFetch(`/api/spots/${+newSpotId}/`)

  if (response.ok && updatedSpot.ok) {
    const spotUpdate = await updatedSpot.json()
    dispatch(addImage(spotUpdate))
    return spotUpdate
  } else {
    console.log('wrong: addImageThunk')
  }
}

export const getOwnedSpotsThunk = (ownerId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/user`)

  if (response.ok) {
    const ownedSpots = response.json()
    dispatch(getOwnedSpots(ownedSpots))
    return ownedSpots
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
    case POST_SPOT:
      newState = {...state}
      const newSpot = action.payload
      newState[newSpot.id] = newSpot
      return newState
    case ADD_IMAGE:
      newState = {...state}
      const imgData = action.payload
      newState[imgData.id] = imgData
      return newState
    case OWNED_SPOTS:

    default:
      return state
  }
}

export default spotReducer

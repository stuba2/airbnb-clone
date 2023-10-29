import { csrfFetch } from "./csrf"

const GET_SPOTS = "spots/get"
const GET_SPOT = "spot/get"
const FIND_OWNER = "spot/get/owner"
const POST_SPOT = "spot/post"
const ADD_IMAGE = "spot/post/image"
const OWNED_SPOTS = "spot/get/owned"
const EDIT_SPOT = "spot/edit"
const DELETE_SPOT = "spot/delete"

const getSpots = (spots) => {
  console.log('getSpots action: payload (spots): ', spots)
  return {
    type: GET_SPOTS,
    payload: spots
  }
}

const getASpot = (spot) => {
  console.log('getASpot action: payload (spot): ', spot)
  return {
    type: GET_SPOT,
    payload: spot
  }
}

const findOwner = (data) => {
  console.log('findOwner action: payload (data): ', data)
  return {
    type: FIND_OWNER,
    payload: data
  }
}

const createASpot = (spot) => {
  console.log('createASpot action: payload (spot): ', spot)
  return {
    type: POST_SPOT,
    payload: spot
  }
}

const addImage = (data) => {
  console.log('addImage action: payload (data): ', data)
  return {
    type: ADD_IMAGE,
    payload: data
  }
}

const getOwnedSpots = (data) => {
  console.log('getOwnedSpots action: payload (data): ', data)
  return {
    type: OWNED_SPOTS,
    payload: data
  }
}

const editSpot = (data) => {
  return {
    type: EDIT_SPOT,
    payload: data
  }
}

const deleteSpot = (data) => {
  return {
    type: DELETE_SPOT,
    payload: data
  }
}

export const getSpotsThunk = () => async (dispatch) => {
  console.log('in getSpotsThunk')
  const response = await csrfFetch("/api/spots")
  console.log('getSpotsThunk: response: ', response)

  if (response.ok) {
    console.log('in getSpotsThunk if (response.ok) block')
    const data = await response.json()
    console.log('getSpotsThunk if block: data: ', data)
    dispatch(getSpots(data))
    return data
  } else {
    console.log('wrong: getSpotsThunk')
  }
}

export const getASpotThunk = (spot) => async (dispatch) => {
  console.log('in getASpotThunk')
  console.log('getASpotThunk: passed in spot and typeof: ', spot, typeof spot)
  const response = await csrfFetch(`/api/spots/${spot.id}`)
  console.log('getASpotThunk: response: ', response)

  if (response.ok) {
    console.log('in getASpotThunk if (response.ok) block')
    const data = await response.json()
    console.log('getASpotThunk if block: data: ', data)
    dispatch(getASpot(data))
    return data
  } else {
    console.log('wrong: getASpotThunk')
  }
}

export const getSpotDeetsThunk = (id) => async (dispatch) => {
  console.log('in getSpotDeetsThunk')
  console.log('getSpotDeetsThunk: passed in id and typeof: ', id, typeof id)
  const response = await csrfFetch(`/api/spots/${id}`)
  console.log('getSpotDeetsThunk: response: ', response)

  if (response.ok) {
    console.log('in getSpotDeetsThunk if (response.ok) block: ')
    const data = await response.json()
    console.log('getSpotDeetsThunk if block: data: ', data)
    dispatch(findOwner(data))
    return data
  } else {
    console.log('wrong: getSpotDeetsThunk')
  }
}

export const createSpotThunk = (spotForm) => async (dispatch) => {
  console.log('in createSpotThunk')
  console.log('createSpotThunk: passed in spotForm and typeof: ', spotForm, typeof spotForm)
  try {
    console.log('in createSpotThunk try block')
    const newSpot = await csrfFetch('/api/spots/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(spotForm)
    })
    console.log('createSpotThunk: newSpot: ', newSpot)
    // console.log('createSpotThunk: newSpot.json(): ', await newSpot.json())

    if (newSpot.ok) {
      const createdSpot = await newSpot.json()
      console.log('newSpot is ok!')
      console.log('createSpotThunk: createdSpot: ', createdSpot)
      dispatch(createASpot(createdSpot))
      return createdSpot
    }

    if (!newSpot.ok) {
      console.log('newSpot is not ok and neither am i')
      return newSpot
    }

  } catch (error) {
    console.log('in createSpotThunk catch block')
    console.log('createSpotThunk: error: ', error)
    // console.log('createSpotThunk: error.json(): ', await error.json())
    return error
  }

  // } else {
  //   console.log('wrong: createSpotThunk')
  // }
}

export const addImageThunk = (newSpotId, imageObj) => async (dispatch) => {
  console.log('in addImageThunk')
  console.log('addImageThunk: passed in newSpotId and typeof: ', newSpotId, typeof newSpotId)
  console.log('addImageThunk: passed in +newSpotId and typeof: ', +newSpotId, typeof +newSpotId)
  console.log('addImageThunk: passed in imageObj and typeof: ', imageObj, typeof imageObj)
  const response = await csrfFetch(`/api/spots/${+newSpotId}/images/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(imageObj)
  })
  console.log('addImageThunk: response: ', response)

  const updatedSpot = await csrfFetch(`/api/spots/${+newSpotId}/`)
  console.log('addImageThunk: updatedSpot: ', updatedSpot)

  if (response.ok && updatedSpot.ok) {
    console.log('addImageThunk if (response.ok && updatedSpot.ok) block')
    const spotUpdate = await updatedSpot.json()
    console.log('addImageThunk: spotUpdate: ', spotUpdate)
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

export const editASpotThunk = (spotForm, spotId) => async (dispatch) => {
  console.log('in editASpotThunk')
  console.log('editASpotThunk: passed in spotForm and typeof: ', spotForm, typeof spotForm)
  console.log('editASpotThunk: passed in spotId and typeof: ', spotId, typeof spotId)
  console.log('editASpotThunk: passed in +spotId and typeof: ', +spotId, typeof +spotId)
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(spotForm)
  })
  console.log('editASpotThunk: response (uninvoked): ', response)

  const secondResponse = await csrfFetch(`/api/spots/${spotId}`)
  console.log('editASpotThunk: secondResponse: ', secondResponse)

  if (secondResponse.ok) {
    console.log('editASpotThunk if (secondResponse.ok) block')
    const updatedSpot = await secondResponse.json()
    console.log('editASpotThunk if block: updatedSpot: ', updatedSpot)
    dispatch(findOwner(updatedSpot))
    return updatedSpot
  } else {
    console.log('wrong: editASpotThunk')
  }
}

export const deleteASpotThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const deletedSpot = await response.json()
    dispatch(deleteSpot(spotId))
    return deletedSpot
  }
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_SPOTS:
      newState = {...state}
      console.log('spotReducer GET_SPOTS: previous state: ', newState)
      const getArr = action.payload.Spots
      console.log('spotReducer GET_SPOTS: action (action.payload.Spots) getArr: ', getArr)
      getArr.map((spotObj) => newState[spotObj.id] = spotObj)
      console.log('spotReducer GET_SPOTS: new state: ', newState)
      return newState
    case FIND_OWNER:
      newState = {...state}
      const spotObj = action.payload
      newState[spotObj.id] = spotObj
      return newState
    case POST_SPOT:
      newState = {...state}
      console.log('spotReducer POST_SPOT: previous state: ', newState)
      const newSpot = action.payload
      console.log('spotReducer POST_SPOT: action (action.payload) newSpot: ', newSpot)
      newState[newSpot.id] = newSpot
      console.log('spotReducer POST_SPOT: new state: ', newState)
      return newState
    case ADD_IMAGE:
      newState = {...state}
      console.log('spotReducer ADD_IMAGE: previous state: ', newState)
      const imgData = action.payload
      console.log('spotReducer ADD_IMAGE: action (action.payload) imgData: ', imgData)
      newState[imgData.id] = imgData
      console.log('spotReducer ADD_IMAGE: new state: ', newState)
      return newState
    case EDIT_SPOT:
      newState = {...state}
      console.log('spotReducer ADD_IMAGE: previous state: ', newState)
      const spot = action.payload
      console.log('spotReducer ADD_IMAGE: action (action.payload) spot: ', spot)
      newState[spot.id] = spot
      console.log('spotReducer ADD_IMAGE: new state: ', newState)
      return newState
    case DELETE_SPOT:
      newState = {...state}
      const spotId = action.payload
      delete newState[spotId]
      return newState
    case OWNED_SPOTS:

    default:
      return state
  }
}

export default spotReducer

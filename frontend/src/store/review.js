import { csrfFetch } from "./csrf";

const GET_REVIEWS = "reviews/get"

const getReviews = (spot) => {
  return {
    type: GET_REVIEWS,
    payload: spot
  }
}

export const getReviewsThunk = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}/reviews`)

  if (response.ok) {
    const data = await response.json()
    dispatch(getReviews(data))
    return data
  } else {
    console.log('wrong: getReviewsThunk')
  }
}

const initialState = {}

const reviewReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case GET_REVIEWS:
      newState = {...state}
      const getArr = action.payload.Reviews
      getArr.map((spotObj) => newState[spotObj.id] = spotObj)
      return newState
    default:
      return state
  }
}

export default reviewReducer

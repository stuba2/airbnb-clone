import { csrfFetch } from "./csrf";
import { ValidationError } from '../utils/validationError'

const GET_REVIEWS = "reviews/get"
const POST_REVIEW = "reviews/post"

const getReviews = (spot) => {
  return {
    type: GET_REVIEWS,
    payload: spot
  }
}

const postReview = (review) => {
  return {
    type: POST_REVIEW,
    payload: review
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

export const createReviewThunk = (spotId, reviewForm) => async (dispatch) => {
console.log('before try block')
  try {
console.log('first in try block')
console.log('spotId: ', spotId)
console.log('reviewForm: ', reviewForm)
    const response = await csrfFetch(`/api/spots/${+spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewForm)
    })
console.log('after fetch in try block')

    // if (response.ok) {
      //   const createdReview = await response.json()
  //   dispatch(postReview(createdReview))
  //   return createdReview
  // } else {
    //   console.log('wrong: createReviewThunk')
    // }

    if (!response.ok) {
console.log('response is not ok')
      let error
      if (response.status === 422) {
console.log('response is 422')
        error = await response.json();
        throw new ValidationError(error.errors, response.statusText);
      } else {
console.log('response is NOT 422')
        let errorJSON;
        error = await response.text();
        try {
console.log('error is JSON?')
          // Check if the error is JSON, i.e., from the Pokemon server. If so,
          // don't throw error yet or it will be caught by the following catch
          errorJSON = JSON.parse(error);
        } catch {
console.log('server couldn"t be reached?')
          // Case if server could not be reached
          throw new Error(error);
        }
console.log('honestly idk')
        throw new Error(`${errorJSON.title}: ${errorJSON.message}`);
      }
    }
console.log('before sending to action creator')
    const createdReview = await response.json()
    dispatch(postReview(createdReview))
console.log('after sending to action and dispatching to reducer')
    return createdReview

  } catch (error) {
console.log('last catch')
console.log(error)
    throw error
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
    case POST_REVIEW:
      newState = {...state}
      const newReview = action.payload
      newState[newReview.id] = newReview
    default:
      return state
  }
}

export default reviewReducer

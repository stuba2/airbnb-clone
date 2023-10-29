import { csrfFetch } from "./csrf";
import { ValidationError } from '../utils/validationError'

const GET_REVIEWS = "reviews/get"
const POST_REVIEW = "reviews/post"
const DELETE_REVIEW = "reviews/delete"

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

const deleteAReview = (data) => {
  return {
    type: DELETE_REVIEW,
    payload: data
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
//   try {
    const response = await csrfFetch(`/api/spots/${+spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewForm)
    })

    if (response.ok) {
        const createdReview = await response.json()
    dispatch(postReview(createdReview))
    return createdReview
  } else {
      console.log('wrong: createReviewThunk')
    }

//     if (!response.ok) {
//       let error
//       if (response.status === 422) {
//         error = await response.json();
//         throw new ValidationError(error.errors, response.statusText);
//       } else {
//         let errorJSON;
//         error = await response.text();
//         try {
//           // Check if the error is JSON, i.e., from the Pokemon server. If so,
//           // don't throw error yet or it will be caught by the following catch
//           errorJSON = JSON.parse(error);
//         } catch {
//           // Case if server could not be reached
//           throw new Error(error);
//         }
//         throw new Error(`${errorJSON.title}: ${errorJSON.message}`);
//       }
//     }
//     const createdReview = await response.json()
//     dispatch(postReview(createdReview))
//     return createdReview

//   } catch (error) {
// console.log(error)
//     throw error
//   }
}

export const deleteAReviewThunk = (spotId, reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews/${reviewId}`, {
    method: "DELETE"
  })

  if (response.ok) {
    const rezzy = await response.json()
    const data = { spotId, reviewId}
    dispatch(deleteAReview(reviewId))
    return rezzy
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
      return newState
    case DELETE_REVIEW:
      newState = {...state}
      const reviewId = action.payload
      delete newState[reviewId]
      return newState
    default:
      return state
  }
}

export default reviewReducer

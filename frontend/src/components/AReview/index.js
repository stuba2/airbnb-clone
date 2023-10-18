import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/review'
import { useParams } from "react-router-dom";

const AReview = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const reviews = useSelector(state => {
    return state.reviews
  })

  let reviewsArrVals = Object.values(reviews)

  console.log('this is reviews: ', reviews)

  useEffect(() => {
    dispatch(reviewActions.getReviewsThunk(+spotId))
  }, [dispatch])


  if (!reviews) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <div>
        {reviewsArrVals.map((review) => {
          return (
            <div>
              <h5>{review.User.firstName}</h5>
              <h6>{review.createdAt}</h6> {/* Format these */}
              <p>{review.review}</p>
            </div>
          )
        })}
      </div>
      )
    }
}

export default AReview
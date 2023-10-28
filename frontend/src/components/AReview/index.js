import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as reviewActions from '../../store/review'
import { useParams } from "react-router-dom";
import './AReview.css'
import OpenModalButton from "../OpenModalButton";
import DeleteAReview from "../DeleteAReview";

const AReview = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const reviews = useSelector(state => {
    return state.reviews
  })
  const session = useSelector(state => {
    return state.session
  })

  let reviewsArrVals = Object.values(reviews)
  let purgedReviews = reviewsArrVals.filter((review) =>
    review.spotId === +spotId
  )
  let reversedPurgedReviews = purgedReviews.slice().reverse()


  useEffect(() => {
    dispatch(reviewActions.getReviewsThunk(+spotId))
  }, [dispatch])

  let deleteButtonClass



  if (!reviews) {
    return (
      <div>...loading</div>
      )
    } else {
      return (
        <div>
        {reversedPurgedReviews.map((review) => {
        let date = new Date(review.createdAt).toDateString()
        let dateMonth = date.split(' ')[1]
        let dateYear = date.split(' ')[3]
        if (review.userId === session.user.id) {
          deleteButtonClass = "review-delete"
        }
        else {
          deleteButtonClass = "review-delete-hide"
        }
          return (
            <div
              key={review.id}
              className="whole-review"
            >
              <div className="review-name">{review && review.User && review.User.firstName}</div>
              <div className="review-date">{dateMonth} {dateYear}</div> {/* Format these */}
              <p className="review-review">{review.review}</p>
              <div className={deleteButtonClass}>
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteAReview spotId={spotId} reviewId={review.id}
                   />}
                />
              </div>
            </div>
          )
        })}
      </div>
      )
    }
}

export default AReview

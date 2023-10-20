import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { useParams } from "react-router-dom"
import AReview from "../AReview"
import './ASpot.css'
import PostAReview from "../PostAReview/PostAReview"
import OpenModalButton from "../OpenModalButton"

const ASpot = () => {
  const dispatch = useDispatch()
  const { spotId } = useParams()
  const spots = useSelector(state => {
    return state.spots
  })
  const spot = spots[+spotId]


  // useEffect(() => {
    // dispatch(spotActions.getSpotsThunk(spots))
  // }, [dispatch])

  useEffect(() => {
    dispatch(spotActions.getOwnerDeetsThunk(spotId))
  }, [dispatch])

  if (!spot || !spot.Owner) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <div className="whole-thing-a-spot">
        <div className="above-image-info">
          <h1>{spot.name}</h1>
          <h3>{spot.city}, {spot.state}, {spot.country}</h3>
        </div>

        <div className="images">
          <div className="big-pic">
            Preview Image
          </div>
          <div className="small-pics">
            <div className="small-pic-2">Optional Image</div>
            <div className="small-pic-3">Optional Image</div>
            <div className="small-pic-4">Optional Image</div>
            <div className="small-pic-5">Optional Image</div>
          </div>
        </div> {/* Create component for this? */}

        <div className="under-image-info">
          <div className="description-owner-area">
            <div className="owner-info">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
            <p className="spot-description">{spot.description}</p>
          </div>
          <div className="reserve-button-area">
            <div className="spot-price">${spot.price} night</div>
            <div className="reserve-rating-reviews"><i className="fa-solid fa-star"></i> {spot.avgStarRating} · {spot.numReviews} reviews</div>
            <button className="reserve-button">Reserve</button>
          </div>
        </div>

        <div>
          <div className="lower-review"><i className="fa-solid fa-star"></i> {spot.avgStarRating} · {spot.numReviews} reviews</div>
          <div className="review-modal">
            <OpenModalButton
              buttonText={'Post Your Review'}
              modalComponent={<PostAReview spotId={spotId}/>}
            />
          </div>
          <div className="reviews-area"><AReview /></div>
        </div>
      </div>
      )
  }
}

export default ASpot

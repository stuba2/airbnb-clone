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
  const image1 = spot ? (spot.SpotImages ? (spot.SpotImages[0] ? spot.SpotImages[0].url : "No Image Found") : "No Image Found") : "No Image Found"
  const image2 = spot ? (spot.SpotImages ? (spot.SpotImages[1] ? spot.SpotImages[1].url : "No Image Found") : "No Image Found") : "No Image Found"
  const image3 = spot ? (spot.SpotImages ? (spot.SpotImages[2] ? spot.SpotImages[2].url : "No Image Found") : "No Image Found") : "No Image Found"
  const image4 = spot ? (spot.SpotImages ? (spot.SpotImages[3] ? spot.SpotImages[3].url : "No Image Found") : "No Image Found") : "No Image Found"
  const image5 = spot ? (spot.SpotImages ? (spot.SpotImages[4] ? spot.SpotImages[4].url : "No Image Found") : "No Image Found") : "No Image Found"


  // useEffect(() => {
    // dispatch(spotActions.getSpotsThunk(spots))
  // }, [dispatch])

  useEffect(() => {
    dispatch(spotActions.getSpotDeetsThunk(spotId))
  }, [dispatch])

  const hasPreviewImg = (spot) => {
    const SpotImages = spot.SpotImages
    if (SpotImages) {
      const imgPreview = SpotImages.find((image) => image.previewImage === true)
      if (imgPreview) {
        return imgPreview.url
      } else return 'No Image Found'
    }
  }

  let avgStar
  const star = <i className="fa-solid fa-star"></i>
  if (!spot.avgStarRating && typeof spot.avgStarRating !== "number") {
    avgStar = "New"
  } else if (spot.avgStarRating && typeof spot.avgStarRating === "number") {
    const rating = (+spot.avgStarRating).toFixed(1)
    avgStar = <div>{star} {rating}</div>
  }

  let reviewNum
  if (spot.numReviews === 1) reviewNum = "Review"
  else reviewNum = "Reviews"

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
            {hasPreviewImg(spot)}
          </div>
          <div className="small-pics">
            <div className="small-pic-2">{image2}</div>
            <div className="small-pic-3">{image3}</div>
            <div className="small-pic-4">{image4}</div>
            <div className="small-pic-5">{image5}</div>
          </div>
        </div> {/* Create component for this? */}

        <div className="under-image-info">
          <div className="description-owner-area">
            <div className="owner-info">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
            <p className="spot-description">{spot.description}</p>
          </div>
          <div className="reserve-button-area">
            <div className="spot-price">${spot.price} night</div>
            <div className="reserve-rating-reviews">{avgStar} · {spot.numReviews} {reviewNum}</div>
            <button className="reserve-button">Reserve</button>
          </div>
        </div>

        <div>
          <div className="lower-review">
            {avgStar} · {spot.numReviews} {reviewNum}
          </div>
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

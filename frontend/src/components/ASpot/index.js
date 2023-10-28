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
  const session = useSelector(state => {
    return state.session
  })
  const reviews = useSelector(state => {
    return state.reviews
  })
  const spot = spots[+spotId]
  
  const image1 = <img src='https://source.unsplash.com/random/700x700/?house' style={{height: '350px'}}/>
  const image2 = <img src='https://source.unsplash.com/random/600x600/?house' style={{height: '175px'}} />
  const image3 = <img src='https://source.unsplash.com/random/500x500/?house' style={{height: '175px'}} />
  const image4 = <img src='https://source.unsplash.com/random/400x400/?house' style={{height: '175px'}} />
  const image5 = <img src='https://source.unsplash.com/random/300x300/?house' style={{height: '175px'}} />


  useEffect(() => {
    dispatch(spotActions.getSpotsThunk())
  }, [dispatch])


  // const hasPreviewImg = (spot) => {
  //   const SpotImages = spot.SpotImages
  //   if (SpotImages) {
  //     const imgPreview = SpotImages.find((image) => image.previewImage === true)
  //     if (imgPreview) {
  //       return <img src='https://source.unsplash.com/random/?house'/>
  //       return imgPreview.url
  //     } else return 'No Image Found'
  //   }
  // }

  const reserveAlert = () => {
    alert("Feature coming soon!")
  }

  let avgStar
  const star = <i className="fa-solid fa-star"></i>
  if (spot && !spot.avgStarRating && typeof spot.avgStarRating !== "number") {
    avgStar = <div>{star} New</div>
  } else if (spot && spot.avgStarRating && typeof spot.avgStarRating === "number") {
    const rating = (+spot.avgStarRating).toFixed(1)
    avgStar = <div className="avgStar">{star} {rating}</div>
  }

  let reviewNum
  if (spot && spot.numReviews === 1) reviewNum = `· ${spot.numReviews} Review`
  if (spot && spot.numReviews === 0) reviewNum = ""
  else reviewNum = `· ${spot && spot.numReviews} Reviews`

  let reviewButton
  let reviewButtonModalClass
  const reviewsArrVals = Object.values(reviews)
  const filteredReviews = reviewsArrVals.filter(review => review.spotId === +spotId)
  console.log('filter: ', filteredReviews)
  const usersReview = filteredReviews.find(review => review.userId === session.user.id)
  console.log('usersReview: ', usersReview)

  if (!session.user) {
    reviewButtonModalClass = "review-modal hide"
  } else if (spot && session.user.id === spot.Owner.id) {
    reviewButtonModalClass = "review-modal hide"
  } else if (spot && session.user.id !== spot.Owner.id && Object.values(filteredReviews).length  ) {
    reviewButtonModalClass = "review-modal"
    reviewButton = "Post Your Review"
  } else if (spot && session.user.id !== spot.Owner.id && !Object.values(filteredReviews).length !== 0) {
    reviewButtonModalClass= "review-modal"
    reviewButton = "Be the first to post a review!"
  } else if (spot && session.user.id !== spot.Owner.id && Object.values(filteredReviews).length && usersReview && Object.values(usersReview)) {
    reviewButtonModalClass = "review-modal hide"
  }


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
            {image1}
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
            <div className="reserve-rating-reviews">{avgStar} {" "} {reviewNum}</div>
            <button className="reserve-button" onClick={reserveAlert}>Reserve</button>
          </div>
        </div>

        <div>

          <div className="lower-review">
            {avgStar}  {reviewNum}
          </div>

          <div className={reviewButtonModalClass}>
            <OpenModalButton
              buttonText={reviewButton}
              modalComponent={<PostAReview spotId={spotId} />}
            />
          </div>

          <div className="reviews-area"><AReview /></div>
        </div>
      </div>
      )
  }
}

export default ASpot

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { useParams } from "react-router-dom"

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
      <div>
        <h1>{spot.name}</h1>
        <h3>{spot.city}, {spot.state} {spot.country}</h3>
        <div>{spot.previewImage}</div> {/* Create component for this? */}
        <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
        <div>{spot.description}</div>
        <div className="reserve-button-area">
          <div>${spot.price}</div>
          <div>[star] {spot.avgStarRating}</div>
          <div>{spot.numReviews} reviews</div>
          <button>RESERVE</button>
        </div>
        <div>
          <div>[star] {spot.avgStarRating} - {spot.numReviews} reviews</div>
          REVIEWS
        </div>
      </div>
      )
  }
}

export default ASpot

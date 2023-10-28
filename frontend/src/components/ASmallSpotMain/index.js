import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { useParams, NavLink } from "react-router-dom"
import './ASmallSpotMain.css'

const ASmallSpotMain = ({spotId}) => {
  const dispatch = useDispatch()
  // const { spotId } = useParams()
  const spots = useSelector(state => {
    return state.spots
  })
  const spot = spots[+spotId]


  let spotsArrVals = Object.values(spots)

  // useEffect(() => {
  //   dispatch(spotActions.getSpotDeetsThunk(spot.id))
  // }, [dispatch])


  let avgStar
  const star = <i className="fa-solid fa-star"></i>
  if (!spot.avgStarRating && typeof spot.avgStarRating !== "number") {
    avgStar = "New"
  } else if (spot.avgStarRating && typeof spot.avgStarRating === "number") {
    const rating = (+spot.avgStarRating).toFixed(1)
    avgStar = <div>{star} {rating}</div>
  }

  const SpotImages = spot ? spot.SpotImages : []
  let previewImage
  previewImage = SpotImages.find(image => image.previewImage === true)

  const image1 = previewImage ? <img src={previewImage.url} style={{height: '100%', width: '100%'}} /> : <img src='https://source.unsplash.com/random/700x700/?house' style={{height: '100%', width: '100%'}}/>


  if (!spot) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <div className="whole-thing-small-spot">
        <div className="spot-image">
          {image1}
        </div>
        <div className="under-pic">
          <div className="city-state">{spot.city}, {spot.state}</div>
          <div className="rating">{avgStar}</div>
          <div className="price">${spot.price} night</div>
        </div>
      </div>
    )
  }
}

export default ASmallSpotMain

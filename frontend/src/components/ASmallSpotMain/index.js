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

  const hasPreviewImg = (spot) => {
    const SpotImages = spot.SpotImages
    if (SpotImages) {
      const imgPreview = SpotImages.find((image) => image.previewImage === true)
      if (imgPreview) {
        return imgPreview.url
      } else return 'No Image Found'
    }
  }

  if (!spot) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <div className="whole-thing-small-spot">
        <div className="spot-image">
          {hasPreviewImg(spot)}
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

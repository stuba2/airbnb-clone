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

  useEffect(() => {
    dispatch(spotActions.getOwnerDeetsThunk(spot.id))
  }, [dispatch])

  // let truePreviewImg
  // const imgArr = spot.SpotImages
  // if (imgArr) {
  //   imgArr.map((image) => {
  //     if (image.previewImage) {
  //       truePreviewImg = image.url
  //       // return truePreviewImg
  //     }
  //   })
  // } else truePreviewImg = null
  // // console.log('spotId', spotId, 'truePreviewImg: ', truePreviewImg)
  // console.log('---', spot.SpotImages)

  const hasPreviewImg = (spot) => {
    const SpotImages = spot.SpotImages
    if (SpotImages) {
      const what = SpotImages.find((image) => image.previewImage === true)
      if (what) {
        return what.url
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
          <div className="rating"><i className="fa-solid fa-star"></i> {spot.avgStarRating}</div>
          <div className="price">${spot.price} night</div>
        </div>
      </div>
    )
  }
}

export default ASmallSpotMain

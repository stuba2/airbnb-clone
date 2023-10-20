import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { NavLink } from "react-router-dom"

const UserSpots = () => {
  const dispatch = useDispatch()
  const spots = useSelector(state => {
    return state.spots
  })
  const userId = useSelector(state => {
    return state.session.user.id
  })

  let spotsArrVals = Object.values(spots)

  const ownedSpots = spotsArrVals.filter((spot) => {
    return spot.ownerId === userId
  })
  console.log('owned: ', ownedSpots)


  useEffect(() => {
    dispatch(spotActions.getSpotsThunk())
  }, [dispatch]);

  if (!spots) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <div>{ownedSpots.map((spot) => {
        return (
          <NavLink
            to={`/api/spots/${spot.id}`}
            className='spots'
            key={spot.id}>
              <div>({spot.name} {spot.id})</div>
              <div>{spot.previewImage || "null"}</div>
              <div>{spot.city}, {spot.state}</div>
              <div>${spot.price} night</div>
              <div><i className="fa-solid fa-star"></i> {spot.avgRating}</div>
              <br></br>
              <button>update</button>
              <button>delete</button>
          </NavLink>
        )
      })}</div>
    )
  }
}

export default UserSpots

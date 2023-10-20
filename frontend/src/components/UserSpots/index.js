import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { NavLink } from "react-router-dom"
import ASmallSpotMain from "../ASmallSpotMain"
import './UserSpots.css'

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
      <div className="whole-thing-user-spots">
        <h4>Manage Your Spots</h4>
        <button className="manage-create">Create a New Spot</button>
        <div className="who-knows">
          {ownedSpots.map((spot) => {
          return (
            <div className="spot-holder">
              <NavLink
                to={`/api/spots/${spot.id}`}
                className='whole-spot-container'
                key={spot.id}>
                  <ASmallSpotMain spotId={spot.id} />
              </NavLink>
              <div className="update-delete-buttons">
                <button className="manage-update">
                    Update
                </button>
                <button className="manage-delete">
                  Delete
                </button>
              </div>
            </div>
          )
        })}
        </div>
      </div>
    )
  }
}

export default UserSpots

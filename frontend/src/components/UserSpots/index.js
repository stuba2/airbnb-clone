import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { NavLink } from "react-router-dom"
import ASmallSpotMain from "../ASmallSpotMain"
import './UserSpots.css'
import OpenModalButton from "../OpenModalButton"
import DeleteASpot from "../DeleteASpot"

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
        <div className="manage-header">
          <h4>Manage Spots</h4>
          <NavLink to={`/spots/new`}><button className="manage-create">Create a New Spot</button></NavLink>
        </div>
        <div className="who-knows">
          {ownedSpots.map((spot) => {
          return (
            <div className="spot-holder">
              <NavLink
                to={`/spots/${spot.id}`}
                className='whole-spot-container'
                key={spot.id}
                title={spot.name}>
                  <ASmallSpotMain spotId={spot.id} />
              </NavLink>
              <div className="update-delete-buttons">
                <NavLink to={`/spots/${spot.id}/edit`}>
                  <button className="manage-update">
                      Update
                  </button>
                </NavLink>
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteASpot spotId={spot.id}/>}
                />
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

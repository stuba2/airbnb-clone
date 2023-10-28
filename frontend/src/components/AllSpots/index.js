import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import * as spotActions from '../../store/spot'
import { useDispatch, useSelector } from "react-redux";
import "./AllSpots.css"
import ASpot from "../ASpot";
import ASmallSpotMain from "../ASmallSpotMain";

const AllSpots = () =>{
  const dispatch = useDispatch();
  const spots = useSelector(state => {
    return state.spots
  });

  let spotsArrVals = Object.values(spots)

  useEffect(() => {
    dispatch(spotActions.getSpotsThunk())
  }, [dispatch]);


  if (!spots) {
    return (
      <div>...loading</div>
    )
  } else {
    return (
      <div className="front-page-spots">
        {spotsArrVals.map((spot) => {
          return (
            <NavLink
              to={`/api/spots/${spot.id}`}
              className="spots"
              key={spot.id}
              title={spot.name}>
                <ASmallSpotMain spotId={spot.id}/>
            </NavLink>
          )
        })}
      </div>
    )
  }
}

export default AllSpots

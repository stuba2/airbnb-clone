import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const dispatch = useDispatch()

  // const loggedInUser = () => {
  //   if (sessionUser.user) setIsLoggedIn(true)
  // }

let newSpotClass
  if (!sessionUser) {
    newSpotClass = "create-spot logged-out"
  } else {
    newSpotClass = "create-spot"
  }

  // const newSpotClass = "create-spot" + (isLoggedIn ? "" : " logged-out")

  return (
    <div className='nav-bar'>
      <div className='nav-left'>
        <div className='home-logo'>
          <NavLink exact to="/"><img src={require('../../images/heirbnb-logo.png')} style={{ height: '30%', width: '30%' }}  /></NavLink>
        </div>
      </div>
      <div className='nav-right'>
        <div className={newSpotClass}>
          <NavLink to="/api/spots/new">
            Create a New Spot
          </NavLink>
        </div>
        {isLoaded && (
          <div className='profile-button'>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    </div>
  )
}


export default Navigation

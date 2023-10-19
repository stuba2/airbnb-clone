import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
// import OpenModalButton from '../OpenModalButton';
// import LoginFormModal from '../LoginFormModal';
// import SignupFormModal from '../signupFormModal';
// import * as sessionActions from '../../store/session';
import './Navigation.css';

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch()

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logoutThunk());
  // };

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //       <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }

  return (
    <div className='nav-bar'>
      <div className='nav-left'>
        <div className='home-logo'>
          <NavLink exact to="/"><img src={require('../../images/heirbnb-logo.png')}  /></NavLink>
        </div>
      </div>
      <div className='nav-right'>
        <div className='create-spot'>
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

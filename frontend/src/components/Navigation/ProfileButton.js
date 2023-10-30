import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css'
import { NavLink, useHistory } from "react-router-dom";

const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => {
    setShowMenu(false)
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutThunk());
    closeMenu()
    history.push(`/`)
  };


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button
        onClick={openMenu}
        className="whole-button"
      >
        <i className="fa-solid fa-bars profile-button-img"></i>
        <i className="fas fa-user-circle profile-button-img" />
      </button>
      {user ? (
  <ul className={`${ulClassName} logged-in-user-menu`} ref={ulRef}>
    <li className="first-last">Hello, {user.firstName}</li>
      <li className="email">{user.email}</li>
      <NavLink to='/spots/current'
        className="manage-spots"
        onClick={closeMenu}>
          Manage Spots
      </NavLink>
    <li className="logout">
      <button  onClick={logout}>Log Out</button>
    </li>
  </ul>
) : (
  <ul className={`${ulClassName} logged-out-user-menu`} ref={ulRef}>
    <li className="login-menu-option">
      <OpenModalMenuItem
        itemText="Log In"
        onItemClick={closeMenu}
        modalComponent={<LoginFormModal />}
      />
    </li>
    <li className="signup-menu-option">
      <OpenModalMenuItem
        itemText="Sign Up"
        onItemClick={closeMenu}
        modalComponent={<SignupFormModal />}
      />
    </li>
  </ul>
)}

    </>
  );
}

export default ProfileButton

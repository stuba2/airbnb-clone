import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './LoginForm.css'
import { NavLink } from "react-router-dom";
import { ValidationError } from "../../utils/validationError";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState();
  const [validity, setValidity] = useState(false)
  const { closeModal } = useModal()

  useEffect(() => {
    if (credential.length > 3 && password.length > 5) setValidity(true)
    else setValidity(false)
  }, [credential, password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setErrors({});
    const what = await dispatch(sessionActions.loginThunk({ credential, password }))
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors)
      };
    })

    if (!what.ok) {
      const response = await what.json()
      if (response.message) {
        setErrors(response.message)
      }
    } else closeModal()


  };


  const demoLogIn = (e) => {
    e.preventDefault()
    // setErrors({})
    return dispatch(sessionActions.loginThunk({ credential: 'Demo-lition', password: 'password' }))
    .catch(async (res) => {
      const data = await res.json()
      if (data && data.errors) setErrors(data.errors)
    })
    .then(closeModal)
  }


  const loginButtonClass = "login-button" + (validity ? "" : " disabled");

  return (
    <div className="whole-container-login">

      <div className="login-header-container">
        <h1 className="login-header">Log In</h1>
        <p className="login-errors">{errors ? errors : ""}</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-input-container">
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
            className="login-username-email-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="login-password-input"
          />

          {/* {errors.credential && (
            <p>{errors.credential}</p>
          )} */}

        </div>

        <button type="submit" className={loginButtonClass} disabled={!validity ? true : false}>Log In</button>

        <button className="demo-login" onClick={demoLogIn}>Demo User</button>

      </form>

    </div>
  );
}

export default LoginFormModal

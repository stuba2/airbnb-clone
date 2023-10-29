import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css"

const SignupFormModal = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validity, setValidity] = useState(false)
  const { closeModal } = useModal()

  useEffect(() => {
    if (email && username && firstName && lastName && password && confirmPassword && username.length > 3 && password.length > 5 && confirmPassword.length > 5) setValidity(true)
    else setValidity(false)
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (password === confirmPassword) {
      console.log('signup: in password === confirm password if block, before dispatch')
      console.log('signup: email and typeof email: ', email, typeof email)
      console.log('signup: username and typeof username: ', username, typeof username)
      console.log('signup: firstName and typeof firstName: ', firstName, typeof firstName)
      console.log('signup: lastName and typeof lastName: ', lastName, typeof lastName)
      console.log('signup: password and typeof password: ', password, typeof password)

      setErrors({})
      return dispatch(
        sessionActions.signupThunk({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
      .then(closeModal)
      .catch(async (res) => {
        console.log('signup: in .catch of dispatch')
        const data = await res.json()
        console.log('signup: data: ', data)
        if (data && data.errors) {
          setErrors(data.errors)
        }
      })
    }

    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    })
  }

  const signupButtonClass = "signup-button" + (validity ? "" : " disabled");
  const firstErrorClass = "signup-firstname-error" + (errors.firstName ? "" : " hide")
  const lastErrorClass = "signup-lastname-error" + (errors.lastName ? "" : " hide")
  const emailErrorClass = "signup-email-error" + (errors.email ? "" : " hide")
  const usernameErrorClass = "signup-username-error" + (errors.username ? "" : " hide")
  const passwordErrorClass = "signup-password-error" + (errors.password ? "" : " hide")
  const confirmErrorClass = "signup-confirm-error" + (errors.confirmPassword ? "" : " hide")

  return (
    <div className="whole-container-signup">

      <div className="signup-header-container">
        <h1 className="signup-header">Sign Up</h1>

        <div className="signup-header-errors">
          {errors.firstName && <p className={firstErrorClass}>{errors.firstName}</p>}
          {errors.lastName && <p className={lastErrorClass}>{errors.lastName}</p>}
          {errors.email && <p className={emailErrorClass}>{errors.email}</p>}
          {errors.username && <p className={usernameErrorClass}>{errors.username}</p>}
          {errors.password && <p className={passwordErrorClass}>{errors.password}</p>}
          {errors.confirmPassword && <p className={confirmErrorClass}>{errors.confirmPassword}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="First Name"
          className="signup-firstname-input"
        />


        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Last Name"
          className="signup-lastname-input"
        />


        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="signup-email-input"
        />


        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Username"
          className="signup-username-input"
        />


        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="signup-password-input"
        />


        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm Password"
          className="signup-confirm-input"
        />


        <button type="submit" className={signupButtonClass}>Sign Up</button>
      </form>

    </div>
  )
}

export default SignupFormModal

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
        const data = await res.json()
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

  return (
    <div className="whole-container-signup">

      <div className="signup-header-container">
        <h1 className="signup-header">Sign Up</h1>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="signup-email-input"
        />

        {errors.email && <p>{errors.email}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Username"
          className="signup-username-input"
        />

        {errors.username && <p>{errors.username}</p>}

        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="First Name"
          className="signup-firstname-input"
        />

        {errors.firstName && <p>{errors.firstName}</p>}

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Last Name"
          className="signup-lastname-input"
        />

        {errors.lastName && <p>{errors.lastName}</p>}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="signup-password-input"
        />

        {errors.password && <p>{errors.password}</p>}

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm Password"
          className="signup-confirm-input"
        />

        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <button type="submit" className={signupButtonClass}>Sign Up</button>
      </form>

    </div>
  )
}

export default SignupFormModal

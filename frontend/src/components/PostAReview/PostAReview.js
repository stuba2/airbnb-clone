import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import './PostAReview.css'
import { useEffect, useState } from "react"
import * as reviewActions from '../../store/review'
import { useHistory } from "react-router-dom/"

const PostAReview = ({spotId}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [reviewText, setReviewText] = useState('')
  const [numStars, setNumStars] = useState()
  const [isStar1Clicked, setIsStar1Clicked] = useState(false)
  const [isStar2Clicked, setIsStar2Clicked] = useState(false)
  const [isStar3Clicked, setIsStar3Clicked] = useState(false)
  const [isStar4Clicked, setIsStar4Clicked] = useState(false)
  const [isStar5Clicked, setIsStar5Clicked] = useState(false)
  const [errors, setErrors] = useState({})
  const [validity, setValidity] = useState(false)
  const { closeModal } = useModal()

  useEffect(() => {
    dispatch(reviewActions.getReviewsThunk(+spotId))
  }, [dispatch])

  useEffect(() => {
    if (reviewText.length > 10 && numStars > 0) setValidity(true)
    else setValidity(false)
  }, [reviewText, numStars])

  const handleSubmit = (e) => {
    e.preventDefault()
    // setErrors({})

    const reviewForm = {
      review: reviewText,
      stars: numStars
    }

    let createdReview
    // if no errors block
    dispatch(reviewActions.createReviewThunk(spotId, reviewForm))

    // history.push(`/api/spots/${spotId}`)
    closeModal()
  }




  const star1ClassName = (isStar1Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star2ClassName = (isStar2Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star3ClassName = (isStar3Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star4ClassName = (isStar4Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star5ClassName = (isStar5Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')

  const submitButtonClass = "post-review-button" + (validity ? "" : " disabled")

  return (
    <div className="whole-container-post-review">

      <div className="post-review-header-container">
        <h3 className="post-review-header">How was your stay?</h3>
      </div>

      <form onSubmit={handleSubmit} className="post-review-form">

        <div className="post-review-text-container">
          <textarea
            id="review-text"
            type="text"
            onChange={e => setReviewText(e.target.value)}
            value={reviewText}
            placeholder="Leave your review here..."
            className="post-review-text-box"
          />
        </div>

        <div className="post-review-stars">
          <span className="rate">
            <i
              className={star1ClassName}
              onClick={e => {
                setNumStars(1)
                setIsStar1Clicked(true)
                setIsStar2Clicked(false)
                setIsStar3Clicked(false)
                setIsStar4Clicked(false)
                setIsStar5Clicked(false)
              }}
            />
            <i
              className={star2ClassName}
              onClick={e => {
                setNumStars(2)
                setIsStar1Clicked(true)
                setIsStar2Clicked(true)
                setIsStar3Clicked(false)
                setIsStar4Clicked(false)
                setIsStar5Clicked(false)
              }}
            />
            <i
              className={star3ClassName}
              onClick={e => {
                setNumStars(3)
                setIsStar1Clicked(true)
                setIsStar2Clicked(true)
                setIsStar3Clicked(true)
                setIsStar4Clicked(false)
                setIsStar5Clicked(false)
              }}
            />
            <i
              className={star4ClassName}
              onClick={e => {
                setNumStars(4)
                setIsStar1Clicked(true)
                setIsStar2Clicked(true)
                setIsStar3Clicked(true)
                setIsStar4Clicked(true)
                setIsStar5Clicked(false)
              }}
            />
            <i
              className={star5ClassName}
              onClick={e => {
                setNumStars(5)
                setIsStar1Clicked(true)
                setIsStar2Clicked(true)
                setIsStar3Clicked(true)
                setIsStar4Clicked(true)
                setIsStar5Clicked(true)
              }}
            />
          </span> Stars
        </div>

        <button className={submitButtonClass} disabled={!validity ? true : false}>Submit Your Review</button>

      </form>

    </div>
  )
}

export default PostAReview

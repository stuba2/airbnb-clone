import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import './PostAReview.css'
import { useEffect, useState } from "react"
import * as reviewActions from '../../store/review'
import { useParams } from "react-router-dom/"

const PostAReview = ({spotId}) => {
  const dispatch = useDispatch()
  // const { spotId } = useParams()
  const [reviewText, setReviewText] = useState('')
  const [numStars, setNumStars] = useState()
  const [isStar1Clicked, setIsStar1Clicked] = useState(false)
  const [isStar2Clicked, setIsStar2Clicked] = useState(false)
  const [isStar3Clicked, setIsStar3Clicked] = useState(false)
  const [isStar4Clicked, setIsStar4Clicked] = useState(false)
  const [isStar5Clicked, setIsStar5Clicked] = useState(false)
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()

  const handleSubmit = (e) => {
    e.preventDefault()
    // setErrors({})

    const reviewForm = {
      review: reviewText,
      stars: numStars
    }

    let createdReview
    // if no errors block
    createdReview = dispatch(reviewActions.createReviewThunk(spotId, reviewForm))

    closeModal()

  }




  const star1ClassName = (isStar1Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star2ClassName = (isStar2Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star3ClassName = (isStar3Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star4ClassName = (isStar4Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')
  const star5ClassName = (isStar5Clicked ? 'fa-solid fa-star' : 'fa-regular fa-star')

  return (
    <div className="whole-container">
      <form onSubmit={handleSubmit}>
        <h3>How was your stay?</h3>
        <div className="review-text">
          <textarea
            id="review-text"
            type="text"
            onChange={e => setReviewText(e.target.value)}
            value={reviewText}
            placeholder="Leave your review here..."
            className="review-text-box"
          />
        </div>
        <div className="stars">
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
        <div className="button-container">
          <button>Submit Your Review</button>
        </div>
      </form>

    </div>
  )
}

export default PostAReview

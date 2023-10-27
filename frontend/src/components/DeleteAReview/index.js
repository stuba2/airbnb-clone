import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import * as reviewActions from '../../store/review'
import { useEffect } from "react"
import "./DeleteAReview.css"

const DeleteAReview = ({ spotId, reviewId }) => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  useEffect(() => {
    dispatch(reviewActions.getReviewsThunk(+spotId))
  }, [dispatch])

  const handleDelete = (e) => {
    e.preventDefault()

    dispatch(reviewActions.deleteAReviewThunk(spotId, reviewId))

    closeModal()
  }

  const handleKeep = (e) => {
    closeModal()
  }


  return (
    <div className="whole-container-delete-review">

      <div className="delete-review-header-container">
        <h4 className="delete-review-header">Confirm Delete</h4>
      </div>

      <div className="delete-review-p-body-container">
        <p className="delete-review-p-body">Are you sure you want to delete this review?</p>
      </div>

      <button onClick={handleDelete} className="delete-review-delete-button">Yes (Delete Review)</button>

      <button onClick={handleKeep} className="delete-review-keep-button">No (Keep Review)</button>

    </div>
  )
}

export default DeleteAReview

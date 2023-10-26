import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import * as reviewActions from '../../store/review'
import { useEffect } from "react"

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
    <div>
      <h4>Confirm Delete</h4>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={handleDelete}>Yes (Delete Review)</button>
      <button onClick={handleKeep}>No (Keep Review)</button>
    </div>
  )
}

export default DeleteAReview

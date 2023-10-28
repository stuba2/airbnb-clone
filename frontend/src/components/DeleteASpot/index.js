import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { useHistory } from "react-router-dom"
import * as spotActions from '../../store/spot'
import './DeleteASpot.css'

const DeleteASpot = ({ spotId }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { closeModal } = useModal()

  const handleDelete = (e) => {
    e.preventDefault()

    dispatch(spotActions.deleteASpotThunk(spotId))
    closeModal()
    history.push(`/api/spots/current`)
  }

  const handleKeep = (e) => {
    closeModal()
  }


  return (
    <div className="whole-container-delete-spot">

      <div className="delete-spot-header-container">
        <h4 className="delete-spot-header">Confirm Delete</h4>
      </div>

      <div className="delete-spot-p-body-container">
        <p className="delete-spot-p-body">Are you sure you want to remove this spot?</p>
      </div>

      <button onClick={handleDelete} className="delete-spot-delete-button">Yes (Delete Spot)</button>

      <button onClick={handleKeep} className="delete-spot-keep-button">No (Keep Spot)</button>

    </div>
  )
}

export default DeleteASpot

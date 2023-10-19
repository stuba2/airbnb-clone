import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { useParams } from "react-router-dom"
import './NewSpotForm.css'

const NewSpotForm = () => {
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [livedState, setLivedState] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState()
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [image5, setImage5] = useState('')

  return (
    <div>
      <form className="new-spot-form">
        <h2>Create a new Spot</h2>
        <div className="location">
          <h3>Where's your place located?</h3>
          <h4>Guests will only get your exact address once they booked a reservation</h4>
          <div className="new-spot-country">
            <label htmlFor="country" className="new-spot-label">Country</label>
            <input
              id="country"
              type="text"
              onChange={e => setCountry(e.target.value)}
              value={country}
              placeholder="Country"
            />
          </div>
          <div className="new-spot-address">
            <label htmlFor="address">Street Address</label>
            <input
              id="address"
              type="text"
              onChange={e => setAddress(e.target.value)}
              value={address}
              placeholder="Address"
            />
          </div>
          <div className="city-state">
            <div className="new-spot-city">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                onChange={e => setCity(e.target.value)}
                value={city}
                placeholder="City"
                className="input-city"
              />
            </div>
            <div className="comma">,</div>
            <div className="new-spot-state">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                onChange={e => setLivedState(e.target.value)}
                value={livedState}
                placeholder="STATE"
              />
            </div>
          </div>
        </div>
        <div className="description-div">
          <h3>Describe your place to guests</h3>
          <h4>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</h4>
          <div className="description">
            <label htmlFor="description"></label>
            <textarea
              id="description"
              type="text"
              onChange={e => setDescription(e.target.value)}
              value={description}
              placeholder="Please write at least 30 characters"
              className="description-box"
            />
          </div>
        </div>
        <div className="name-div">
          <h3>Create a title for your spot</h3>
          <h4>Catch guests' attention with a spot title that highlights what makes your place special.</h4>
          <div className="name">
            <label htmlFor="name"></label>
            <input
              id="name"
              type="text"
              onChange={e => setName(e.target.value)}
              value={name}
              placeholder="Name of your spot"
            />
          </div>
        </div>
        <div className="price-div">
          <h3>Set a base price for your spot</h3>
          <h4>Competitive pricing can help your listing stand out and rank higher in search results</h4>
          <div className="price">
            <label htmlFor="price">$</label>
            <input
              id="price"
              type="number"
              onChange={(e => setPrice(e.target.value))}
              value={price}
              placeholder="Price per night (USD)"
              className="price-input"
            />
          </div>
        </div>
          <div className="image-div">
            <h3>Liven up your spot with photos</h3>
            <h4>Submit a link to at least one photo to publish your spot</h4>
            <div>
              <label htmlFor="images"></label>
              <input
                id="image1"
                type="text"
                onChange={e => setImage1(e.target.value)}
                value={image1}
                placeholder="Preview Image URL"
              />
            </div>
          <div>
            <label htmlFor="images"></label>
            <input
              id="image2"
              type="text"
              onChange={e => setImage2(e.target.value)}
              value={image2}
              placeholder="Image URL"
              />
          </div>
          <div>
            <label htmlFor="images"></label>
            <input
              id="image3"
              type="text"
              onChange={e => setImage3(e.target.value)}
              value={image3}
              placeholder="Image URL"
              />
          </div>
          <div>
            <label htmlFor="images"></label>
            <input
              id="image4"
              type="text"
              onChange={e => setImage4(e.target.value)}
              value={image4}
              placeholder="Image URL"
              />
          </div>
          <div>
            <label htmlFor="images"></label>
            <input
              id="image5"
              type="text"
              onChange={e => setImage5(e.target.value)}
              value={image5}
              placeholder="Image URL"
              />
          </div>
        </div>
        <div className="button-div">
          <button>Create Spot</button>
        </div>
      </form>
    </div>
  )
}

export default NewSpotForm

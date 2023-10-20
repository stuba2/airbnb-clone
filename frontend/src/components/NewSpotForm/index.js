import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import * as spotActions from '../../store/spot'
import { useParams } from "react-router-dom"
import './NewSpotForm.css'

const NewSpotForm = () => {
  const dispatch = useDispatch()
  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [livedState, setLivedState] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [image5, setImage5] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  useEffect(() => {
    const errors = {}
    if (!country) errors['country'] = 'Country is required'
    if (!address) errors['address'] = 'Address is required'
    if (!city) errors['city'] = 'City is required'
    if (!livedState) errors['state'] = 'State is required'
    if (isNaN(parseInt(lat))) errors['lat'] = 'Latitude needs to be a number'
    if (!lat) errors['lat'] = 'Latitude is required'
    if (isNaN(parseInt(lng))) errors['lng'] = 'Longitude needs to be a number'
    if (!lng) errors['lng'] = 'Longitude is required'
    if (!description) errors['description'] = 'Description is required'
    if (!description.length < 30) errors['description'] = 'Description must be at least 30 characters'
    if (!name) errors['name'] = 'Name is required'
    if (!name.length > 50) errors['name'] = 'Name must be less than 50 characters'
    if (!(image1.split('.')[image1.split('.').length-1] === 'png' || image1.split('.')[image1.split('.').length-1] === 'jpg' || image1.split('.')[image1.split('.').length-1] === 'jpeg')) errors['image1'] = 'Image URL must end in .png, .jpg, or .jpeg'
    if (!image1) errors['image1'] = 'Preview image is required'
    if (!(image2.split('.')[image2.split('.').length-1] === 'png' || image2.split('.')[image2.split('.').length-1] === 'jpg' || image2.split('.')[image2.split('.').length-1] === 'jpeg')) errors['image2'] = 'Image URL must end in .png, .jpg, or .jpeg'
    if (!(image3.split('.')[image3.split('.').length-1] === 'png' || image3.split('.')[image3.split('.').length-1] === 'jpg' || image3.split('.')[image3.split('.').length-1] === 'jpeg')) errors['image3'] = 'Image URL must end in .png, .jpg, or .jpeg'
    if (!(image4.split('.')[image4.split('.').length-1] === 'png' || image4.split('.')[image4.split('.').length-1] === 'jpg' || image4.split('.')[image4.split('.').length-1] === 'jpeg')) errors['image4'] = 'Image URL must end in .png, .jpg, or .jpeg'
    if (!(image5.split('.')[image5.split('.').length-1] === 'png' || image5.split('.')[image5.split('.').length-1] === 'jpg' || image5.split('.')[image5.split('.').length-1] === 'jpeg')) errors['image5'] = 'Image URL must end in .png, .jpg, or .jpeg'
    setValidationErrors(errors)
  }, [country, address, city, livedState, lat, lng, description, name, price, image1, image2, image3, image4, image5])

  const onSubmit = async (e) => {
    e.preventDefault()

    setHasSubmitted(true)
    // if (Object.values(validationErrors).length) {
      // return alert(`The following errors were found:

      // ${validationErrors.country ? "* " + validationErrors.country : ""}
      // ${validationErrors.address ? "* " + validationErrors.address : ""}
      // ${validationErrors.city ? "* " + validationErrors.city : ""}
      // ${validationErrors.state ? "* " + validationErrors.state : ""}
      // ${validationErrors.lat ? "* " + validationErrors.lat : ""}
      // ${validationErrors.lng ? "* " + validationErrors.lng : ""}
      // ${validationErrors.description ? "* " + validationErrors.description : ""}
      // ${validationErrors.name ? "* " + validationErrors.name : ""}
      // ${validationErrors.price ? "* " + validationErrors.price : ""}
      // ${validationErrors.image1 ? "* " + validationErrors.image1 : ""}
      // ${validationErrors.image2 ? "* " + validationErrors.image2 : ""}
      // ${validationErrors.image3 ? "* " + validationErrors.image3 : ""}
      // ${validationErrors.image4 ? "* " + validationErrors.image4 : ""}
      // ${validationErrors.image5 ? "* " + validationErrors.image5 : ""}
      // `)
    // }

    const spotForm = {
      address,
      city,
      state: livedState,
      country,
      name,
      description,
      price: +price,
      lat,
      lng
    }

    let imageForm1
    let imageForm2
    let imageForm3
    let imageForm4
    let imageForm5

    imageForm1 = {
      url: image1,
      preview: true
    }

    if (image2) {
      imageForm2 = {
        url: image2,
        preview: false
      }
    }
    if (image3) {
      imageForm3 = {
        url: image3,
        preview: false
      }
    }
    if (image4) {
      imageForm4 = {
        url: image4,
        preview: false
      }
    }
    if (image5) {
      imageForm5 = {
        url: image5,
        preview: false
      }
    }

    let createdSpot
    let addedImage1
    let addedImage2
    let addedImage3
    let addedImage4
    let addedImage5

    if (!(Object.values(validationErrors).length)) {
      createdSpot = await dispatch(spotActions.createSpotThunk(spotForm))
      const newSpotId = +createdSpot.id

      addedImage1 = await dispatch(spotActions.addImageThunk(newSpotId, imageForm1))

      if (image2) {
        addedImage2 = await dispatch(spotActions.addImageThunk(newSpotId, imageForm2))
      }

      if (image3) {
        addedImage3 = await dispatch(spotActions.addImageThunk(newSpotId, imageForm3))
      }

      if (image4) {
        addedImage4 = await dispatch(spotActions.addImageThunk(newSpotId, imageForm4))
      }

      if (image5) {
        addedImage5 = await dispatch(spotActions.addImageThunk(newSpotId, imageForm5))
      }

      setAddress('')
      setCity('')
      setLivedState('')
      setLat('')
      setLng('')
      setCountry('')
      setName('')
      setDescription('')
      setPrice(0)
      setImage1('')
      setImage2('')
      setImage3('')
      setImage4('')
      setImage5('')
    }




  }

  return (
    <div>
      <form
        className="new-spot-form"
        onSubmit={onSubmit}
      >
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
            <div className="spot-error">
              {hasSubmitted && validationErrors.country && `* ${validationErrors.country}`}
            </div>
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
            <div className="spot-error">
              {hasSubmitted && validationErrors.address && `* ${validationErrors.address}`}
            </div>
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
              <div className="spot-error">
              {hasSubmitted && validationErrors.city && `* ${validationErrors.city}`}
            </div>
            </div>
            {/* <div className="comma">,</div> */}
            <div className="new-spot-state">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                onChange={e => setLivedState(e.target.value)}
                value={livedState}
                placeholder="STATE"
              />
              <div className="spot-error">
                {hasSubmitted && validationErrors.state && `* ${validationErrors.state}`}
              </div>
            </div>
          </div>
          <div className="lat-lng">
            <div className="latitude">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="lat"
                type="text"
                onChange={e => setLat(e.target.value)}
                value={lat}
                placeholder="Latitude"
              />
              <div className="spot-error">
                {hasSubmitted && validationErrors.lat && `* ${validationErrors.lat}`}
              </div>
            </div>
            <div className="longitude">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="lng"
                type="text"
                onChange={e => setLng(e.target.value)}
                value={lng}
                placeholder="Longitude"
              />
              <div className="spot-error">
                {hasSubmitted && validationErrors.lng && `* ${validationErrors.lng}`}
              </div>
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
            <div className="spot-error">
              {hasSubmitted && validationErrors.description && `* ${validationErrors.description}`}
            </div>
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
            <div className="spot-error">
              {hasSubmitted && validationErrors.name && `* ${validationErrors.name}`}
            </div>
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
            <div className="spot-error">
              {hasSubmitted && validationErrors.price && `* ${validationErrors.price}`}
            </div>
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
              <div className="spot-error">
              {hasSubmitted && validationErrors.image1 && `* ${validationErrors.image1}`}
            </div>
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
              <div className="spot-error">
              {hasSubmitted && validationErrors.image2 && `* ${validationErrors.image2}`}
            </div>
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
              <div className="spot-error">
              {hasSubmitted && validationErrors.image3 && `* ${validationErrors.image3}`}
            </div>
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
              <div className="spot-error">
              {hasSubmitted && validationErrors.image4 && `* ${validationErrors.image4}`}
            </div>
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
              <div className="spot-error">
              {hasSubmitted && validationErrors.image5 && `* ${validationErrors.image5}`}
            </div>
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
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import "./PostRecommendation.css"
import Chip from '@material-ui/core/Chip';
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import Modal from 'react-bootstrap/Modal'
import config from "./config.js"
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { MdLocationOn } from 'react-icons/md'
import Toast from "react-bootstrap/Toast";
import firebase from "firebase/app";
import { useHistory } from "react-router-dom";
import Compressor from 'compressorjs';
import "firebase/storage";
import {
  IfFirebaseAuthed,
} from "@react-firebase/auth";

export default function PostRecommendation(){
	const [dishes, setDishes] = useState([]);
	const [dishName, setDishName] = useState("");
	const [images, setImages] = useState([]);
	const [show, setShow] = useState(false);
	const [location, setLocation] = useState(null);
	const [validationError, setValidationError] = useState(null);
	const [review, setReviewChange] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const history = useHistory();
	const [imageFiles, setImageFiles] = useState([]);

	firebase.auth().onAuthStateChanged((user) => {
	  if (!user){
	  	history.push('/login')
	  }
	});

	function handleAddDish(e){
		let dishesCopy = JSON.parse(JSON.stringify(dishes)).concat(dishName.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))));
		setDishes(dishesCopy)
	}

	function handleDishNameChange(e){
		setDishName(e.target.value)
	}

	function handlePhotosChange(e){
		setImages(
			Array.from(e.target.files).map(file => {
				return {
					original: URL.createObjectURL(file)
				}
			})
		)
		setImageFiles(Array.from(e.target.files))
	}

	function handleReviewChange(e){
		setReviewChange(e.target.value)
	}

	function handleSubmit(e){
		setIsSubmitting(true)
		if(!location){
			setValidationError("One restaurant must be chosen for your recommendation.")
			setIsSubmitting(false)
			return

		}

		if(dishes.length < 1){
			setValidationError("At least one dish must be added to the recommendation")
			setIsSubmitting(false)
			return

		}

		if(review.length < 1){
			setValidationError("Review section cannot be empty")
			setIsSubmitting(false)
			return
		}

		setValidationError(null)

		let locationId = location.value.place_id
		const proxyurl = "https://secret-ocean-49799.herokuapp.com/";
		const url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + locationId + "&key=" + config.apiKey 
		// console.log(location.value.place_id)
		// console.log(url)
		fetch(proxyurl + url, {
			method: 'POST',
			headers: {
			  "Content-Type": "application/json"
			}
		})
			.then(response => response.json())
			.then(data => {
				const recommendation = {
			        'description': review,
			        'dishes': dishes,
			        'restaurant': location.value.structured_formatting.main_text,
			        'location': new firebase.firestore.GeoPoint(
			          data.result.geometry.location.lat,
			          data.result.geometry.location.lng,
			        ),
			        'googleLink': data.result.url,
			        'timestamps': firebase.firestore.FieldValue.serverTimestamp(),
			        'name': firebase.auth().currentUser.displayName,
			        'username': firebase.auth().currentUser.email,
			        'favourites': 0,
			        'active': true,
			        'pictures': [],
				}

				var db = firebase.firestore();
				var docRef = db.collection("recommendations").add(recommendation)
					.then((docRef) => {
						imageFiles.forEach((image, index) => {
							new Compressor(image, {
								quality: 0.8,
								success(result){
									var recommendationImagesRef = firebase.storage().ref().child('recommendations/' + docRef.id + '/picture' + index)
									recommendationImagesRef.put(result).then((snapshot) => {
										console.log("Uploaded a file")
										snapshot.ref.getDownloadURL().then((downloadURL) => {
											console.log(downloadURL)
											db.collection('recommendations').doc(docRef.id).update({
												'pictures': firebase.firestore.FieldValue.arrayUnion(downloadURL)
											}).then(()=>{
												if(index === imageFiles.length - 1){
													setIsSubmitting(false)
													history.push('/recommendation/' + docRef.id)
												}
											})

										})
									})

								}
							})
						})

						if (imageFiles.length === 0){
							setIsSubmitting(false)
							history.push('/recommendation/' + docRef.id)
						}


					})


			})
			.catch((error) => console.log(error))
	}

	// console.log(location)

	return(
		<>
			<IfFirebaseAuthed>
				{({ isSignedIn, user, providerId }) => {
					if(isSignedIn){
						return (<Card>
							{ isSubmitting ? <div className="loader-container">
								<div className="loader">
								</div>
							</div> : null }
							<Toast bg="danger" show={validationError} onClose={()=>setValidationError(null)}>
								<Toast.Header>
								  <strong className="me-auto">Error When Submitting</strong>
								</Toast.Header>
								<Toast.Body className="form-error">{validationError}</Toast.Body>
							</Toast>

							<Modal show={show} onHide={() => setShow(false)} centered>
							  <Modal.Header closeButton>
							    <Modal.Title>Location Search</Modal.Title>
							  </Modal.Header>
							  <Modal.Body>
							  	<GooglePlacesAutocomplete 
							  	autocompletionRequest={{
							  		componentRestrictions: { country: "my"},
							  		types: ["establishment"]
							  	}}
							  	selectProps={{
							  		location,
							  		onChange: setLocation,
							  	}} apiKey={config.apiKey}/>
							  </Modal.Body>
							  <Modal.Footer>
							    <Button variant="primary" onClick={() => setShow(false)}>
							      Save Changes
							    </Button>
							  </Modal.Footer>
							</Modal>

							<Form noValidate className="post-recommendation-form">
							  <h2 className="post-your-recommendation mb-4">Post Your Food Recommendation</h2>
							  <Form.Label className="restaurant">Restaurant : </Form.Label>
							  {location ? 
							      <a href="" target="_blank">
							  	    <Button type="button" variant="danger" className="px-2 mb-2 align-items-center">
							  	    	<MdLocationOn size={20}/>
							  	    	{location.value.structured_formatting.main_text}
							  	    </Button>
							  	  </a> : null
						  	  }
							  <div></div>
							  <Button className="mb-4" variant="primary" onClick={()=>setShow(true)}>
							    Pick A Restaurant
							  </Button>
							  <Form.Group className="mb-3">
							    <Form.Label>Dish Name</Form.Label>
							    <Form.Control onChange={handleDishNameChange} placeholder="Enter dish name here" />
							    <Form.Text muted>
							    	Enter one dish at a time and press the "Add Dish" button. Repeat the process to add multiple dishes.
							    </Form.Text>

							  </Form.Group>
							  {dishes.map((dish, index)=>
							  	<Chip label={dish} onDelete={(e)=>{
							  		let dishesCopy = JSON.parse(JSON.stringify(dishes));
							  		dishesCopy.splice(index, 1)
							  		setDishes(dishesCopy)
							  	}}/>
							  )}
							  <p></p>
							  <Button variant="primary" onClick={handleAddDish}>
							    Add Dish
							  </Button>
							  <Form.Group className="mt-4 mb-3">
							    <Form.Label>Review</Form.Label>
							    <Form.Control as="textarea" rows={3} placeholder="Tell us what you liked about the place!" onChange={handleReviewChange}/>
							  </Form.Group>


							  <Form.Group controlId="formFileMultiple" className="mb-3">
							    <Form.Label>Photos</Form.Label>
							    <Form.Control accept="image/*" type="file" multiple onChange={handlePhotosChange}/>
							  </Form.Group>
							  {images.length > 0 ? <ImageGallery showBullets={true} showPlayButton={false} items={images} showThumbnails={false}/> : null}


							  <Button className="mt-2" variant="primary" onClick={handleSubmit}>
							    Submit
							  </Button>
							</Form>
						</Card>
						)
					}
				}}
			</IfFirebaseAuthed>

		</>

	)
}
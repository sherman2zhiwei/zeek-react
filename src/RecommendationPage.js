import { useParams } from "react-router-dom";
import {
  FirebaseAuthConsumer
} from "@react-firebase/auth";
import { FirestoreDocument, FirestoreCollection } from "@react-firebase/firestore";
import './RecommendationPage.css'
import Container from "react-bootstrap/Container";
import { useState } from "react";
import firebase from "firebase/app";
import Card from "react-bootstrap/Card";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MdDelete, MdLocationOn } from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useHistory } from "react-router-dom";

export default function RecommendationPage(){
	let { id } = useParams();
	const [favourited, setFavourite] = useState(null)
	const [loaded, setLoaded] = useState(false)
	const [recommendation, setRecommendationData] = useState({})
	const [images, setImages] = useState([])
	const [noOfFavourites, setNoOfFavourites] = useState(0)
	const [showDelete, setShowDelete] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const history = useHistory();

	var db = firebase.firestore();

	firebase.auth().onAuthStateChanged((user) => {
	  if (!user){
	  	history.push('/login')
	  }
	});

	return (
		<FirebaseAuthConsumer>
			{({ isSignedIn, user, providerId }) => {
				if(isSignedIn){

					var email = user.email;
					if (favourited == null){
						var docRef = db.collection("favourites").where('userEmail', "==", email).get().then((querySnapshot) => {
								let tempFavourites = []
								querySnapshot.forEach((doc) => {
									tempFavourites.push(doc.data().recommendationId)
								})

								if (tempFavourites.includes(id)){
									setFavourite(true)
								}
						})
					}


					if(!loaded){
						var path = "/recommendations/" + id
						var recommendationRef = db.collection('recommendations').doc(id)
						recommendationRef.get()
						.then((doc) => {
							if (doc.exists){	
							if(doc.data().username === email){
									setShowDelete(true);
								}
								setRecommendationData(doc.data())
								setLoaded(true)
								if(doc.data().favourites){
									setNoOfFavourites(doc.data().favourites)
								}
								if(doc.data().pictures){
									setImages(doc.data().pictures.map((url) => {
										return {
											original: url,
										}
									}))


								}
							}																		
						})


					}


					return ( loaded ? (
								<Container className="recommendation my-auto">
										<Card className="rounded-0 details">
											{images.length > 0 ?
											<ImageGallery showBullets={true} showPlayButton={false} items={images} showThumbnails={false}/>
											: null										
											}
										  <Card.Body>
										    <Card.Title>
										    	{recommendation.dishes ? recommendation.dishes.join(", ") : recommendation.dish}
										    	{showDelete ?
										    		<span className="delete d-flex align-items-center">
										    			<MdDelete onClick={()=>{
										    				setShowDeleteModal(true)
										    			}} className="delete-icon" size={25}/>
										    			{ showDeleteModal ? 
										    			<Modal onHide={() => setShowDeleteModal(false)} show={showDeleteModal} centered>
										    			  <Modal.Header>
										    			    <Modal.Title>Are you sure?</Modal.Title>
										    			  </Modal.Header>

										    			  <Modal.Body>
										    			    <p>Do you really want to delete this post? This process cannot be undone.</p>
										    			  </Modal.Body>

										    			  <Modal.Footer>
										    			    <Button variant="secondary" onClick={()=>{setShowDeleteModal(false)}}>Cancel</Button>
										    			    <Button variant="danger" onClick={()=>{
										    			    	setIsDeleting(true)
										    			    	if(recommendation){
										    			    		if(recommendation.username === email){
										    			    			db.collection('recommendations').doc(id).delete().then(() => {
										    			    				history.push('/', {
										    			    					state: {
										    			    						deleted: true
										    			    					}
										    			    				})
										    			    			})
										    			    		}
										    			    	}
										    			    }}>Delete</Button>
										    			  </Modal.Footer>
										    			</Modal> : null}
										    		</span>
										    		: null
										    	}
										    	{ isDeleting ? <div className="loader-container">
										    		<div className="loader">
										    		</div>
										    	</div> : null }

												</Card.Title>
										    <a href={recommendation.googleLink} target="_blank">
											    <Button type="button" variant="danger" className="px-2 mb-2 align-items-center">
											    	<MdLocationOn size={20}/>
											    	{recommendation.restaurant}
											    </Button>
											  </a>
										    {/*<Card.Subtitle className="">{recommendation.restaurant}</Card.Subtitle>*/}
										    <Card.Text>
										      {recommendation.description} 
										    </Card.Text>
										    <hr className="mt-2 mb-3"/>
										    <Card.Text className="text-muted">
										    	{recommendation.name}
										    	<span className="likes d-flex align-items-center">
										    	    {noOfFavourites} 
										    	    <FaHeart className="number-of-likes" size={14}/>
										    	</span>
										    </Card.Text>
										  </Card.Body>
										</Card>
										{favourited ? 
											(
												<div onClick={()=>{

													var docRef = db.collection("favourites")
														.where('userEmail', "==", email)
														.where('recommendationId', "==", id)
														.get().then((querySnapshot) => {
															querySnapshot.forEach((doc) => {
																doc.ref.delete();
															})
														})

													var recommendationRef = db.collection('recommendations').doc(id)
													recommendationRef.get()
													.then((doc) => {
														if (doc.exists){
															let noOfFavourites = doc.data().favourites
															recommendationRef.update({
																favourites: noOfFavourites - 1
															})
															.then(() => {
																setNoOfFavourites(noOfFavourites - 1)
																setFavourite(false)
															})
														}

													})

												}} className="like-button d-flex align-items-center py-2">
													<FaHeart className="like-icon liked" size={18}/>
												<div className="liked">Liked</div>
												</div>
											) :
											(
												<div onClick={() => {
													var docRef = db.collection("favourites").add({
														'recommendationId': id,
														'userEmail': email,
														'timestamps': firebase.firestore.FieldValue.serverTimestamp(),
													}).then((docRef) => {
													})

													var recommendationRef = db.collection('recommendations').doc(id)
													recommendationRef.get()
													.then((doc) => {
														if (doc.exists && doc.data().favourites){
															let favourites = doc.data().favourites
															recommendationRef.update({
																favourites: favourites + 1
															})
															.then(() => {
															})
														} else {
															recommendationRef.update({
																favourites: 1
															})
														}

														setFavourite(true)
														setNoOfFavourites(noOfFavourites + 1)

														
													})


												}} className="like-button d-flex align-items-center py-2">
													<FaRegHeart className="like-icon" size={18}/>
														Like
												</div>
											)
										}
								</Container>
							) : null )
				}
			}}
		</FirebaseAuthConsumer>

	)

}
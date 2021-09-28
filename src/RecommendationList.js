import config from "./config.js"
import { FirestoreCollection } from "@react-firebase/firestore";
import { useState } from "react";
import Toast from "react-bootstrap/Toast";
import './RecommendationList.css';
import { InView } from 'react-intersection-observer';
import Card from "react-bootstrap/Card";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import firebase from "firebase/app";
import {
  IfFirebaseAuthed,
  IfFirebaseUnAuthed,
} from "@react-firebase/auth";
import { useHistory } from "react-router-dom";
import { MdLocationOn, MdAdd } from 'react-icons/md'
import Button from 'react-bootstrap/Button';
import ShowMoreText from "react-show-more-text";
import { Fab } from '@material-ui/core';


export default function RecommendationList(){
	const [showLocationToast, setShowLocationToast] = useState(false);
	const [limit, setLimit] = useState(10);
	const [limitReached, setLimitReached] = useState(false);
	const [favourites, setFavourites] = useState(null);

	firebase.auth().onAuthStateChanged((user) => {
	  if (!user){
	  	history.push('/login')
	  }
	});

	const history = useHistory();

	let location;

	// navigator.permissions
	// 	.query({ name: "geolocation" })
	// 	.then(function(result){
	// 		if (result.state === "granted"){
	// 			navigator.geolocation.getCurrentPosition(function(position){
	// 					location = position;
	// 				}
	// 			)
	// 		} else if (result.state === "denied"){
	// 			setShowLocationToast(true);
	// 		}
	// 	});


	var db = firebase.firestore();


	return (
		<>
		<IfFirebaseAuthed>
			{({ isSignedIn, user, providerId }) => {
				if(isSignedIn){
					var email = user.email;

					if (favourites == null){
						var docRef = db.collection("favourites").where('userEmail', "==", email).get().then((querySnapshot) => {
								let tempFavourites = []
								querySnapshot.forEach((doc) => {
									tempFavourites.push(doc.data().recommendationId)
								})

								setFavourites(tempFavourites)							
						})
					} else {

					return (
						<FirestoreCollection path="/recommendations/" limit={limit} orderBy={[{field: "timestamps", type: "desc"}]}>
							{d => {
								return (
									<div>
										<Toast bg="warning" show={showLocationToast} onClose={()=>setShowLocationToast(false)}>
											<Toast.Header>
											  <strong className="me-auto">No Location Access</strong>
											</Toast.Header>
											<Toast.Body>Zeek does not have access to your location right now. We wouldn't want to recommend restaurants you can't reach. Find out how to enable location access for your browser <a target="_blank" href="https://docs.buddypunch.com/en/articles/919258-how-to-enable-location-services-for-chrome-safari-edge-and-android-ios-devices-gps-setting">here</a>.</Toast.Body>
										</Toast>
										{d.isLoading || !d.value ? null : 
											d.value.map((recommendation,index) => {
												var recommendationId = d.ids[index]
												var favourited = favourites.includes(recommendationId)
												return (
													<div key={index}>
														{/*<Card onClick={()=>{history.push('/recommendation/' + recommendationId)}} className="rounded-0">*/}
														<Card className="rounded-0">
															{recommendation.pictures && recommendation.pictures.length > 0 ?
															<Card.Img className="rounded-0" variant="top" src={recommendation.pictures[0]}/>
															: null											
															}
														  <Card.Body>
														  	<a href="" onClick={()=>history.push('/recommendation/' + recommendationId)}>
														  	  <Card.Title className="article-title">{recommendation.dishes ? recommendation.dishes.join(", ") : recommendation.dish}</Card.Title>
														  	</a> 
														    <a href={recommendation.googleLink} target="_blank">
															    <Button type="button" variant="danger" className="d-flex align-items-center px-2 mb-2">
															    	<MdLocationOn size={20}/>
															    	<span className="restaurant">{recommendation.restaurant}</span>
															    </Button>
															  </a>
															  <Card.Text className="description">
																  <ShowMoreText className="show-more" lines={3} more="Show more" less="">
																  	{recommendation.description}
																  </ShowMoreText>
														    </Card.Text>

														    <hr className="mt-2 mb-3"/>
														    <Card.Text className="text-muted">
														    	{recommendation.name}
														    	<span className="likes d-flex align-items-center">
															    	{recommendation.favourites}
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
																		.where('recommendationId', "==", recommendationId)
																		.get().then((querySnapshot) => {
																			querySnapshot.forEach((doc) => {
																				doc.ref.delete();
																			})
																			const index = favourites.indexOf(recommendationId);
																			let favouritesCopy = JSON.parse(JSON.stringify(favourites));
																			if (index > -1) {
																			  favouritesCopy.splice(index, 1);
																			}
																			setFavourites(favouritesCopy)
																		})

																	var recommendationRef = db.collection('recommendations').doc(recommendationId)
																	recommendationRef.get()
																	.then((doc) => {
																		if (doc.exists){
																			let noOfFavourites = doc.data().favourites
																			recommendationRef.update({
																				favourites: noOfFavourites - 1
																			})
																			.then(() => {
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
																		'recommendationId': recommendationId,
																		'userEmail': email,
																		'timestamps': firebase.firestore.FieldValue.serverTimestamp(),
																	}).then((docRef) => {
																		let favouritesCopy = JSON.parse(JSON.stringify(favourites));
																		favouritesCopy.push(recommendationId)
																	    setFavourites(favouritesCopy)
																	})

																	var recommendationRef = db.collection('recommendations').doc(recommendationId)
																	recommendationRef.get()
																	.then((doc) => {
																		if (doc.exists && doc.data().favourites){
																			favourites = doc.data().favourites
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
																		
																	})


																}} className="like-button d-flex align-items-center py-2">
																	<FaRegHeart className="like-icon" size={18}/>
																		Like
																</div>
															)
														}
													</div>
												)
											})}
										<InView onChange={(inView, entry) => {
												if(inView && !d.isLoading && !limitReached){
													setLimit(limit+5);
													// console.log(limit);
												}

												if(!d.isLoading && d.value.length < limit){
													setLimitReached(true);
												}

											}}>

											<div className="end">
											  <h3>{limitReached ? "You've reached the bottom! How about adding your own post?" : "Loading more posts..."}</h3>
											</div>
										</InView>
									</div>
								)

							}}
						</FirestoreCollection>
					)}
				}			  
			}}

		</IfFirebaseAuthed>
		</>

	)
}
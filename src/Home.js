import React from "react";
import "./Home.css";
import Card from "react-bootstrap/Card";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import RecommendationList from './RecommendationList';
import { useState } from "react";
import Toast from "react-bootstrap/Toast";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { createBrowserHistory } from "history";
import FloatingAddPostButton from './FloatingAddPostButton.js';


export default function Home() {
	const location = useLocation();
	const [showDeleteToast, setShowDeleteToast] = useState(false);

	useEffect(() => {
		// console.log(location)
		if (location.state){
			setShowDeleteToast(location.state.state.deleted)
			location.state.state.deleted = false
			const history = createBrowserHistory();

			const state = {...location.state}
			delete state.state
			history.replace({...history.location, state})
		}
	}, [location])


	return (
		<div className="Home">
		  <div className="lander">
			<FloatingAddPostButton/>
		    <h1>Recommendations</h1>
		    {/*<p className="text-muted">A food recommendation app</p>*/}
		  </div>
		  <RecommendationList/>
		  {
		  	showDeleteToast ? 
		  		<Toast bg='success' show={showDeleteToast} onClose={() => setShowDeleteToast(false)}>
		  		  <Toast.Header>
		  		    <strong className="me-auto">Post Deleted</strong>
		  		  </Toast.Header>
		  		  <Toast.Body className="post-deleted">Your post has been deleted!</Toast.Body>
		  		</Toast>
		  	: null
		  }

		</div>
	)
}
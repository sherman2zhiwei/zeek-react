import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home.js";
import Login from './Login.js'
import NotFound from "./NotFound.js"
import RecommendationPage from './RecommendationPage.js'
import PostRecommendation from './PostRecommendation.js'
import MyLikes from './MyLikes.js'
import SignUp from './SignUp.js'
import MyPosts from './MyPosts.js'
import DataDeletion from './DataDeletion.js'
import ContactUs from './ContactUs.js'

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/my-likes">
        <MyLikes/>
      </Route>
      <Route path="/recommendation/:id">
        <RecommendationPage/>
      </Route>
      <Route path="/add-recommendation">
        <PostRecommendation/>
      </Route>
      <Route path="/signup">
        <SignUp/>
      </Route>
      <Route path="/my-posts">
        <MyPosts/>
      </Route>
      <Route path="/data-deletion">
        <DataDeletion/>
      </Route>
      <Route path="/contact-us">
        <ContactUs/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
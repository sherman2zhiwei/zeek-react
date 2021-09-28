import './App.css';
import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import "firebase/analytics";


import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import config from "./config";
import "firebase/firestore";
import { FirestoreProvider } from "@react-firebase/firestore";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function App() {
  const history = useHistory();

  return (
    <FirestoreProvider {...config} firebase={firebase}>
      <FirebaseAuthProvider firebase={firebase} {...config}>
        <div className="App">

                <FirebaseAuthConsumer>
                  {({ isSignedIn, user, providerId }) => {
                  const analytics = firebase.analytics();


                  return (
                    <Navbar fixed ="top" collapseOnSelect expand="lg" variant="dark" >
                      <LinkContainer to="/">
                        <Navbar.Brand className="logo ml-2">
                          zeek
                        </Navbar.Brand>
                      </LinkContainer>
                      <Navbar.Toggle />
                      <Navbar.Collapse className="justify-content-end">
                        <Nav activeKey={window.location.pathname} className="me-auto">
                          <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                          </LinkContainer>
                          <Nav.Link target="_blank" href="https://sherman2zhiwei.github.io/zeek/">About Us</Nav.Link>
                          <LinkContainer to="/contact-us">
                            <Nav.Link>Contact Us</Nav.Link>
                          </LinkContainer>                    
                        </Nav>
                        <Nav>
                          {isSignedIn ? 
                            <>
                            <LinkContainer to="/my-posts">
                              <Nav.Link>My Posts</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/my-likes">
                              <Nav.Link>My Likes</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/add-recommendation">
                              <Nav.Link>Add Recommendation</Nav.Link>
                            </LinkContainer>
                            <Nav.Link onClick={() => {
                                  firebase.auth().signOut();
                                  history.push("/login");
                                }}>
                              Sign Out
                            </Nav.Link>
                            </>: 
                            <>
                              <LinkContainer to="/signup">
                                <Nav.Link>Sign Up</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                              </LinkContainer>
                            </>
                          }

                        </Nav>
                      </Navbar.Collapse>
                    </Navbar>
                  )
                  }}
                </FirebaseAuthConsumer>
                <Routes />
        </div>
      </FirebaseAuthProvider>
    </FirestoreProvider>
  );
}




export default App;

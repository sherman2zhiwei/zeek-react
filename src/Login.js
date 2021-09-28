import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import "firebase/auth";
import firebase from "firebase/app";
import {
  FirebaseAuthConsumer
} from "@react-firebase/auth";
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // console.log("watrafak")
        history.push("/");
      })
      .catch((e) => {
        setErrorMessage(e.message)
        setShow(true) 
      });
  }

  return (
    <div className="Login">
      <h1>Sign In</h1>
      <Form className="d-grid gap-2 my-4">
        <Button block variant="danger" className="social-button py-2" onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider)
              .catch((e) => {
                  setErrorMessage(e.message)
                  setShow(true)
              }).then((userCredential) => {
                history.push("/");
              });
            }}>
          <FaGoogle className="social-button-icon"/>
          Sign In With Google
        </Button>
        <Button block variant="primary" className="social-button py-2" onClick={() => {
              const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
              firebase.auth().signInWithPopup(facebookAuthProvider)
              .catch((e) => {
                  setErrorMessage(e.message)
                  setShow(true)
              }).then((userCredential) => {
                history.push("/");
              });
            }}>
          <FaFacebook className="social-button-icon"/>
          Sign In With Facebook
        </Button>
      </Form>

      <div className="or-separator">
        <i>or</i>
      </div>

      <Form className="d-grid gap-1" onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg mt-3" type="submit" disabled={!validateForm()}>
          Sign In
        </Button>
        <a className="privacy-policy" href="https://www.termsfeed.com/live/95a660bf-228c-4b78-a61c-8364c55744ad" target="_blank">
          Privacy Policy
        </a>
      </Form>

      {show ? 
        (
          <Alert className="fixed-bottom" variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>
              {errorMessage}
            </p>
          </Alert>
        ) :
        null
      }
      

{/*      <FirebaseAuthConsumer>
        {({ isSignedIn, user, providerId }) => {
          return (
            <div>
              <pre style={{ height: 300, overflow: "auto" }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre>
              {isSignedIn ? <Button block size="lg" onClick={() => {
                    firebase.auth().signOut();
                  }}>
                Sign Out
              </Button> : null}
            </div>
          );
        }}
      </FirebaseAuthConsumer>*/}
    </div>
  );
}
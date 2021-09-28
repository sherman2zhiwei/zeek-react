import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import "./ContactUs.css";

export default function ContactUs(){
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	function handleSubmit(e){
		e.preventDefault()

	}

	function handleNameChange(e){
		setName(e.target.value)
	}

	function handleEmailChange(e){
		setEmail(e.target.value)
	}

	function handleMessageChange(e){
		setMessage(e.target.value)
	}

	return (
		<>
			<h1 className="mt-4">Contact Us</h1>
			<p className="px-3 contact-us">To contact us for any enquiries, requests or feedback, do email us at <a className="data-deletion-email" href="mailto: theweekdayproj@gmail.com">theweekdayproj@gmail.com</a>.</p>

{/*			<Form className="px-3 mt-4">
				<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
				  <Form.Label>Full Name</Form.Label>
				  <Form.Control onChange={handleNameChange} type="text" placeholder="John Smith" required/>
				</Form.Group>
			  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
			    <Form.Label>E-mail</Form.Label>
			    <Form.Control onChange={handleEmailChange} type="email" placeholder="name@example.com" required/>
			  </Form.Group>
			  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
			    <Form.Label>Message</Form.Label>
			    <Form.Control onChange={handleMessageChange} as="textarea" rows={4} required/>
			  </Form.Group>
			  <Button variant="primary" type="submit" onClick={handleSubmit}>
			    Submit
			  </Button>
			</Form>*/}
		</>
	)
}
import Button from 'react-bootstrap/Button';
import { IoAddCircleSharp, IoAddOutline } from 'react-icons/io5';
import { LinkContainer } from "react-router-bootstrap";
import './FloatingAddPostButton.css'
import Nav from "react-bootstrap/Nav";


export default function FloatingAddPostButton(){

	return (
		<>
			<LinkContainer to="/add-recommendation">
				<Nav.Link>
					<IoAddCircleSharp className="add-recommendation-button" size={80}/>
					<div className="add-recommendation-button-2"></div>
				</Nav.Link>
			</LinkContainer>
		</>

	)

}
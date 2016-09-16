import React			from 'react';
import { Link }			from 'react-router';

class FormRegister extends React.Component {
	render() {
		return (
			<form className="RegisterForm">
				<input type="text"/>
				<input type="mail"/>
				<input type="mail"/>
				<input type="password"/>
				<input type="password"/>
				<input type="submit"/>
			</form>
		);
	}
}

export default class Register extends React.Component {
	render() {
		return (
			<div className="single">
				<FormRegister />
				<Link to="/">Already registered</Link>
			</div>
		)
	}
}

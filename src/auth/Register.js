import React					from 'react';
import { Link }					from 'react-router';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import MatchInput				from '../customComponents/matchInput';

import './register.css';
import '../master.css';

class FormRegister extends React.Component {
	render() {
		return (
			<form onSubmit={this.register}>
				<MatchInput label="USERNAME" inputType="text" inputName="username"/>
				<MatchInput label="MAIL" inputType="text" inputName="mail"/>
				<MatchInput label="MAIL VERIFICATION" inputType="text" inputName="mailVerif" />
				<MatchInput label="PASSWORD" inputType="password" inputName="password" />
				<MatchInput label="PASSWORD VERIFICATION" inputType="password" inputName="passwordVerif" />
				<input type="submit" name="register" value="REGISTER" className="mainButton"/>
			</form>
		);
	}
}

export default class Register extends React.Component {
	render() {
		return (
			<ReactCssTransitionGroup
			component="div"
			transitionName="route"
			className="registerForm"
			transitionAppear={true}
			transitionEnterTimeout={500}
			transitionAppearTimeout={500}
			transitionLeaveTimeout={500}>
				<div className="otherOptions">
					<Link to="/"><div className="otherOption centered">ALREADY REGISTERED</div></Link>
				</div>
				<FormRegister />
			</ReactCssTransitionGroup>
		)
	}
}

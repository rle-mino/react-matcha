import React					from 'react';
import { Link }					from 'react-router';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';

import './register.css';

class FormRegister extends React.Component {
	state = {
		userReq: false,
		userAlr: false,
		userInval: false,
		passReq: false,
		passInval: false,
		mailReq: false,
		mailAlr: false,
		mailInval: false,
		mailVReq: false,
		mailVInval: false,
		passVInval: false,
		passVReq: false,
	}

	register = async (e) => {
		e.preventDefault();
		await this.setState({
			passVInval: e.target.password.value !== e.target.passwordVerif.value,
			mailVInval: e.target.mail.value !== e.target.mailVerif.value,
		});
		if (!!this.state.passVInval || !!this.state.mailVInval) {
			return false;
		} else {
			//ajax
		}
	};

	render() {
		return (
			<form onSubmit={this.register}>
				<MatchInput
					label="USERNAME"
					inputType="text"
					inputName="username"
				>
					{(!!this.state.userReq && (<ErrorMessage message="USERNAME REQUIRED" />)) ||
					(!!this.state.userAlr && (<ErrorMessage message="USERNAME ALREADY EXIST" />)) ||
					(!!this.state.userInval && (<ErrorMessage message="INVALID USERNAME" />))}
				</MatchInput>
				<MatchInput
					label="PASSWORD"
					inputType="password"
					inputName="password"
				>
					{(!!this.state.passReq && (<ErrorMessage message="REQUIRED" />)) ||
					(!!this.state.passInval && (<ErrorMessage message="INVALID PASSWORD" />))}
				</MatchInput>
				<MatchInput
					label="VERIFY PASSWORD"
					inputType="password"
					inputName="passwordVerif"
				>
					{(!!this.state.passVReq && (<ErrorMessage message="REQUIRED" />)) ||
					(!!this.state.passVInval && (<ErrorMessage message="INVALID" />))}
				</MatchInput>
				<MatchInput
					label="MAIL"
					inputType="text"
					inputName="mail"
				>
					{(!!this.state.mailReq && (<ErrorMessage message="REQUIRED" />)) ||
					(!!this.state.mailAlr && (<ErrorMessage message="MAIL ALREADY EXIST" />)) ||
					(!!this.state.mailInval && (<ErrorMessage message="INVALID MAIL" />))}
				</MatchInput>
				<MatchInput
					label="VERIFY MAIL"
					inputType="text"
					inputName="mailVerif"
				>
					{(!!this.state.mailVReq && (<ErrorMessage message="REQUIRED"/>)) ||
					(!!this.state.mailVInval && (<ErrorMessage message="INVALID" />))}
				</MatchInput>
				<input type="submit" name="register" value="REGISTER" className="mainButton" />
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

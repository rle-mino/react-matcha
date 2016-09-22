import React					from 'react';
import axios					from 'axios';
import { Link, browserHistory }	from 'react-router';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';
import DateInput				from '../components/DateInput';
import apiConnect				from '../apiConnect.js';

import './register.css';

class FormRegister extends React.Component {
	state = {
		userReq: false,
		userAlr: false,
		userInval: false,
		passReq: false,
		passInval: false,
		passVInval: false,
		passVReq: false,
		firstReq: false,
		firstInval: false,
		lastReq: false,
		lastInval: false,
		birthInval: false,
		mailReq: false,
		mailAlr: false,
		mailInval: false,
		mailVReq: false,
		mailVInval: false,
		serverResponse: null,
		mainButtonDis: false,
		mainButtonValue: 'REGISTER',
	}

	register = async (e) => {
		e.preventDefault();
		e.persist();
		await this.setState({
			userReq: false,
			userAlr: false,
			userInval: false,
			passReq: false,
			passInval: false,
			passVInval: false,
			passVReq: false,
			firstReq: false,
			firstInval: false,
			lastReq: false,
			lastInval: false,
			birthInval: false,
			mailReq: false,
			mailAlr: false,
			mailInval: false,
			mailVReq: false,
			mailVInval: false,
			serverResponse: null,
			mainButtonDis: true,
			mainButtonValue: 'WAIT',
		});
		await this.setState({
			passVInval: e.target.password.value !== e.target.passwordVerif.value,
			mailVInval: e.target.mail.value !== e.target.mailVerif.value,
			birthInval: !e.target.day.value && !e.target.year.value,
		});
		if (!!this.state.passVInval || !!this.state.mailVInval || !!this.state.birthInval) {
			this.setState({ mainButtonDis: false, mainButtonValue: 'REGISTER' });
			return false;
		} else {
			const birthdate = `${e.target.month.value}-${e.target.day.value}-${e.target.year.value}`;
			const response = await axios({
				method: 'post',
				url: `${apiConnect}user/add/register`,
				data: {
					username: e.target.username.value,
					firstname: e.target.firstname.value,
					lastname: e.target.lastname.value,
					password: e.target.password.value,
					birthdate: birthdate,
					mail: e.target.mail.value,
				},
			});
			setTimeout(() => {
				if (response.data.details === 'invalid request') {
					response.data.error.forEach((error) => {
						const { path } = error;
						if (path === 'mail') this.setState({ mailInval: true });
						if (path === 'password') this.setState({ passInval: true });
						if (path === 'username') this.setState({ userInval: true });
						if (path === 'firstname') this.setState({ firstInval: true });
						if (path === 'lastname') this.setState({ lastInval: true });
						if (path === 'birthdate') this.setState({ birthInval: true });
						this.setState({ mainButtonValue: 'REGISTER', mainButtonDis: false });
					})
				} else if (response.data.details === 'already exists') {
					this.setState({ serverResponse: response.data.error, mainButtonValue: 'REGISTER', mainButtonDis: false });
				} else if (response.data.status === true){
					this.setState({ mainButtonValue: 'SUCCESS' });
				}
				if (response.data.status === true) {
					setTimeout(() => browserHistory.push('confirm_mail'), 1000);
				}
			}, 1000);
		}
	};

	render() {
		return (
			<form onSubmit={this.register}>
				<div className="errorMessageMain">{this.state.serverResponse}</div>
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
					(!!this.state.passInval && (<ErrorMessage message="UNSECURE PASSWORD" />))}
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
					label="FIRSTNAME"
					inputType="text"
					inputName="firstname"
				>
					{(!!this.state.firstReq && (<ErrorMessage message="REQUIRED" />)) ||
					(!!this.state.firstInval && (<ErrorMessage message="INVALID FIRSTNAME" />))}
				</MatchInput>
				<MatchInput
					label="LASTNAME"
					inputType="text"
					inputName="lastname"
				>
					{(!!this.state.lastReq && (<ErrorMessage message="REQUIRED" />)) ||
					(!!this.state.lastInval && (<ErrorMessage message="INVALID LASTNAME" />))}
				</MatchInput>
				<DateInput label="BIRTHDATE">
					{(!!this.state.birthInval && (<ErrorMessage message="INVALID BIRTHDATE" />))}
				</DateInput>
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
				<input type="submit" value={this.state.mainButtonValue} className="mainButton" name="submit" disabled={this.state.mainButtonDis} />
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
				<div className="mainTitle">REGISTER</div>
				<FormRegister />
				<div className="otherOptions">
					<Link to="/"><div className="otherOption centered">ALREADY REGISTERED</div></Link>
				</div>
			</ReactCssTransitionGroup>
		)
	}
}

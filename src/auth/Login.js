import React					from 'react';
import { Link }					from 'react-router';
import axios					from 'axios';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import apiConnect				from '../apiConnect';
import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';

import './login.css';
import './loginForm.css';

class LoginForm extends React.Component {
	state = {
		isPending: false,
		displayResponse: false,
		serverStatus: null,
		buttonValue: 'SIGN IN',
		passReq: false,
		userReq: false,
		mainErr: 'errorMessageMain',
	};

	login = async (e) => {
		e.preventDefault();
		this.setState({
			isPending: true,
			buttonValue: 'WAIT',
			userReq: false,
			passReq: false,
			mainErr: 'errorMessageMain',
			serverResponse: null,
		});
		const response = await axios({
			method: 'put',
			url: `${apiConnect}user/auth/login`,
			data: {
				username: e.target.username.value,
				password: e.target.password.value,
			},
		});
		setTimeout(() => {
			this.setState({
				buttonValue: response.data.status ? 'SUCCESS' : 'SIGN IN',
				serverResponse: response.data.details,
			});
			if (response.data.status === false) {
				this.setState({ isPending: false });
				if (response.data.details === 'invalid request') {
					this.setState({ serverResponse: null });
					if (response.data.require.indexOf('password') !== -1) {
						this.setState({ passReq: true });
					} else this.setState({ passReq: false })
					if (response.data.require.indexOf('username') !== -1) {
						this.setState({ userReq: true });
					} else this.setState({ userReq: false });
				} else {
					this.setState({ mainErr: 'errorMessageMain isVisible' });
				}
			}
			else {
				this.setState({ serverResponse: null });
			}
		}, 1000);
	};

	render() {
		const {
			isPending,
			serverResponse,
			buttonValue,
			passReq,
			userReq,
			mainErr
		} = this.state;
		return (
			<div>
				<div className={mainErr}>{serverResponse}</div>
				<form id="loginForm" onSubmit={this.login}>
					<MatchInput
						label="USERNAME"
						inputType="text"
						inputName="username"
					>
						{!!userReq && (<ErrorMessage message="REQUIRED" />)}
					</MatchInput>
					<MatchInput
						label="PASSWORD"
						inputType="password"
						inputName="password"
					>
						{!!passReq && (<ErrorMessage message="REQUIRED" />)}
					</MatchInput>
					<input className="mainButton" type="submit" name="button" value={buttonValue} disabled={isPending} />
				</form>
			</div>
		);
	}
};

export default class Login extends React.Component {
	render() {
		return (
			<ReactCssTransitionGroup
			component="div"
			transitionName="route"
			className="loginComp"
			transitionAppear={true}
			transitionEnterTimeout={500}
			transitionAppearTimeout={500}
			transitionLeaveTimeout={500}>
				<div className="mainTitle">LOGIN</div>
				<LoginForm />
				<div className="otherOptions">
					<Link to="register"><div className="register otherOption">REGISTER</div></Link>
					<Link to="forgot"><div className="forgot otherOption">FORGOT PASSWORD?</div></Link>
				</div>
			</ReactCssTransitionGroup>
		);
	}
}

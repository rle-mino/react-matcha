import React					from 'react';
import { Link, browserHistory }	from 'react-router';
import axios					from 'axios';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import apiConnect				from '../apiConnect';
import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';

import './css/login.sass';

class LoginForm extends React.Component {

	 	state = {
			isPending: false,
			displayResponse: false,
			serverStatus: null,
			buttonValue: 'SIGN IN',
			username: null,
			password: null,
			mainErr: 'errorMessageMain',
		};

	login = async (e) => {
		e.preventDefault();
		this.setState({
			isPending: true,
			buttonValue: 'WAIT',
			username: null,
			password: null,
			mainErr: 'errorMessageMain',
			serverResponse: null,
		});
		const response = await axios({
			method: 'put',
			url: `${apiConnect}user/login`,
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
					const error = {};
					response.data.error.forEach((err) => {
						error[err.path] = err.error.toUpperCase();
					});
					this.setState({ ...error });
				} else {
					this.setState({ mainErr: 'errorMessageMain isVisible' });
				}
				if (response.data.details.match(/not activated$/g)) {
					setTimeout(() => browserHistory.push('confirm_mail'), 1000);
				}
			}
			else {
				localStorage.setItem('logToken', response.headers.logtoken);
				this.setState({ serverResponse: null });
				setTimeout(() => browserHistory.push('/matcha/my_profile'), 1000);
			}
		}, 1000);
	};

	render() {
		const {
			isPending,
			username,
			password,
			serverResponse,
			buttonValue,
			mainErr,
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
						<ErrorMessage message={username} />
					</MatchInput>
					<MatchInput
						label="PASSWORD"
						inputType="password"
						inputName="password"
					>
						<ErrorMessage message={password} />
					</MatchInput>
					<input
						className="mainButton" type="submit"
						name="button" value={buttonValue}
						disabled={isPending}
						onClick={this.ripple}
					/>
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
				className="comp"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionAppearTimeout={500}
				transitionLeaveTimeout={500}
			>
				<h1 className="mainTitle">LOGIN</h1>
				<LoginForm />
				<div className="otherOptions">
					<Link to="register"><div className="register otherOption">REGISTER</div></Link>
					<Link to="forgot_password"><div className="forgot otherOption">FORGOT PASSWORD?</div></Link>
				</div>
			</ReactCssTransitionGroup>
		);
	}
}

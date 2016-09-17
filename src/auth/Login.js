import React					from 'react';
import { Link }					from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import './login.css';
import './loginForm.css';

class LoginForm extends React.Component {
	state = {
		isPending: false,
		displayResponse: false,
		serverStatus: null,
		buttonValue: 'SIGN IN',
		focusStatus1: 'textInp',
		focusStatus2: 'textInp',
		passReq: false,
		userReq: false,
		mainErr: 'errorMessageMain',
	};

	focusedInput = (e) => {
		if (e.target === document.querySelector('input[name=username]'))
			this.setState({ focusStatus1: `${this.state.focusStatus1} isFocused` });
		if (e.target === document.querySelector('input[name=password]'))
			this.setState({ focusStatus2: `${this.state.focusStatus2} isFocused` });
	}

	bluredInput = (e) => {
		if (e.target === document.querySelector('input[name=username]'))
			this.setState({ focusStatus1: 'textInp' });
		if (e.target === document.querySelector('input[name=password]'))
			this.setState({ focusStatus2: 'textInp' });
	}

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
			focusStatus1,
			focusStatus2,
			passReq,
			userReq,
			mainErr
		} = this.state;
		return (
			<div>
				<div className={mainErr}>{serverResponse}</div>
				<form id="loginForm" onSubmit={this.login}>
					<div className="beforeInput">
						<div className="label">USERNAME OR MAIL</div>
						{userReq === true && (<div className="errorMessage">USERNAME REQUIRED</div>)}
					</div>
					<input type="text" name="username" className={focusStatus1} onFocus={this.focusedInput} onBlur={this.bluredInput}/>
					<div className="beforeInput">
						<div className="label">PASSWORD</div>
						{passReq === true && (<div className="errorMessage">PASSWORD REQUIRED</div>)}
					</div>
					<input type="password" name="password" className={focusStatus2} onFocus={this.focusedInput} onBlur={this.bluredInput} />
					<input className="mainButton" type="submit" name="button" value={buttonValue} disabled={isPending} />
				</form>
			</div>
		);
	}
};

export default class Login extends React.Component {
	render() {
		return (
			<div id="loginComp">
				<div className="mainTitle">LOGIN</div>
				<LoginForm />
				<div className="otherOptions">
					<Link to="register"><div className="register otherOption">REGISTER</div></Link>
					<Link to="forgot"><div className="forgot otherOption">FORGOT PASSWORD?</div></Link>
				</div>
			</div>
		);
	}
}

import React						from 'react';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import axios						from 'axios';
import { browserHistory, Link }		from 'react-router';
import apiConnect					from '../apiConnect';

import MatchInput					from '../components/MatchInput';
import ErrorMessage					from '../components/ErrorMessage';

import './css/confirmMail.sass';

class ConfirmMailForm extends React.Component {
	state = {
		mainButtonValue: 'CONFIRM',
		serverResponse: false,
		subDis: false,
		userReq: false,
		keyReq: false,
	}

	confirmMail = async (e) => {
		e.preventDefault();
		this.setState({
			mainButtonValue: 'WAIT',
			subDis: true,
			serverResponse: false,
			keyReq: false,
			userReq: false,
		});
		axios({
			method: 'put',
			url: `${apiConnect}user/confirm_mail`,
			data: {
				username: e.target.username.value,
				newMailKey: e.target.confirmationKey.value,
			}
		}).then(({ data, headers }) => {
			if (data.status === false) {
				if (data.details !== 'invalid request') {
					this.setState({
						serverResponse: data.details,
						mainButtonValue: 'CONFIRM',
						subDis: false,
					});
				} else {
					data.error.forEach((error) => {
						if (error.path === 'username') this.setState({ userReq: true });
						if (error.path === 'newMailKey') this.setState({ keyReq: true });
						return false;
					})
					this.setState({ mainButtonValue: 'CONFIRM', subDis: false });
				}
			} else {
				this.setState({ mainButtonValue: 'SUCCESS' });
				localStorage.setItem('logToken', headers['x-access-token']);
				setTimeout(() => browserHistory.push('add_details'), 1000);
			}
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED', mainButtonValue: 'ERROR' }));
	}

	render() {
		return (
			<div className="confirmMailForm">
				<div className="errorMessageMain">{this.state.serverResponse}</div>
				<form onSubmit={this.confirmMail}>
					<MatchInput label="USERNAME" inputType="text" inputName="username">
						{!!this.state.userReq && (<ErrorMessage message="REQUIRED"/>)}
					</MatchInput>
					<MatchInput label="CONFIRMATION'S CODE" inputType="text" inputName="confirmationKey">
						{!!this.state.keyReq && (<ErrorMessage message="REQUIRED"/>)}
					</MatchInput>
					<input type="submit" className="mainButton" value={this.state.mainButtonValue} disabled={this.state.subDis}/>
				</form>
			</div>
		);
	}
}

export default class ConfirmMail extends React.Component {
	render() {
		return (
			<ReactCssTransitionGroup
			component="div"
			transitionName="route"
			className="comp"
			transitionAppear={true}
			transitionEnterTimeout={500}
			transitionAppearTimeout={500}
			transitionLeaveTimeout={500}>
				<h1 className="mainTitle">CONFIRM YOUR MAIL</h1>
				<ConfirmMailForm />
				<div className="otherOptions">
					<Link to="/"><div className="forgot otherOption">SIGN IN</div></Link>
					<Link to="register"><div className="register otherOption">NOT REGISTERED YET?</div></Link>
				</div>
			</ReactCssTransitionGroup>
		)
	}
}

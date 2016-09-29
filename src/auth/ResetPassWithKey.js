import React					from 'react';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

import ErrorMessage				from '../components/ErrorMessage';
import MatchInput				from '../components/MatchInput';

class ResetPassWithKeyForm extends React.Component {
	state = {
		serverResponse: null,
		username: null,
		resetKey: null,
		password: null,
		passVerif: null,
		subVal: 'SET NEW PASSWORD',
	}

	render() {
		const { serverResponse, username, resetKey, password, passVerif, subVal } = this.state;
		return (
			<div>
				<div className="errorMessageMain isVisible">{serverResponse}</div>
				<form onSubmit={this.resetPassWithKey}>
				<MatchInput
					label="USERNAME"
					inputType="text"
					inputName="username"
				>
					{username && (<ErrorMessage message={username}/>)}
				</MatchInput>
				<MatchInput
					label="CODE"
					inputType="text"
					inputName="resetKey"
				>
					{resetKey && (<ErrorMessage message={resetKey}/>)}
				</MatchInput>
				<MatchInput
					label="NEW PASSWORD"
					inputType="password"
					inputName="password"
				>
					{password && (<ErrorMessage message={password} />)}
				</MatchInput>
				<MatchInput
					label="CONFIRM PASSWORD"
					inputType="password"
					inputName="passVerif"
				>
					{passVerif && (<ErrorMessage message={passVerif}/>)}
				</MatchInput>
				<input type="submit" value={subVal} className="mainButton"/>
				</form>
			</div>
		);
	}
}

export default class ResetPassWithKey extends React.Component {
	render() {
		return (
			<ReactCssTransitionGroup
				transitionName="route"
				className="comp"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<h1 className="mainTitle">RESET YOUR PASSWORD</h1>
				<ResetPassWithKeyForm />
			</ReactCssTransitionGroup>
		);
	}
}

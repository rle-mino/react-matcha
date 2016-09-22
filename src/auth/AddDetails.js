import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
// import axios					from 'axios';

// import ErrorMessage				from '../components/ErrorMessage';
// import MatchInput				from '../components/MatchInput';

import './addDetails.css';

class AddDetailsForm extends React.Component {
	state = {
		serverResponse: null,
	}

	render() {
		return (
			<div className="AddDetailsForm">
				<div className="errorMessageMain">{this.state.serverResponse}</div>
				<form>
					
				</form>
			</div>
		);
	}
}

export default class AddDetails extends React.Component {
	render() {
		return (
			<ReactCssTransitionGroup
				component="div"
				transitionName="route"
				className="addDetailsComponent"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionAppearTimeout={500}
				transitionLeaveTimeout={500}
			>
				<div className="mainTitle">ADD DETAILS TO YOUR PROFIL</div>
				<AddDetailsForm />
			</ReactCssTransitionGroup>
		);
	}
}

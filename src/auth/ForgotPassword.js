import React					from 'react';
import { browserHistory }		from 'react-router';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';


class ForgotForm extends React.Component {
	state = {
		serverResponse: null,
		subDis: false,
		subVal: 'SEND ME AN EMAIL',
		mail: null,
	}

	forgot = async (e) => {
		e.preventDefault();
		this.setState({ subVal: 'WAIT', mail: null, serverResponse: null, subDis: true });
		axios({
			method: 'put',
			url: `${apiConnect}user/forgot_password`,
			data: {
				mail: e.target.mail.value,
			}
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'invalid request') {
					this.setState({ mail: data.error[0].error, subVal: 'SEND ME AN EMAIL' });
				} else {
					this.setState({ subVal: 'SEND ME AN EMAIL', serverResponse: data.details });
				}
			} else {
				this.setState({ subVal: 'SUCCESS', serverResponse: data.details });
				setTimeout(() => {
					browserHistory.push('reset_password');
				}, 2000);
			}
		}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURED', subVal: 'ERROR' }));
	}

	render() {
		const { serverResponse, subVal, mail, subDis } = this.state
		return (
			<div>
				<div className="errorMessageMain isVisible">{serverResponse}</div>
				<form onSubmit={this.forgot}>
					<MatchInput label="MAIL" inputType="text" inputName="mail">
					{mail && (<ErrorMessage message={mail}/>)}
					</MatchInput>
					<input type="submit" className="mainButton" value={subVal} disabled={subDis} />
				</form>
			</div>
		);
	}
}

export default () =>
	<ReactCssTransitionGroup
		className="comp"
		transitionName="route"
		transitionAppear={true}
		transitionEnterTimeout={500}
		transitionLeaveTimeout={500}
		transitionAppearTimeout={500}
	>
		<h1 className="mainTitle">FORGOT PASSWORD</h1>
		<ForgotForm />
		</ReactCssTransitionGroup>

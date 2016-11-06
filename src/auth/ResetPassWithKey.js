import React					from 'react';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import RippledButton			from '../components/RippledButton';
import ErrorMessage             from '../components/ErrorMessage';
import MatchInput               from '../components/MatchInput';

class ResetPassWithKeyForm extends React.Component {
	state = {
		serverResponse: null,
		username: null,
		resetKey: null,
		password: null,
		passVerif: null,
		subVal: 'SET NEW PASSWORD',
		subDis: false,
	}

	resetPassWithKey = async(e) => {
		e.preventDefault();
		this.setState({
			username: null,
			resetKey: null,
			password: null,
			passVerif: null,
			subVal: 'WAIT',
			serverResponse: null,
			subDis: true,
		});
		if (e.target.password.value !== e.target.passVerif.value) {
			this.setState({ passVerif: 'INVALID', subVal: 'SET NEW PASSWORD' });
			return (false);
		}
		axios({
			method: 'put',
			url: `${apiConnect}user/reset_password`,
			data: {
				username: e.target.username.value,
				resetKey: e.target.resetKey.value,
				password: e.target.password.value,
			},
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'invalid request') {
					const error = {};
					data.error.forEach((el) => {
						error[el.path] = el.error.toUpperCase();
					})
					this.setState({
						...error,
						subVal: 'SET NEW PASSWORD',
						subDis: false,
					});
				} else {
					this.setState({ serverResponse: data.details, subVal: 'SET NEW PASSWORD', subDis: false });
				}
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => browserHistory.push('/'), 1000);
			}
		}).catch(() => this.setState({ subVal: 'ERROR', serverResponse: 'AN ERROR OCCURRED' }));
	}

	render() {
		const {
			serverResponse,
			username,
			resetKey,
			password,
			passVerif,
			subVal,
			subDis,
		} = this.state;
		return (
			<div>
				<div className="errorMessageMain isVisible">{serverResponse}</div>
				<form onSubmit={this.resetPassWithKey}>
					<MatchInput label="USERNAME" inputType="text" inputName="username">
						{username && (<ErrorMessage message={username}/>)}
					</MatchInput>
					<MatchInput label="CODE" inputType="text" inputName="resetKey">
						{resetKey && (<ErrorMessage message={resetKey}/>)}
					</MatchInput>
					<MatchInput label="NEW PASSWORD" inputType="password" inputName="password">
						{password && (<ErrorMessage message={password}/>)}
					</MatchInput>
					<MatchInput label="CONFIRM PASSWORD" inputType="password" inputName="passVerif">
						{passVerif && (<ErrorMessage message={passVerif}/>)}
					</MatchInput>
					<RippledButton butType="submit" value={subVal} disabled={subDis} />
				</form>
			</div>
		);
	}
}

export default () =>
	<div className="comp">
		<h1 className="mainTitle">RESET YOUR PASSWORD</h1>
		<ResetPassWithKeyForm/>
	</div>

import React					from 'react'
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';
import RippledButton			from '../components/RippledButton';

class UpdatePasswordForm extends React.Component {
	state = {
		oldPassword: null,
		newPassConfirm: null,
		newPassword: null,
		subDis: false,
		subVal: 'SAVE',
	}

	updatePass = (e) => {
		e.preventDefault();
		const { oldPassword, newPassConfirm, newPassword } = e.target;
		this.setState({
			oldPassword: null,
			newPassConfirm: null,
			newPassword: null,
			subVal: 'WAIT',
			subDis: true,
			serverResponse: null,
		});
		if (newPassword.value !== newPassConfirm.value) {
			this.setState({ newPassConfirm: 'INVALID', subDis: false, subVal: 'SAVE' });
			return (false);
		}
		axios({
			url: `${apiConnect}user/update_password`,
			method: 'put',
			data: {
				oldPassword: oldPassword.value,
				newPassword: newPassword.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'invalid request') {
					const error = {};
					data.error.forEach((err) => error[err.path] = err.error.toUpperCase());
					this.setState({ ...error, subDis: false, subVal: 'SAVE' });
				} else {
					this.setState({
						serverResponse: data.details.toUpperCase(),
						subDis: false,
						subVal: 'SAVE',
					});
				}
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => {
					browserHistory.push('/matcha/my_profile');
				}, 1000);
			}
		}).catch((err) => this.setState({ serverResponse: 'AN ERROR OCCURRED', subVal: 'ERROR' }));
	}

	render() {
		const {
			oldPassword,
			newPassConfirm,
			newPassword,
			subDis,
			subVal,
			serverResponse,
		} = this.state;
		return (

			<form onSubmit={this.updatePass}>
				<div className="errorMessageMain">{serverResponse}</div>
				<MatchInput label="OLD PASSWORD" inputName="oldPassword" inputType="password">
					<ErrorMessage message={oldPassword} />
				</MatchInput>
				<MatchInput label="NEW PASSWORD" inputName="newPassword" inputType="password">
					<ErrorMessage message={newPassword} />
				</MatchInput>
				<MatchInput label="CONFIRM NEW PASSWORD" inputName="newPassConfirm" inputType="password">
					<ErrorMessage message={newPassConfirm} />
				</MatchInput>
				<RippledButton butType="submit" value={subVal} disabled={subDis}/>
			</form>
		);
	}
}

export default class UpdatePassword extends React.Component {
	state = {
		auth: false,
	}

	componentWillMount() {
		axios.get(`${apiConnect}user/checkAuth`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) browserHistory.push('/');
			else this.setState({ auth: true });
		});
	}

	render() {
		const { auth } = this.state;
		if (!auth) return (<div></div>);
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
				<h1 className="mainTitle">UPDATE YOUR PASSWORD</h1>
				<UpdatePasswordForm />
			</ReactCssTransitionGroup>
		);
	}
}
import React					from 'react'
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import MatchInput				from '../components/MatchInput';
import ErrorMessage				from '../components/ErrorMessage';
import RippledButton			from '../components/RippledButton';

class UpdateMailForm extends React.Component {
	state = {
		mail: null,
		subVal: 'SAVE',
		subDis: false,
		serverResponse: null,
	}

	updateMail = (e) => {
		e.preventDefault();
		this.setState({
			serverResponse: null,
			subDis: true,
			subVal: 'WAIT',
			mail: null,
		});
		if (e.target.mail && e.target.mail.value.length > 100) {
			this.setState({ mail: '100 CHARACTERS MAX', subDis: false, subVal: 'SAVE' });
			return (false);
		}
		axios({
			url: `${apiConnect}user/update_mail`,
			method: 'put',
			data: {
				mail: e.target.mail.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'invalid request') {
					const error = {};
					data.error.forEach((el) => error[el.path] = el.error.toUpperCase());
					this.setState({ ...error, subVal: 'SAVE', subDis: false });
				} else this.setState({ subVal: 'SAVE', subDis: false, serverResponse: data.details });
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => browserHistory.push('/confirm_mail'), 1000);
			}
		}).catch((err) => this.setState({ serverResponse: 'AN ERROR OCCURRRED', subVal: 'ERROR' }));
	}

	render() {
		const { mail, serverResponse, subVal, subDis } = this.state;
		return (
			<form onSubmit={this.updateMail}>
				<div className="errorMessageMain">{serverResponse}</div>
				<MatchInput label="MAIL" inputName="mail" inputType="text">
					<ErrorMessage message={mail} />
				</MatchInput>
				<RippledButton butType="submit" value={subVal} disabled={subDis}/>
			</form>
		);
	}
}

export default class UpdateMail extends React.Component {
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
		if (!auth) return (<div className="comp"></div>);
		return (
			<div className="comp">
				<h1 className="mainTitle">UPDATE YOUR MAIL</h1>
				<UpdateMailForm />
			</div>
		);
	}
}
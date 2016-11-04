import React					from 'react'
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
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
		}).catch((err) => {
			console.log(err);
			this.setState({ serverResponse: 'AN ERROR OCCURRRED', subVal: 'ERROR' })
		});
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
		console.log(this.props.con);
		axios.get(`${apiConnect}user/checkAuth`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) browserHistory.push('/');
			else this.setState({ auth: true });
		});
	}

	componentWillReceiveProps = (newProps) => console.log(newProps.con);

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
				<h1 className="mainTitle">UPDATE YOUR MAIL</h1>
				<UpdateMailForm />
			</ReactCssTransitionGroup>
		);
	}
}
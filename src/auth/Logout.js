import React						from 'react';
import { browserHistory }			from 'react-router';
import axios						from 'axios';
import apiConnect					from '../apiConnect';

import './css/logout.sass';

export default class Logout extends React.Component {
	state = {
		message: null,
	}

	componentWillMount() {
		axios({
			url: `${apiConnect}user/logout`,
			method: 'put',
			headers: { Authorization: `Bearer ${localStorage.getItem('logToken')}` },
		}).then(({ data }) => {
			if (data.status === true) {
				this.setState({ message: 'YOU ARE NOW LOGGED OUT' })
				localStorage.removeItem('logToken');
				setTimeout(() => browserHistory.push('/'), 1000);
			} else browserHistory.push('/');
		}).catch(() => browserHistory.push('/'));
	}

	render() {
		const { message } = this.state;
		if (!message) return (<div className="comp"></div>);
		return (
			<div className="comp">
				<h1 className="mainTitle">{message}</h1>
			</div>
		)
	}
}

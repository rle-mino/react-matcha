import React						from 'react';
import { browserHistory }			from 'react-router';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
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
				// localStorage.removeItem('logToken');
				setTimeout(() => browserHistory.push('/'), 1000);
			} else browserHistory.push('/');
		}).catch(() => browserHistory.push('/'));
	}

	render() {
		const { message } = this.state;
		if (!message) return (<div></div>);
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
				<h1 className="mainTitle">{message}</h1>
			</ReactCssTransitionGroup>
		)
	}
}

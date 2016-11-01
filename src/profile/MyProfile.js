import React						from 'react';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import { browserHistory }			from 'react-router';
import axios						from 'axios';
import apiConnect					from '../apiConnect';

import Profile						from '../components/Profile';

export default class MyProfile extends React.Component {
	_mounted = false

	state = {
		data: {},
		editComp: null,
	}

	componentWillMount() {
		axios({
			url: `${apiConnect}user/singular/all`,
			headers: { Authorization : `Bearer ${localStorage.getItem('logToken')}` },
		}).then(({ data }) => {
			if (!this._monted) return (false); 
			if (data.status === false) browserHistory.push('/');
			else this.setState({ data: data.more });
		});
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false
	}

	render() {
		return (
			<ReactCssTransitionGroup
				className="matcha"
				component="div"
				transitionName="route"
				transitionAppear={true}
				transitionEnterTimeout={500}
				transitionLeaveTimeout={500}
				transitionAppearTimeout={500}
			>
				<h1 className="mainTitle">PROFILE</h1>
				<Profile editable={true} data={this.state.data} />
			</ReactCssTransitionGroup>
		);
	}
}

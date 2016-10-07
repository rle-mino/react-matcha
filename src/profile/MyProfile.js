import React						from 'react';
import ReactCssTransitionGroup		from 'react-addons-css-transition-group';
import { browserHistory }			from 'react-router';
import axios						from 'axios';
import apiConnect					from '../apiConnect';

import Profile						from '../components/Profile';

export default class MyProfile extends React.Component {
	state = {
		data: {},
		editComp: null,
	}

	componentWillMount() {
		const logToken = localStorage.getItem('logToken');
		if (!logToken) browserHistory.push('/');
		axios({
			url: `${apiConnect}user/singular/all`,
			headers: { logToken },
		}).then(({data}) => {
			if (data.status === false) browserHistory.push('/');
			else this.setState({ data: data.more });
		});
	}

	render() {
		return (
			<div>
				<ReactCssTransitionGroup
					className="matcha"
					transitionName="route"
					transitionAppear={true}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
					transitionAppearTimeout={500}
				>
					<h1 className="mainTitle">MY PROFILE</h1>
					<Profile editable={true} data={this.state.data} />
				</ReactCssTransitionGroup>
			</div>
		);
	}
}

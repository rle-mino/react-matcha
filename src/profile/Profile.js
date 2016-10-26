import React                    from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import { browserHistory }		from 'react-router';

import Profile					from '../components/Profile';

export default class ProfileExt extends React.Component {
	state = {
		data: null,
	}

	componentWillMount() {
		axios({
			url: `${apiConnect}user/singular/all?username=${this.props.params.username}`,
			headers: { Authorization : `Bearer ${localStorage.getItem('logToken')}` },
		}).then(({data}) => {
			if (data.status === false) {
				if (data.details === 'user unauthorized') {
					browserHistory.push('/');
				} else browserHistory.push('/matcha/my_profile');
			}
			else this.setState({ data: data.more });
		});
	}

	render() {
		const { data } = this.state;
		if (!data) return (<div></div>);
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
				<Profile editable={false} data={data} />
			</ReactCssTransitionGroup>
		);
	}
}
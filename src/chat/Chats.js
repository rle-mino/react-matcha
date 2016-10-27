import React					from 'react';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';

// import RippledButton			from '../components/RippledButton';

import './chats.sass';

export default class Chat extends React.Component {
	state = {
		rooms: null,
		auth: false,
	}

	componentWillMount() {
		axios.get(`${apiConnect}user/get_self_interest`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`
			}
		}).then(({ data }) => {
			if (data.status === false) {
				if (data.details === 'user unauthorized') browserHistory.push('/');
			} else {
				console.log(data.more);
				this.setState({ auth: true, rooms: data.more.map((el, key) => {
					return (
						<li key={key} className="miniChat">
							<div className="thumbChat" style={{ backgroundImage: `url('${apiConnect}user/get_img_src/${el.user.image}')` }}></div>
							<span>{el.user.username}</span>
						</li>
					)}) });
			}
		});
	}
	
	render() {
		const { rooms, auth } = this.state;
		if (!auth) return (<div></div>);
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
				<h1 className="mainTitle">CHATS</h1>
				<ul className="rooms">{rooms}</ul>
			</ReactCssTransitionGroup>
		);
	}
}
import React						from 'react';
import { Link, browserHistory }		from 'react-router';
import io							from 'socket.io-client';
import axios						from 'axios';
import apiConnect					from './apiConnect';

import FontAwesome					from 'react-fontawesome';

import './header.sass';

class MatchHeader extends React.Component {
	state = {
		notifications: [],
		lastNotif: null,
		connectStatus: 'isConnected',
		headVis: 'header',
		notifBlock: 'notifBlock',
		lastNotifClass: 'lastNotif',
		socket: null,
	}

	componentDidMount() {
		this.socket = io('http://localhost:8080');
		this.setState({ socket: this.socket });
		this.socket.emit('auth', localStorage.getItem('logToken'));
		this.socket.on('connect status', (status) => {})
		this.socket.on('new notification', (notification) => {
			const { notifications } = this.state;
			const newNotifList = notifications ? [notification, ...notifications] : [notification];
			this.setState({ lastNotif: notification, notifications: newNotifList });
		});
	}

	componentWillReceiveProps = (newProps) => {
		this.setState({ notifications: newProps.notifications });
	}

	componentWillMount(){
		this.setState({ notifications: this.props.notifications });
	}

	showHeader = (e) => {
		if (this.state.headVis.includes('isVisible')) {
			this.setState({ headVis: 'header' });
		} else {
			this.setState({ headVis: 'header isVisible' });
		}
	}

	seeList = (e) => {
		this.setState({
			notifBlock: this.state.notifBlock === 'notifBlock showNotif' ?
				'notifBlock' : 'notifBlock showNotif'
			});
	}

	watched = (e) => {
		this.setState({ lastNotifClass: 'lastNotif leave' });
		setTimeout(() => {
			this.setState({ lastNotif: null, lastNotifClass: 'lastNotif' });
		}, 500);
	}

	componentWillAppear = () => {
		console.log('componentWillAppear');
	}

	componentDidEnter = () => {
		console.log('did enter');
	}

	componentWillLeave = () => {
		console.log('will leave');
	}

	componentDidLeave = () => {
		console.log('componentDidLeave');
	}

	render() {
		const { lastNotif, headVis, notifications, notifBlock, lastNotifClass } = this.state;
		const notifList = notifications ? notifications.map((el, key) => <li key={key} className="notification">{el}</li>) : [];
		return (
			<div className="headAndButton">
				<FontAwesome name="bars" className="headerToggler" onClick={this.showHeader}/>
				<div className={headVis}>
					<div className="links">
						<Link to="/matcha/my_profile" activeClassName="routeIsActive">
							<div className="headerLink">MY PROFILE</div>
						</Link>
						<Link to="/matcha/suggestion" activeClassName="routeIsActive">
							<div className="headerLink">SUGGESTIONS</div>
						</Link>
						<Link to="/matcha/search" activeClassName="routeIsActive">
							<div className="headerLink">SEARCH</div>
						</Link>
						<Link to="/matcha/chats" activeClassName="routeIsActive">
							<div className="headerLink">CHATS</div>
						</Link>
						<Link to="logout" activeClassName="routeIsActive">
							<div className="headerLink">LOGOUT</div>
						</Link>
					</div>
					<div className="showList" onClick={this.seeList}>LATESTS NOTIFICATIONS</div>
					{lastNotif && (<div className={lastNotifClass} onClick={this.watched}>{lastNotif}</div>)}
					<ul className={notifBlock}>
						{notifList}
					</ul>
				</div>
			</div>
		);
	}
}

// const MatchFooter = () => <footer className="footer">rle-mino 2016</footer>

export default class AppHeader extends React.Component {
	state = {
		notifications: [],
	}

	componentWillMount() {
		if (!localStorage.getItem('logToken')) {
			browserHistory.push('/');
		} else {
			axios({
				url: `${apiConnect}user/notification/latest`,
				method: 'get',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('logToken')}`,
				},
			}).then(({ data }) => {
				if (data.status === true) this.setState({ notifications: data.more });
			})
		}
	}

	getChildContext() {
		if (this.refs && this.refs.header && this.refs.header.state) {
			return ({ socket: this.refs.header.state.socket });
		}
		else return ({ socket: null });
	}

	render() {
		return (
			<div className="AppHeader">
				<MatchHeader notifications={this.state.notifications} ref="header" />
	    		{this.props.children}
	        </div>
		);
	}
}

AppHeader.childContextTypes = {
	socket: React.PropTypes.object,
};

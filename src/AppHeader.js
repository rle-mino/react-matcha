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
		global.socket = this.socket;
		this.setState({ socket: this.socket });
		this.socket.emit('auth', localStorage.getItem('logToken'));

		this.socket.on('new notification', (notification) => {
			const { notifications } = this.state;
			const newNotifList = notifications ? [notification, ...notifications] : [notification];
			this.setState({ lastNotif: notification, notifications: newNotifList });
		});
		if (this.props.location.pathname === '/matcha/chats') {
			this.socket.on('receive message', this.notifMessage);
		}
	}

	notifMessage = ({ author }) => {
		const { notifications } = this.state;
		const notification = `${author} sent you a message`;
		const newNotifList = notifications ? [notification, ...notifications] : [notification];
		this.setState({ notifications: newNotifList, lastNotif: notification });
	}

	componentWillUnmount() {
		this.socket.disconnect();
	}

	componentWillReceiveProps = (newProps) => {
		if (newProps.location.pathname === '/matcha/chats') {
			this.socket.removeListener('receive message');
		} else {
			this.socket.removeListener('receive message');
			this.socket.on('receive message', this.notifMessage);
		}
		this.setState({ notifications: newProps.notifications, headVis: 'header' });
	}

	componentWillMount() {
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
				'notifBlock' : 'notifBlock showNotif',
			});
	}

	watched = (e) => {
		this.setState({ lastNotifClass: 'lastNotif leave' });
		setTimeout(() => {
			this.setState({ lastNotif: null, lastNotifClass: 'lastNotif' });
		}, 500);
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
							<div className="headerLink">CHAT</div>
						</Link>
						<Link to="/matcha/logout" activeClassName="routeIsActive">
							<div className="headerLink">LOGOUT</div>
						</Link>
					</div>
					<div className="showList" onClick={this.seeList}>LATESTS NOTIFICATIONS</div>
					{lastNotif && (<div className={lastNotifClass} onClick={this.watched}>{lastNotif}</div>)}
					{notifList.length > 0 && <ul className={notifBlock}>
						{notifList}
					</ul>}
				</div>
			</div>
		);
	}
}

const MatchFooter = () => <footer className="footer">rle-mino 2016</footer>

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

	render() {
		return (
			<div className="AppHeader">
				<MatchHeader
					notifications={this.state.notifications}
					location={this.props.location}
				/>
					{this.props.children}
				<MatchFooter />
	        </div>
		);
	}
}
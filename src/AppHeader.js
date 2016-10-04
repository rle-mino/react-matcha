import React						from 'react';
import { Link, browserHistory }		from 'react-router';
import io							from 'socket.io-client';

import FontAwesome					from 'react-fontawesome';

import './header.sass';

class MatchHeader extends React.Component {
	state = {
		lastNotif: null,
		connectStatus: 'isConnected',
		headVis: 'header',
		notifBlock: 'notifBlock'
	}

	showHeader = (e) => {
		if (this.state.headVis.includes('isVisible')) {
			this.setState({ headVis: 'header' });
		} else {
			this.setState({ headVis: 'header isVisible' });
		}
	}

	componentDidMount() {
		this.socket = io('http://localhost:8080');
		this.socket.emit('auth', localStorage.getItem('logToken'));
		this.socket.on('connect status', (status) => {
			console.log(status);
		})
		this.socket.on('new notification', (notification) => {
			console.log('coucou');
			this.setState({ lastNotif: notification, lastNotifClass: 'lastNotif newNotif' });
		});
	}

	watched = (e) => {
		this.setState({ lastNotifClass: 'lastNotif' });
	}

	render() {
		const { lastNotif, headVis, lastNotifClass } = this.state;
		return (
			<div className="headAndButton">
				<FontAwesome name="bars" className="headerToggler" onClick={this.showHeader}/>
				<div className={headVis}>
					<div className="links">
						<Link to="matcha/my_profile" activeClassName="routeIsActive">
							<div className="headerLink">MY PROFILE</div>
						</Link>
						<Link to="suggestion" activeClassName="routeIsActive">
							<div className="headerLink">SUGGESTION</div>
						</Link>
						<Link to="search" activeClassName="routeIsActive">
							<div className="headerLink">SEARCH</div>
						</Link>
						<Link to="logout" activeClassName="routeIsActive">
							<div className="headerLink">LOGOUT</div>
						</Link>
					</div>
					<div className='notifBlock' onClick={this.watched}>
						<div className={lastNotifClass}>{lastNotif}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default class AppHeader extends React.Component {
	componentWillMount() {
		if (!localStorage.getItem('logToken')) {
			browserHistory.push('/');
		}
	}

	render() {
		return (
			<div className="AppHeader">
				<MatchHeader />
	    		{this.props.children}
	        </div>
		);
	}
}

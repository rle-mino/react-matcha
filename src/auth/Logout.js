import React			from 'react';

import './css/logout.sass';

export default class Logout extends React.Component {
	state = {
		buttonVal: 'LOGOUT',
	}

	logout = (e) => {
		e.preventDefault();
		localStorage.removeItem('logToken');
		this.setState({ buttonVal: 'SUCCESS' });
	}

	render() {
		return (
			<div className="comp">
				<h1 className="mainTitle">LOGOUT</h1>
				<form onSubmit={this.logout}>
					<input type="submit" value={this.state.buttonVal} className="mainButton" />
				</form>
			</div>
		)
	}
}

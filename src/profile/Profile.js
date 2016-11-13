import React                    from 'react';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import { browserHistory }		from 'react-router';

import Profile					from '../components/Profile';

export default class ProfileExt extends React.Component {
	_mounted = false;

	state = {
		data: null,
	}

	componentWillMount() {
		axios({
			url: `${apiConnect}user/singular/all?username=${this.props.params.username}`,
			headers: { Authorization : `Bearer ${localStorage.getItem('logToken')}` },
		}).then(({ data }) => {
			if (!this._mounted) return (false);
			if (data.status === false) {
				if (data.details === 'user unauthorized') {
					browserHistory.push('/');
				} else browserHistory.push('/matcha/my_profile');
			} else this.setState({ data: data.more });
		});
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	render() {
		const { data } = this.state;
		if (!data) return (<div className="matcha"></div>);
		return (
			<div className="matcha">
				<h1 className="mainTitle">PROFILE</h1>
				<Profile editable={false} data={data} />
			</div>
		);
	}
}
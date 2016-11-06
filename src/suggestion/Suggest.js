import React					from 'react'
import { browserHistory, Link }	from 'react-router';
import FlipMove					from 'react-flip-move';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import SortBar					from '../components/SortBar';
import UserFast					from '../components/UserFast';

export default class Suggest extends React.Component {
	_mounted = false;

	state = {
		results: [],
		users: [],
	}

	sortResults = async (e) => {
		const sortedUser = await this.state.users.sort((a, b) => {
			if (e.target.value === 'distance' || e.target.value === 'age') {
				return (a[e.target.value] - b[e.target.value]);
			}
			return (-a[e.target.value] - -b[e.target.value]);
		});
		const newUserFasts = sortedUser.map((el) =>
			<Link to={`/matcha/profile/${el.username}`} key={el._id}>
				<UserFast data={el} />
			</Link>
		);
		this.setState({ results: newUserFasts });
	}

	componentWillMount() {
		axios.get(`${apiConnect}user/suggest`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (!this._mounted) return (false);
			if (data.status === true) {
				this.setState({ users: data.more, results: data.more.map((el) =>
					<Link to={`/matcha/profile/${el.username}`} key={el._id}>
						<UserFast data={el} />
					</Link>
				) });
			} else {
				if (data.details === 'user unauthorized') browserHistory.push('/');
				else browserHistory.push('/matcha/my_profile');
			}
		})
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnMount() {
		this._mounted = false;
	}

	render() {
		let { results } = this.state;
		if (!results.length) results = (<div className="errorMessageMain">NOTHING TO SUGGEST</div>);
		return (
			<div className="matcha">
				<form onChange={this.sortResults}>
					<SortBar defaultSort="popularity" />
				</form>
				<FlipMove typeName="ul" className="results">
					{results}
				</FlipMove>
			</div>
		);
	}
}
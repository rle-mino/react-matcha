import React					from 'react'
import { browserHistory, Link }	from 'react-router';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
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
		const newUserFasts = sortedUser.map((el, key) =>
			<Link to={`/matcha/profile/${el.username}`} key={key}>
				<UserFast data={el} />
			</Link>
		);
		this.setState({ results: newUserFasts });
	}

	componentWillMount() {
		axios.get(`${apiConnect}user/suggest`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('logToken')}` }
		}).then(({ data }) => {
			if (!this._mounted) return (false);
			if (data.status === true) {
				this.setState({ users: data.more, results: data.more.map((el, key) =>
					<Link to={`/matcha/profile/${el.username}`} key={key}>
						<UserFast data={el} />
					</Link>
				)});
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
		const { results } = this.state;
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
			<form onChange={this.sortResults}>
				<SortBar defaultSort="popularity" />
			</form>
			<ReactCssTransitionGroup
					className="results"
					component="ul"
					transitionName="card"
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
				>
					{results}
				</ReactCssTransitionGroup>
			</ReactCssTransitionGroup>
		);
	}
}
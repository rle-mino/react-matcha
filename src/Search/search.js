import React					from 'react';
import _						from 'lodash';
import { Link, browserHistory }	from 'react-router';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import InputRange				from 'react-input-range';
import axios					from 'axios';
import apiConnect				from '../apiConnect';
import ripple					from '../ripple';

import FontAwesome				from 'react-fontawesome';
import ThreeSelector			from '../components/ThreeSelector';
import UserFast					from '../components/UserFast';
import SortBar					from '../components/SortBar';

import './css/search.sass';
import './css/inputRange.sass';

const SearchInput = ({ children, label }) =>
	<div className="searchInput">
		<div className="searchLabel">{label}</div>
		{children}
	</div>

class SearchForm extends React.Component {
		state = {
		subDis: false,
		subVal: '&nbsp;',
		advanced: false,
		serverResponse: null,
		ageVal: {
			min: 18,
			max: 100,
		},
		popVal: {
			min: 0,
			max: 100,
		},
		distVal: {
			min: 0,
			max: 100,
		},
		tagVal: {
			min: 0,
			max: 100,
		},
	}

	search = (e) => {
		e.preventDefault();
		const { ageVal, popVal, tagVal, distVal } = this.state;
		const checkedInput = _.filter(e.target.orientation, (el) => el.checked);
		const orientation = checkedInput.map((el) => el.value);
		this.setState({ serverResponse: null });
		axios.get(`${apiConnect}user/search`, {
			params: {
				name: e.target.name.value,
				ageMin: ageVal.min,
				ageMax: ageVal.max,
				popMin: popVal.min,
				popMax: popVal.max,
				tagMin: tagVal.min,
				tagMax: tagVal.max,
				distMax: distVal.max,
				distMin: distVal.min,
				gender: e.target.gender.value,
				orientation1: orientation[0],
				orientation2: orientation[1],
				orientation3: orientation[2],
				sort: e.target.sort.value,
			},
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (data.status === false) {
				this.setState({ serverResponse: 'AN ERROR OCCURRED' });
			} else {
				if (!data.more.length) {
					this.setState({ serverResponse: 'NO RESULTS FOUND' });
				}
				this.props.setResults(data.more);
			}
		});
	}

	updateAge = (comp, values) => this.setState({ ageVal: values });
	updatePop = (comp, values) => this.setState({ popVal: values });
	updateDist = (comp, values) => this.setState({ distVal: values });
	updateTag = (comp, values) => this.setState({ tagVal: values });
	showAdvanced = (e) => {
		ripple(e);
		this.setState({ advanced: !this.state.advanced });
	}

	render() {
		const {
			ageVal,
			popVal,
			distVal,
			tagVal,
			subDis,
			serverResponse,
			advanced,
		} = this.state;
		return (
			<form onSubmit={this.search} className="searchForm">
				<div className="errorMessageMain">{serverResponse}</div>
				<div className="label">NAME / USERNAME</div>
				<input type="text" name="name" className="textInp" />
				<button onClick={this.showAdvanced} className="showAdvancedButton" type="button">
					<FontAwesome name={advanced ? 'angle-up' : 'angle-down'} className="showAdvanced" />
				</button>
				<div className={`searchBlocks ${!advanced ? 'invisible' : ''}`}>
					<div className="leftSearch">
						<SearchInput label="AGE">
							<InputRange maxValue={100} minValue={18} value={ageVal} onChange={this.updateAge.bind(this)} />
						</SearchInput>
						<SearchInput label="COMMON TAGS">
							<InputRange maxValue={100} minValue={0} value={tagVal} onChange={this.updateTag.bind(this)} />
						</SearchInput>
						<ThreeSelector name="orientation" label="ORIENTATION"
							value3="straight" label3="STRAIGHT"
							value1="bisexual" label1="BISEXUAL"
							value2="gay" label2="GAY"
							className="orientationSelector"
							inpType="checkbox"
						/>
					</div>
					<div className="rightSearch">
						<SearchInput label="POPULARITY">
							<InputRange maxValue={100} minValue={0} value={popVal} onChange={this.updatePop.bind(this)} />
						</SearchInput>
						<SearchInput label="DISTANCE(KM)">
							<InputRange maxValue={100} minValue={0} value={distVal} onChange={this.updateDist.bind(this)} />
						</SearchInput>
						<ThreeSelector name="gender" label="GENDER"
							value2="male" label2="MALE"
							value3="other" label3="OTHER"
							value1="female" label1="FEMALE"
							className="genderSelector"
						/>
					</div>
				</div>
				<SortBar defaultSort="popularity" />
				<button type="submit" disabled={subDis} onMouseDown={ripple}>
					<FontAwesome name="search" className="searchButton" />
				</button>
			</form>
		);
	}
}

export default class Search extends React.Component {
	_mounted = false;

	state = {
		users: [],
		auth: false,
	}

	setResults = (results) => {
		const users = results.map((el, key) => <Link to={`/matcha/profile/${el.username}`} key={key}><UserFast data={el} /></Link>);
		this.setState({ users });
	}

	componentWillMount() {
		axios.get(`${apiConnect}user/checkAuth`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (!this._mounted) return (false);
			if (data.status === false) browserHistory.push('/');
			else this.setState({ auth: true });
		});
		if (this.props.location.query.tag) {
			axios.get(`${apiConnect}tag/search`, {
				params: {
					tag: this.props.location.query.tag,
				},
				headers: {
					Authorization: `Bearer ${localStorage.getItem('logToken')}`,
				},
			}).then(({ data }) => {
				if (!this._mounted) return (false);
				if (data.status === true) {
					this.setResults(data.more);
				}
			});
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentDidMount() {
		this._mounted = true;
	}

	render() {
		const { users, auth } = this.state;
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
				<div className="mainTitle">SEARCH</div>
				<SearchForm setResults={this.setResults} />
				<ReactCssTransitionGroup
					className="results"
					component="ul"
					transitionName="card"
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}
				>
					{users}
				</ReactCssTransitionGroup>
			</ReactCssTransitionGroup>
		);
	}
}

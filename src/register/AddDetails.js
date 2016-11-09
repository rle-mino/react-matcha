import _						from 'lodash';
import React					from 'react';
import { browserHistory }		from 'react-router';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import TagInput					from '../components/TagInput';
import Unauthorized				from '../Unauthorized';
import ErrorMessage				from '../components/ErrorMessage';
import BioInput					from '../components/BioInput';
import ThreeSelector			from '../components/ThreeSelector';
import RippledButton			from '../components/RippledButton';
import MatchInput				from '../components/MatchInput';

import './css/addDetails.sass';

class AddDetailsForm extends React.Component {
	_mounted = false;

	state = {
		serverResponse: null,
		addedTags: [],
		subVal: 'ADD DETAILS',
		subDis: false,
		bio: null,
		location: null,
		gender: null,
		orientation: null,
		tags: null,
	}

	checkAddress = async (value) => {
		if (!value) return (null);
		const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}`);
		if (response.data.status === 'OK') {
			const result = response.data.results[0];
			return ({
				address: result.formatted_address.toUpperCase(),
				lat: result.geometry.location.lat,
				lng: result.geometry.location.lng,
			});
		}
		return (false);
	}

	sendDetails = async (e) => {
		e.preventDefault();
		e.persist();
		this.setState({
			subVal: 'WAIT',
			location: null,
			gender: null,
			orientation: null,
			bio: null,
			tags: null,
			subDis: true,
			serverResponse: null,
		});
		const addedTags = this.refs.tagInput.state.addedTags;
		const location = await this.checkAddress(e.target.geoloc.value);
		const data = {
			location,
			gender: e.target.gender.value,
			orientation: e.target.orientation.value,
			bio: e.target.bio.value,
			tags: this.refs.tagInput.state.addedTags,
		}
		axios({
			method: 'put',
			url: `${apiConnect}user/add_details`,
			data: data,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (!this._mounted) return (false);
			if (data.status === false) {
				if (data.details === 'invalid request') {
					const error = {};
					data.error.forEach((el) => error[el.path] = el.error.toUpperCase());
					this.setState({ ...error });
				} else this.setState({ serverResponse: data.details });
			this.setState({ subDis: false, subVal: 'ADD DETAILS', addedTags });
			} else {
				this.setState({ subVal: 'SUCCESS' });
				setTimeout(() => {
					browserHistory.push('add_photos');
				}, 2000);
			}
		}).catch(() => this.setState({ subVal: 'ERROR', serverResponse: 'AN ERROR OCCURRED' }));
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	render() {
		const {
			serverResponse,
			location,
			bio,
			gender,
			orientation,
			tags,
			subVal,
			subDis,
			addedTags,
		} = this.state;
		return (
			<div className="addDetailsForm">
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.sendDetails}>
					<MatchInput inputType="text" inputName="geoloc" label="LOCATION">
						<ErrorMessage message={location} />
					</MatchInput>
					<ThreeSelector name="gender" label="GENDER"
						value1="male" label1="MALE"
						value2="other" label2="OTHER"
						value3="female" label3="FEMALE"
						className="genderSelector"
					>
						<ErrorMessage message={gender} />
					</ThreeSelector>
					<ThreeSelector name="orientation" label="ORIENTATION"
						value1="gay" label1="GAY"
						value2="bisexual" label2="BISEXUAL"
						value3="straight" label3="STRAIGHT"
						className="orientationSelector"
					>
						<ErrorMessage message={orientation} />
					</ThreeSelector>
					<BioInput>
						<ErrorMessage message={bio} />
					</BioInput>
					<TagInput savedTags={this.props.tags} addedTags={addedTags} ref="tagInput" >
						<ErrorMessage message={tags} />
					</TagInput>
					<RippledButton butType="submit" value={subVal} disabled={subDis} />
				</form>
			</div>
		);
	}
}

export default class AddDetails extends React.Component {
	_mounted = false;

	state = {
		auth: true,
		tags: [],
	};

	componentWillMount() {
		this.setState({ auth: !!localStorage.getItem('logToken') });
		axios({
			method: 'get',
			url: `${apiConnect}tag/all`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		})
		.then(({ data }) => {
			if (!this._mounted) return (false);
			this.setState({ tags: data });
		});
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	render() {
		const { auth, tags } = this.state;
		if (!auth) return (<Unauthorized message="YOU HAVE TO BE LOGGED-IN" />);
		return (
			<div>
				{!_.isEmpty(tags) && !_.isNil(tags) && (
					<div className="comp">
						<h1 className="mainTitle">ADD DETAILS TO YOUR PROFIL</h1>
						<AddDetailsForm tags={tags} />
					</div>
				)}
			</div>
		);
	}
}

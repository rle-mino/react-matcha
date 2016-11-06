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

import './css/addDetails.sass';

class GeolocInput extends React.Component {
	state = {
		isFocused: '',
		localInval: null,
		geolocButtonVal: 'LOCATE ME',
		geolocButtonDis: false,
		lat: null,
		lng: null,
	}

	geoLoc = async (e) => {
		e.preventDefault();
		this.setState({ geolocButtonVal: 'WAIT', geolocButtonDis: true });
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(async(position) => {
				let lat = position.coords.latitude;
				let lng = position.coords.longitude;
				const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`);
				if (response.data.status === 'OK') {
					this.setState({
						geolocButtonVal: response.data.results[3].formatted_address.toUpperCase(),
						lat,
						lng,
					});
				} else {
					this.setState({ geolocButtonVal: 'FAILED TO LOCATE YOU' });
				}
			}, (error) => {
				this.setState({ geolocButtonVal: error.message.toUpperCase() });
			});
		}
	}

	render() {
		const { geolocButtonVal, geolocButtonDis } = this.state;
		return (
			<div className="geolocInput">
				<div className="beforeInput">
					<div className="label">LOCATION</div>
					{this.props.children}
				</div>
				<input
					type="button"
					className="geolocButton"
					value={geolocButtonVal}
					name="geoloc"
					onClick={this.geoLoc}
					disabled={geolocButtonDis}
				/>
			</div>
		);
	}
}

class AddDetailsForm extends React.Component {
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

	sendDetails = async (e) => {
		e.preventDefault();
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
		const { lat, lng } = this.refs.geolocInput.state;
		const addedTags = this.refs.tagInput.state.addedTags;
		const data = {
			location: {
				lat,
				lng,
				address: e.target.geoloc.value,
			},
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
					<GeolocInput ref="geolocInput">
						<ErrorMessage message={location} />
					</GeolocInput>
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
						<ErrorMessage message={bio}/>
					</BioInput>
					<TagInput savedTags={this.props.tags} addedTags={addedTags} ref="tagInput" >
						<ErrorMessage message={tags}/>
					</TagInput>
					<RippledButton butType="submit" value={subVal} disabled={subDis} />
				</form>
			</div>
		);
	}
}

export default class AddDetails extends React.Component {
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
			this.setState({ tags: data });
		});
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

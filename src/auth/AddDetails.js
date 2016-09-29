import _						from 'lodash';
import React					from 'react';
import ReactCssTransitionGroup	from 'react-addons-css-transition-group';
import axios					from 'axios';
import apiConnect				from '../apiConnect';

import TagInput					from '../components/TagInput.js';
import Unauthorized				from '../Unauthorized';
import ErrorMessage				from '../components/ErrorMessage';

import './css/addDetails.sass';

class ThreeSelector extends React.Component {
	state = {
		firstC: '',
		secondC: '',
		thirdC: '',
	}

	activate = (e) => {
		this.setState({ firstC: '', secondC: '', thirdC: '' });
		if (e.target.id === this.props.value1) {
			this.setState({ firstC: 'isChecked' });
		} else if (e.target.id === this.props.value2) {
			this.setState({ secondC: 'isChecked' });
		} else {
			this.setState({ thirdC: 'isChecked' });
		}
	}

	render () {
		const { firstC, secondC, thirdC } = this.state;
		return (
			<div className={this.props.className}>
				<div className="beforeInput">
					<div className="labelRadio">{this.props.label}</div>
					{this.props.errorMessage}
				</div>
				<div className="radioInps">
					<input id={this.props.value1} type="radio" name={this.props.name} value={this.props.value1} onClick={this.activate} />
				    <label htmlFor={this.props.value1} className={`radioInp ${firstC}`}>{this.props.label1}</label>
					<input id={this.props.value2} type="radio" name={this.props.name} value={this.props.value2} onClick={this.activate} />
					<label htmlFor={this.props.value2} className={`radioInp ${secondC}`}>{this.props.label2}</label>
				    <input id={this.props.value3} type="radio" name={this.props.name} value={this.props.value3} onClick={this.activate} />
				    <label htmlFor={this.props.value3} className={`radioInp ${thirdC}`}>{this.props.label3}</label>
				</div>
			</div>
		);
	}
}

const BioInput = ({children}) => {
	return (
		<div className="bioInput">
			<div className="beforeInput">
				<div className="label">BIO</div>
				{children}
			</div>
			<textarea name="bio" className="textInp textarea" />
		</div>
	);
}

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
						geolocButtonVal: response.data.results[0].formatted_address.toUpperCase(),
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
		subVal: 'ADD DETAILS',
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
		});
		const { lat, lng } = this.refs.geolocInput.state;
		const data = {
			location: {
				lat,
				lng,
				address: e.target.geoloc.value,
			},
			gender: e.target.gender.value,
			orientation: e.target.orientation.value,
			bio: e.target.bio.value,
			tags: this.refs.tagInput.state.validTag,
		}
		console.log('1');
		const response = await axios({
			method: 'put',
			url: `${apiConnect}user/add_details`,
			data: data,
			headers: {
				logToken: localStorage.getItem('logToken'),
			},
		});
		setTimeout(() => {
			if (response.data.status === false) {
				if (response.data.details === 'invalid request') {
					const error = {};
					response.data.error.forEach((el) => {
						error[el.path] = el.error;
					})
					this.setState({ ...error, subVal: 'ADD DETAILS' });
				}
			} else this.setState({ subVal: 'SUCCESS' });
		}, 1000);
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
		} = this.state;
		return (
			<div className="addDetailsForm">
				<div className="errorMessageMain">{serverResponse}</div>
				<form onSubmit={this.sendDetails}>
					<GeolocInput ref="geolocInput">
						{!!location && (<ErrorMessage message={location} />)}
					</GeolocInput>
					<ThreeSelector name="gender" label="GENDER"
						value1="male" label1="MALE"
						value2="other" label2="OTHER"
						value3="female" label3="FEMALE"
						className="genderSelector"
					>
						{!!gender && (<ErrorMessage message={gender} />)}
					</ThreeSelector>
					<ThreeSelector name="orientation" label="ORIENTATION"
						value1="gay" label1="GAY"
						value2="bisexual" label2="BISEXUAL"
						value3="straight" label3="STRAIGHT"
						className="orientationSelector"
					>
						{!!orientation && (<ErrorMessage message={orientation} />)}
					</ThreeSelector>
					<BioInput>
						{!!bio && (<ErrorMessage message={bio}/>)}
					</BioInput>
					<TagInput tags={this.props.tags} ref="tagInput" >
						{tags && (<ErrorMessage message={tags}/>)}
					</TagInput>
					<input type="submit" value={subVal} className="mainButton" />
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
			url: `${apiConnect}tag/get/all`,
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
					<ReactCssTransitionGroup
						component="div"
						transitionName="route"
						className="comp"
						transitionAppear={true}
						transitionEnterTimeout={500}
						transitionAppearTimeout={500}
						transitionLeaveTimeout={500}
					>
						<h1 className="mainTitle">ADD DETAILS TO YOUR PROFIL</h1>
						<AddDetailsForm tags={tags} />
					</ReactCssTransitionGroup>
				)}
			</div>
		);
	}
}
